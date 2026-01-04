/**
 * Defensive DOM selector strategies for ChatGPT's changing structure
 * Provides multiple fallback selectors with runtime validation
 */

const DOMSelectors = {
  /**
   * Get selectors for message containers (ordered by reliability)
   * ChatGPT's DOM structure changes frequently, so we try multiple strategies
   */
  getMessageSelectors() {
    return [
      '[data-testid^="conversation-turn"]',  // Data attribute (most stable)
      'article[data-scroll-anchor]',         // Article with scroll anchor
      '.group.w-full',                        // Tailwind grouping
      'article',                              // Generic article tags
      'div[class*="text-base"]',             // Text base wrapper
      'main > div > div > div'                // Positional fallback
    ];
  },

  /**
   * Get selectors for chat title element
   */
  getTitleSelectors() {
    return [
      'h1.text-xl',                           // Specific heading
      'h1',                                   // Any h1 in page
      '[data-testid="chat-title"]',          // Test ID
      'header h1',                            // Header area h1
      'nav button[class*="active"] span',     // Active nav item
      'title'                                 // Document title (last resort)
    ];
  },

  /**
   * Get selectors for message input textarea
   */
  getTextareaSelectors() {
    return [
      '#prompt-textarea',                     // ID-based (most stable)
      'textarea[id*="prompt"]',               // ID contains prompt
      'textarea[placeholder*="Message"]',     // Placeholder text
      'textarea[data-id="root"]',            // Data attribute
      'textarea',                             // Any textarea (fallback)
      '[contenteditable="true"]'              // Contenteditable div (backup)
    ];
  },

  /**
   * Detect if a message element is from user or assistant
   * Uses multiple heuristics for robustness
   * @param {HTMLElement} element - Message container element
   * @returns {boolean} - True if user message, false if assistant
   */
  isUserMessage(element) {
    const strategies = [
      // Strategy 1: Data attribute for role
      () => {
        const role = element.getAttribute('data-message-author-role');
        if (role) return role === 'user';
        return null;
      },

      // Strategy 2: Test ID contains "user"
      () => {
        const testId = element.getAttribute('data-testid');
        if (testId) return testId.includes('user');
        return null;
      },

      // Strategy 3: Class name contains "user"
      () => {
        if (element.className.includes('user')) return true;
        if (element.className.includes('assistant')) return false;
        return null;
      },

      // Strategy 4: Check for AI avatar image
      () => {
        const hasAIAvatar = element.querySelector('img[alt*="ChatGPT"], img[alt*="Assistant"]');
        if (hasAIAvatar) return false;
        return null;
      },

      // Strategy 5: Position-based heuristic (user messages often appear differently)
      () => {
        const computedStyle = window.getComputedStyle(element);
        // This is a weak heuristic, return null to try other strategies
        return null;
      }
    ];

    // Try each strategy until we get a definitive result
    for (const strategy of strategies) {
      try {
        const result = strategy();
        if (result !== null && result !== undefined) {
          return !!result;
        }
      } catch (e) {
        // Strategy failed, try next one
        continue;
      }
    }

    // Default to assistant if we can't determine
    // (conservative choice - less likely to confuse context)
    return false;
  },

  /**
   * Find first element matching any of the provided selectors
   * @param {string[]} selectors - Array of CSS selectors to try
   * @returns {HTMLElement|null} - First matching element or null
   */
  findElement(selectors) {
    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          return element;
        }
      } catch (e) {
        console.warn('[LiteChatGPT] Invalid selector:', selector, e);
      }
    }
    return null;
  },

  /**
   * Find all elements matching any of the provided selectors
   * Returns results from first successful selector
   * @param {string[]} selectors - Array of CSS selectors to try
   * @returns {HTMLElement[]} - Array of matching elements
   */
  findElements(selectors) {
    for (const selector of selectors) {
      try {
        const elements = Array.from(document.querySelectorAll(selector));
        if (elements.length > 0) {
          return elements;
        }
      } catch (e) {
        console.warn('[LiteChatGPT] Invalid selector:', selector, e);
      }
    }
    return [];
  },

  /**
   * Validate that all critical selectors are working
   * Useful for debugging and error reporting
   * @returns {Object} - Validation results for each selector type
   */
  validateSelectors() {
    return {
      messages: this.findElements(this.getMessageSelectors()).length > 0,
      title: this.findElement(this.getTitleSelectors()) !== null,
      textarea: this.findElement(this.getTextareaSelectors()) !== null,
      timestamp: Date.now()
    };
  }
};

// Make available globally for other scripts
if (typeof window !== 'undefined') {
  window.DOMSelectors = DOMSelectors;
}
