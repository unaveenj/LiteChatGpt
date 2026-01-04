/**
 * Context extraction and formatting for ChatGPT conversations
 * Extracts messages, preserves formatting, and builds context summaries
 */

class ContextExtractor {
  constructor(messageCount = 8) {
    this.messageCount = messageCount;
  }

  /**
   * Extract current chat title from the page
   * @returns {string} - Chat title or fallback
   */
  extractChatTitle() {
    const titleElement = DOMSelectors.findElement(
      DOMSelectors.getTitleSelectors()
    );

    if (!titleElement) {
      return 'Untitled Chat';
    }

    // Special handling for <title> element
    if (titleElement.tagName === 'TITLE') {
      // Extract from document title, remove " | ChatGPT" suffix if present
      const titleText = titleElement.textContent.replace(/\s*\|\s*ChatGPT.*$/i, '').trim();
      return titleText || 'Untitled Chat';
    }

    // Extract text content and clean whitespace
    const titleText = titleElement.textContent.trim();
    return titleText || 'Untitled Chat';
  }

  /**
   * Extract recent messages from the chat
   * @returns {Array<{role: string, content: string, index: number}>} - Array of messages
   */
  extractMessages() {
    const messageElements = DOMSelectors.findElements(
      DOMSelectors.getMessageSelectors()
    );

    if (messageElements.length === 0) {
      throw new Error('No messages found in chat. Cannot extract context.');
    }

    // Get last N messages
    const recentMessages = messageElements.slice(-this.messageCount);

    return recentMessages.map((element, index) => {
      const role = DOMSelectors.isUserMessage(element) ? 'user' : 'assistant';
      const content = this.extractMessageContent(element);

      return {
        role,
        content,
        index
      };
    });
  }

  /**
   * Extract content from a single message element
   * Preserves code blocks and formatting while removing UI elements
   * @param {HTMLElement} element - Message container element
   * @returns {string} - Extracted and formatted content
   */
  extractMessageContent(element) {
    // Clone element to avoid modifying the actual DOM
    const clone = element.cloneNode(true);

    // Remove UI elements (buttons, avatars, etc.)
    const uiSelectors = [
      'button',
      '[role="button"]',
      '.avatar',
      'img[alt*="avatar"]',
      'img[alt*="ChatGPT"]',
      'img[alt*="User"]',
      '[class*="copy-button"]',
      '[class*="edit-button"]',
      'svg'  // Remove icons
    ];

    uiSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Extract and preserve code blocks
    const codeBlocks = [];
    clone.querySelectorAll('pre code, pre').forEach((codeEl, idx) => {
      // Try to detect language from class name
      const language = codeEl.className.match(/language-(\w+)/)?.[1] || '';
      const code = codeEl.textContent;
      const placeholder = `[[CODE_BLOCK_${idx}]]`;

      codeBlocks.push({ language, code, placeholder });

      // Replace code element with placeholder
      codeEl.replaceWith(document.createTextNode(placeholder));
    });

    // Get text content (with placeholders for code)
    let text = clone.textContent.trim();

    // Restore code blocks with markdown formatting
    codeBlocks.forEach(({ language, code, placeholder }) => {
      text = text.replace(
        placeholder,
        `\n\`\`\`${language}\n${code}\n\`\`\`\n`
      );
    });

    // Clean up excessive whitespace
    text = text.replace(/\n{3,}/g, '\n\n');

    return text;
  }

  /**
   * Build complete context summary with template format
   * @param {string} originalTitle - Title of the original chat
   * @param {Array} messages - Array of message objects
   * @returns {string} - Formatted context summary
   */
  buildContextSummary(originalTitle, messages, versionedTitle) {
    // Extract summary elements
    const topics = this.extractTopics(messages);
    const concepts = this.extractConcepts(messages);
    const questions = this.extractOpenQuestions(messages);

    // Build summary using improved template
    const summary = `I'm continuing our previous conversation. Here's the checkpoint:

Source: ${originalTitle}

Summary:
• Main topic: ${topics.length > 0 ? topics.join(', ') : 'Continuing discussion'}
• Concepts covered: ${concepts.length > 0 ? concepts.join(', ') : 'Various topics'}
• Open questions / next steps: ${questions.length > 0 ? questions.join('; ') : 'To be determined'}

Recent conversation history:
${this.formatMessages(messages)}

Please continue from where we left off. Also, please set this chat's title to: "${versionedTitle}"`;

    return summary;
  }

  /**
   * Format messages for display in context summary
   * @param {Array} messages - Array of message objects
   * @returns {string} - Formatted messages
   */
  formatMessages(messages) {
    return messages.map(msg => {
      const prefix = msg.role === 'user' ? 'User:' : 'Assistant:';
      return `${prefix}\n${msg.content}`;
    }).join('\n\n---\n\n');
  }

  /**
   * Extract main topics from messages (simple heuristic)
   * @param {Array} messages - Array of message objects
   * @returns {Array<string>} - Extracted topics
   */
  extractTopics(messages) {
    const topics = new Set();

    // Focus on user messages for topic detection
    const userMessages = messages.filter(m => m.role === 'user');

    userMessages.forEach(msg => {
      // Look for capitalized phrases (likely proper nouns or topics)
      const matches = msg.content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (matches) {
        // Take first few unique capitalized phrases
        matches.slice(0, 3).forEach(t => topics.add(t));
      }
    });

    return Array.from(topics).slice(0, 3);
  }

  /**
   * Extract concepts covered in the conversation
   * @param {Array} messages - Array of message objects
   * @returns {Array<string>} - Extracted concepts
   */
  extractConcepts(messages) {
    const concepts = new Set();

    messages.forEach(msg => {
      // Check for code blocks
      if (msg.content.includes('```')) {
        concepts.add('code examples');
      }

      // Check for programming keywords
      if (/\b(function|class|import|const|let|var|def|public|private)\b/.test(msg.content)) {
        concepts.add('programming');
      }

      // Check for math/technical symbols
      if (/[∑∫∂√±×÷]|\b(algorithm|equation|formula)\b/i.test(msg.content)) {
        concepts.add('technical concepts');
      }

      // Check for data/analysis keywords
      if (/\b(data|analysis|visualization|chart|graph|statistics)\b/i.test(msg.content)) {
        concepts.add('data analysis');
      }
    });

    return Array.from(concepts).slice(0, 3);
  }

  /**
   * Extract open questions from recent user messages
   * @param {Array} messages - Array of message objects
   * @returns {Array<string>} - Extracted questions
   */
  extractOpenQuestions(messages) {
    const questions = [];

    // Get last 2 user messages
    const recentUserMessages = messages
      .filter(m => m.role === 'user')
      .slice(-2);

    recentUserMessages.forEach(msg => {
      // Find sentences ending with question marks
      const questionMatches = msg.content.match(/[^.!?]*\?/g);
      if (questionMatches) {
        questionMatches.forEach(q => {
          const cleaned = q.trim();
          if (cleaned.length > 10 && cleaned.length < 150) {
            questions.push(cleaned);
          }
        });
      }
    });

    return questions.slice(0, 2);
  }
}

// Export convenience functions for use in content scripts
function extractChatTitle() {
  return new ContextExtractor().extractChatTitle();
}

function extractMessages(count = 8) {
  return new ContextExtractor(count).extractMessages();
}

function buildContextSummary(title, messages, versionedTitle) {
  return new ContextExtractor().buildContextSummary(title, messages, versionedTitle);
}

// Make available globally
if (typeof window !== 'undefined') {
  window.ContextExtractor = ContextExtractor;
  window.extractChatTitle = extractChatTitle;
  window.extractMessages = extractMessages;
  window.buildContextSummary = buildContextSummary;
}
