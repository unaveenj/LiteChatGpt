# LiteChatGPT - Testing Guide

## Step-by-Step Testing Instructions

### Phase 1: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Method 1: Type `chrome://extensions/` in address bar
   - Method 2: Menu → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Look for toggle switch in top-right corner
   - Turn it ON (should turn blue/purple)

3. **Load Unpacked Extension**
   - Click **"Load unpacked"** button (top-left area)
   - Navigate to: `C:\Users\naveen\Desktop\LiteChatGpt`
   - Click **"Select Folder"**

4. **Verify Installation**
   - Extension card appears with:
     - ⚡ LiteChatGPT icon
     - Version 1.0.0
     - "Making your ChatGPT sessions lighter and smoother"
   - No red error messages
   - Extension enabled (toggle ON)

### Phase 2: Basic Functionality Tests

#### Test 1: Extension Popup
1. Click the LiteChatGPT icon in Chrome toolbar (top-right, puzzle piece icon)
2. **Expected**: Purple gradient popup appears
3. **Check**:
   - Shows "⚡ LiteChatGPT" header
   - "Enter Lite Mode" button (should be disabled)
   - Message count setting (default: 8)
   - "View Title Versions" button

#### Test 2: Floating Button on ChatGPT
1. Go to `https://chatgpt.com`
2. Log in if needed
3. Open any existing conversation (or create a new one with 5+ messages)
4. **Expected**: After 2 seconds, floating button appears
5. **Check**:
   - Button in bottom-right corner
   - Purple gradient background
   - Text: "⚡ Lite Mode"
   - Hover effect works (button lifts slightly)

#### Test 3: Popup on Chat Page
1. While on a ChatGPT conversation page
2. Click extension icon in toolbar
3. **Expected**:
   - "Enter Lite Mode" button is ENABLED (not grayed out)
   - Button shows full text
4. **Check**:
   - Message count setting visible
   - Can change message count (try 5, 10, etc.)

### Phase 3: Core Feature Tests

#### Test 4: Activate Lite Mode (Floating Button)
1. On ChatGPT conversation with at least 8 messages
2. Click the **⚡ Lite Mode** floating button
3. **Expected**:
   - Button text changes to "⚡ Creating..."
   - Button becomes disabled
   - Notification appears (top-right): "Lite Mode activated!"
   - New Chrome tab opens to chatgpt.com
   - After page loads, context appears in textarea

4. **Verify Context Injection**:
   Check that textarea contains:
   ```
   Context from previous chat:
   Source: [Original Chat Title]

   Summary:
   • Main topic: ...
   • Concepts covered: ...
   • Open questions / next steps: ...

   Recent conversation:
   User:
   [message content]

   ---

   Assistant:
   [message content]

   ---

   Continue from here.
   ```

5. **Check**:
   - Context is readable and formatted
   - Last 8 messages included (or your configured amount)
   - Code blocks preserved (if any in original)
   - Send button is enabled (React detected the input)

#### Test 5: Activate Lite Mode (Popup)
1. Go to ChatGPT conversation
2. Click extension icon → Click "Enter Lite Mode" button
3. **Expected**: Same behavior as Test 4
4. Popup should close automatically after 1.5 seconds

#### Test 6: Title Versioning
1. Note the original chat title (e.g., "Spring Boot Tutorial")
2. Activate Lite Mode
3. After context is injected, type a simple message and send
4. Wait for ChatGPT to auto-generate title for new chat
5. **Expected**: Title increments properly
   - First time: "Spring Boot Tutorial – Part 1"
   - Second time: "Spring Boot Tutorial – Part 2"

6. **Verify Storage**:
   - Click extension icon
   - Click "View Title Versions"
   - **Expected**: Alert shows tracked versions

#### Test 7: Message Count Configuration
1. Click extension icon
2. Change "Messages to preserve" to 5
3. Wait for "Settings saved!" message
4. Go to a long conversation
5. Activate Lite Mode
6. **Expected**: Only last 5 messages in context

### Phase 4: Edge Case Tests

#### Test 8: Empty Chat
1. Create a new chat with only 1-2 messages
2. Try to activate Lite Mode
3. **Expected**: Should still work or show appropriate message

#### Test 9: Code Blocks
1. Go to a conversation with code blocks
2. Activate Lite Mode
3. **Expected**: Code blocks preserved with markdown formatting:
   ```
   ```language
   code here
   ```
   ```

#### Test 10: Very Long Messages
1. Conversation with messages >1000 characters
2. Activate Lite Mode
3. **Expected**: Full messages extracted without truncation

#### Test 11: Multiple Activations
1. Activate Lite Mode on same chat 3 times
2. **Expected**:
   - Creates 3 new tabs
   - Titles: "Chat – Part 1", "Chat – Part 2", "Chat – Part 3"
   - Each injection works correctly

#### Test 12: Browser Restart
1. Activate Lite Mode once
2. Note title version
3. Close Chrome completely
4. Reopen Chrome
5. Click extension icon → "View Title Versions"
6. **Expected**: Versions still stored (persistence works)

### Phase 5: Error Handling Tests

#### Test 13: Wrong Page Type
1. Go to chatgpt.com homepage (not a conversation)
2. Check for floating button
3. **Expected**: NO button (only appears on `/c/{id}` pages)
4. Click extension icon
5. **Expected**: "Open a chat conversation to use" message

#### Test 14: Non-ChatGPT Page
1. Go to any other website (google.com, etc.)
2. Click extension icon
3. **Expected**: "Open ChatGPT to use Lite Mode" message

#### Test 15: ChatGPT Not Loaded
1. Open chatgpt.com but block page load (Ctrl+Esc quickly)
2. Check for errors
3. **Expected**: Extension doesn't crash, degrades gracefully

### Testing Checklist

Copy and check off as you test:

**Installation**
- [ ] Extension loads without errors
- [ ] Icons display correctly
- [ ] Version shows as 1.0.0

**UI Elements**
- [ ] Floating button appears on chat pages
- [ ] Floating button NOT on homepage
- [ ] Popup opens correctly
- [ ] Popup shows correct state (enabled/disabled)
- [ ] Settings UI is functional

**Core Features**
- [ ] Lite Mode activates from floating button
- [ ] Lite Mode activates from popup
- [ ] New tab opens automatically
- [ ] Context injects into textarea
- [ ] React detects injection (send button enabled)
- [ ] Can manually review and send

**Title Versioning**
- [ ] First activation: "Title – Part 1"
- [ ] Second activation: "Title – Part 2"
- [ ] Versions persist across browser restarts
- [ ] View Versions shows correct data

**Settings**
- [ ] Message count changes and saves
- [ ] Settings persist across sessions

**Content Extraction**
- [ ] Text messages extracted correctly
- [ ] Code blocks preserved
- [ ] Formatting maintained
- [ ] Configured message count respected

**Error Handling**
- [ ] Wrong page type handled gracefully
- [ ] Non-ChatGPT pages handled
- [ ] Empty chats handled
- [ ] Network errors don't crash extension

**Performance**
- [ ] Floating button appears quickly (<2 sec)
- [ ] Context extraction is fast (<1 sec)
- [ ] New tab opens promptly
- [ ] No memory leaks (test multiple activations)

### Common Issues & Solutions

**Issue**: Extension won't load
- **Check**: All icon files exist in icons/ folder
- **Fix**: Verify icon16.png, icon48.png, icon128.png are present

**Issue**: Floating button doesn't appear
- **Check**: Are you on a conversation page (/c/{id})?
- **Check**: Console errors? (F12 → Console tab)
- **Fix**: Refresh the page

**Issue**: Context doesn't inject
- **Check**: Did new tab fully load?
- **Check**: Is textarea visible?
- **Fix**: Wait a few more seconds, or refresh new tab

**Issue**: Title versioning doesn't work
- **Check**: Storage permissions granted?
- **Fix**: Reload extension, clear storage

**Issue**: React doesn't detect input
- **Check**: Is send button still disabled?
- **Try**: Click in textarea, type a space, then delete it
- **Fix**: May need to adjust event dispatching

### Debug Tools

**View Console Logs**:
1. F12 → Console tab
2. Filter by "LiteChatGPT"
3. Look for errors (red) or warnings (yellow)

**View Storage**:
1. F12 → Application tab
2. Storage → Local Storage → chrome-extension://...
3. Check for chatTitleIndex, messageCount, pendingInjection

**View Background Worker**:
1. chrome://extensions/
2. Find LiteChatGPT
3. Click "service worker" link
4. View background script console

### Success Criteria

Extension is working if:
✅ Loads without errors
✅ Floating button appears on chat pages
✅ Context extracts and injects correctly
✅ Title versioning increments
✅ Settings save and persist
✅ No console errors during normal operation

---

**After testing, report any issues you find!**
