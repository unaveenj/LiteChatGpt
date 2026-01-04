# LiteChatGPT - Quick Start Guide

## ✅ Extension Health Check: PASSED

All files present and validated:
- 3 Core JS files
- 3 Utility modules
- 3 Icon files (16, 48, 128)
- UI files (HTML, CSS)
- Manifest V3 valid

**Total Size**: 1.5 MB

---

## 🚀 Load in Chrome (4 Steps)

### 1. Extensions Page
Chrome should have opened to `chrome://extensions/`

If not, manually go to:
- Type in address bar: `chrome://extensions/`
- OR: Menu (⋮) → Extensions → Manage Extensions

### 2. Enable Developer Mode
- Find toggle in **top-right corner**
- Click to turn ON (becomes blue/purple)

### 3. Load Unpacked
- Click **"Load unpacked"** button (appears after Developer Mode is on)
- Browse to: `C:\Users\naveen\Desktop\LiteChatGpt`
- Click **"Select Folder"**

### 4. Verify
✓ Extension card appears
✓ Shows "LiteChatGPT" with ⚡ icon
✓ Version 1.0.0
✓ No errors (no red text)

---

## 🧪 Test Immediately

### Test 1: Open ChatGPT
1. Go to `https://chatgpt.com`
2. Log in
3. Open any conversation (or create one with 5+ messages)
4. **Look for**: ⚡ Lite Mode button in bottom-right corner

### Test 2: Click Lite Mode
1. Click the floating **⚡ Lite Mode** button
2. **Expect**:
   - Button changes to "Creating..."
   - New tab opens
   - Context appears in textarea
3. **Verify**: Last 8 messages extracted and formatted

### Test 3: Review & Send
1. Review the injected context
2. Click Send button (or press Enter)
3. **Expect**: ChatGPT responds as normal
4. Conversation continues seamlessly

---

## 📱 Extension Features

### Floating Button
- **Location**: Bottom-right on chat pages
- **Action**: Click to activate Lite Mode
- **Design**: Purple gradient with ⚡ icon

### Popup (Click Extension Icon)
- **Button**: Alternative Lite Mode trigger
- **Settings**: Adjust message count (2-50)
- **Versions**: View title tracking

### Title Versioning
- First use: `"Chat Title" → "Chat Title – Part 1"`
- Next use: `"Chat Title – Part 1" → "Chat Title – Part 2"`
- Persists across browser restarts

---

## 🔧 Settings

Click extension icon → Adjust:
- **Messages to preserve**: 2-50 (default: 8)
- **View Title Versions**: See tracking history

Settings save automatically!

---

## ⚠️ Troubleshooting

**Button doesn't appear?**
- Make sure you're on `/c/{id}` page (conversation, not homepage)
- Refresh the page
- Check F12 Console for errors

**Context doesn't inject?**
- Wait for new tab to fully load
- Look for textarea
- Check notification messages

**Title versioning not working?**
- Popup → View Title Versions
- Check if data is stored

---

## 📊 What Gets Extracted

From your current chat:
- ✓ Last N messages (default 8)
- ✓ User questions
- ✓ Assistant responses
- ✓ Code blocks (preserved)
- ✓ Formatting (lists, headings)

What doesn't get extracted:
- ✗ Images/files
- ✗ Regenerated messages
- ✗ UI elements (buttons, avatars)

---

## 🎯 When to Use

Use Lite Mode when:
- Chat becomes slow/laggy
- Browser freezes during scrolling
- Typing has delay
- Want fresh session with context

Don't use when:
- Chat is still fast
- Only 1-2 messages in conversation
- Need complete chat history

---

## 📁 Files Reference

**Main Files**:
- `manifest.json` - Extension config
- `content.js` - Floating button logic
- `background.js` - Tab coordination
- `popup.html/js` - Extension popup

**Utilities**:
- `utils/dom-selectors.js` - Defensive selectors
- `utils/title-versioner.js` - Part X logic
- `utils/context-extractor.js` - Message extraction

**Icons**:
- `icons/icon16.png` - Toolbar icon
- `icons/icon48.png` - Extension card
- `icons/icon128.png` - Chrome Web Store

---

## 🆘 Need Help?

1. **Check Console**: F12 → Console → Filter "LiteChatGPT"
2. **Read Logs**: Extension logs all actions
3. **Testing Guide**: See `TESTING_GUIDE.md`
4. **Health Check**: Run `python check-extension.py`

---

## ✨ Quick Tips

- **Keyboard**: No keyboard shortcuts (click only for now)
- **Privacy**: All data stays local, nothing sent to servers
- **Updates**: Reload extension after code changes
- **Uninstall**: chrome://extensions/ → Remove

---

**Ready to make your ChatGPT sessions lighter!** ⚡

Next: Go test it on ChatGPT now!
