/**
 * LiteChatGPT Background Service Worker
 * Coordinates tab creation and message passing
 */

console.log('[LiteChatGPT Background] Service worker started');

/**
 * Listen for messages from content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[LiteChatGPT Background] Received message:', message.action);

  if (message.action === 'CREATE_LITE_CHAT') {
    handleCreateLiteChat(message.payload, sender.tab?.id);
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'LOG_ERROR') {
    // Log errors for debugging (could be sent to analytics in production)
    console.error('[LiteChatGPT Background] Error logged:', message.error);
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'SELECTOR_VALIDATION') {
    // Log selector validation results for debugging
    console.log('[LiteChatGPT Background] Selector validation:', message.results);
    sendResponse({ success: true });
    return true;
  }

  return false;
});

/**
 * Handle creation of new lite chat
 * @param {Object} payload - Context and title data
 * @param {number} sourceTabId - ID of the originating tab
 */
async function handleCreateLiteChat(payload, sourceTabId) {
  const { contextSummary, versionedTitle, originalTitle } = payload;

  try {
    console.log('[LiteChatGPT Background] Creating lite chat...');
    console.log('[LiteChatGPT Background] Original title:', originalTitle);
    console.log('[LiteChatGPT Background] Versioned title:', versionedTitle);

    // 1. Store injection data for the new tab
    await chrome.storage.local.set({
      pendingInjection: {
        contextSummary,
        versionedTitle,
        originalTitle,
        timestamp: Date.now()
      }
    });

    console.log('[LiteChatGPT Background] Pending injection stored');

    // 2. Open new ChatGPT tab
    const newTab = await chrome.tabs.create({
      url: 'https://chatgpt.com/',
      active: true
    });

    console.log('[LiteChatGPT Background] New tab created:', newTab.id);

    // 3. Monitor tab load completion
    const listener = (tabId, changeInfo, tab) => {
      if (tabId === newTab.id && changeInfo.status === 'complete') {
        console.log('[LiteChatGPT Background] New tab loaded, content script should inject context');

        // Remove listener
        chrome.tabs.onUpdated.removeListener(listener);
      }
    };

    chrome.tabs.onUpdated.addListener(listener);

    // 4. Schedule cleanup of old pending injections
    setTimeout(() => {
      cleanupOldInjections();
    }, 5 * 60 * 1000); // 5 minutes

  } catch (error) {
    console.error('[LiteChatGPT Background] Error creating lite chat:', error);

    // Notify source tab of failure
    if (sourceTabId) {
      chrome.tabs.sendMessage(sourceTabId, {
        action: 'LITE_MODE_ERROR',
        error: error.message
      }).catch(err => {
        console.error('[LiteChatGPT Background] Failed to notify source tab:', err);
      });
    }
  }
}

/**
 * Clean up pending injections older than 5 minutes
 * Prevents stale data from accumulating
 */
async function cleanupOldInjections() {
  try {
    const data = await chrome.storage.local.get('pendingInjection');

    if (data.pendingInjection) {
      const age = Date.now() - data.pendingInjection.timestamp;

      // If older than 5 minutes, remove it
      if (age > 5 * 60 * 1000) {
        await chrome.storage.local.remove('pendingInjection');
        console.log('[LiteChatGPT Background] Cleaned up stale pending injection');
      }
    }
  } catch (error) {
    console.error('[LiteChatGPT Background] Error during cleanup:', error);
  }
}

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[LiteChatGPT Background] Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // First-time installation
    console.log('[LiteChatGPT Background] First-time install detected');

    // Initialize storage with defaults
    chrome.storage.local.set({
      messageCount: 8,
      chatTitleIndex: {}
    });

    // Could open a welcome page here
    // chrome.tabs.create({ url: 'welcome.html' });
  }

  if (details.reason === 'update') {
    // Extension updated
    const previousVersion = details.previousVersion;
    console.log('[LiteChatGPT Background] Updated from version:', previousVersion);

    // Could run migration logic here if needed
  }
});

/**
 * Periodic cleanup task
 * Runs every hour to clean up stale data
 */
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    console.log('[LiteChatGPT Background] Running periodic cleanup...');
    cleanupOldInjections();
  }
});

/**
 * Handle extension icon click (when popup is not available)
 */
chrome.action.onClicked.addListener((tab) => {
  // This is only called if no popup is defined
  // Since we have a popup, this won't be called
  console.log('[LiteChatGPT Background] Action clicked:', tab.id);
});

console.log('[LiteChatGPT Background] Service worker initialized');
