# ⚡ LiteChatGPT

**Making your ChatGPT sessions lighter and smoother**

A Chrome extension that helps you recover performance when ChatGPT conversations become slow and laggy by creating fresh chat sessions with preserved context.

## Features

- **User-Triggered Lite Mode** - Activate when you need it with a floating button or popup
- **Context Preservation** - Automatically extracts and carries over recent conversation context
- **Smart Title Versioning** - Tracks chat continuity with "Part X" suffixes
- **Configurable Settings** - Choose how many messages to preserve (2-50, default: 8)
- **Defensive DOM Handling** - Adapts to ChatGPT UI changes gracefully
- **Read-Only & Safe** - Never modifies your existing chats or manipulates React state

## Installation

### Step 1: Generate Extension Icons

Before loading the extension, you need to create the required icon files:

1. Open `icons/icon-generator.html` in your web browser
2. Click the download buttons to save:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. Save all three files in the `icons/` folder

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `LiteChatGpt` folder
5. The extension should now appear in your extensions list

## Usage

### Method 1: Floating Button (Recommended)

1. Open any ChatGPT conversation at `https://chatgpt.com/c/{id}`
2. Look for the **⚡ Lite Mode** button in the bottom-right corner
3. Click it when your chat becomes slow or laggy
4. A new chat tab will open with context automatically injected
5. Review the context and click Send to continue

### Method 2: Extension Popup

1. Click the LiteChatGPT extension icon in your Chrome toolbar
2. Click **Enter Lite Mode** button
3. Same result as Method 1

## How It Works

1. **Extraction** - Reads last N messages from current chat (default: 8)
2. **Context Building** - Creates a formatted summary with:
   - Main topics covered
   - Concepts discussed
   - Open questions
   - Recent conversation history
3. **Title Versioning** - Increments chat title:
   - `"Spring Boot Tutorial"` → `"Spring Boot Tutorial – Part 1"`
   - `"React Hooks – Part 1"` → `"React Hooks – Part 2"`
4. **New Chat Creation** - Opens fresh ChatGPT session
5. **Context Injection** - Automatically fills the message textarea
6. **Manual Review** - You review and send the context yourself

## Settings

Access settings via the extension popup:

- **Messages to preserve**: Number of recent messages to extract (2-50)
- **View Title Versions**: See all tracked chat continuations

Settings are saved automatically and persist across browser sessions.

## Storage

The extension uses `chrome.storage.local` to store:

- **Chat title versions**: Tracks "Part X" numbering for each chat series
- **User settings**: Message count preference
- **Temporary injection data**: Context for new chat (auto-cleaned after 5 minutes)

All data stays local on your device. Nothing is sent to external servers.

## Permissions

The extension requires these permissions:

- `activeTab` - To detect ChatGPT pages and inject content
- `storage` - To save settings and title versions
- `scripting` - To inject content scripts into ChatGPT
- `tabs` - To open new chat tabs
- `host_permissions: https://chatgpt.com/*` - To access ChatGPT pages

## Troubleshooting

### Extension icon shows but button doesn't appear

- Make sure you're on a conversation page (URL like `/c/{id}`)
- Try refreshing the page
- Check browser console for errors (F12 → Console tab)

### Context doesn't inject in new chat

- Wait a few seconds for the page to fully load
- Check that the textarea is visible
- Try refreshing the new tab

### Title versioning not working

- Check storage: Open popup → View Title Versions
- Clear extension data: Chrome Extensions → LiteChatGPT → Remove
- Reinstall extension

### ChatGPT UI changed and selectors broke

- The extension uses defensive selectors with multiple fallbacks
- If issues persist, check for extension updates
- Report issues with browser console errors

## Technical Details

### Architecture

- **Manifest V3** - Modern Chrome extension standard
- **Content Script** - Injected into ChatGPT pages for DOM access
- **Background Service Worker** - Coordinates tab creation
- **Popup UI** - Alternative trigger and settings interface

### DOM Selector Strategy

Uses multiple fallback selectors for robustness:

```javascript
// Messages
[data-testid^="conversation-turn"]
article[data-scroll-anchor]
.group.w-full

// Title
h1.text-xl
h1
[data-testid="chat-title"]

// Textarea
#prompt-textarea
textarea[placeholder*="Message"]
```

### Context Injection Technique

Bypasses React's controlled component using native setters:

```javascript
Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
```

Then dispatches `input` event with `bubbles: true` to trigger React updates.

## File Structure

```
LiteChatGpt/
├── manifest.json              # Extension configuration
├── background.js              # Service worker
├── content.js                 # Main content script
├── popup.html                 # Popup UI
├── popup.js                   # Popup logic
├── styles.css                 # Floating button styles
├── utils/
│   ├── dom-selectors.js      # Defensive selectors
│   ├── title-versioner.js    # Title parsing/incrementing
│   └── context-extractor.js  # Message extraction
├── icons/
│   ├── icon16.png            # Extension icon 16x16
│   ├── icon48.png            # Extension icon 48x48
│   ├── icon128.png           # Extension icon 128x128
│   └── icon-generator.html   # Icon generation tool
└── README.md                  # This file
```

## Limitations & Non-Goals

This extension does NOT:

- ❌ Modify ChatGPT's React internals
- ❌ Delete or remove messages from original chat
- ❌ Auto-trigger based on message count
- ❌ Intercept infinite scrolling
- ❌ Automatically submit injected context (you must review and send)

## Future Enhancements

Potential features for future versions:

- Auto-summarization using AI
- Export to Obsidian/Notion
- Conversation threading across Part X sessions
- Topic auto-tagging
- Memory usage insights
- Right-click context menu trigger
- Visual "Lite View" (CSS-only message collapsing)

## Development

### Testing Checklist

- [ ] Floating button appears on chat pages
- [ ] Context extraction with various message types
- [ ] Title versioning increments correctly
- [ ] New tab opens with context injected
- [ ] Settings save and persist
- [ ] Error handling for selector failures
- [ ] Works with code blocks and formatting
- [ ] Storage cleanup after 5 minutes

### Making Changes

1. Edit source files
2. Go to `chrome://extensions/`
3. Click reload icon on LiteChatGPT card
4. Test changes on ChatGPT

## Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- No tracking or analytics
- No account required
- Open source - inspect the code yourself

## License

MIT License - Feel free to use, modify, and distribute

## Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify ChatGPT URL structure hasn't changed
3. Try disabling other ChatGPT extensions
4. Reinstall the extension

## Version History

**v1.0.0** - Initial release
- User-triggered Lite Mode
- Context extraction and injection
- Title versioning with Part X format
- Configurable message count
- Defensive DOM selectors

---

Made with ⚡ for ChatGPT power users
