# LiteChatGPT - Installation Guide

## Quick Install (3 Steps)

### 1. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `LiteChatGpt` folder
6. Extension loaded! ✅

### 2. Verify Installation

You should see:
- Extension appears in chrome://extensions/ list
- LiteChatGPT icon in Chrome toolbar
- No errors in the extension card

### 3. Test It Out

1. Go to `https://chatgpt.com`
2. Open any existing conversation (or create one with a few messages)
3. Look for the **⚡ Lite Mode** button (bottom-right corner)
4. Click it to test functionality

## What Happens When You Click "Lite Mode"

1. Extension extracts last 8 messages from current chat
2. Creates formatted context summary
3. Opens new ChatGPT tab
4. Injects context into textarea
5. You review and manually send

## Testing Checklist

- [ ] Floating button appears on conversation pages
- [ ] Clicking button opens new tab
- [ ] Context appears in new chat's textarea
- [ ] Title versioning works (check popup → View Versions)
- [ ] Settings save (change message count in popup)

## Troubleshooting

**Button doesn't appear:**
- Make sure you're on a conversation page (URL: `/c/{id}`)
- Refresh the page
- Check console for errors (F12)

**Context doesn't inject:**
- Wait for page to fully load
- Check that textarea is visible
- Try refreshing new tab

**Extension won't load:**
- Check all files are present
- Verify icons exist in icons/ folder
- Check manifest.json for syntax errors

## Permissions Explanation

- **activeTab**: Detect ChatGPT pages
- **storage**: Save settings and title versions
- **scripting**: Inject content scripts
- **tabs**: Open new chat tabs
- **chatgpt.com**: Access ChatGPT domain

## Next Steps

1. Use it on ChatGPT when chats get slow
2. Configure message count in popup settings
3. View title versions to track continuations
4. Provide feedback if you find issues

---

Enjoy lighter ChatGPT sessions! ⚡
