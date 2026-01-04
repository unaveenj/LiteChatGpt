/**
 * LiteChatGPT Content Script
 * Main orchestrator for Lite Mode functionality
 */

// State management
let isProcessing = false;
let floatingButtonInjected = false;

/**
 * Initialize extension based on page type
 */
function init() {
  console.log('[LiteChatGPT] Initializing...');

  if (isNewChatPage()) {
    // Check if we need to inject context
    checkForPendingInjection();
  } else if (isChatConversationPage()) {
    // Inject floating button after a short delay (let page settle)
    setTimeout(() => {
      injectFloatingButton();
    }, 2000);
  }
}

/**
 * Check if current page is a new/empty chat
 * @returns {boolean}
 */
function isNewChatPage() {
  const path = window.location.pathname;
  return path === '/' || path === '/c/new' || path === '/chat' || path === '/c/';
}

/**
 * Check if current page is a chat conversation
 * @returns {boolean}
 */
function isChatConversationPage() {
  const path = window.location.pathname;
  // Chat URLs are like /c/{uuid}
  return path.startsWith('/c/') && path.length > 4;
}

/**
 * Inject floating "⚡ Lite Mode" button into the page
 */
function injectFloatingButton() {
  // Prevent duplicate injections
  if (floatingButtonInjected) return;

  const existingButton = document.getElementById('litechat-float-btn');
  if (existingButton) {
    floatingButtonInjected = true;
    return;
  }

  // Create floating button
  const button = document.createElement('button');
  button.id = 'litechat-float-btn';
  button.className = 'litechat-floating-button';
  button.innerHTML = '⚡ Lite Mode';
  button.title = 'Create a lighter version of this chat';

  // Add click handler
  button.addEventListener('click', handleLiteModeClick);

  // Inject into page
  document.body.appendChild(button);
  floatingButtonInjected = true;

  console.log('[LiteChatGPT] Floating button injected');
}

/**
 * Main handler for Lite Mode activation
 */
async function handleLiteModeClick() {
  // Prevent double-clicks
  if (isProcessing) {
    console.log('[LiteChatGPT] Already processing, please wait...');
    return;
  }

  isProcessing = true;

  try {
    console.log('[LiteChatGPT] Activating Lite Mode...');

    // Update button state
    const button = document.getElementById('litechat-float-btn');
    if (button) {
      button.disabled = true;
      button.textContent = '⚡ Creating...';
    }

    // 1. Extract current chat title
    const currentTitle = extractChatTitle();
    console.log('[LiteChatGPT] Current title:', currentTitle);

    // 2. Get message count from settings (or use default)
    const settings = await chrome.storage.local.get('messageCount');
    const messageCount = settings.messageCount || 8;

    // 3. Extract last N messages
    const messages = extractMessages(messageCount);
    console.log(`[LiteChatGPT] Extracted ${messages.length} messages`);

    if (messages.length === 0) {
      throw new Error('No messages found to extract. Chat may be empty.');
    }

    // 4. Get versioned title
    const versionedTitle = await getVersionedTitle(currentTitle);
    console.log('[LiteChatGPT] Versioned title:', versionedTitle);

    // 5. Build context summary with versioned title
    const contextSummary = buildContextSummary(currentTitle, messages, versionedTitle);

    // 6. Send to background script to create new chat
    chrome.runtime.sendMessage({
      action: 'CREATE_LITE_CHAT',
      payload: {
        contextSummary,
        versionedTitle,
        originalTitle: currentTitle
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
      }

      if (response && response.success) {
        showNotification('Lite Mode activated! Opening new chat...', 'success');
      }
    });

  } catch (error) {
    console.error('[LiteChatGPT] Error in Lite Mode:', error);
    showNotification(`Error: ${error.message}`, 'error');

    // Reset button state
    const button = document.getElementById('litechat-float-btn');
    if (button) {
      button.disabled = false;
      button.innerHTML = '⚡ Lite Mode';
    }
  } finally {
    isProcessing = false;
  }
}

/**
 * Check for pending context injection (runs on new chat pages)
 */
async function checkForPendingInjection() {
  console.log('[LiteChatGPT] Checking for pending injection...');

  try {
    const data = await chrome.storage.local.get('pendingInjection');

    if (data.pendingInjection) {
      console.log('[LiteChatGPT] Found pending injection, waiting for textarea...');

      const { contextSummary, versionedTitle } = data.pendingInjection;

      // Wait for textarea to be available (with timeout)
      const textarea = await waitForElement(
        DOMSelectors.getTextareaSelectors(),
        15000
      );

      if (textarea) {
        console.log('[LiteChatGPT] Textarea found, injecting context...');

        // Inject context
        injectContext(textarea, contextSummary);

        // Show success notification
        showNotification(`Context injected! Rename chat to: ${versionedTitle}`, 'success');

        // Store versioned title for later rename
        await chrome.storage.local.set({ pendingTitleRename: versionedTitle });

        // Set up title rename after first message
        setupTitleRename(versionedTitle);

        // Clear pending injection
        await chrome.storage.local.remove('pendingInjection');

        console.log('[LiteChatGPT] Context injection complete');
      }
    }
  } catch (error) {
    console.error('[LiteChatGPT] Error during injection check:', error);
    showNotification('Failed to inject context. Please try again.', 'error');
  }
}

/**
 * Set up automatic title rename after first message is sent
 * @param {string} targetTitle - The desired title
 */
function setupTitleRename(targetTitle) {
  console.log('[LiteChatGPT] Setting up title rename to:', targetTitle);

  // Wait for chat title to appear (after first message is sent)
  const checkInterval = setInterval(async () => {
    const titleElement = DOMSelectors.findElement(DOMSelectors.getTitleSelectors());

    if (titleElement && titleElement.textContent.trim() && titleElement.textContent.trim() !== 'ChatGPT') {
      console.log('[LiteChatGPT] Chat title detected:', titleElement.textContent);

      // Try to rename the chat
      const renamed = await attemptTitleRename(targetTitle);

      if (renamed) {
        clearInterval(checkInterval);
        await chrome.storage.local.remove('pendingTitleRename');
        showNotification(`Chat renamed to: ${targetTitle}`, 'success');
      }
    }
  }, 2000); // Check every 2 seconds

  // Stop checking after 2 minutes
  setTimeout(() => {
    clearInterval(checkInterval);
    console.log('[LiteChatGPT] Title rename timeout - manual rename may be needed');
  }, 120000);
}

/**
 * Attempt to rename the chat title
 * @param {string} newTitle - The new title to set
 * @returns {Promise<boolean>} - Success status
 */
async function attemptTitleRename(newTitle) {
  try {
    // Try multiple strategies to find and click rename button
    const renameSelectors = [
      'button[aria-label*="Rename"]',
      'button[title*="Rename"]',
      '[data-testid="rename-button"]',
      'button:has-text("Rename")'
    ];

    let renameButton = null;
    for (const selector of renameSelectors) {
      try {
        renameButton = document.querySelector(selector);
        if (renameButton) break;
      } catch (e) {
        continue;
      }
    }

    if (!renameButton) {
      // Try clicking on title to trigger edit mode
      const titleElement = DOMSelectors.findElement(DOMSelectors.getTitleSelectors());
      if (titleElement) {
        titleElement.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Look for input field
        const titleInput = document.querySelector('input[value*=""]') ||
                          document.querySelector('input[type="text"]');

        if (titleInput) {
          titleInput.value = newTitle;
          titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          titleInput.dispatchEvent(new Event('change', { bubbles: true }));

          // Press Enter to confirm
          titleInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true
          }));

          console.log('[LiteChatGPT] Title renamed via input field');
          return true;
        }
      }

      console.log('[LiteChatGPT] Could not find rename mechanism');
      return false;
    }

    // Click rename button
    renameButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find input field and set title
    const inputField = document.querySelector('input[type="text"]');
    if (inputField) {
      inputField.value = newTitle;
      inputField.dispatchEvent(new Event('input', { bubbles: true }));

      // Press Enter or click confirm button
      inputField.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true
      }));

      console.log('[LiteChatGPT] Title renamed successfully');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[LiteChatGPT] Error renaming title:', error);
    return false;
  }
}

/**
 * Wait for an element to appear in the DOM
 * @param {string[]} selectors - Array of selectors to try
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HTMLElement>} - The found element
 */
function waitForElement(selectors, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const element = DOMSelectors.findElement(selectors);

      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error('Textarea not found within timeout'));
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}

/**
 * Inject context into the textarea
 * Uses native setter and event simulation to trigger React
 * @param {HTMLElement} textarea - The textarea element
 * @param {string} contextSummary - The context to inject
 */
function injectContext(textarea, contextSummary) {
  try {
    // Method 1: Use native setter to bypass React's controlled component
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(textarea, contextSummary);
    } else {
      // Fallback: direct assignment
      textarea.value = contextSummary;
    }

    // Trigger React detection with input event
    const inputEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(inputEvent);

    // Additional events for compatibility
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    // Focus the textarea
    textarea.focus();

    console.log('[LiteChatGPT] Context injected successfully');
  } catch (error) {
    console.error('[LiteChatGPT] Error injecting context:', error);
    throw error;
  }
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelectorAll('.litechat-notification');
  existing.forEach(el => el.remove());

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `litechat-notification ${type}`;
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

/**
 * Listen for messages from popup or background script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[LiteChatGPT] Received message:', message.action);

  if (message.action === 'TRIGGER_LITE_MODE') {
    handleLiteModeClick();
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'LITE_MODE_ERROR') {
    showNotification(`Error: ${message.error}`, 'error');
    sendResponse({ success: true });
    return true;
  }

  return false;
});

/**
 * Handle page navigation (for single-page app behavior)
 */
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log('[LiteChatGPT] URL changed, re-initializing...');

    // Reset state
    floatingButtonInjected = false;

    // Re-initialize
    init();
  }
}).observe(document.body, { childList: true, subtree: true });

/**
 * Initialize on page load
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('[LiteChatGPT] Content script loaded');
