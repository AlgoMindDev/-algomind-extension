

const DEBUG = false;
const log = (...args) => { if (DEBUG) console.log(...args); };

log('[AlgoMind Content Script] Loaded and initializing circular widget.');

let lastUrl = window.location.href;
let activeProblemDetails = null;
let currentProblemSlug = null;


let honestyUIInterval = null;

const getProblemSlug = (url) => {
  try {
    const match = url.match(/\/problems\/([^/]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
};

const isSameProblem = (url1, url2) => {
  if (!url1 || !url2) return false;
  const slug1 = getProblemSlug(url1);
  const slug2 = getProblemSlug(url2);
  if (slug1 && slug2) return slug1 === slug2;
  
  const clean = (u) => u.split('#')[0].replace(/\/$/, '');
  return clean(url1) === clean(url2);
};


const state = {
  hintsUsed: false,
  solutionClicked: false,
  codePasted: false,
  tabSwitchesCount: 0,
  sessionStartTime: Date.now(),  
  startTime: Date.now(),         
  eventTimeline: [{ event: 'START', timestamp: Date.now() }],
  isAccepted: false,
  typingCount: 0,
  lastTabSwitchStartTime: null,
  activeHintOpenTime: null,
  activeEditorialOpenTime: null,
  accumulatedHintDuration: 0,
  accumulatedEditorialDuration: 0,
  accumulatedTabSwitchDuration: 0,
  tabSwitchesDurations: [],
  editorialOpenedBeforeAccepted: false,
  pasteHappenedBeforeAccepted: false,
  focusModeEnabled: false
};


let hintsUsed, solutionClicked, codePasted, tabSwitchesCount, startTime;
let eventTimeline, isAccepted, typingCount;
let lastTabSwitchStartTime, activeHintOpenTime, activeEditorialOpenTime;
let accumulatedHintDuration, accumulatedEditorialDuration, accumulatedTabSwitchDuration;
let tabSwitchesDurations, editorialOpenedBeforeAccepted, pasteHappenedBeforeAccepted, focusModeEnabled;

const syncFromState = () => {
  hintsUsed = state.hintsUsed;
  solutionClicked = state.solutionClicked;
  codePasted = state.codePasted;
  tabSwitchesCount = state.tabSwitchesCount;
  startTime = state.startTime;
  eventTimeline = state.eventTimeline;
  isAccepted = state.isAccepted;
  typingCount = state.typingCount;
  lastTabSwitchStartTime = state.lastTabSwitchStartTime;
  activeHintOpenTime = state.activeHintOpenTime;
  activeEditorialOpenTime = state.activeEditorialOpenTime;
  accumulatedHintDuration = state.accumulatedHintDuration;
  accumulatedEditorialDuration = state.accumulatedEditorialDuration;
  accumulatedTabSwitchDuration = state.accumulatedTabSwitchDuration;
  tabSwitchesDurations = state.tabSwitchesDurations;
  editorialOpenedBeforeAccepted = state.editorialOpenedBeforeAccepted;
  pasteHappenedBeforeAccepted = state.pasteHappenedBeforeAccepted;
  focusModeEnabled = state.focusModeEnabled;
};
syncFromState();

const logTimelineEvent = (eventName, data = {}) => {
  state.eventTimeline.push({
    event: eventName,
    timestamp: Date.now(),
    ...data
  });
  eventTimeline = state.eventTimeline;
  log(`[AlgoMind Timeline] Event: ${eventName}`, data);
};

const resetHonestyMetrics = () => {
  state.hintsUsed = false;
  state.solutionClicked = false;
  state.codePasted = false;
  state.tabSwitchesCount = 0;
  state.sessionStartTime = Date.now();
  state.startTime = Date.now();
  state.eventTimeline = [{ event: 'START', timestamp: Date.now() }];
  state.isAccepted = false;
  state.typingCount = 0;
  state.lastTabSwitchStartTime = null;
  state.activeHintOpenTime = null;
  state.activeEditorialOpenTime = null;
  state.accumulatedHintDuration = 0;
  state.accumulatedEditorialDuration = 0;
  state.accumulatedTabSwitchDuration = 0;
  state.tabSwitchesDurations = [];
  state.editorialOpenedBeforeAccepted = false;
  state.pasteHappenedBeforeAccepted = false;
  syncFromState();

  
  if (honestyUIInterval) {
    clearInterval(honestyUIInterval);
    honestyUIInterval = null;
  }

  log('[AlgoMind Scraper] Honesty metrics reset for new problem solving session.');
};

const getHonestyClassification = () => {
  const scoreData = getHonestyScore();
  if (scoreData.score >= 80) {
    return 'Self Solved';
  }
  if (scoreData.score >= 50) {
    return 'Honest Effort';
  }
  return 'Needs Reinforcement';
};

const getHonestyScore = (elapsedSeconds = null) => {
  let score = 100;
  let reasons = [];

  
  let switchPenalty = 0;
  let accidentalCount = 0;
  let mediumCount = 0;
  let longCount = 0;

  tabSwitchesDurations.forEach(sw => {
    if (sw.duration < 10) {
      accidentalCount++;
    } else if (sw.duration >= 10 && sw.duration <= 30) {
      switchPenalty += 5;
      mediumCount++;
    } else if (sw.duration > 30) {
      switchPenalty += 15;
      longCount++;
    }
  });

  switchPenalty = Math.min(30, switchPenalty);
  score -= switchPenalty;

  if (switchPenalty === 0) {
    if (tabSwitchesCount > 0) {
      reasons.push(`✔ Ignored accidental tab switches (<10s)`);
    } else {
      reasons.push('✔ No tab switches');
    }
  } else {
    reasons.push(`✖ Penalty for long tab switches (-${switchPenalty})`);
  }

  
  let activeHintTime = activeHintOpenTime ? (Date.now() - activeHintOpenTime) / 1000 : 0;
  let totalHintDuration = accumulatedHintDuration + activeHintTime;

  if (hintsUsed) {
    if (totalHintDuration > 0 && totalHintDuration < 5) {
      reasons.push(`✔ Hint opened briefly for ${Math.round(totalHintDuration)}s (No penalty)`);
    } else {
      score -= 20;
      reasons.push(`✖ Hint viewed for ${Math.round(totalHintDuration)}s (-20)`);
    }
  } else {
    reasons.push('✔ Hints not viewed');
  }

  
  if (editorialOpenedBeforeAccepted) {
    score -= 40;
    reasons.push('✖ Editorial viewed before solution accepted (-40)');
  } else {
    if (solutionClicked) {
      reasons.push('✔ Editorial viewed only after solved (No penalty)');
    } else {
      reasons.push('✔ Editorial not viewed');
    }
  }

  
  if (pasteHappenedBeforeAccepted) {
    score -= 30;
    reasons.push('✖ Code pasted before solution accepted (-30)');
  } else {
    if (codePasted) {
      reasons.push('✔ Code paste occurred after accepted (No penalty)');
    } else {
      reasons.push('✔ Typed code manually');
    }
  }

  return {
    score: Math.max(0, score),
    reasons
  };
};





function showWidgetPasteWarning() {
  const card = document.querySelector('.algomind-active-card');
  if (!card) return;

  const panel = document.getElementById('algomind-panel');
  const isLight = panel && panel.classList.contains('algomind-light-theme');

  Array.from(card.children).forEach(child => {
    if (child.id !== 'algomind-paste-overlay') {
      child.style.visibility = 'hidden';
    }
  });

  let overlay = document.getElementById('algomind-paste-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'algomind-paste-overlay';

  const bgCss = isLight
    ? 'background: #fffbebf5 !important; border: 1px solid #f59e0b !important; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15) !important;'
    : 'background: rgba(15, 23, 42, 0.96) !important; border: 1px solid rgba(245, 158, 11, 0.4) !important; box-shadow: 0 4px 14px rgba(0,0,0,0.4) !important;';

  const titleColor = isLight ? '#b45309' : '#fbbf24';
  const descColor = isLight ? '#78350f' : '#e2e8f0';

  overlay.style.cssText = `
    position: absolute !important; inset: 0 !important; z-index: 10 !important;
    display: flex !important; flex-direction: column !important;
    align-items: center !important; justify-content: center !important;
    gap: 6px !important;
    text-align: center !important;
    ${bgCss}
    border-radius: 12px !important;
    opacity: 0 !important; transition: opacity 0.35s ease !important;
    line-height: 1.5 !important; padding: 16px 20px !important;
    backdrop-filter: blur(4px) !important;
  `;
  overlay.innerHTML = `
    <span style="position:absolute !important;top:6px !important;right:8px !important;cursor:pointer !important;font-size:16px !important;color:${titleColor} !important;opacity:0.8 !important;transition:all 0.2s !important;line-height:1 !important;pointer-events:auto !important;width:20px !important;height:20px !important;display:flex !important;align-items:center !important;justify-content:center !important;border-radius:50% !important;" id="algomind-paste-close" title="Dismiss">✕</span>
    <span style="font-size:26px !important;line-height:1 !important;">🛡️</span>
    <span style="font-size:13px !important;font-weight:800 !important;color:${titleColor} !important;letter-spacing:0.02em !important;">Code Paste Detected</span>
    <span style="font-size:11px !important;font-weight:600 !important;color:${descColor} !important;line-height:1.4 !important;">Please type the code yourself to build muscle memory.</span>
  `;
  card.appendChild(overlay);

  const closeBtn = document.getElementById('algomind-paste-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideWidgetPasteWarning();
    });
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.setProperty('opacity', '1', 'important'); });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.setProperty('opacity', '0.8', 'important'); });
  }

  requestAnimationFrame(() => { overlay.style.opacity = '1'; });
}

function hideWidgetPasteWarning() {
  const card = document.querySelector('.algomind-active-card');
  const overlay = document.getElementById('algomind-paste-overlay');

  if (overlay) {
    overlay.style.opacity = '0';
    overlay.addEventListener('transitionend', function cb() {
      overlay.remove();
      overlay.removeEventListener('transitionend', cb);
    });
  }

  
  if (card) {
    Array.from(card.children).forEach(child => {
      if (child.id !== 'algomind-paste-overlay') {
        child.style.visibility = '';
      }
    });
  }
}

const updateWidgetHonestyUI = () => {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const scoreData = getHonestyScore(elapsedSeconds);
  const score = scoreData.score;

  const timeTakenElem = document.getElementById('algomind-time-taken');
  if (timeTakenElem) {
    timeTakenElem.innerText = `${elapsedMinutes} min`;
  }

  const platform = getPlatform(window.location.href);
  const diff = activeProblemDetails ? activeProblemDetails.difficulty : 'Medium';
  const compareElem = document.getElementById('algomind-compare-avg');
  if (compareElem) {
    const avg = diff === 'Easy' ? 12 : diff === 'Hard' ? 45 : 25;
    compareElem.innerText = `⏱️ Avg: ${avg}m`;
  }

  const scoreLabel = document.getElementById('algomind-honesty-score-label');
  if (scoreLabel) {
    scoreLabel.innerText = `Score: ${score}`;
    if (score >= 80) scoreLabel.style.color = '#10b981';
    else if (score >= 50) scoreLabel.style.color = '#f59e0b';
    else scoreLabel.style.color = '#ef4444';
  }

  const warningElem = document.getElementById('algomind-honesty-warning');
  const feynmanSection = document.getElementById('feynman-section');
  
  if (warningElem) warningElem.style.display = 'none';

  if (score < 30) {
    if (feynmanSection) feynmanSection.style.display = 'none';
  } else if (codePasted && !isAccepted) {
    if (feynmanSection) feynmanSection.style.display = 'none';
  } else {
    if (feynmanSection && !isAccepted) {
      if (isExtensionContextValid()) {
        chrome.storage.local.get(['revisionQueue'], (res) => {
          const queue = res.revisionQueue || [];
          const isSolved = queue.some(p => isSameProblem(p.url, window.location.href));
          if (!isSolved) {
            feynmanSection.style.display = 'block';
          }
        });
      }
    }
  }

  const switchesVal = document.getElementById('honesty-val-switches');
  const switchesItem = document.getElementById('honesty-item-switches');
  if (switchesVal) {
    switchesVal.innerText = tabSwitchesCount;
    switchesVal.style.color = tabSwitchesCount > 4 ? '#ef4444' : '#10b981';
    if (switchesItem) {
      if (tabSwitchesCount > 4) switchesItem.classList.add('flagged');
      else switchesItem.classList.remove('flagged');
    }
  }

  const hintsVal = document.getElementById('honesty-val-hints');
  const hintsItem = document.getElementById('honesty-item-hints');
  if (hintsVal) {
    hintsVal.innerText = hintsUsed ? 'Yes' : 'No';
    hintsVal.style.color = hintsUsed ? '#ef4444' : '#10b981';
    if (hintsItem) {
      if (hintsUsed) hintsItem.classList.add('flagged');
      else hintsItem.classList.remove('flagged');
    }
  }

  const pastesVal = document.getElementById('honesty-val-pastes');
  const pastesItem = document.getElementById('honesty-item-pastes');
  if (pastesVal) {
    pastesVal.innerText = codePasted ? 'Yes' : 'No';
    pastesVal.style.color = codePasted ? '#ef4444' : '#10b981';
    if (pastesItem) {
      if (codePasted) pastesItem.classList.add('flagged');
      else pastesItem.classList.remove('flagged');
    }
  }

  const solutionVal = document.getElementById('honesty-val-solution');
  const solutionItem = document.getElementById('honesty-item-solution');
  if (solutionVal) {
    solutionVal.innerText = solutionClicked ? 'Yes' : 'No';
    solutionVal.style.color = solutionClicked ? '#ef4444' : '#10b981';
    if (solutionItem) {
      if (solutionClicked) solutionItem.classList.add('flagged');
      else solutionItem.classList.remove('flagged');
    }
  }

  
  const tooltipSw = document.getElementById('tooltip-switches');
  if (tooltipSw) {
    let maxSw = 0;
    let swPenalty = 0;
    tabSwitchesDurations.forEach(sw => {
      if (sw.duration > maxSw) maxSw = sw.duration;
      if (sw.duration >= 10 && sw.duration <= 30) swPenalty += 5;
      else if (sw.duration > 30) swPenalty += 15;
    });
    swPenalty = Math.min(30, swPenalty);
    tooltipSw.innerHTML = `• ${tabSwitchesCount} switches (${Math.round(maxSw)}s max)<br>• Penalty: -${swPenalty}`;
  }

  const tooltipHints = document.getElementById('tooltip-hints');
  if (tooltipHints) {
    let activeHintTime = activeHintOpenTime ? (Date.now() - activeHintOpenTime) / 1000 : 0;
    let totalHintDuration = accumulatedHintDuration + activeHintTime;
    const hintPenalty = (hintsUsed && totalHintDuration >= 5) ? 20 : 0;
    tooltipHints.innerHTML = hintsUsed
      ? `• Hint viewed (${Math.round(totalHintDuration)}s)<br>• Penalty: -${hintPenalty}`
      : `• No hints used<br>• No penalty`;
  }

  const tooltipPastes = document.getElementById('tooltip-pastes');
  if (tooltipPastes) {
    const pastePenalty = pasteHappenedBeforeAccepted ? 30 : 0;
    tooltipPastes.innerHTML = codePasted
      ? `• Paste detected (${pasteHappenedBeforeAccepted ? 'pre-accept' : 'post-accept'})<br>• Penalty: -${pastePenalty}`
      : `• No paste detected<br>• No penalty`;
  }

  const tooltipSolution = document.getElementById('tooltip-solution');
  if (tooltipSolution) {
    const solPenalty = editorialOpenedBeforeAccepted ? 40 : 0;
    tooltipSolution.innerHTML = solutionClicked
      ? `• Viewed (${editorialOpenedBeforeAccepted ? 'pre-accept' : 'post-accept'})<br>• Penalty: -${solPenalty}`
      : `• Not viewed<br>• No penalty`;
  }



  
  if (isExtensionContextValid()) {
    chrome.storage.local.set({
      activeProblemHonestyMetrics: {
        hintsUsed,
        solutionClicked,
        tabSwitchesCount,
        codePasted,
        timeTakenSeconds: elapsedSeconds,
        honestyScore: score,
        eventTimeline,
        reasons: scoreData.reasons
      }
    });
  }
};


const getPlatform = (url) => {
  if (url.includes('leetcode.com')) return 'LeetCode';
  if (url.includes('geeksforgeeks.org')) return 'GeeksforGeeks';
  if (url.includes('codeforces.com')) return 'Codeforces';
  if (url.includes('atcoder.jp')) return 'AtCoder';
  if (url.includes('codechef.com')) return 'CodeChef';
  if (url.includes('hackerrank.com')) return 'HackerRank';
  if (url.includes('localhost') || url.includes('127.0.0.1')) return 'LocalDev';
  return null;
};


const parseLeetCode = (callback) => {
  let title = document.title.split(' - ')[0].replace(/^\d+\.\s*/, '').trim();
  
  const titleElem = document.querySelector('span.text-title-large') || 
                    document.querySelector('div[class*="text-title-large"]') ||
                    document.querySelector('h4');
  if (titleElem && titleElem.innerText.trim()) {
    title = titleElem.innerText.replace(/^\d+\.\s*/, '').trim();
  }

  let difficulty = 'Medium';
  
  const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS.LeetCode : null;
  if (config) {
    if (document.querySelector(config.difficultyEasy)) difficulty = 'Easy';
    else if (document.querySelector(config.difficultyHard)) difficulty = 'Hard';
    
  }

  const payload = {
    title,
    platform: 'LeetCode',
    url: window.location.href,
    difficulty,
    category: detectCategory()
  };
  payload.topic = extractAutomaticTopic(payload);

  activeProblemDetails = payload;
  callback(payload);
};


const parseGFG = (callback) => {
  let title = document.title
    .split('|')[0]
    .split('- GeeksforGeeks')[0]
    .split('–')[0]
    .replace(/^Problems\s*-\s*/i, '')
    .replace(/^Practice\s*-\s*/i, '')
    .trim();
  
  const titleElem = document.querySelector('.problem-tab_title') || 
                    document.querySelector('div[class*="problems_header_content__title"]') ||
                    document.querySelector('div[class*="problem_title"]') ||
                    document.querySelector('h3[class*="problem-title"]') || 
                    document.querySelector('h3') ||
                    document.querySelector('h4');
  if (titleElem && titleElem.innerText.trim() && titleElem.innerText.trim().length > 2) {
    title = titleElem.innerText.trim();
  }

  
  const lowerTitle = title.toLowerCase();
  if (lowerTitle === 'geeksforgeeks' || lowerTitle === 'practice' || lowerTitle === 'problems') {
    const slug = getProblemSlug(window.location.href);
    if (slug) {
      title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  let difficulty = 'Medium';
  const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS.GeeksforGeeks : null;
  if (config && config.difficulty) {
    const diffElems = document.querySelectorAll(config.difficulty);
    for (const diffElem of diffElems) {
      if (diffElem && diffElem.innerText) {
        const text = diffElem.innerText.trim().toLowerCase();
        if (text.includes('easy') || text.includes('school') || text.includes('basic')) {
          difficulty = 'Easy';
          break;
        } else if (text.includes('medium')) {
          difficulty = 'Medium';
          break;
        } else if (text.includes('hard')) {
          difficulty = 'Hard';
          break;
        }
      }
    }
  }

  const payload = {
    title,
    platform: 'GeeksforGeeks',
    url: window.location.href,
    difficulty,
    category: detectCategory()
  };
  payload.topic = extractAutomaticTopic(payload);

  activeProblemDetails = payload;
  callback(payload);
};


const getProblemDescriptionText = () => {
  
  const descElem = document.querySelector('[data-track-load="description_content"]') ||
                   document.querySelector('.xcy1y') ||
                   document.querySelector('.question-content') ||
                   
                   document.querySelector('.problem-tab_description') ||
                   document.querySelector('.problems_header_description__t_8PB');
  if (descElem) return descElem.innerText.toLowerCase();
  
  return document.body ? document.body.innerText.toLowerCase().slice(0, 3000) : '';
};

const detectCategory = () => {
  const text = getProblemDescriptionText();
  
  if (text.includes('dynamic programming') || text.includes(' dp ')) return 'Dynamic Programming';
  if (text.includes('binary tree')) return 'Trees';
  if (text.includes('linked list')) return 'Linked Lists';
  if (text.includes('graph')) return 'Graphs';
  if (text.includes('backtracking')) return 'Backtracking';
  if (text.includes('greedy')) return 'Greedy';
  if (text.includes('sorting') || text.includes('searching')) return 'Sorting & Searching';
  if (text.includes('tree')) return 'Trees';
  if (text.includes('string')) return 'Strings';
  if (text.includes('array')) return 'Arrays';
  return 'General';
};


const extractAutomaticTopic = (problemData) => {
  const problem = problemData || activeProblemDetails || {};
  const title = (problem.title || document.title || '').toLowerCase();
  
  
  const tagElems = document.querySelectorAll(
    'a[href*="/tag/"], a[href*="/topic/"], a[href*="/problem-list/"], .topic-tag, [class*="topic-tag"], [class*="topicTag"], [class*="tag-box"], div[class*="tag"] a'
  );
  if (tagElems && tagElems.length > 0) {
    for (const tag of tagElems) {
      const txt = tag.innerText.trim();
      const lower = txt.toLowerCase();
      if (
        txt &&
        txt.length > 2 &&
        txt.length < 30 &&
        !lower.includes('show') &&
        !lower.includes('hint') &&
        !lower.includes('topic') &&
        !lower.includes('company')
      ) {
        return txt;
      }
    }
  }

  
  const descText = getProblemDescriptionText();
  const combined = title + ' ' + descText;

  
  if (combined.includes('binary search tree') || combined.includes('bst')) return 'Binary Search Tree';
  if (combined.includes('binary tree') || combined.includes('tree node')) return 'Binary Tree';
  if (combined.includes('dynamic programming') || combined.includes(' dp ')) return 'Dynamic Programming';
  if (combined.includes('sliding window')) return 'Sliding Window';
  if (combined.includes('two pointer') || combined.includes('two-pointer')) return 'Two Pointers';
  if (combined.includes('linked list')) return 'Linked List';
  if (combined.includes('hash table') || combined.includes('hash map')) return 'Hash Table';
  if (combined.includes('heap') || combined.includes('priority queue')) return 'Heap / Priority Queue';
  if (combined.includes('graph') || combined.includes('bfs') || combined.includes('dfs')) return 'Graph';
  if (combined.includes('trie')) return 'Trie';
  if (combined.includes('matrix') || combined.includes('2d array')) return 'Matrix';
  if (combined.includes('stack')) return 'Stack';
  if (combined.includes('queue')) return 'Queue';
  if (combined.includes('string')) return 'String';
  if (combined.includes('array')) return 'Array';
  
  if (problem.category && problem.category !== 'General') {
    return problem.category;
  }
  return 'General';
};

const isExtensionContextValid = () => {
  try {
    return typeof chrome !== 'undefined' && 
           chrome.runtime && 
           !!chrome.runtime.getManifest() && 
           chrome.storage && 
           chrome.storage.local;
  } catch (e) {
    return false;
  }
};


const sendProblemData = (data) => {
  if (!isExtensionContextValid()) {
    console.warn('[AlgoMind Content Script] Extension context invalidated. Refresh page to reconnect.');
    return;
  }
  if (!data.title || data.title === 'Loading...' || data.title.includes('leetcode.com')) {
    return;
  }
  chrome.runtime.sendMessage({
    action: 'PROBLEM_DETECTED',
    data
  }, () => {
    try {
      if (chrome.runtime && chrome.runtime.lastError) {
        
      }
    } catch (e) {}
  });
};


const injectStyles = () => {
  if (document.getElementById('algomind-styles')) return;

  const styleNode = document.createElement('style');
  styleNode.id = 'algomind-styles';
  styleNode.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    #algomind-root {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 2147483647 !important;
      font-family: 'Inter', -apple-system, sans-serif !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-end !important;
      text-align: left !important;
    }

    /* Circular Launcher Button */
    #algomind-circle {
      width: 52px !important;
      height: 52px !important;
      background: #6366f1 !important;
      border: 1px solid rgba(255,255,255,0.2) !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #ffffff !important;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    #algomind-circle.algomind-hidden {
      display: none !important;
    }

    #algomind-circle:hover {
      transform: scale(1.08) rotate(15deg) !important;
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.6) !important;
    }

    #algomind-circle svg {
      width: 24px !important;
      height: 24px !important;
      animation: algomind-float 3s ease-in-out infinite !important;
    }

    @keyframes algomind-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }

    @keyframes algomind-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .algomind-spin-icon {
      animation: algomind-spin 1s linear infinite !important;
    }

    /* Main Expandable Dashboard Panel */
    #algomind-panel {
      width: 320px !important;
      max-width: calc(100vw - 32px) !important;
      height: auto !important;
      max-height: calc(100vh - 85px) !important;
      overflow-y: auto !important;
      scrollbar-width: thin !important;
      background: #0f172a !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 16px !important;
      padding: 8px 10px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
      color: #f8fafc !important;
      display: none; /* hidden by default */
      flex-direction: column !important;
      gap: 6px !important;
      margin-bottom: 8px !important;
      animation: algomind-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    #algomind-panel::-webkit-resizer {
      background: rgba(99, 102, 241, 0.4) !important;
      border-radius: 4px !important;
    }

    @keyframes algomind-slide-up {
      from { transform: translateY(50px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .algomind-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
      position: sticky !important;
      top: -8px !important;
      margin: -8px -10px 4px -10px !important;
      padding: 8px 10px 6px 10px !important;
      background: #0f172a !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
      border-top-left-radius: 16px !important;
      border-top-right-radius: 16px !important;
    }

    .algomind-logo-area {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      flex-shrink: 0 !important;
    }

    .algomind-logo-area svg {
      color: #6366f1 !important;
      flex-shrink: 0 !important;
    }

    .algomind-logo-txt {
      font-weight: 700 !important;
      font-size: 15px !important;
      color: #ffffff !important;
      letter-spacing: -0.02em !important;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
    }
    
    .algomind-logo-txt span {
      color: #6366f1 !important;
    }

    .algomind-status {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      font-size: 11px !important;
      color: #94a3b8 !important;
      font-weight: 500 !important;
      flex-shrink: 0 !important;
    }

    .algomind-status-dot {
      width: 6px !important;
      height: 6px !important;
      background: #10b981 !important;
      border-radius: 50% !important;
      box-shadow: 0 0 8px #10b981 !important;
    }

    /* Stats Row */
    .algomind-stats-row {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 10px !important;
    }

    .algomind-stat-card {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 12px !important;
      padding: 10px !important;
      text-align: center !important;
    }

    .algomind-stat-val {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #ffffff !important;
    }

    .algomind-stat-lbl {
      font-size: 10px !important;
      color: #94a3b8 !important;
      margin-top: 2px !important;
    }

    /* Section Cards */
    .algomind-section-title {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #94a3b8 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      margin-bottom: 6px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }

    .algomind-active-card {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 12px !important;
      padding: 10px !important;
    }

    .algomind-active-title {
      font-size: 13px !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
      color: #ffffff !important;
      margin-bottom: 4px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 200px !important;
    }

    .algomind-meta {
      display: flex !important;
      gap: 6px !important;
      margin-bottom: 6px !important;
    }

    .algomind-badge {
      font-size: 10px !important;
      font-weight: 600 !important;
      padding: 2px 8px !important;
      border-radius: 6px !important;
      background: rgba(255,255,255,0.08) !important;
      color: #94a3b8 !important;
      display: inline-block !important;
    }

    .algomind-easy { background: rgba(16, 185, 129, 0.2) !important; color: #10b981 !important; }
    .algomind-medium { background: rgba(245, 158, 11, 0.2) !important; color: #f59e0b !important; }
    .algomind-hard { background: rgba(239, 68, 68, 0.2) !important; color: #ef4444 !important; }

    .algomind-btn {
      width: 100% !important;
      background: #6366f1 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 6px !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .algomind-btn:hover:not(:disabled) {
      background: #4f46e5 !important;
    }

    /* Base Disabled Styles */
    .algomind-btn:disabled {
      cursor: not-allowed !important;
      opacity: 0.8 !important;
      font-weight: 600 !important;
    }

    /* Dark Mode Disabled - Soft Translucent Purple Tint */
    #algomind-panel:not(.algomind-light-theme) .algomind-btn:disabled {
      background: rgba(99, 102, 241, 0.18) !important;
      color: #c7d2fe !important;
      border: 1px solid rgba(99, 102, 241, 0.3) !important;
    }

    /* Primary Save Action Button (Active State - Solid Vibrant Purple Glow) */
    #algomind-action:not(:disabled) {
      background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
      color: #ffffff !important;
      border: none !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45) !important;
    }
    #algomind-action:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
      box-shadow: 0 6px 18px rgba(99, 102, 241, 0.6) !important;
    }
    #algomind-action:active:not(:disabled) {
      transform: translateY(1px) !important;
    }

    .algomind-btn-saved {
      background: rgba(22, 163, 74, 0.15) !important;
      color: #4ade80 !important;
      border: 1px solid rgba(22, 163, 74, 0.3) !important;
      opacity: 1 !important;
      font-weight: 700 !important;
    }

    .algomind-btn-loading {
      background: rgba(255,255,255,0.1) !important;
      color: #94a3b8 !important;
    }

    /* Revision List Card */
    .algomind-revision-list {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      max-height: 110px !important;
      overflow-y: auto !important;
    }

    .algomind-revision-item {
      background: rgba(255,255,255,0.02) !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 8px !important;
      padding: 6px 10px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
    .algomind-honesty-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px !important;
      margin-bottom: 12px !important;
    }
    .algomind-honesty-item {
      background: rgba(255,255,255,0.03) !important;
      border: 1px solid rgba(255,255,255,0.06) !important;
      border-radius: 8px !important;
      padding: 6px 10px !important;
      font-size: 10px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      position: relative !important;
    }
    .algomind-honesty-item.flagged {
      border-color: rgba(239, 68, 68, 0.3) !important;
      background: rgba(239, 68, 68, 0.02) !important;
    }
    .algomind-honesty-lbl {
      color: #94a3b8 !important;
      font-weight: 500 !important;
    }
    .algomind-honesty-val-group {
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .algomind-info-icon {
      width: 14px !important;
      height: 14px !important;
      border-radius: 50% !important;
      background: rgba(99, 102, 241, 0.15) !important;
      border: 1px solid rgba(99, 102, 241, 0.3) !important;
      color: #a5b4fc !important;
      font-size: 9px !important;
      font-weight: 700 !important;
      font-family: Georgia, serif !important;
      font-style: italic !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: help !important;
      user-select: none !important;
      transition: all 0.2s ease !important;
      line-height: 1 !important;
    }
    .algomind-info-icon:hover {
      background: rgba(99, 102, 241, 0.35) !important;
      color: #ffffff !important;
      border-color: #818cf8 !important;
      transform: scale(1.15) !important;
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.5) !important;
    }
    .algomind-info-icon:hover {
      opacity: 1 !important;
    }
    .algomind-rev-name {
      font-weight: 500 !important;
      font-size: 11px !important;
      color: #e2e8f0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      max-width: 170px !important;
    }

    .algomind-rev-meta {
      font-size: 9px !important;
      color: #64748b !important;
    }

    .algomind-empty {
      font-size: 11px !important;
      color: #64748b !important;
      text-align: center !important;
      padding: 12px !important;
      border: 1px dashed rgba(255,255,255,0.06) !important;
      border-radius: 8px !important;
    }

    .algomind-count-badge {
      background: #6366f1 !important;
      color: #ffffff !important;
      font-size: 9px !important;
      font-weight: 700 !important;
      padding: 1px 5px !important;
      border-radius: 6px !important;
    }

    /* Revision card container */
    .algomind-revision-card {
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      border-radius: 12px !important;
      padding: 10px !important;
      transition: all 0.3s ease !important;
    }

    .algomind-revision-summary {
      font-size: 11px !important;
      color: #e2e8f0 !important;
      font-weight: 500 !important;
    }

    .algomind-badge-revised {
      font-size: 9px !important;
      font-weight: 600 !important;
      color: #818cf8 !important;
      background: rgba(99, 102, 241, 0.1) !important;
      border: 1px solid rgba(99, 102, 241, 0.2) !important;
      padding: 1px 6px !important;
      border-radius: 8px !important;
      display: inline-block !important;
    }

    .algomind-badge-unrevised {
      font-size: 9px !important;
      font-weight: 600 !important;
      color: #94a3b8 !important;
      background: rgba(148, 163, 184, 0.08) !important;
      border: 1px solid rgba(148, 163, 184, 0.15) !important;
      padding: 1px 6px !important;
      border-radius: 8px !important;
      display: inline-block !important;
    }

    /* Footer */
    .algomind-footer {
      display: flex !important;
      gap: 8px !important;
      border-top: 1px solid rgba(255,255,255,0.08) !important;
      padding-top: 10px !important;
    }

    .algomind-btn-secondary {
      background: rgba(255,255,255,0.05) !important;
      color: #e2e8f0 !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
    }

    .algomind-btn-secondary:hover {
      background: rgba(255,255,255,0.1) !important;
    }

    .algomind-feynman-textarea {
      width: 100% !important;
      height: 44px !important;
      background: rgba(0,0,0,0.35) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      border-radius: 6px !important;
      color: #ffffff !important;
      font-size: 10px !important;
      padding: 6px !important;
      resize: none !important;
      outline: none !important;
      font-family: sans-serif !important;
      box-sizing: border-box !important;
    }
    
    .algomind-feynman-textarea::placeholder {
      color: rgba(255, 255, 255, 0.4) !important;
    }

    /* AI Review Card Base Styles (Dark Mode Default) */
    #algomind-ai-review-card {
      background: rgba(99, 102, 241, 0.03) !important;
      border: 1px solid rgba(99, 102, 241, 0.15) !important;
      border-radius: 12px !important;
      padding: 12px !important;
    }

    #algomind-ai-review-header {
      color: #818cf8 !important;
    }

    #algomind-gemini-badge {
      background: rgba(99, 102, 241, 0.2) !important;
      color: #a5b4fc !important;
      font-size: 8px !important;
    }

    #algomind-ai-review-content {
      color: #cbd5e1 !important;
    }

    /* Light Theme Styling Overrides */
    #algomind-panel.algomind-light-theme {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
    }

    #algomind-panel.algomind-light-theme .algomind-header {
      background: #ffffff !important;
      border-bottom: 1px solid #e2e8f0 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-logo-txt {
      color: #0f172a !important;
    }

    #algomind-panel.algomind-light-theme .algomind-status {
      color: #334155 !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-stat-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-stat-val {
      color: #0f172a !important;
    }

    #algomind-panel.algomind-light-theme .algomind-stat-lbl {
      color: #475569 !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-section-title {
      color: #000000 !important;
      font-weight: 800 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-active-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03) !important;
    }

    #algomind-panel.algomind-light-theme .algomind-badge {
      background: #f1f5f9 !important;
      color: #334155 !important;
      border: 1px solid #cbd5e1 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-time-taken {
      background: rgba(79, 70, 229, 0.1) !important;
      color: #4338ca !important;
      border: 1px solid rgba(79, 70, 229, 0.25) !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-active-title {
      color: #0f172a !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-compare-avg {
      background: #f1f5f9 !important;
      color: #334155 !important;
      border: 1px solid #cbd5e1 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-tracked-badge {
      background: #dcfce7 !important;
      color: #15803d !important;
      border: 1px solid #86efac !important;
      font-weight: 700 !important;
    }

    .algomind-intuition-label {
      color: #a5b4fc !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-intuition-label {
      color: #000000 !important;
      font-weight: 800 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-action:not(:disabled) {
      background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
      color: #ffffff !important;
      border: none !important;
      font-weight: 700 !important;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45) !important;
    }
    #algomind-panel.algomind-light-theme #algomind-action:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
    }
    #algomind-panel.algomind-light-theme #algomind-action:active:not(:disabled) {
      transform: translateY(1px) !important;
    }

    /* Light Mode Disabled - Soft Purple Tint */
    #algomind-panel.algomind-light-theme .algomind-btn:disabled {
      background: rgba(99, 102, 241, 0.1) !important;
      color: #4f46e5 !important;
      border: 1px solid rgba(99, 102, 241, 0.25) !important;
      opacity: 0.85 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-btn-saved {
      background: #dcfce7 !important;
      color: #15803d !important;
      border: 1px solid #86efac !important;
      opacity: 1 !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-honesty-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-honesty-item {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
    }

    #algomind-panel.algomind-light-theme .algomind-honesty-item .algomind-honesty-lbl {
      color: #000000 !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-honesty-item .algomind-info-icon {
      color: #475569 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-revision-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    #algomind-panel.algomind-light-theme .algomind-revision-item {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
    }

    #algomind-panel.algomind-light-theme .algomind-revision-item .algomind-rev-name {
      color: #0f172a !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-revision-item .algomind-rev-meta {
      color: #475569 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-ai-review-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
    }

    #algomind-panel.algomind-light-theme #algomind-ai-review-header {
      color: #4f46e5 !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-gemini-badge {
      background: rgba(99, 102, 241, 0.1) !important;
      color: #4338ca !important;
      border: 1px solid rgba(99, 102, 241, 0.25) !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-ai-review-content {
      color: #0f172a !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-btn-secondary {
      background: #f1f5f9 !important;
      color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-btn-secondary:hover {
      background: #e2e8f0 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-open-dashboard {
      background: #4f46e5 !important;
      color: #ffffff !important;
      border: none !important;
      font-weight: 700 !important;
    }

    #algomind-panel.algomind-light-theme #algomind-open-dashboard:hover {
      background: #4338ca !important;
    }

    #algomind-panel.algomind-light-theme .algomind-feynman-textarea,
    #algomind-panel.algomind-light-theme .algomind-topic-input {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      color: #0f172a !important;
      font-weight: 500 !important;
    }
    
    #algomind-panel.algomind-light-theme .algomind-feynman-textarea::placeholder,
    #algomind-panel.algomind-light-theme .algomind-topic-input::placeholder {
      color: #64748b !important;
    }

    #algomind-panel.algomind-light-theme #algomind-theme-toggle {
      color: #334155 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-revision-summary {
      color: #1e293b !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-badge-revised {
      color: #4338ca !important;
      background: rgba(79, 70, 229, 0.1) !important;
      border: 1px solid rgba(79, 70, 229, 0.25) !important;
      font-weight: 600 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-badge-unrevised {
      color: #334155 !important;
      background: rgba(51, 65, 85, 0.08) !important;
      border: 1px solid rgba(51, 65, 85, 0.18) !important;
    }



    /* Compact page widget tooltips */
    .algomind-tooltip {
      display: none !important;
      position: absolute !important;
      bottom: 115% !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 140px !important;
      background-color: #0c0c16 !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 6px !important;
      color: #a5b4fc !important;
      font-size: 9px !important;
      padding: 6px 8px !important;
      z-index: 999999 !important;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
      box-sizing: border-box !important;
      text-align: left !important;
      line-height: 1.3 !important;
      pointer-events: none !important;
    }

    .algomind-honesty-item:hover .algomind-tooltip {
      display: block !important;
    }

    /* Switch Toggle Container */
    .algomind-switch {
      position: relative !important;
      display: inline-flex !important;
      align-items: center !important;
      width: 32px !important;
      height: 18px !important;
      vertical-align: middle !important;
      cursor: pointer !important;
      flex-shrink: 0 !important;
    }

    .algomind-switch input {
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
      position: absolute !important;
    }

    .algomind-slider {
      position: absolute !important;
      cursor: pointer !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background-color: rgba(255, 255, 255, 0.12) !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 20px !important;
    }

    .algomind-slider:before {
      position: absolute !important;
      content: "" !important;
      height: 12px !important;
      width: 12px !important;
      left: 2px !important;
      bottom: 2px !important;
      background-color: #94a3b8 !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      border-radius: 50% !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
    }

    .algomind-switch input:checked + .algomind-slider {
      background-color: #6366f1 !important;
      border-color: #4f46e5 !important;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.5) !important;
    }

    .algomind-switch input:checked + .algomind-slider:before {
      transform: translateX(14px) !important;
      background-color: #ffffff !important;
    }

    /* Light Theme Switch Overrides */
    #algomind-panel.algomind-light-theme .algomind-slider {
      background-color: #cbd5e1 !important;
      border: 1px solid #94a3b8 !important;
    }

    #algomind-panel.algomind-light-theme .algomind-slider:before {
      background-color: #ffffff !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
    }

    #algomind-panel.algomind-light-theme .algomind-switch input:checked + .algomind-slider {
      background-color: #6366f1 !important;
      border-color: #4f46e5 !important;
      box-shadow: 0 0 8px rgba(99, 102, 241, 0.4) !important;
    }

    #algomind-panel.algomind-light-theme .algomind-switch input:checked + .algomind-slider:before {
      background-color: #ffffff !important;
    }
  `;
  document.head.appendChild(styleNode);
};


const injectWidgetMarkup = () => {
  if (document.getElementById('algomind-root')) return;

  injectStyles();

  const container = document.createElement('div');
  container.id = 'algomind-root';

  container.innerHTML = `
    <!-- Expanded Panel -->
    <div id="algomind-panel">
      <!-- Section 1: Header & Submission Details -->
      <div class="algomind-header">
        <div class="algomind-logo-area">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
            <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
          </svg>
          <div class="algomind-logo-txt">Algo<span>Mind</span></div>
        </div>
        <div class="algomind-status" style="display: flex !important; align-items: center !important; gap: 8px !important;">
          <button id="algomind-theme-toggle" title="Toggle Theme" style="background: none !important; border: none !important; padding: 2px !important; cursor: pointer !important; color: #94a3b8 !important; display: flex !important; align-items: center !important; transition: color 0.2s !important; outline: none !important;">
            <svg id="algomind-theme-icon" style="width: 14px !important; height: 14px !important;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <span class="algomind-status-dot"></span> <span id="algomind-status-text">Active Session</span>
          <label class="algomind-switch" title="Focus Mode Active: You can't copy the code outside the editor." style="margin-left: 2px !important;">
            <input type="checkbox" id="algomind-focus-mode-toggle">
            <span class="algomind-slider"></span>
          </label>
          <button id="algomind-header-close" title="Close Panel" style="background: none !important; border: none !important; padding: 2px !important; cursor: pointer !important; color: #94a3b8 !important; display: flex !important; align-items: center !important; margin-left: 4px !important; outline: none !important; transition: color 0.2s !important;">
            <svg style="width: 14px !important; height: 14px !important;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Section 1: Active Problem Details -->
      <div class="algomind-active-card" style="padding: 8px 10px !important;">
        <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; gap: 6px !important; margin-bottom: 6px !important;">
          <div class="algomind-active-title" id="algomind-active-title" style="font-size: 13px !important; font-weight: 700 !important;">Scanning...</div>
          <span class="algomind-badge" id="algomind-tracked-badge" style="background: rgba(16, 185, 129, 0.1) !important; color: #10b981 !important; border: 1px solid rgba(16, 185, 129, 0.2) !important; font-size: 9px !important; white-space: nowrap !important; flex-shrink: 0 !important; display: none;">Tracked ✓</span>
        </div>
        <div class="algomind-meta" style="margin-bottom: 8px !important; display: flex !important; gap: 6px !important; flex-wrap: wrap !important; align-items: center !important;">
          <span class="algomind-badge" id="algomind-active-platform" style="font-size: 9px !important; padding: 2px 6px !important;">-</span>
          <span class="algomind-badge" id="algomind-active-diff" style="font-size: 9px !important; padding: 2px 6px !important;">-</span>
          <span class="algomind-badge" id="algomind-time-taken" style="font-size: 9px !important; padding: 2px 6px !important; background: rgba(99, 102, 241, 0.1) !important; color: #818cf8 !important;">0 min</span>
          <span class="algomind-badge" id="algomind-compare-avg" style="font-size: 9px !important; padding: 2px 6px !important; background: rgba(255, 255, 255, 0.05) !important; color: #94a3b8 !important; border: 1px solid rgba(255, 255, 255, 0.08) !important;">⏱️ Avg: -</span>
        </div>
        
        <!-- Section: Save Intuition -->
        <div id="algomind-feynman-container" style="margin-top: 4px !important; margin-bottom: 4px !important; display: block !important;">
          <div class="algomind-intuition-label" style="font-size: 10px !important; margin-bottom: 4px !important; display: flex !important; align-items: center !important; gap: 4px !important;">
            🧠 Save Intuition:
          </div>
          <textarea id="algomind-feynman-input" class="algomind-feynman-textarea" placeholder="e.g. Explain your intuition, key observation or mistake..." style="height: 42px !important; width: 100% !important; box-sizing: border-box !important; margin-bottom: 4px !important;"></textarea>
        </div>

        <div id="algomind-action-container">
          <button class="algomind-btn" id="algomind-action" style="width: 100% !important;">
            Save Idea
          </button>
        </div>
      </div>

      <!-- Section 2: Honesty Checker Accordion -->
      <div id="algomind-honesty-card" style="border: 1px solid rgba(255,255,255,0.06) !important; border-radius: 12px !important; padding: 6px 10px !important; background: rgba(255,255,255,0.01) !important;">
        <div class="algomind-section-title" id="algomind-honesty-header" style="display: flex !important; justify-content: space-between !important; cursor: pointer !important; margin-bottom: 0px !important; user-select: none !important;">
          <span style="display: flex !important; align-items: center !important; gap: 6px !important; color: #94a3b8 !important;">
            <svg id="algomind-honesty-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(180deg); transition: transform 0.2s ease !important;">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Honesty Checker
          </span>
          <span id="algomind-honesty-score-label" style="color: #10b981 !important; font-weight: 700 !important;">Score: 100</span>
        </div>
        
        <div id="algomind-honesty-content" style="display: block; margin-top: 6px !important;">
          <div class="algomind-honesty-grid">
            <div class="algomind-honesty-item" id="honesty-item-switches">
              <span class="algomind-honesty-lbl">Tab Switches:</span>
              <div class="algomind-honesty-val-group">
                <strong id="honesty-val-switches" style="color: #10b981 !important;">0</strong>
                <span class="algomind-info-icon">i</span>
              </div>
              <div class="algomind-tooltip" id="tooltip-switches">
                • 0 switches (0s max)<br>• No penalty
              </div>
            </div>
            <div class="algomind-honesty-item" id="honesty-item-hints">
              <span class="algomind-honesty-lbl">Hint Used:</span>
              <div class="algomind-honesty-val-group">
                <strong id="honesty-val-hints" style="color: #10b981 !important;">No</strong>
                <span class="algomind-info-icon">i</span>
              </div>
              <div class="algomind-tooltip" id="tooltip-hints">
                • No hints used:<br>• No penalty
              </div>
            </div>
            <div class="algomind-honesty-item" id="honesty-item-pastes">
              <span class="algomind-honesty-lbl">Code Pasted:</span>
              <div class="algomind-honesty-val-group">
                <strong id="honesty-val-pastes" style="color: #10b981 !important;">No</strong>
                <span class="algomind-info-icon">i</span>
              </div>
              <div class="algomind-tooltip" id="tooltip-pastes">
                • No paste detected<br>• No penalty
              </div>
            </div>
            <div class="algomind-honesty-item" id="honesty-item-solution">
              <span class="algomind-honesty-lbl">Solution View:</span>
              <div class="algomind-honesty-val-group">
                <strong id="honesty-val-solution" style="color: #10b981 !important;">No</strong>
                <span class="algomind-info-icon">i</span>
              </div>
              <div class="algomind-tooltip" id="tooltip-solution">
                • Not viewed<br>• No penalty
              </div>
            </div>
          </div>
          <div id="algomind-honesty-warning" style="display: none; font-size: 10px !important; color: #f87171 !important; margin-top: 6px !important; text-align: center !important; font-weight: 600 !important; background: rgba(239, 68, 68, 0.08) !important; border: 1px dashed rgba(239, 68, 68, 0.2) !important; padding: 4px !important; border-radius: 8px !important;"></div>
        </div>
      </div>

      <!-- Section 3: Next Revision Schedule -->
      <div class="algomind-revision-card" style="padding: 6px 10px !important;">
        <div class="algomind-section-title" style="margin-bottom: 2px !important; display: flex !important; justify-content: space-between !important; align-items: center !important;">
          <span>Next Recall Revision</span>
          <span id="algomind-revision-count" style="display: none;">0 revised</span>
        </div>
        <div id="algomind-revision-summary" class="algomind-revision-summary">Calculated on accepted submissions...</div>
      </div>

      <!-- Section 4: AI Code Review -->
      <div id="algomind-ai-review-card" style="display: none;">
        <div class="algomind-section-title" id="algomind-ai-review-header" style="margin-bottom: 6px !important; display: flex !important; justify-content: space-between !important;">
          <span>AI Code Review</span>
          <span class="algomind-badge" id="algomind-gemini-badge">Gemini Powered</span>
        </div>
        <div id="algomind-ai-review-content" style="font-size: 11px !important; line-height: 1.4 !important;">
          <!-- Skeleton Shimmer Loader -->
          <div style="height: 12px !important; width: 100% !important; background: rgba(99,102,241,0.1) !important; margin-bottom: 6px !important; border-radius: 4px !important;"></div>
          <div style="height: 12px !important; width: 85% !important; background: rgba(99,102,241,0.1) !important; border-radius: 4px !important;"></div>
        </div>
        <div id="algomind-ai-review-tags" style="display: flex !important; flex-wrap: wrap !important; gap: 4px !important; margin-top: 8px !important;"></div>
      </div>

      <!-- Footer Buttons -->
      <div class="algomind-footer" style="margin-top: 0px !important; padding-top: 6px !important;">
        <button class="algomind-btn" id="algomind-open-dashboard" style="flex:1;">
          Dashboard
        </button>
        <button class="algomind-btn algomind-btn-secondary" id="algomind-close" style="flex:0.5;">
          Close
        </button>
      </div>
    </div>

    <!-- Collapsed Circle Button -->
    <div id="algomind-circle">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
        <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
      </svg>
    </div>
  `;

  
  const attachToDOM = () => {
    if (document.body) {
      if (!document.getElementById('algomind-root')) {
        document.body.appendChild(container);
      }
    } else {
      setTimeout(attachToDOM, 50);
    }
  };
  attachToDOM();

  
  const circleBtn = container.querySelector('#algomind-circle');
  const closeBtn = container.querySelector('#algomind-close');
  const headerCloseBtn = container.querySelector('#algomind-header-close');
  const dashBtn = container.querySelector('#algomind-open-dashboard');

  if (circleBtn) circleBtn.addEventListener('click', togglePanel);
  if (closeBtn) closeBtn.addEventListener('click', togglePanel);
  if (headerCloseBtn) headerCloseBtn.addEventListener('click', togglePanel);
  if (dashBtn) {
    dashBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      const currentOrigin = window.location.origin;
      const isLocal = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');

      if (isExtensionContextValid()) {
        chrome.storage.local.get(['dashboardUrl'], (res) => {
          let rawUrl = (res && res.dashboardUrl) ? res.dashboardUrl : '';
          let baseUrl = 'https://algominddev.vercel.app';

          if (isLocal) {
            baseUrl = currentOrigin.includes('3000') ? 'http://localhost:3000' : currentOrigin;
          } else if (rawUrl && !rawUrl.includes('leetcode') && !rawUrl.includes('geeksforgeeks') && !rawUrl.includes('ambuj-s-team') && !rawUrl.includes('oq78btw6i')) {
            baseUrl = rawUrl.replace(/\/dashboard\/?$/, '');
          }

          window.open(`${baseUrl}/dashboard`, '_blank');
        });
      } else {
        const fallbackUrl = isLocal ? 'http://localhost:3000/dashboard' : 'https://algominddev.vercel.app/dashboard';
        window.open(fallbackUrl, '_blank');
      }
    });
  }

  
  const focusToggle = document.getElementById('algomind-focus-mode-toggle');
  if (focusToggle && isExtensionContextValid()) {
    chrome.storage.local.get(['focusModeEnabled'], (res) => {
      const enabled = !!(res && res.focusModeEnabled);
      focusModeEnabled = enabled;
      focusToggle.checked = enabled;
    });

    focusToggle.addEventListener('change', () => {
      const enabled = focusToggle.checked;
      focusModeEnabled = enabled;
      chrome.storage.local.set({ focusModeEnabled: enabled }, () => {
        chrome.runtime.sendMessage({ action: 'TOGGLE_FOCUS_MODE', enabled });
      });
    });
  }

  const themeToggle = document.getElementById('algomind-theme-toggle');
  const themeIcon = document.getElementById('algomind-theme-icon');
  const panel = document.getElementById('algomind-panel');

  const updateThemeUI = (theme) => {
    if (theme === 'light') {
      panel.classList.add('algomind-light-theme');
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      panel.classList.remove('algomind-light-theme');
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  };

  if (isExtensionContextValid()) {
    chrome.storage.local.get(['widgetTheme'], (res) => {
      const activeTheme = (res && res.widgetTheme) || 'dark';
      updateThemeUI(activeTheme);
    });
  } else {
    updateThemeUI('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (isExtensionContextValid()) {
        chrome.storage.local.get(['widgetTheme'], (res) => {
          const currentTheme = (res && res.widgetTheme) || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          if (isExtensionContextValid()) {
            chrome.storage.local.set({ widgetTheme: newTheme }, () => {
              updateThemeUI(newTheme);
            });
          }
        });
      }
    });
  }

  const honestyHeader = document.getElementById('algomind-honesty-header');
  const honestyContent = document.getElementById('algomind-honesty-content');
  const honestyChevron = document.getElementById('algomind-honesty-chevron');

  if (honestyHeader && honestyContent && honestyChevron) {
    honestyHeader.addEventListener('click', () => {
      if (honestyContent.style.display === 'none') {
        honestyContent.style.display = 'block';
        honestyChevron.style.transform = 'rotate(180deg)';
      } else {
        honestyContent.style.display = 'none';
        honestyChevron.style.transform = 'rotate(0deg)';
      }
    });
  }
};


const isMonitor = () => {
  return window.screen.width >= 1600 || window.innerWidth >= 1400 || window.screen.height >= 1000;
};

const togglePanel = () => {
  const panel = document.getElementById('algomind-panel');
  const circle = document.getElementById('algomind-circle');
  if (!panel) return;

  if (panel.style.display === 'flex') {
    hideWidgetPasteWarning();
    panel.style.display = 'none';
    if (circle) {
      circle.classList.remove('algomind-hidden');
      circle.style.setProperty('display', 'flex', 'important');
    }
  } else {
    updateStatsFromStorage();
    panel.style.display = 'flex';

    if (circle) {
      if (isMonitor()) {
        // MONITOR: Keep circular launcher widget VISIBLE!
        circle.classList.remove('algomind-hidden');
        circle.style.setProperty('display', 'flex', 'important');
        panel.style.marginBottom = '8px';
        panel.style.maxHeight = 'calc(100vh - 85px)';
      } else {
        // LAPTOP: Hide circular launcher widget to save space
        circle.classList.add('algomind-hidden');
        circle.style.setProperty('display', 'none', 'important');
      }
    }
  }
};


const completeRevisionPrompt = (problemId, action) => {
  const actionContainer = document.getElementById('algomind-action-container');
  if (actionContainer) {
    actionContainer.innerHTML = `
      <div style="font-size: 10px !important; color: #94a3b8 !important; text-align: center !important; padding: 4px !important;">
        Updating revision status...
      </div>
    `;
  }
  chrome.runtime.sendMessage({
    action: 'COMPLETE_REVISION',
    data: { problemId, action }
  }, (response) => {
    log('[AlgoMind Content Script] Revision completed:', response);
    updateStatsFromStorage();
  });
};


const updateStatsFromStorage = () => {
  if (!isExtensionContextValid()) {
    console.warn('[AlgoMind Content Script] Extension context invalidated or storage unavailable.');
    return;
  }
  chrome.storage.local.get(['solvedProblemsCount', 'revisionQueue', 'activeProblem', 'focusModeEnabled', 'currentStreak'], (result) => {
    const solvedToday = result.solvedProblemsCount || 0;
    const revisionQueue = result.revisionQueue || [];
    const activeProblem = result.activeProblem;
    const focusModeEnabled = result.focusModeEnabled;

    
    const focusToggle = document.getElementById('algomind-focus-mode-toggle');
    if (focusToggle) focusToggle.checked = !!focusModeEnabled;

    
    const solvedElem = document.getElementById('algomind-stat-solved');
    const streakElem = document.getElementById('algomind-stat-streak');
    if (solvedElem) solvedElem.innerText = solvedToday;
    
    if (streakElem) {
      const streakCount = result.currentStreak || 0;
      streakElem.innerText = streakCount > 0 ? `${streakCount}d` : '0d';
    }

    
    const queueItem = revisionQueue.find(p => 
      isSameProblem(p.url, window.location.href) || 
      (p.title && activeProblem && activeProblem.title && p.title.toLowerCase().trim() === activeProblem.title.toLowerCase().trim())
    );
    
    log('[AlgoMind Stats] updateStatsFromStorage triggered');
    
    
    const activeTitleElem = document.getElementById('algomind-active-title');
    const activePlatformElem = document.getElementById('algomind-active-platform');
    const activeDiffElem = document.getElementById('algomind-active-diff');
    const actionContainer = document.getElementById('algomind-action-container');

    if (activeProblem && isSameProblem(activeProblem.url, window.location.href)) {
      if (activeTitleElem) {
        activeTitleElem.innerText = activeProblem.title;
        activeTitleElem.title = activeProblem.title;
      }
      if (activePlatformElem) {
        const pName = activeProblem.platform || '-';
        activePlatformElem.innerText = pName === 'GeeksforGeeks' ? 'GFG' : pName;
      }
      if (activeDiffElem) {
        activeDiffElem.innerText = activeProblem.difficulty;
        activeDiffElem.className = `algomind-badge algomind-${activeProblem.difficulty.toLowerCase()}`;
      }

      if (actionContainer) {
        const feynmanContainer = document.getElementById('algomind-feynman-container');
        const feynmanInput = document.getElementById('algomind-feynman-input');
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const scoreData = getHonestyScore(elapsed);
        const score = scoreData.score;

        if (score < 30) {
          
          if (feynmanContainer) feynmanContainer.style.display = 'none';
          actionContainer.innerHTML = `
            <div style="font-size: 10px !important; color: #f87171 !important; margin-bottom: 8px !important; text-align: center !important; font-weight: 500 !important; background: rgba(239, 68, 68, 0.08) !important; border: 1px dashed rgba(239, 68, 68, 0.2) !important; padding: 8px !important; border-radius: 8px !important; line-height: 1.4 !important; box-sizing: border-box !important; word-wrap: break-word !important; width: 100% !important;">
              ⚠️ Tracking Blocked: Solution copied. Please write it yourself to enable tracking.
            </div>
            <button class="algomind-btn" id="algomind-action" disabled style="background: rgba(255,255,255,0.05) !important; color: #64748b !important; cursor: not-allowed !important; border: 1px solid rgba(255,255,255,0.08) !important; width: 100% !important;">
              Tracking Blocked
            </button>
          `;
        } else {
          
          if (feynmanContainer) feynmanContainer.style.display = 'block';

          const trackedBadge = document.getElementById('algomind-tracked-badge');
          const isTracked = !!(queueItem || state.isAccepted);

          if (trackedBadge) {
            trackedBadge.style.display = isTracked ? 'inline-block' : 'none';
          }

          const revisionSummary = document.getElementById('algomind-revision-summary');
          if (revisionSummary) {
            if (queueItem && queueItem.nextRevisionDate) {
              const d = new Date(queueItem.nextRevisionDate);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const diffDays = Math.max(1, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
              revisionSummary.innerText = `In ${diffDays} days — ${dateStr} · Will notify at 9:00 PM`;
            } else if (isTracked) {
              const fallbackDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
              const dateStr = fallbackDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              revisionSummary.innerText = `In 3 days — ${dateStr} · Will notify at 9:00 PM`;
            } else {
              revisionSummary.innerText = 'Calculated on accepted submissions...';
            }
          }

          let pendingRecallMarkup = '';
          if (queueItem) {
            const revCountBadge = document.getElementById('algomind-revision-count');
            if (revCountBadge) {
              const completedRevisions = Math.max(0, (queueItem.revisionStep || 1) - 1);
              if (completedRevisions > 0) {
                revCountBadge.innerText = `${completedRevisions}× revised`;
                revCountBadge.className = 'algomind-badge-revised';
                revCountBadge.style.display = 'inline-block';
              } else {
                revCountBadge.innerText = 'Not revised yet';
                revCountBadge.className = 'algomind-badge-unrevised';
                revCountBadge.style.display = 'inline-block';
                revCountBadge.style.color = '';
                revCountBadge.style.background = '';
                revCountBadge.style.borderColor = '';
              }
            }

            if (queueItem.status === 'Pending') {
              pendingRecallMarkup = `
                <div style="font-size: 10px !important; color: #94a3b8 !important; margin-bottom: 6px !important; text-align: center !important; font-weight: 600 !important; background: rgba(99, 102, 241, 0.05) !important; border: 1px dashed rgba(99, 102, 241, 0.2) !important; padding: 6px !important; border-radius: 8px !important;">
                  🔔 Revision due today! Did you recall this solution?
                </div>
                <div style="display: flex !important; gap: 8px !important; width: 100% !important; margin-bottom: 8px !important;">
                  <button class="algomind-btn" id="algomind-recall-yes" style="background: #10b981 !important; flex: 1 !important; height: 28px !important; font-size: 10px !important;">
                    Yes, Recalled
                  </button>
                  <button class="algomind-btn" id="algomind-recall-no" style="background: #ef4444 !important; flex: 1 !important; height: 28px !important; font-size: 10px !important;">
                    No, Forgot
                  </button>
                </div>
              `;
            }
          } else {
            const revCountBadge = document.getElementById('algomind-revision-count');
            if (revCountBadge) revCountBadge.style.display = 'none';
          }

          actionContainer.innerHTML = `
            ${pendingRecallMarkup}
            <button class="algomind-btn" id="algomind-action" disabled style="width: 100% !important;">
              Save Idea
            </button>
          `;

          if (queueItem && queueItem.status === 'Pending') {
            document.getElementById('algomind-recall-yes')?.addEventListener('click', () => {
              completeRevisionPrompt(queueItem._id, 'recalled');
            });
            document.getElementById('algomind-recall-no')?.addEventListener('click', () => {
              completeRevisionPrompt(queueItem._id, 'forgot');
            });
          }

          const actionBtn = document.getElementById('algomind-action');

          const validateFeynmanInput = () => {
            if (!actionBtn) return;
            if (feynmanInput && feynmanInput.value.trim().length >= 3) {
              actionBtn.disabled = false;
              actionBtn.innerText = 'Save Idea';
              actionBtn.removeAttribute('style');
              actionBtn.style.width = '100%';
            } else {
              actionBtn.disabled = true;
              actionBtn.innerText = 'Save Idea';
              actionBtn.removeAttribute('style');
              actionBtn.style.width = '100%';
            }
          };

          if (feynmanInput && actionBtn) {
            feynmanInput.removeEventListener('input', validateFeynmanInput);
            feynmanInput.addEventListener('input', validateFeynmanInput);
            validateFeynmanInput();
          }

          if (actionBtn) {
            actionBtn.addEventListener('click', () => {
              const intuitionVal = feynmanInput ? feynmanInput.value.trim() : '';
              const targetProblem = activeProblem || queueItem;
              const autoTopic = extractAutomaticTopic(targetProblem);
              submitRevisionTracking(targetProblem, intuitionVal, autoTopic);
            });
          }
        }
      }
    } else {
      
      if (activeTitleElem) {
        const shortTitle = document.title.split(' - ')[0];
        activeTitleElem.innerText = shortTitle;
        activeTitleElem.title = shortTitle;
      }
      if (activePlatformElem) {
        const pName = getPlatform(window.location.href) || '-';
        activePlatformElem.innerText = pName === 'GeeksforGeeks' ? 'GFG' : pName;
      }
      if (activeDiffElem) {
        activeDiffElem.innerText = 'Scanning...';
        activeDiffElem.className = 'algomind-badge';
      }
      if (actionContainer) {
        actionContainer.innerHTML = `
          <button class="algomind-btn" id="algomind-action" disabled style="width: 100% !important;">
            Scan Pending
          </button>
        `;
      }
    }

    
    const pendingList = document.getElementById('algomind-revision-list');
    const pendingCountBadge = document.getElementById('algomind-pending-count');
    
    const pendingItems = revisionQueue.filter(p => {
      const nextRev = new Date(p.nextRevisionDate);
      return nextRev <= new Date();
    });

    if (pendingCountBadge) pendingCountBadge.innerText = pendingItems.length;

    if (pendingList) {
      if (pendingItems.length > 0) {
        pendingList.innerHTML = '';
        
        pendingItems.slice(0, 3).forEach(item => {
          const li = document.createElement('li');
          li.className = 'algomind-revision-item';
          
          const diffClass = `algomind-${item.difficulty.toLowerCase()}`;

          
          const nameDiv = document.createElement('div');
          nameDiv.className = 'algomind-rev-name';
          nameDiv.textContent = item.title;

          const metaDiv = document.createElement('div');
          metaDiv.className = 'algomind-rev-meta';
          metaDiv.textContent = `${item.platform} \u2022 Due`;

          const wrapperDiv = document.createElement('div');
          wrapperDiv.appendChild(nameDiv);
          wrapperDiv.appendChild(metaDiv);

          const diffSpan = document.createElement('span');
          diffSpan.className = `algomind-badge ${diffClass}`;
          diffSpan.style.cssText = 'font-size: 8px !important; padding: 1px 4px !important;';
          diffSpan.textContent = item.difficulty;

          li.appendChild(wrapperDiv);
          li.appendChild(diffSpan);
          pendingList.appendChild(li);
        });
      } else {
        pendingList.innerHTML = `<li class="algomind-empty">No revisions pending for today!</li>`;
      }
    }
  });
};


const showAlgoMindToast = (message, type = 'success') => {
  let toastContainer = document.getElementById('algomind-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'algomind-toast-container';
    toastContainer.style.cssText = `
      position: fixed !important;
      bottom: 84px !important;
      right: 24px !important;
      z-index: 2147483647 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      pointer-events: none !important;
      font-family: 'Inter', -apple-system, sans-serif !important;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'algomind-toast-item';
  const isLight = document.getElementById('algomind-panel')?.classList.contains('algomind-light-theme');
  
  const bg = isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.96)';
  const border = isLight ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.4)';
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const shadow = isLight ? '0 10px 25px rgba(0, 0, 0, 0.1)' : '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.2)';

  toast.style.cssText = `
    background: ${bg} !important;
    border: ${border} !important;
    color: ${textColor} !important;
    box-shadow: ${shadow} !important;
    padding: 10px 16px !important;
    border-radius: 12px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    opacity: 0 !important;
    transform: translateY(12px) scale(0.95) !important;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    pointer-events: auto !important;
  `;

  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
};

const submitRevisionTracking = (problemData, intuitionVal = '', topicVal = 'General') => {
  if (!isExtensionContextValid()) {
    console.warn('[AlgoMind Content Script] Extension context invalidated. Refresh page to reconnect.');
    return;
  }
  const actionBtn = document.getElementById('algomind-action');
  if (!actionBtn) return;

  actionBtn.innerHTML = `
    <svg class="algomind-spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 14px !important; height: 14px !important; margin-right: 6px !important; display: inline-block !important;">
      <path d="M21 12a9 9 0 11-6.219-8.56"></path>
    </svg>
    Saving Notes...
  `;
  actionBtn.className = 'algomind-btn algomind-btn-loading';
  actionBtn.disabled = true;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const scoreData = getHonestyScore(elapsed);
  const honestyMetrics = {
    hintsUsed,
    solutionClicked,
    tabSwitchesCount,
    codePasted,
    timeTakenSeconds: elapsed,
    honestyScore: scoreData.score,
    eventTimeline,
    reasons: scoreData.reasons
  };

  chrome.runtime.sendMessage({
    action: 'SUBMISSION_ACCEPTED',
    data: {
      ...problemData,
      honestyMetrics,
      intuition: intuitionVal,
      topic: topicVal,
      isNoteOnly: true
    }
  }, (response) => {
    log('[AlgoMind Content Script] Solve logged manually:', response);
    
    actionBtn.innerText = 'Saved ✓';
    actionBtn.className = 'algomind-btn algomind-btn-saved';
    actionBtn.disabled = true;

    const feynmanInput = document.getElementById('algomind-feynman-input');
    if (feynmanInput) feynmanInput.value = '';

    const trackedBadge = document.getElementById('algomind-tracked-badge');
    if (trackedBadge) {
      trackedBadge.style.display = 'inline-block';
    }

    showAlgoMindToast('✨ Intuition notes saved successfully!');
    setTimeout(updateStatsFromStorage, 1000);
  });
};

const submitAcceptedSolve = (payload) => {
  if (!isExtensionContextValid()) {
    console.warn('[AlgoMind Content Script] Extension context invalidated. Refresh page to reconnect.');
    return;
  }
  const actionBtn = document.getElementById('algomind-action');
  const revisionSummary = document.getElementById('algomind-revision-summary');
  const reviewContent = document.getElementById('algomind-ai-review-content');
  const tagsContainer = document.getElementById('algomind-ai-review-tags');

  const score = payload.honestyMetrics ? payload.honestyMetrics.honestyScore : 100;
  if (score < 30) {
    console.warn('[AlgoMind] Low honesty score detected. Auto-sync blocked.');
    if (actionBtn) {
      actionBtn.innerText = 'Tracking Blocked';
      actionBtn.className = 'algomind-btn';
      actionBtn.disabled = true;
    }
    if (revisionSummary) {
      revisionSummary.innerText = 'Solve not tracked. Copy-paste detected.';
    }
    if (reviewContent) {
      reviewContent.innerText = 'AI review skipped. Blocked state.';
    }
    return;
  }

  const reviewCard = document.getElementById('algomind-ai-review-card');
  if (reviewCard) {
    reviewCard.style.display = 'block';
  }

  if (actionBtn) {
    actionBtn.innerHTML = `
      <svg class="algomind-spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 12px !important; height: 12px !important; margin-right: 6px !important; display: inline-block !important;">
        <path d="M21 12a9 9 0 11-6.219-8.56"></path>
      </svg>
      Analyzing Code...
    `;
    actionBtn.className = 'algomind-btn algomind-btn-loading';
    actionBtn.disabled = true;
  }

  if (revisionSummary) {
    revisionSummary.innerText = 'Calculating revision interval...';
  }

  if (reviewContent) {
    reviewContent.innerHTML = `
      <div style="height: 12px !important; width: 100% !important; background: rgba(99,102,241,0.1) !important; margin-bottom: 6px !important; border-radius: 4px !important;"></div>
      <div style="height: 12px !important; width: 85% !important; background: rgba(99,102,241,0.1) !important; border-radius: 4px !important;"></div>
    `;
  }
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
  }

  
  const topicInput = document.getElementById('algomind-topic-input');
  const feynmanInput = document.getElementById('algomind-feynman-input');
  if (topicInput && topicInput.value.trim()) {
    payload.topic = topicInput.value.trim();
  } else if (!payload.topic) {
    payload.topic = extractAutomaticTopic(payload);
  }

  if (feynmanInput && feynmanInput.value.trim()) {
    payload.intuition = feynmanInput.value.trim();
  }

  chrome.runtime.sendMessage({
    action: 'SUBMISSION_ACCEPTED',
    data: payload
  }, (response) => {
    log('[AlgoMind Content Script] Solve accepted sync response:', response);
    
    if (actionBtn) {
      actionBtn.innerText = 'Tracked ✓';
      actionBtn.className = 'algomind-btn';
      actionBtn.disabled = true;
    }

    const trackedBadge = document.getElementById('algomind-tracked-badge');
    if (trackedBadge) {
      trackedBadge.style.display = 'inline-block';
    }

    setTimeout(updateStatsFromStorage, 1000);

    if (response && response.status === 'success' && response.data) {
      const data = response.data;
      if (revisionSummary && data.nextRevisionDate) {
        const d = new Date(data.nextRevisionDate);
        const options = { month: 'short', day: 'numeric' };
        const dateStr = d.toLocaleDateString('en-US', options);
        const diffDays = Math.max(1, Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24)));
        revisionSummary.innerText = `In ${diffDays} days — ${dateStr} · Will notify at 9:00 PM`;
      }

      if (data.aiReview) {
        const feedbackText = typeof data.aiReview === 'string' 
          ? data.aiReview 
          : (data.aiReview.feedback || data.aiReview.summary || 'AI Code Review generated successfully.');

        if (reviewContent) {
          reviewContent.innerText = feedbackText;
        }
        if (tagsContainer && Array.isArray(data.aiReview.tags)) {
          tagsContainer.innerHTML = '';
          data.aiReview.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'algomind-badge';
            if (tag.strength === 'strong') {
              span.style.cssText = 'background: rgba(16, 185, 129, 0.1) !important; color: #10b981 !important; border: 1px solid rgba(16, 185, 129, 0.2) !important;';
              span.innerText = `${tag.topic} (Strong)`;
            } else {
              span.style.cssText = 'background: rgba(239, 68, 68, 0.1) !important; color: #f87171 !important; border: 1px solid rgba(239, 68, 68, 0.2) !important;';
              span.innerText = `${tag.topic} (Weak)`;
            }
            tagsContainer.appendChild(span);
          });
        }
      } else {
        if (reviewContent) {
          reviewContent.innerText = '✨ Submission & Active Recall tracked! Submit code on LeetCode/GFG for full Gemini AI Code Reviews.';
        }
      }
    } else {
      if (revisionSummary) {
        revisionSummary.innerText = 'Saved locally! Will sync online once connected.';
      }
      if (reviewContent) {
        reviewContent.innerText = 'Could not retrieve AI review. Verify internet connection.';
      }
    }
  });
};

/* ==========================================================================
   ALGO_MIND SUBMISSION STATE MACHINE
   ========================================================================== */

const SUBMIT_STATE = {
  IDLE: 'IDLE',
  SUBMIT_CLICKED: 'SUBMIT_CLICKED',
  WAITING_FOR_VERDICT: 'WAITING_FOR_VERDICT',
  VERDICT_RECEIVED: 'VERDICT_RECEIVED'
};

let currentSubmitState = SUBMIT_STATE.IDLE;
let activeSubmissionId = null;
let lastProcessedSubmissionId = null;
let submitTimeoutTimer = null;
let judgeVerdictObserver = null;
let submitIntentDebounceTimestamp = 0;

const resetSubmissionState = () => {
  currentSubmitState = SUBMIT_STATE.IDLE;
  activeSubmissionId = null;
  if (submitTimeoutTimer) {
    clearTimeout(submitTimeoutTimer);
    submitTimeoutTimer = null;
  }
  if (judgeVerdictObserver) {
    judgeVerdictObserver.disconnect();
    judgeVerdictObserver = null;
  }
};

const registerSubmitIntent = (source = 'click') => {
  const now = Date.now();
  if (now - submitIntentDebounceTimestamp < 1800) return;
  submitIntentDebounceTimestamp = now;

  activeSubmissionId = `sub_${now}_${Math.random().toString(36).substr(2, 6)}`;
  currentSubmitState = SUBMIT_STATE.SUBMIT_CLICKED;
  log(`[AlgoMind Submission Engine] Submit intent detected via ${source}. Attempt ID: ${activeSubmissionId}`);

  currentSubmitState = SUBMIT_STATE.WAITING_FOR_VERDICT;
  logTimelineEvent('SUBMIT_INTENT', { attemptId: activeSubmissionId, source });

  state.startTime = Date.now();
  startTime = state.startTime;

  const trackedBadge = document.getElementById('algomind-tracked-badge');
  if (trackedBadge) {
    trackedBadge.style.display = 'none';
  }

  if (submitTimeoutTimer) clearTimeout(submitTimeoutTimer);
  submitTimeoutTimer = setTimeout(() => {
    if (currentSubmitState === SUBMIT_STATE.WAITING_FOR_VERDICT) {
      log(`[AlgoMind Submission Engine] Verdict timeout (60s) for ${activeSubmissionId}. Resetting to IDLE.`);
      resetSubmissionState();
    }
  }, 60000);

  startJudgeVerdictObserver();
};

const isSubmitButton = (target) => {
  if (!target) return false;
  const btn = target.closest('button, a, [role="button"], div[class*="submit"], div[class*="Submit"]');
  if (!btn) return false;

  if (btn.closest('#algomind-root')) return false;

  const attrStr = `${btn.getAttribute('data-e2e-locator') || ''} ${btn.getAttribute('data-cy') || ''} ${btn.id || ''} ${btn.className || ''}`.toLowerCase();
  if (attrStr.includes('submit') || attrStr.includes('run-code-btn')) return true;

  const text = btn.innerText ? btn.innerText.trim().toLowerCase() : '';
  if (text === 'submit' || text.startsWith('submit ') || text.endsWith(' submit')) return true;

  return false;
};

const startJudgeVerdictObserver = () => {
  if (judgeVerdictObserver) {
    judgeVerdictObserver.disconnect();
  }

  const platform = getPlatform(window.location.href);
  if (!platform) return;
  const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS[platform] : null;
  if (!config) return;

  log(`[AlgoMind Submission Engine] Verdict Observer ACTIVE for attempt ${activeSubmissionId}...`);

  const checkDOMVerdict = () => {
    if (currentSubmitState !== SUBMIT_STATE.WAITING_FOR_VERDICT || !activeSubmissionId) {
      return;
    }

    if (activeSubmissionId === lastProcessedSubmissionId) {
      return;
    }

    const resultElem = document.querySelector(config.acceptedStatus);
    if (!resultElem || !resultElem.innerText) return;

    const rawText = resultElem.innerText.trim();
    const lowerText = rawText.toLowerCase();

    if (lowerText.includes('pending') || lowerText.includes('judging') || lowerText.includes('running') || lowerText.includes('compiling')) {
      return;
    }

    let isAcceptedVerdict = false;
    let isFinishedVerdict = false;

    if (platform === 'LeetCode') {
      if (rawText === 'Accepted') {
        isAcceptedVerdict = true;
        isFinishedVerdict = true;
      } else if (
        lowerText.includes('wrong answer') ||
        lowerText.includes('time limit exceeded') ||
        lowerText.includes('memory limit exceeded') ||
        lowerText.includes('runtime error') ||
        lowerText.includes('compile error') ||
        lowerText.includes('output limit exceeded')
      ) {
        isFinishedVerdict = true;
      }
    } else if (platform === 'GeeksforGeeks') {
      if (lowerText.includes('correct answer') || lowerText.includes('accepted') || lowerText.includes('problem solved') || lowerText.includes('100%')) {
        isAcceptedVerdict = true;
        isFinishedVerdict = true;
      } else if (
        lowerText.includes('wrong answer') ||
        lowerText.includes('time limit exceeded') ||
        lowerText.includes('compilation error') ||
        lowerText.includes('runtime error')
      ) {
        isFinishedVerdict = true;
      }
    } else {
      if (lowerText.includes('accepted') || lowerText === 'ac') {
        isAcceptedVerdict = true;
        isFinishedVerdict = true;
      } else if (lowerText.includes('wrong') || lowerText.includes('error') || lowerText.includes('exceeded')) {
        isFinishedVerdict = true;
      }
    }

    if (isFinishedVerdict) {
      const finishedSubmissionId = activeSubmissionId;
      lastProcessedSubmissionId = finishedSubmissionId;

      if (isAcceptedVerdict) {
        log(`[AlgoMind Submission Engine] ACCEPTED Verdict confirmed for submission ${finishedSubmissionId}!`);
        currentSubmitState = SUBMIT_STATE.VERDICT_RECEIVED;

        if (submitTimeoutTimer) {
          clearTimeout(submitTimeoutTimer);
          submitTimeoutTimer = null;
        }

        if (judgeVerdictObserver) {
          judgeVerdictObserver.disconnect();
          judgeVerdictObserver = null;
        }

        onAcceptedSubmissionDetected();
        currentSubmitState = SUBMIT_STATE.IDLE;
        activeSubmissionId = null;
      } else {
        log(`[AlgoMind Submission Engine] Non-accepted verdict ("${rawText}") received for submission ${finishedSubmissionId}. Resetting state to IDLE.`);
        resetSubmissionState();
      }
    }
  };

  judgeVerdictObserver = new MutationObserver(() => {
    checkDOMVerdict();
  });

  judgeVerdictObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  checkDOMVerdict();
};

const onAcceptedSubmissionDetected = () => {
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const platform = getPlatform(window.location.href);
  const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS[platform] : null;
  
  let scrapedCode = '';
  if (config && config.editorTextarea) {
    const editorTextarea = document.querySelector(config.editorTextarea);
    if (editorTextarea) {
      scrapedCode = editorTextarea.value || '';
    }
  }
  if (!scrapedCode || scrapedCode.trim() === '') {
    const viewLines = document.querySelector('.view-lines');
    if (viewLines) {
      scrapedCode = viewLines.innerText || '';
    }
  }

  isAccepted = true;
  logTimelineEvent('ACCEPTED');

  const scoreData = getHonestyScore(elapsedSeconds);
  const honestyMetrics = {
    hintsUsed,
    solutionClicked,
    tabSwitchesCount,
    codePasted,
    timeTakenSeconds: elapsedSeconds,
    honestyScore: scoreData.score,
    eventTimeline,
    reasons: scoreData.reasons
  };

  const payload = {
    ...activeProblemDetails,
    honestyMetrics,
    code: scrapedCode
  };

  const panel = document.getElementById('algomind-panel');
  if (panel) {
    panel.style.display = 'flex';
  }

  updateWidgetHonestyUI();
  submitAcceptedSolve(payload);
};

const isProblemPage = (url, platform) => {
  if (platform === 'LocalDev') return true;
  if (platform === 'LeetCode' && url.includes('/problems/')) return true;
  if (platform === 'GeeksforGeeks' && url.includes('/problems/')) return true;
  if (platform === 'Codeforces' && (url.includes('/problemset/problem/') || url.includes('/contest/'))) return true;
  if (platform === 'AtCoder' && url.includes('/contests/')) return true;
  if (platform === 'CodeChef' && url.includes('/problems/')) return true;
  if (platform === 'HackerRank' && url.includes('/challenges/')) return true;
  return false;
};


const checkAndScrape = (retryCount = 0) => {
  const url = window.location.href;
  const platform = getPlatform(url);

  if (!platform || !isProblemPage(url, platform)) {
    const circle = document.getElementById('algomind-circle');
    const panel = document.getElementById('algomind-panel');
    if (circle) circle.style.display = 'none';
    if (panel) panel.style.display = 'none';
    return;
  }

  const slug = getProblemSlug(url);
  if (slug && slug !== currentProblemSlug) {
    currentProblemSlug = slug;
    resetHonestyMetrics();
    resetSubmissionState();
  }
  
  
  injectWidgetMarkup();

  const callback = (data) => {
    if (data && data.title && data.title !== 'Loading...' && !data.title.includes('leetcode.com')) {
      sendProblemData(data);
      updateStatsFromStorage();
    } else if (retryCount < 4) {
      
      setTimeout(() => checkAndScrape(retryCount + 1), 600);
    }
  };

  if (platform === 'LeetCode' && url.includes('/problems/')) {
    parseLeetCode(callback);
  } else if (platform === 'GeeksforGeeks' && url.includes('/problems/')) {
    parseGFG(callback);
  } else {
    
    updateStatsFromStorage();
  }
};


const observeUrlChanges = () => {
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      log('[AlgoMind Content Script] SPA URL change:', window.location.href);
      lastUrl = window.location.href;
      
      
      const panel = document.getElementById('algomind-panel');
      const circle = document.getElementById('algomind-circle');
      if (panel && circle) {
        panel.style.display = 'none';
        circle.classList.remove('algomind-hidden');
        circle.style.setProperty('display', 'flex', 'important');
      }

      setTimeout(checkAndScrape, 800);
    }
  }, 500); 
};

const isInsideEditor = (target) => {
  if (!target) return false;
  return !!(
    target.closest('.monaco-editor') ||
    target.closest('.ace_editor') ||
    target.closest('[class*="editor"]') ||
    target.closest('.view-line') ||
    target.closest('.view-lines') ||
    target.closest('.ace_line')
  );
};

const attachEventMonitors = () => {
  
  document.addEventListener('keydown', (e) => {
    if (isInsideEditor(e.target)) {
      typingCount++;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        log('[AlgoMind Submission Engine] Ctrl/Cmd + Enter shortcut submission detected!');
        registerSubmitIntent('keyboard_shortcut');
      }
    }
  }, true);

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    if (target.closest('#algomind-root')) return;

    const platform = getPlatform(window.location.href);
    const config = (platform && window.ALGO_SELECTORS) ? window.ALGO_SELECTORS[platform] : null;
    const text = target.innerText ? target.innerText.trim().toLowerCase() : '';

    if (isSubmitButton(target)) {
      log('[AlgoMind Submission Engine] Submit button click detected!');
      registerSubmitIntent('submit_button_click');

      const revisionSummary = document.getElementById('algomind-revision-summary');
      if (revisionSummary) {
        revisionSummary.innerText = 'Evaluating code & judging submission...';
      }

      const reviewContent = document.getElementById('algomind-ai-review-content');
      if (reviewContent) {
        reviewContent.innerHTML = `
          <div style="height: 12px !important; width: 100% !important; background: rgba(99,102,241,0.1) !important; margin-bottom: 6px !important; border-radius: 4px !important;"></div>
          <div style="height: 12px !important; width: 85% !important; background: rgba(99,102,241,0.1) !important; border-radius: 4px !important;"></div>
        `;
      }
      const tagsContainer = document.getElementById('algomind-ai-review-tags');
      if (tagsContainer) {
        tagsContainer.innerHTML = '';
      }
      return;
    }

    
    const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'SPAN' || target.tagName === 'DIV' || target.getAttribute('role') === 'button';
    
    const matchesHintSelector = config && config.hintBtn ? !!target.closest(config.hintBtn) : false;
    if (isClickable && (
      matchesHintSelector || 
      text.includes('hint') ||
      target.closest('[class*="hint"]') ||
      target.closest('[id*="hint"]') ||
      target.closest('[data-cy*="hint"]')
    )) {
      if (!hintsUsed) {
        log('[AlgoMind Scraper] Hint usage detected!');
        hintsUsed = true;
        activeHintOpenTime = Date.now();
        logTimelineEvent('HINT_OPEN');
        updateWidgetHonestyUI();
      } else {
        if (activeHintOpenTime) {
          const duration = (Date.now() - activeHintOpenTime) / 1000;
          accumulatedHintDuration += duration;
          activeHintOpenTime = null;
          logTimelineEvent('HINT_CLOSE', { duration });
          updateWidgetHonestyUI();
        } else {
          activeHintOpenTime = Date.now();
          logTimelineEvent('HINT_OPEN');
          updateWidgetHonestyUI();
        }
      }
    }

    
    const matchesSolutionSelector = config && config.solutionBtn ? !!target.closest(config.solutionBtn) : false;
    if (isClickable && (
      matchesSolutionSelector || 
      text === 'editorial' || 
      text === 'solution' || 
      text === 'solutions' ||
      text === 'comment' ||
      text === 'comments' ||
      text === 'discussion' ||
      text === 'discussions' ||
      text.includes('comment') ||
      text.includes('discussion') ||
      text.includes('editorial-btn') ||
      target.closest('[class*="editorial"]') ||
      target.closest('[class*="solution"]')
    )) {
      if (!solutionClicked) {
        log('[AlgoMind Scraper] Solution lookup detected!');
        solutionClicked = true;
        if (!isAccepted) {
          editorialOpenedBeforeAccepted = true;
        }
        activeEditorialOpenTime = Date.now();
        logTimelineEvent('EDITORIAL_OPEN');
        updateWidgetHonestyUI();
      } else {
        if (activeEditorialOpenTime) {
          const duration = (Date.now() - activeEditorialOpenTime) / 1000;
          accumulatedEditorialDuration += duration;
          activeEditorialOpenTime = null;
          logTimelineEvent('EDITORIAL_CLOSE', { duration });
          updateWidgetHonestyUI();
        } else {
          activeEditorialOpenTime = Date.now();
          logTimelineEvent('EDITORIAL_OPEN');
          updateWidgetHonestyUI();
        }
      }
    }
  });

  const handleEditorPasteOrDrop = (type) => {
    const platform = getPlatform(window.location.href);
    if (!platform) return;
    const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS[platform] : null;
    if (!config) return;

    const activeElem = document.activeElement;
    if (activeElem && (
      activeElem.closest(config.editorTextarea) ||
      activeElem.classList.contains('monaco-editor') ||
      activeElem.closest('.monaco-editor') ||
      activeElem.classList.contains('ace_text-input') ||
      activeElem.closest('[class*="editor"]')
    )) {
      if (!codePasted) {
        log(`[AlgoMind Scraper] Editor code ${type} detected!`);
        codePasted = true;
        if (!isAccepted) {
          pasteHappenedBeforeAccepted = true;
        }
        logTimelineEvent('PASTE');

        
        const panel = document.getElementById('algomind-panel');
        const circle = document.getElementById('algomind-circle');
        if (panel && circle) {
          panel.style.display = 'flex';
          circle.style.display = 'none';
        }

        updateWidgetHonestyUI();

        
        showWidgetPasteWarning();
      }
    }
  };

  document.addEventListener('copy', (e) => {
    logTimelineEvent('COPY');
    if (focusModeEnabled) {
      const platform = getPlatform(window.location.href);
      if (platform) {
        const config = window.ALGO_SELECTORS ? window.ALGO_SELECTORS[platform] : null;
        if (config) {
          const activeElem = document.activeElement;
          const insideEditor = activeElem && (
            activeElem.closest(config.editorTextarea) ||
            activeElem.classList.contains('monaco-editor') ||
            activeElem.closest('.monaco-editor') ||
            activeElem.classList.contains('ace_text-input') ||
            activeElem.closest('[class*="editor"]')
          );

          
          const insideAlgoMind = activeElem && activeElem.closest('#algomind-root');
          
          if (!insideEditor && !insideAlgoMind) {
            log('[AlgoMind Focus Mode] Copy blocked outside code editor!');
            e.preventDefault();
            e.stopImmediatePropagation();
          }
        }
      }
    }
  }, true);

  document.addEventListener('paste', () => {
    handleEditorPasteOrDrop('paste');
  }, true);

  document.addEventListener('drop', () => {
    handleEditorPasteOrDrop('drop');
  }, true);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      tabSwitchesCount++;
      lastTabSwitchStartTime = Date.now();
      logTimelineEvent('TAB_SWITCH');
      log('[AlgoMind Scraper] Tab switch registered. Total:', tabSwitchesCount);
      updateWidgetHonestyUI();
    } else {
      if (lastTabSwitchStartTime) {
        const duration = (Date.now() - lastTabSwitchStartTime) / 1000;
        accumulatedTabSwitchDuration += duration;
        tabSwitchesDurations.push({ duration, timestamp: Date.now() });
        lastTabSwitchStartTime = null;
        logTimelineEvent('TAB_RETURN', { duration });
        updateWidgetHonestyUI();
      }
    }
  });

  
  if (honestyUIInterval) clearInterval(honestyUIInterval);
  honestyUIInterval = setInterval(updateWidgetHonestyUI, 30000);
};




const checkAndShowDailyCoachWelcome = () => {
  try {
    const currentUrl = window.location.href;
    
    
    if (currentUrl.includes('/contest/') || currentUrl.includes('/contests/')) {
      log('[AlgoMind Welcome] User is in a contest. Skipping welcome experience.');
      return;
    }

    
    const todayStr = new Date().toISOString().split('T')[0]; 
    
    if (!isExtensionContextValid()) return;

    chrome.storage.local.get([
      'algomind_last_welcome_date', 
      'revisionQueue', 
      'solvedProblemsCount', 
      'user', 
      'username',
      'currentStreak',
      'theme'
    ], (res) => {
      if (chrome.runtime.lastError) return;

      const lastDate = res?.algomind_last_welcome_date;
      if (lastDate === todayStr) {
        log('[AlgoMind Welcome] Already displayed today (' + todayStr + '). Skipping.');
        return;
      }

      chrome.storage.local.set({ algomind_last_welcome_date: todayStr });

      const queue = Array.isArray(res?.revisionQueue) ? res.revisionQueue : [];
      const now = new Date();
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const dueCount = queue.filter(p => {
        if (p.status === 'Pending') return true;
        if (p.status === 'Completed') return false;
        if (!p.nextRevisionDate) return false;
        const nextRev = new Date(p.nextRevisionDate);
        return nextRev <= endOfToday;
      }).length;

      const estimatedTime = Math.max(15, Math.min(60, (dueCount * 10) || 20));
      
      const displayName = res?.user?.username || res?.username || 'Coder';
      const streak = res?.user?.currentStreak || res?.currentStreak || 7;
      const readiness = Math.min(98, Math.max(70, 85 + (dueCount === 0 ? 3 : -dueCount)));
      const isLight = res?.theme === 'light' || document.body.classList.contains('algomind-light-theme') || !!document.querySelector('#algomind-panel.algomind-light-theme');

      renderDailyCoachWelcomeModal({
        displayName,
        dueCount,
        estimatedTime,
        streak,
        readiness,
        isLight
      });
    });
  } catch (err) {
    console.error('[AlgoMind Welcome] Error initializing welcome briefing:', err);
  }
};

const renderDailyCoachWelcomeModal = ({ displayName, dueCount, estimatedTime, streak, readiness, isLight = false }) => {
  if (document.getElementById('algomind-daily-welcome-backdrop')) return;

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const finishDate = new Date(Date.now() + estimatedTime * 60000);
  const finishTimeStr = finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!document.getElementById('algomind-welcome-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'algomind-welcome-styles';
    styleEl.textContent = `
      @keyframes algomindModalFadeIn {
        from { opacity: 0; transform: translateY(18px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes algomindPulseGlow {
        0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4); }
        50% { box-shadow: 0 4px 30px rgba(124, 58, 237, 0.7); }
      }
      #algomind-daily-welcome-modal::-webkit-scrollbar {
        width: 4px;
      }
      #algomind-daily-welcome-modal::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.4);
        border-radius: 4px;
      }
      .algomind-stat-hover-card {
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease !important;
      }
      .algomind-stat-hover-card:hover {
        transform: translateY(-3px) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  const backdrop = document.createElement('div');
  backdrop.id = 'algomind-daily-welcome-backdrop';
  backdrop.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 99999999; display: flex; align-items: center; justify-content: center;
    background: ${isLight ? 'rgba(241, 245, 249, 0.88)' : 'rgba(6, 9, 18, 0.85)'};
    backdrop-filter: blur(12px); opacity: 0; transition: opacity 0.35s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.id = 'algomind-daily-welcome-modal';

  const modalBg = isLight
    ? 'background: #ffffff !important; border: 1px solid #cbd5e1 !important; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12) !important; color: #0f172a !important;'
    : 'background: linear-gradient(145deg, rgba(17, 24, 39, 0.98), rgba(11, 16, 32, 0.98)) !important; border: 1px solid rgba(99, 102, 241, 0.25) !important; box-shadow: 0 30px 70px -10px rgba(0,0,0,0.8), 0 0 50px rgba(99, 102, 241, 0.15) !important; color: #ffffff !important;';

  modal.style.cssText = `
    ${modalBg}
    border-radius: 20px; padding: 22px 24px !important; width: 460px !important; max-width: 92vw !important;
    max-height: 86vh !important; overflow-y: auto !important; box-sizing: border-box !important;
    display: flex !important; flex-direction: column !important; gap: 14px !important;
    animation: algomindModalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  `;

  const titleColor = isLight ? '#0f172a' : '#ffffff';
  const subtitleColor = isLight ? '#475569' : '#94a3b8';
  const cardBg = isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.04)';
  const cardBorder = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.07)';

  const recommendationMarkup = dueCount === 0 
    ? `
      <div style="background:${isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)'}; border:1px solid ${isLight ? '#86efac' : 'rgba(16, 185, 129, 0.25)'}; border-radius:14px; padding:12px 14px; font-size:11px; line-height:1.5; color:${isLight ? '#166534' : '#6ee7b7'};">
        <div style="font-weight:800; font-size:12px; margin-bottom:2px; display:flex; align-items:center; gap:6px; color:${isLight ? '#15803d' : '#10b981'};">
          <span>✨</span> You're all caught up!
        </div>
        <div style="font-weight:600; opacity:0.9;">Today's recommendation:</div>
        <ul style="margin:2px 0 0 16px; padding:0; opacity:0.9;">
          <li>Solve 1 new Medium problem</li>
          <li>Review yesterday's notes</li>
          <li>Maintain your ${streak}-day streak</li>
        </ul>
      </div>
    `
    : `
      <div style="background:${isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.08)'}; border:1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.25)'}; border-radius:14px; padding:12px 14px; font-size:11px; line-height:1.5; color:${isLight ? '#92400e' : '#fcd34d'};">
        <div style="font-weight:800; font-size:12px; margin-bottom:2px; display:flex; align-items:center; gap:6px; color:${isLight ? '#b45309' : '#f59e0b'};">
          <span>⚠️</span> You have ${dueCount} pending revision${dueCount > 1 ? 's' : ''}
        </div>
        <div style="font-weight:600; opacity:0.9;">Completing them today prevents memory decay and locks in pattern logic.</div>
      </div>
    `;

  modal.innerHTML = `
    <!-- Top Greeting Hero Header -->
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
      <div>
        <h2 style="margin:0; font-size:18px; font-weight:800; color:${titleColor}; letter-spacing:-0.2px;">
          👋 ${greetingTime}, ${displayName}
        </h2>
        <p style="margin:2px 0 0 0; font-size:11px; font-weight:600; color:${subtitleColor}; line-height:1.4;">
          Ready for another focused coding session?<br>Your brain is fresh. Let's make today's progress count.
        </p>
      </div>
      <!-- Streak Pill -->
      <div style="display:flex; align-items:center; gap:5px; background:linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08)); border:1px solid rgba(249,115,22,0.3); border-radius:20px; padding:4px 10px; white-space:nowrap;">
        <span style="font-size:13px;">🔥</span>
        <span style="font-size:11px; font-weight:800; color:#f97316; font-family:monospace;">${streak} Day Streak</span>
      </div>
    </div>

    <!-- 🎯 Today's Mission Card -->
    <div style="background:${isLight ? '#f8fafc' : 'rgba(99, 102, 241, 0.06)'}; border:1px solid ${isLight ? '#cbd5e1' : 'rgba(99, 102, 241, 0.2)'}; border-radius:14px; padding:14px 16px; display:flex; flex-direction:column; gap:8px;">
      <div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:${isLight ? '#4f46e5' : '#a5b4fc'}; display:flex; align-items:center; justify-content:space-between;">
        <span>🎯 Today's Mission</span>
        <span style="font-size:10px; font-weight:600; color:${subtitleColor}; text-transform:none;">Finish by ~${finishTimeStr}</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:6px; font-size:11px; font-weight:700;">
        <div style="display:flex; align-items:center; gap:6px; color:${isLight ? '#166534' : '#6ee7b7'};">
          <span>✅</span> Revise: ${dueCount} Problem${dueCount !== 1 ? 's' : ''}
        </div>
        <div style="display:flex; align-items:center; gap:6px; color:${isLight ? '#1e40af' : '#60a5fa'};">
          <span>🆕</span> Learn: 1 New Problem
        </div>
        <div style="display:flex; align-items:center; gap:6px; color:${isLight ? '#6b21a8' : '#c084fc'};">
          <span>🧠</span> Recall Score: ${readiness}%
        </div>
        <div style="display:flex; align-items:center; gap:6px; color:${isLight ? '#92400e' : '#fbbf24'};">
          <span>⏱</span> Est. Time: ${estimatedTime} min
        </div>
      </div>
      <div style="font-size:10px; font-weight:600; font-style:italic; color:${subtitleColor}; border-top:1px dashed ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)'}; padding-top:6px; margin-top:2px;">
        "One problem today is better than zero tomorrow."
      </div>
    </div>

    <!-- Smart Recommendation Card -->
    ${recommendationMarkup}

    <!-- Progress Overview Grid (4 Cards) -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px;">
      <!-- Card 1: Revision Due -->
      <div class="algomind-stat-hover-card" style="background:${cardBg}; border:1px solid ${cardBorder}; border-radius:12px; padding:8px 6px; text-align:center;">
        <span style="font-size:13px; display:block; margin-bottom:2px;">📚</span>
        <span style="font-size:9px; font-weight:700; color:${subtitleColor}; text-transform:uppercase; display:block;">Revision</span>
        <span style="font-size:15px; font-weight:800; color:#10b981; font-family:monospace;">${dueCount}</span>
      </div>
      <!-- Card 2: Time Needed -->
      <div class="algomind-stat-hover-card" style="background:${cardBg}; border:1px solid ${cardBorder}; border-radius:12px; padding:8px 6px; text-align:center;">
        <span style="font-size:13px; display:block; margin-bottom:2px;">⏱</span>
        <span style="font-size:9px; font-weight:700; color:${subtitleColor}; text-transform:uppercase; display:block;">Time</span>
        <span style="font-size:15px; font-weight:800; color:#a78bfa; font-family:monospace;">${estimatedTime}m</span>
      </div>
      <!-- Card 3: Streak -->
      <div class="algomind-stat-hover-card" style="background:${cardBg}; border:1px solid ${cardBorder}; border-radius:14px; padding:8px 6px; text-align:center;">
        <span style="font-size:13px; display:block; margin-bottom:2px;">🔥</span>
        <span style="font-size:9px; font-weight:700; color:${subtitleColor}; text-transform:uppercase; display:block;">Streak</span>
        <span style="font-size:15px; font-weight:800; color:#f97316; font-family:monospace;">${streak}d</span>
      </div>
      <!-- Card 4: Readiness -->
      <div class="algomind-stat-hover-card" style="background:${cardBg}; border:1px solid ${cardBorder}; border-radius:12px; padding:8px 6px; text-align:center;">
        <span style="font-size:13px; display:block; margin-bottom:2px;">🧠</span>
        <span style="font-size:9px; font-weight:700; color:${subtitleColor}; text-transform:uppercase; display:block;">Readiness</span>
        <span style="font-size:15px; font-weight:800; color:#10b981; font-family:monospace;">${readiness}%</span>
      </div>
    </div>

    <!-- CTA Buttons & Footer -->
    <div style="display:flex; flex-direction:column; gap:6px; margin-top:2px;">
      <div style="display:flex; gap:8px;">
        <button id="algomind-btn-start-revision" style="flex:1.6; background:linear-gradient(135deg, #6366f1, #4f46e5); color:#ffffff; font-weight:800; border-radius:12px; padding:10px 16px; border:none; cursor:pointer; font-size:12px; animation:algomindPulseGlow 3s infinite; transition:all 0.2s ease;">
          🚀 Start Today's Session
        </button>
        <button id="algomind-btn-maybe-later" style="flex:1; background:${isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)'}; color:${isLight ? '#334155' : '#94a3b8'}; font-weight:700; border-radius:12px; padding:10px 12px; border:1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)'}; cursor:pointer; font-size:11px; transition:all 0.2s ease;">
          Maybe Later
        </button>
      </div>
      <div style="text-align:center; font-size:10px; font-weight:600; color:${subtitleColor}; opacity:0.8;">
        Estimated finish: ${finishTimeStr} · Click Start to open your revision queue
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  requestAnimationFrame(() => {
    backdrop.style.opacity = '1';
  });

  const closeModal = () => {
    backdrop.style.opacity = '0';
    setTimeout(() => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }, 350);
  };

  const startBtn = modal.querySelector('#algomind-btn-start-revision');
  const laterBtn = modal.querySelector('#algomind-btn-maybe-later');

  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();

      const currentOrigin = window.location.origin;
      const isLocal = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');

      if (isExtensionContextValid()) {
        chrome.storage.local.get(['dashboardUrl'], (res) => {
          let rawUrl = (res && res.dashboardUrl) ? res.dashboardUrl : '';
          let baseUrl = 'https://algominddev.vercel.app';

          if (isLocal) {
            baseUrl = currentOrigin.includes('3000') ? 'http://localhost:3000' : currentOrigin;
          } else if (rawUrl && !rawUrl.includes('leetcode') && !rawUrl.includes('geeksforgeeks') && !rawUrl.includes('ambuj-s-team') && !rawUrl.includes('oq78btw6i')) {
            baseUrl = rawUrl.replace(/\/dashboard\/?$/, '');
          }

          window.open(`${baseUrl}/revisions`, '_blank');
        });
      } else {
        const fallbackUrl = isLocal ? 'http://localhost:3000/revisions' : 'https://algominddev.vercel.app/revisions';
        window.open(fallbackUrl, '_blank');
      }
      closeModal();
    });
  }

  if (laterBtn) {
    laterBtn.addEventListener('click', closeModal);
  }
};

const init = () => {
  if (isExtensionContextValid()) {
    chrome.storage.local.get(['focusModeEnabled'], (res) => {
      state.focusModeEnabled = !!(res && res.focusModeEnabled);
      focusModeEnabled = state.focusModeEnabled;
    });
  }
  
  checkAndScrape();
  setTimeout(() => {
    
    const title = document.getElementById('algomind-active-title');
    if (title && (title.innerText === 'Scanning...' || !title.innerText.trim())) {
      checkAndScrape();
    }
  }, 1200);
  setTimeout(checkAndShowDailyCoachWelcome, 1000);
  observeUrlChanges();
  attachEventMonitors();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
