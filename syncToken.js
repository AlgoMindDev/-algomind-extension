

let syncInterval = null;

const syncAuth = () => {
  try {
    if (!chrome || !chrome.runtime || !chrome.runtime.id || !chrome.storage || !chrome.storage.local) {
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
      return;
    }
  } catch (err) {
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
    return;
  }

  const token = localStorage.getItem('token');
  const currentOrigin = window.location.origin;
  
  const isValidAppOrigin = currentOrigin && (
    currentOrigin.includes('localhost') || 
    currentOrigin.includes('127.0.0.1') || 
    currentOrigin.includes('algomind') || 
    currentOrigin.includes('vercel.app')
  ) && !currentOrigin.includes('ambuj-s-team') && !currentOrigin.includes('oq78btw6i');

  if (!isValidAppOrigin) return;

  const currentDashboardUrl = `${currentOrigin}/dashboard`;
  const payload = { dashboardUrl: currentDashboardUrl };
  if (token) {
    payload.token = token;
  }

  chrome.storage.local.set(payload);
};


syncAuth();


window.addEventListener('storage', (e) => {
  if (e.key === 'token') {
    syncAuth();
  }
});


syncInterval = setInterval(syncAuth, 2000);
