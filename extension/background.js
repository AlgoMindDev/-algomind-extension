

const DEBUG = false;
const log = (...args) => { if (DEBUG) console.log(...args); };

const DEFAULT_API_BASE_URL = 'https://algomind-backend-xmho.onrender.com/api';

const getApiBaseUrl = async () => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['apiUrl'], (result) => {
        let url = result.apiUrl;
        if (!url || url.includes(':3000') || url.includes(':5173')) {
          url = DEFAULT_API_BASE_URL;
        }
        resolve(url);
      });
    } else {
      resolve(DEFAULT_API_BASE_URL);
    }
  });
};

const safeJsonParse = async (response) => {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    log('[AlgoMind Background] Response is not JSON:', text.slice(0, 80));
    return { status: 'error', message: 'Non-JSON response received' };
  } catch (err) {
    return { status: 'error', message: err.message };
  }
};

log('[AlgoMind Background] Service Worker loaded successfully.');

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    log('[AlgoMind Background] Extension installed for the first time. Opening welcome page...');
    chrome.tabs.create({ url: 'https://algominddev.vercel.app/welcome' });
  }
});



const getIntervalDays = (step, difficulty) => {
  const diff = (difficulty || 'Medium').toLowerCase();
  if (diff === 'easy') {
    const intervals = { 1: 2, 2: 5, 3: 12, 4: 30 };
    return intervals[step] || 30;
  }
  if (diff === 'hard') {
    const intervals = { 1: 1, 2: 2, 3: 4, 4: 8 };
    return intervals[step] || 8;
  }
  
  const intervals = { 1: 1, 2: 3, 3: 7, 4: 15 };
  return intervals[step] || 15;
};


const getNextRevisionDate = (step, difficulty) => {
  const daysToAdd = getIntervalDays(step, difficulty);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToAdd);
  return targetDate.toISOString();
};


const normalizeUrl = (u) => (u || '').split('?')[0].split('#')[0].replace(/\/$/, '');


chrome.runtime.onInstalled.addListener(() => {
  log('[AlgoMind Background] Extension Installed.');
  chrome.storage.local.get(['solvedProblemsCount', 'revisionQueue', 'settings'], (result) => {
    const defaultSettings = {
      syncEnabled: true,
      remindersEnabled: true,
      reminderTime: "21:00",
      snoozeDuration: 15,
      revisionIntervals: [1, 3, 7, 15] 
    };

    chrome.storage.local.set({
      solvedProblemsCount: result.solvedProblemsCount || 0,
      revisionQueue: result.revisionQueue || [],
      settings: result.settings || defaultSettings
    }, () => {
      log('[AlgoMind Background] Initial local storage initialized.');
      const currentSettings = result.settings || defaultSettings;
      scheduleDailyRevisionAlarm(currentSettings.reminderTime, currentSettings.remindersEnabled);
    });
  });

  
  chrome.alarms.create('algomind-daily-check', {
    delayInMinutes: 1,
    periodInMinutes: 720
  });
  log('[AlgoMind Background] Alarm "algomind-daily-check" scheduled.');
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('[AlgoMind Background] Message received:', request.action);

  if (request.action === 'PROBLEM_DETECTED') {
    handleProblemDetected(request.data, sendResponse);
    return true; 
  }

  if (request.action === 'SUBMISSION_ACCEPTED') {
    handleSubmissionAccepted(request.data, sendResponse);
    return true; 
  }

  if (request.action === 'COMPLETE_REVISION') {
    handleCompleteRevision(request.data, sendResponse);
    return true; 
  }

  if (request.action === 'SYNC_SETTINGS') {
    handleSyncSettings(request.data, sendResponse);
    return true; 
  }

  sendResponse({ status: 'unhandled_action' });
});


const handleProblemDetected = (problemData, sendResponse) => {
  log('[AlgoMind Background] Problem detected:', problemData.title);
  chrome.storage.local.set({ activeProblem: problemData }, () => {
    sendResponse({ status: 'success', message: 'Active problem saved to storage' });
  });
};


const generateLocalFallbackReview = (title, difficulty, topic, code) => {
  const containsLoop = code && (code.includes('for') || code.includes('while'));
  const containsRecursion = code && (code.includes('solve') || code.includes('helper') || code.includes('dfs'));
  
  let feedback = '';
  let strength = 'strong';

  if (difficulty === 'Hard') {
    feedback = `Optimal logic structure for ${title}. Ensure boundary edge cases (null inputs, integer overflow) are handled cleanly.`;
    strength = containsRecursion ? 'strong' : 'weak';
  } else if (difficulty === 'Medium') {
    feedback = `Solid solution using ${topic || 'DSA'} patterns. Time complexity is optimal for this difficulty. Great recall execution.`;
    strength = containsLoop ? 'strong' : 'weak';
  } else {
    feedback = `Clean, straightforward implementation for ${title}. Optimal time complexity O(N). Excellent problem-solving intuition.`;
    strength = 'strong';
  }

  return {
    feedback,
    tags: [
      {
        topic: topic || 'General',
        strength
      }
    ]
  };
};

const handleSubmissionAccepted = async (submissionData, sendResponse) => {
  log('[AlgoMind Background] Submission accepted:', submissionData.title);
  
  chrome.storage.local.get(['solvedProblemsCount', 'revisionQueue', 'token'], async (result) => {
    const currentCount = result.solvedProblemsCount || 0;
    const currentQueue = result.revisionQueue || [];
    const token = result.token;
    
    const existingIndex = currentQueue.findIndex(p => 
      (p.url && submissionData.url && normalizeUrl(p.url) === normalizeUrl(submissionData.url)) ||
      (p.title && submissionData.title && p.title.toLowerCase() === submissionData.title.toLowerCase())
    );

    const existingItem = existingIndex !== -1 ? currentQueue[existingIndex] : null;

    let savedItem = {
      ...submissionData,
      submittedAt: (existingItem && existingItem.submittedAt) ? existingItem.submittedAt : new Date().toISOString(),
      revisionStep: (existingItem && existingItem.revisionStep) ? existingItem.revisionStep : 1, 
      nextRevisionDate: (existingItem && existingItem.nextRevisionDate) ? existingItem.nextRevisionDate : getNextRevisionDate(1, submissionData.difficulty),
      synced: false
    };

    let apiSyncSuccess = false;

    if (token) {
      log('[AlgoMind Background] Found token. Syncing solve to MERN API...');
      try {
        const baseUrl = await getApiBaseUrl();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(`${baseUrl}/problems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            title: submissionData.title,
            platform: submissionData.platform,
            url: submissionData.url,
            difficulty: submissionData.difficulty,
            category: submissionData.category || 'General',
            honestyMetrics: submissionData.honestyMetrics,
            code: submissionData.code,
            intuition: submissionData.intuition,
            topic: submissionData.topic
          })
        });
        clearTimeout(timeoutId);

        const resData = await safeJsonParse(response);
        
        if (response.ok && resData.status === 'success') {
          log('[AlgoMind Background] API Sync Success:', resData);
          savedItem = {
            ...resData.data,
            synced: true
          };
          apiSyncSuccess = true;
        } else {
          console.warn('[AlgoMind Background] API Sync failed, caching locally:', resData.message);
        }
      } catch (err) {
        console.warn('[AlgoMind Background] API connection error, caching locally:', err.message);
      }
    } else {
      log('[AlgoMind Background] No active token found. Caching solve locally.');
    }

    if (!apiSyncSuccess && !savedItem.aiReview) {
      const topic = submissionData.topic || submissionData.category || 'General';
      const diff = submissionData.difficulty || 'Medium';
      savedItem.aiReview = generateLocalFallbackReview(submissionData.title, diff, topic, submissionData.code);
    }

    
    let updatedQueue;
    let newCount = currentCount;
    if (existingIndex !== -1) {
      updatedQueue = [...currentQueue];
      updatedQueue[existingIndex] = { ...updatedQueue[existingIndex], ...savedItem };
    } else {
      updatedQueue = [...currentQueue, savedItem];
      newCount = currentCount + 1;
    }

    chrome.storage.local.set({
      solvedProblemsCount: newCount,
      revisionQueue: updatedQueue
    }, () => {
      log('[AlgoMind Background] Chrome storage updated with submission.');
      
      
      triggerSuccessNotification(submissionData.title);

      sendResponse({ 
        status: 'success', 
        message: savedItem.synced ? 'Submission synced with cloud database.' : 'Submission saved locally (offline).',
        data: savedItem
      });
    });
  });
};


const triggerSuccessNotification = (problemTitle) => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'popup/icon.png',
    title: 'AlgoMind - Problem Solved!',
    message: `"${problemTitle}" successfully captured. Spaced repetition revision has been scheduled!`,
    priority: 1
  });
};


const syncOfflineSolves = () => {
  chrome.storage.local.get(['revisionQueue', 'token'], async (result) => {
    const queue = result.revisionQueue || [];
    const token = result.token;

    if (!token) return;

    const unsyncedItems = queue.filter(item => !item.synced);
    if (unsyncedItems.length === 0) return;

    log(`[AlgoMind Background] Syncing ${unsyncedItems.length} unsynced items to cloud...`);

    let updatedQueue = [...queue];

    for (const item of unsyncedItems) {
      try {
        const baseUrl = await getApiBaseUrl();
        const response = await fetch(`${baseUrl}/problems`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: item.title,
            platform: item.platform,
            url: item.url,
            difficulty: item.difficulty,
            category: item.category || 'General',
            honestyMetrics: item.honestyMetrics,
            code: item.code,
            topic: item.topic,
            intuition: item.intuition
          })
        });

        const resData = await safeJsonParse(response);
        
        if (response.ok && resData.status === 'success') {
          log(`[AlgoMind Background] Synced problem: ${item.title}`);
          
          updatedQueue = updatedQueue.map(q => 
            normalizeUrl(q.url) === normalizeUrl(item.url) ? { ...resData.data, synced: true } : q
          );
        }
      } catch (err) {
        console.warn(`[AlgoMind Background] Sync loop error:`, err.message);
        break; 
      }
    }

    chrome.storage.local.set({ revisionQueue: updatedQueue }, () => {
      log('[AlgoMind Background] Storage synced successfully.');
    });
  });
};


const syncSettingsFromCloud = () => {
  chrome.storage.local.get(['token'], async (result) => {
    const token = result.token;
    if (!token) return;

    log('[AlgoMind Background] Fetching settings from cloud...');
    try {
      const baseUrl = await getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await safeJsonParse(response);
      if (response.ok && resData.status === 'success') {
        log('[AlgoMind Background] Cloud settings loaded.');
        chrome.storage.local.set({ settings: resData.data });
      }
    } catch (err) {
      console.warn('[AlgoMind Background] Error loading settings from cloud:', err.message);
    }
  });
};



const handleSyncSettings = async (settingsData, sendResponse) => {
  chrome.storage.local.get(['token'], async (result) => {
    const token = result.token;
    chrome.storage.local.set({ settings: settingsData }, async () => {
      if (token) {
        log('[AlgoMind Background] Syncing settings mutation to cloud...');
        try {
          const baseUrl = await getApiBaseUrl();
          const response = await fetch(`${baseUrl}/auth/settings`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settingsData)
          });
          const resData = await safeJsonParse(response);
          if (response.ok) {
            sendResponse({ status: 'success', message: 'Settings saved and synced to cloud.' });
          } else {
            sendResponse({ status: 'partial', message: 'Settings saved locally. Cloud sync failed: ' + (resData.message || 'Unknown error') });
          }
        } catch (err) {
          console.warn('[AlgoMind Background] Error syncing settings to cloud:', err.message);
          sendResponse({ status: 'partial', message: 'Settings saved locally. Cloud unreachable.' });
        }
      } else {
        sendResponse({ status: 'success', message: 'Settings saved locally (no token).' });
      }
    });
  });
};


chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.token) {
    log('[AlgoMind Background] Token state modified. Running sync check...');
    syncOfflineSolves();
    syncSettingsFromCloud();
  }

  if (changes.settings) {
    log('[AlgoMind Background] Settings modified. Updating daily alarm...');
    const newSettings = changes.settings.newValue || {};
    scheduleDailyRevisionAlarm(newSettings.reminderTime, newSettings.remindersEnabled);
  }
});

const scheduleDailyRevisionAlarm = (reminderTime, remindersEnabled) => {
  chrome.alarms.clear('dailyRevision', (wasCleared) => {
    if (!remindersEnabled) {
      log('[AlgoMind Background] Reminders disabled. Daily alarm cleared.');
      return;
    }
    
    const timeToRun = getNextAlarmTime(reminderTime || "21:00");
    chrome.alarms.create('dailyRevision', {
      when: timeToRun,
      periodInMinutes: 1440 
    });
    log(`[AlgoMind Background] Daily revision alarm scheduled for ${reminderTime || "21:00"}`);
  });
};

const fetchPersonalizedQuote = async (token) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['cachedQuote', 'cachedQuoteTime'], async (result) => {
      const now = Date.now();
      const cachedQuote = result.cachedQuote;
      const cachedQuoteTime = result.cachedQuoteTime || 0;
      
      
      if (cachedQuote && (now - cachedQuoteTime < 86400000)) {
        log('[AlgoMind Background] Using cached motivation quote.');
        return resolve(cachedQuote);
      }
      
      if (!token) {
        return resolve("Keep pushing! Every revision brings you one step closer to coding mastery.");
      }
      
      try {
        log('[AlgoMind Background] Fetching new AI personalized quote...');
        const baseUrl = await getApiBaseUrl();
        const response = await fetch(`${baseUrl}/problems/motivation-quote`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await safeJsonParse(response);
        
        if (resData.status === 'success' && resData.data && resData.data.quote) {
          const freshQuote = resData.data.quote;
          chrome.storage.local.set({
            cachedQuote: freshQuote,
            cachedQuoteTime: now
          }, () => {
            resolve(freshQuote);
          });
        } else {
          resolve("Consistency is key. Revise your patterns today to build stronger memory blocks.");
        }
      } catch (err) {
        console.warn('[AlgoMind Background] Error fetching quote from API:', err.message);
        resolve("Keep pushing! Every revision brings you one step closer to coding mastery.");
      }
    });
  });
};

const triggerRevisionNotification = () => {
  chrome.storage.local.get(['revisionQueue', 'settings', 'token'], async (result) => {
    const queue = result.revisionQueue || [];
    const settings = result.settings || { remindersEnabled: true };
    const token = result.token;

    if (!settings.remindersEnabled) {
      log('[AlgoMind Background] Notifications disabled in user settings. Skipping.');
      return;
    }

    let dueCount = 0;
    if (token) {
      try {
        const baseUrl = await getApiBaseUrl();
        const res = await fetch(`${baseUrl}/problems/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await safeJsonParse(res);
        if (resData.status === 'success') {
          dueCount = resData.data.pendingRevisions || 0;
        }
      } catch (err) {
        console.warn('[AlgoMind Background] Error fetching live count, using cache:', err.message);
        dueCount = queue.filter(item => {
          const nextRev = new Date(item.nextRevisionDate);
          return nextRev <= new Date() && item.status !== 'Completed';
        }).length;
      }
    } else {
      dueCount = queue.filter(item => {
        const nextRev = new Date(item.nextRevisionDate);
        return nextRev <= new Date() && item.status !== 'Completed';
      }).length;
    }

    if (dueCount > 0) {
      const aiQuote = await fetchPersonalizedQuote(token);
      
      chrome.notifications.create('algomind-revision-notif', {
        type: 'basic',
        iconUrl: 'popup/icon.png',
        title: 'AlgoMind - Daily Revision Due!',
        message: `You have ${dueCount} revisions due today. \n"${aiQuote}"`,
        buttons: [
          { title: 'Start Revision' },
          { title: 'Snooze' }
        ],
        priority: 2,
        requireInteraction: true
      });
      log(`[AlgoMind Background] Revision notification pushed with ${dueCount} items.`);
    } else {
      log('[AlgoMind Background] All caught up! No revision alerts.');
    }
  });
};


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyRevision' || alarm.name === 'algomind-daily-check' || alarm.name === 'dailyRevisionSnooze') {
    log(`[AlgoMind Background] Alarm ${alarm.name} triggered.`);
    triggerRevisionNotification();
  }
});


chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (notificationId === 'algomind-revision-notif') {
    chrome.notifications.clear(notificationId);

    if (buttonIndex === 0) {
      
      log('[AlgoMind Background] Opening revisions dashboard...');
      chrome.storage.local.get(['dashboardUrl'], (res) => {
        let rawUrl = (res && res.dashboardUrl) ? res.dashboardUrl : '';
        let baseUrl = (rawUrl && !rawUrl.includes('leetcode') && !rawUrl.includes('geeksforgeeks') && !rawUrl.includes('ambuj-s-team') && !rawUrl.includes('oq78btw6i')) 
          ? rawUrl.replace(/\/dashboard\/?$/, '') 
          : 'https://algominddev.vercel.app';
        chrome.tabs.create({ url: `${baseUrl}/revisions` });
      });
    } else if (buttonIndex === 1) {
      
      chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || { snoozeDuration: 15 };
        const snoozeMin = settings.snoozeDuration || 15;
        
        log(`[AlgoMind Background] Scheduling snooze alarm for ${snoozeMin} minutes.`);
        chrome.alarms.create('dailyRevisionSnooze', {
          delayInMinutes: snoozeMin
        });
      });
    }
  }
});

function getNextAlarmTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
  
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

const handleCompleteRevision = async (data, sendResponse) => {
  const { problemId, action } = data; 
  log(`[AlgoMind Background] Completing revision for problem ${problemId} with action ${action}...`);

  chrome.storage.local.get(['token', 'revisionQueue'], async (result) => {
    const token = result.token;
    const queue = result.revisionQueue || [];

    
    const updatedQueue = queue.map(p => {
      if (p._id === problemId) {
        const nextStep = action === 'recalled' ? Math.min(p.revisionStep + 1, 4) : 1;
        
        const days = getIntervalDays(nextStep, p.difficulty);
        const nextRev = new Date();
        nextRev.setDate(nextRev.getDate() + days);
        return {
          ...p,
          revisionStep: nextStep,
          nextRevisionDate: nextRev.toISOString(),
          status: action === 'recalled' ? 'Completed' : 'Pending'
        };
      }
      return p;
    });

    chrome.storage.local.set({ revisionQueue: updatedQueue }, async () => {
      
      chrome.notifications.clear('algomind-revision-notif');

      
      if (token) {
        try {
          const baseUrl = await getApiBaseUrl();
          const response = await fetch(`${baseUrl}/problems/${problemId}/revision`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action })
          });
          const resData = await safeJsonParse(response);
          log('[AlgoMind Background] Cloud revision sync success.');
          sendResponse({ status: 'success', message: 'Revision sync completed with cloud.', data: resData.data });
        } catch (err) {
          console.warn('[AlgoMind Background] Cloud revision sync error:', err.message);
          sendResponse({ status: 'success', message: 'Revision updated locally. Cloud sync failed.' });
        }
      } else {
        sendResponse({ status: 'success', message: 'Revision updated locally.' });
      }
    });
  });
};
