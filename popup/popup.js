


document.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('open-dashboard').addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.storage.local.get(['dashboardUrl'], (res) => {
        let dashboardUrl = res && res.dashboardUrl;
        if (!dashboardUrl || dashboardUrl.includes('leetcode') || dashboardUrl.includes('geeksforgeeks') || dashboardUrl.includes('ambuj-s-team') || dashboardUrl.includes('oq78btw6i')) {
          dashboardUrl = 'https://algominddev.vercel.app/dashboard';
        }
        chrome.tabs.create({ url: dashboardUrl });
      });
    }
  });

  
  const closeBtn = document.getElementById('close-popup');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.close();
    });
  }

  
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = (tabs && tabs[0] && tabs[0].url) ? tabs[0].url : '';
      const isOnProblem = checkProblemPage(url);

      if (isOnProblem) {
        document.getElementById('on-problem-message').style.display = 'block';
        document.getElementById('off-platform-message').style.display = 'none';
      } else {
        document.getElementById('on-problem-message').style.display = 'none';
        document.getElementById('off-platform-message').style.display = 'block';
      }
    });
  } else {
    
    document.getElementById('off-platform-message').style.display = 'block';
  }
});

const checkProblemPage = (url) => {
  if (!url) return false;
  if (url.includes('leetcode.com/problems/')) return true;
  if (url.includes('geeksforgeeks.org/problems/')) return true;
  if (url.includes('codeforces.com/problemset/problem/') || url.includes('codeforces.com/contest/')) return true;
  if (url.includes('atcoder.jp/contests/')) return true;
  if (url.includes('codechef.com/problems/')) return true;
  if (url.includes('hackerrank.com/challenges/')) return true;
  return false;
};
