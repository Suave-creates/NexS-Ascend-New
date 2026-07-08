/**
 * background.js
 * Listens for the extension icon click and opens the dashboard
 * in a new full tab. If a dashboard tab is already open, focuses it.
 */

const DASHBOARD_URL = chrome.runtime.getURL('dashboard.html');

chrome.action.onClicked.addListener(async () => {
  // Check if a dashboard tab is already open
  const existing = await chrome.tabs.query({ url: DASHBOARD_URL });

  if (existing.length > 0) {
    // Focus the existing tab instead of opening a duplicate
    await chrome.tabs.update(existing[0].id, { active: true });
    await chrome.windows.update(existing[0].windowId, { focused: true });
  } else {
    // Open a fresh dashboard tab
    await chrome.tabs.create({ url: DASHBOARD_URL });
  }
});
