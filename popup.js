/**
 * LiteChatGPT Popup Script
 * Handles extension popup UI and user interactions
 */

const liteModeBtn = document.getElementById('liteModeBtn');
const messageCountInput = document.getElementById('messageCount');
const statusDiv = document.getElementById('status');
const viewVersionsBtn = document.getElementById('viewVersions');

/**
 * Initialize popup
 */
async function init() {
  // Check if we're on ChatGPT page
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];

  if (!currentTab.url.includes('chatgpt.com') && !currentTab.url.includes('chat.openai.com')) {
    disableButton('Open ChatGPT to use Lite Mode');
    return;
  }

  // Check if on a conversation page
  const url = new URL(currentTab.url);
  const path = url.pathname;

  if (!path.startsWith('/c/') || path.length <= 4) {
    disableButton('Open a chat conversation to use');
    return;
  }

  // Valid chat page, enable button
  liteModeBtn.disabled = false;
}

/**
 * Disable the Lite Mode button with a custom message
 * @param {string} message - Message to display
 */
function disableButton(message) {
  liteModeBtn.disabled = true;
  liteModeBtn.textContent = message;
}

/**
 * Load saved settings
 */
async function loadSettings() {
  const data = await chrome.storage.local.get('messageCount');
  if (data.messageCount) {
    messageCountInput.value = data.messageCount;
  }
}

/**
 * Save settings
 */
async function saveSettings() {
  const count = parseInt(messageCountInput.value, 10);

  if (isNaN(count) || count < 2 || count > 50) {
    showStatus('Please enter a number between 2 and 50', 'error');
    return;
  }

  await chrome.storage.local.set({ messageCount: count });
  showStatus('Settings saved!', 'success');
}

/**
 * Handle Lite Mode button click
 */
async function handleLiteModeClick() {
  try {
    // Disable button and show loading state
    liteModeBtn.disabled = true;
    liteModeBtn.textContent = '⚡ Creating lite chat...';

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'TRIGGER_LITE_MODE'
    });

    if (response && response.success) {
      showStatus('Lite Mode activated!', 'success');

      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1500);
    }

  } catch (error) {
    console.error('[LiteChatGPT Popup] Error:', error);
    showStatus(`Error: ${error.message}`, 'error');

    // Reset button
    liteModeBtn.disabled = false;
    liteModeBtn.innerHTML = '⚡ Enter Lite Mode';
  }
}

/**
 * View title versions
 */
async function handleViewVersions() {
  try {
    const data = await chrome.storage.local.get('chatTitleIndex');
    const versions = data.chatTitleIndex || {};

    if (Object.keys(versions).length === 0) {
      showStatus('No title versions yet', 'info');
      return;
    }

    // Format versions for display
    const formatted = Object.entries(versions)
      .map(([title, version]) => `${title}: Part ${version}`)
      .join('\n');

    // Show in alert (simple for now)
    alert(`Chat Title Versions:\n\n${formatted}`);

  } catch (error) {
    console.error('[LiteChatGPT Popup] Error viewing versions:', error);
    showStatus('Error loading versions', 'error');
  }
}

/**
 * Show status message
 * @param {string} message - Status message
 * @param {string} type - Message type (success, error, info)
 */
function showStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Event listeners
liteModeBtn.addEventListener('click', handleLiteModeClick);
messageCountInput.addEventListener('change', saveSettings);
viewVersionsBtn.addEventListener('click', handleViewVersions);

// Initialize
init();
loadSettings();

console.log('[LiteChatGPT Popup] Popup loaded');
