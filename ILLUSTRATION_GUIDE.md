# LiteChatGPT - Detailed Documentation for Illustrations

## Table of Contents
1. [Application Overview](#application-overview)
2. [User Journey & Flows](#user-journey--flows)
3. [UI Components](#ui-components)
4. [Architecture & Data Flow](#architecture--data-flow)
5. [Feature Descriptions](#feature-descriptions)
6. [Visual Elements Guide](#visual-elements-guide)

---

## 1. Application Overview

### Purpose
LiteChatGPT is a Chrome extension that helps users recover performance when ChatGPT conversations become slow and laggy by creating fresh chat sessions with preserved context.

### Problem Statement
- **Issue**: Long ChatGPT conversations (50+ messages) cause browser lag, freezes, and slow typing
- **Impact**: Frustrates users during learning, coding, and deep exploration sessions
- **Current Solution**: Manual copy-paste or starting over (loses context)

### Solution
- **One-Click Activation**: User clicks "⚡ Lite Mode" button when chat becomes slow
- **Smart Context Extraction**: Automatically extracts last 8 messages (configurable)
- **Fresh Start**: Opens new ChatGPT tab with context pre-loaded
- **Title Versioning**: Tracks conversation continuity with "Part X" numbering

### Key Benefits
1. **Performance Recovery**: New chat = fast, responsive experience
2. **Context Preservation**: Don't lose conversation thread
3. **Seamless Continuation**: Pick up exactly where you left off
4. **Organized History**: Track related chats with Part 1, Part 2, etc.

---

## 2. User Journey & Flows

### Flow 1: First-Time User Journey

**Step 1: Installation**
```
User Action: Opens chrome://extensions/, loads unpacked extension
Visual: Chrome extensions page with LiteChatGPT card appearing
UI Elements:
- Extension card with purple gradient icon
- "LiteChatGPT" title
- Version 1.0.0
- Description: "Making your ChatGPT sessions lighter and smoother"
- Toggle switch (enabled)
```

**Step 2: Using ChatGPT**
```
User Action: Opens ChatGPT, starts conversation
Visual: ChatGPT interface with growing message history
UI Elements:
- ChatGPT standard interface
- Messages accumulating (5, 10, 15+ messages)
- User notices slowdown (typing lag, scroll lag)
```

**Step 3: Discovering Lite Mode**
```
User Action: Sees floating button appear
Visual: Bottom-right corner of ChatGPT page
UI Elements:
- Floating button with purple gradient background
- Lightning bolt emoji: ⚡
- Text: "Lite Mode"
- Position: Fixed, 24px from bottom-right
- Shadow: Subtle purple glow
- Hover effect: Button lifts 2px up
```

**Step 4: Activating Lite Mode**
```
User Action: Clicks "⚡ Lite Mode" button
Visual: Button state changes, notification appears
UI Elements:
- Button text changes to "⚡ Creating..."
- Button becomes disabled (grayed out)
- Notification appears top-right:
  - Background: Light green (#e6f4ea)
  - Border-left: Green bar
  - Text: "Lite Mode activated! Opening new chat..."
  - Icon: Checkmark
```

**Step 5: Context Injection**
```
User Action: New tab opens automatically
Visual: Fresh ChatGPT page with context pre-filled
UI Elements:
- New Chrome tab (chatgpt.com)
- Textarea contains formatted context:
  "IMPORTANT: Please name this chat session: 'Original Title – Part 1'"
  [Conversation summary]
  [Recent messages]
- Send button is enabled (blue)
- Cursor focused in textarea
```

**Step 6: Continuation**
```
User Action: Reviews context, clicks Send
Visual: ChatGPT responds, conversation continues
UI Elements:
- Context message sent
- ChatGPT generates response
- Chat title auto-generates
- Notification: "Chat renamed to: Original Title – Part 1"
```

### Flow 2: Popup Trigger Flow

**Alternative Activation Path**
```
Step 1: User clicks extension icon in Chrome toolbar
Visual: Purple gradient popup appears (320px width)

Step 2: Popup displays:
- Header: "⚡ LiteChatGPT"
- Tagline: "Making your ChatGPT sessions lighter and smoother"
- Main button: "Enter Lite Mode" (purple gradient)
- Settings section:
  - "Messages to preserve: [8]" (number input)
  - "View Title Versions" button

Step 3: User clicks "Enter Lite Mode"
Visual: Same flow as Flow 1 Step 4 onwards

Step 4: Popup closes automatically after 1.5 seconds
```

### Flow 3: Settings Adjustment Flow

```
Step 1: User opens popup, changes message count to 12
Visual: Input field updates, "Settings saved!" message appears

Step 2: User activates Lite Mode
Visual: Extension extracts 12 messages instead of 8

Step 3: Settings persist across browser restarts
Visual: Next time popup opens, shows "12" in settings
```

### Flow 4: Title Versioning Flow

```
Scenario: User has chat "Spring Boot Tutorial"

Activation 1:
- Original: "Spring Boot Tutorial"
- New chat title: "Spring Boot Tutorial – Part 1"
- Storage: {"Spring Boot Tutorial": 1}

Activation 2 (from Part 1):
- Original: "Spring Boot Tutorial – Part 1"
- New chat title: "Spring Boot Tutorial – Part 2"
- Storage: {"Spring Boot Tutorial": 2}

Activation 3 (from Part 2):
- Original: "Spring Boot Tutorial – Part 2"
- New chat title: "Spring Boot Tutorial – Part 3"
- Storage: {"Spring Boot Tutorial": 3}

View Versions:
- User clicks "View Title Versions" in popup
- Alert shows: "Spring Boot Tutorial: Part 3"
```

---

## 3. UI Components

### Component 1: Floating Action Button

**Visual Specifications:**
```
Position: Fixed, bottom-right corner
Offset: 24px from bottom, 24px from right
Size: Auto-width, 44px height
Background: Linear gradient (135deg, #667eea 0%, #764ba2 100%)
Border-radius: 24px (fully rounded corners)
Box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4)
Z-index: 9999

Content:
- Lightning emoji: ⚡ (16px)
- Text: "Lite Mode" (14px, 600 weight, white)
- Padding: 12px horizontal, 20px vertical
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI'

States:
1. Default: Purple gradient, shadow
2. Hover: Translate Y -2px, shadow increases
3. Active: Translate Y 0px
4. Disabled: Opacity 60%, cursor not-allowed
5. Processing: Text "⚡ Creating...", disabled state

Animations:
- Hover: 0.3s ease transition
- Appears: Fade in after 2 seconds of page load
```

**Visual Context:**
```
Placement on ChatGPT page:
- Does NOT overlap ChatGPT's UI
- Visible over chat messages
- Visible when scrolling
- Appears only on conversation pages (/c/{id})
- Does NOT appear on homepage
```

### Component 2: Extension Popup

**Visual Specifications:**
```
Dimensions: 320px width, auto height (~380px)
Background: Linear gradient (135deg, #667eea 0%, #764ba2 100%)
Border-radius: None (Chrome default)
Padding: 20px all sides

Header Section:
- Title: "⚡ LiteChatGPT" (24px, white, centered)
- Lightning emoji: ⚡ (inline, 24px)
- Tagline: "Making your ChatGPT sessions lighter and smoother"
  - Size: 12px
  - Color: White, 90% opacity
  - Weight: 300

Main Action Section:
- Background: White
- Border-radius: 12px
- Padding: 16px
- Margin-bottom: 16px

Button: "Enter Lite Mode"
- Width: 100%
- Height: 48px
- Background: Purple gradient (same as floating button)
- Color: White
- Font-size: 15px
- Font-weight: 600
- Border-radius: 8px
- Hover: Translate Y -2px, shadow

Settings Section:
- Background: White 15% opacity
- Border-radius: 12px
- Padding: 16px
- Backdrop-filter: blur(10px)

Settings Title: "Settings"
- Size: 13px
- Weight: 600
- Opacity: 90%
- Margin-bottom: 12px

Message Count Input:
- Label: "Messages to preserve:" (12px, white 90%)
- Input: Number field
  - Width: 80px
  - Background: White 20% opacity
  - Border: 1px solid white 30%
  - Color: White
  - Font-size: 14px
  - Range: 2-50

View Versions Button:
- Background: White 20% opacity
- Border: 1px solid white 30%
- Color: White
- Font-size: 12px
- Border-radius: 6px
- Padding: 8px 12px

Footer:
- Text: "v1.0.0"
- Size: 11px
- Opacity: 70%
- Centered
- Margin-top: 12px
```

### Component 3: Notification Toasts

**Visual Specifications:**
```
Position: Fixed, top-right corner
Offset: 24px from top, 24px from right
Size: Min-width 280px, max-width 400px, auto height
Z-index: 10000

Base Style:
- Background: White
- Border-radius: 8px
- Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
- Padding: 16px 20px
- Font-size: 14px
- Line-height: 1.5

Variants:

Success:
- Background: #e6f4ea (light green)
- Color: #1e8e3e (dark green)
- Border-left: 4px solid #1e8e3e
- Icon: ✓ (optional)

Error:
- Background: #fce8e6 (light red)
- Color: #c5221f (dark red)
- Border-left: 4px solid #c5221f
- Icon: ✗ (optional)

Info:
- Background: #e8f0fe (light blue)
- Color: #1967d2 (dark blue)
- Border-left: 4px solid #1967d2
- Icon: ℹ (optional)

Animation:
- Entry: Slide in from right (0.3s ease)
  - From: translateX(400px), opacity 0
  - To: translateX(0), opacity 1
- Exit: Fade out (0.3s ease)
- Duration: Auto-dismiss after 5 seconds
```

**Notification Messages:**
```
1. "Lite Mode activated! Opening new chat..."
   - Type: Success
   - Trigger: After clicking Lite Mode button
   - Duration: 5 seconds

2. "Context injected! Rename chat to: [Title]"
   - Type: Success
   - Trigger: After context loads in new tab
   - Duration: 5 seconds

3. "Chat renamed to: [Title]"
   - Type: Success
   - Trigger: After successful auto-rename
   - Duration: 5 seconds

4. "Extension updated. Please refresh this page."
   - Type: Error
   - Trigger: When extension context invalidated
   - Duration: 5 seconds

5. "Chat is empty. Add more messages first."
   - Type: Error
   - Trigger: When trying to activate on empty chat
   - Duration: 5 seconds

6. "Settings saved!"
   - Type: Success
   - Trigger: After changing settings in popup
   - Duration: 3 seconds
```

### Component 4: Context Injection Format

**Visual Layout in Textarea:**
```
┌─────────────────────────────────────────────────────┐
│ IMPORTANT: Please name this chat session:          │
│ "Spring Boot Tutorial – Part 2"                     │
│                                                     │
│ I'm continuing our previous conversation from       │
│ "Spring Boot Tutorial – Part 1". Here's the       │
│ checkpoint:                                         │
│                                                     │
│ Summary:                                           │
│ • Main topic: Spring Boot, REST APIs              │
│ • Concepts covered: Controllers, Services         │
│ • Open questions: How to add authentication?      │
│                                                     │
│ Recent conversation history:                       │
│ User:                                              │
│ How do I create a REST controller in Spring Boot? │
│                                                     │
│ ---                                                │
│                                                     │
│ Assistant:                                         │
│ To create a REST controller in Spring Boot...     │
│                                                     │
│ [More messages...]                                 │
│                                                     │
│ Please continue from where we left off and         │
│ remember to use the exact title specified above.   │
└─────────────────────────────────────────────────────┘
```

**Formatting Details:**
```
- Title instruction: Bold emphasis via "IMPORTANT:"
- Original title: In quotes
- Sections: Clear headers (Summary:, Recent conversation:)
- Bullet points: • character for visual clarity
- Message separator: "---" horizontal rule
- Role labels: "User:" and "Assistant:"
- Code blocks: Preserved with ``` markdown syntax
- Whitespace: Extra line breaks for readability
```

---

## 4. Architecture & Data Flow

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ChatGPT Tab (Old Chat)                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │         content.js (Content Script)          │    │  │
│  │  │  • Injects floating button                   │    │  │
│  │  │  • Detects page type                         │    │  │
│  │  │  • Handles Lite Mode click                   │    │  │
│  │  │  • Extracts context                          │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │           ↓                                          │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │         utils/dom-selectors.js               │    │  │
│  │  │  • Defensive DOM queries                     │    │  │
│  │  │  • Multiple fallback selectors               │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │           ↓                                          │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │      utils/context-extractor.js              │    │  │
│  │  │  • Extract messages                          │    │  │
│  │  │  • Build summary                             │    │  │
│  │  │  • Format context                            │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │           ↓                                          │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │       utils/title-versioner.js               │    │  │
│  │  │  • Parse title                               │    │  │
│  │  │  • Increment version                         │    │  │
│  │  │  • Store in chrome.storage                   │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ↓                                     │
│                       ↓ (chrome.runtime.sendMessage)        │
│                       ↓                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           background.js (Service Worker)              │  │
│  │  • Receives CREATE_LITE_CHAT message                 │  │
│  │  • Stores pendingInjection in chrome.storage         │  │
│  │  • Opens new ChatGPT tab                             │  │
│  │  • Monitors tab load completion                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ↓                                     │
│                       ↓ (chrome.tabs.create)                │
│                       ↓                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ChatGPT Tab (New Chat)                   │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │         content.js (Content Script)          │    │  │
│  │  │  • Detects new chat page                     │    │  │
│  │  │  • Checks chrome.storage for pending data    │    │  │
│  │  │  • Waits for textarea                        │    │  │
│  │  │  • Injects context                           │    │  │
│  │  │  • Sets up title rename                      │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           popup.html/popup.js (Extension Popup)       │  │
│  │  • Alternative Lite Mode trigger                     │  │
│  │  • Settings UI                                       │  │
│  │  • Title version viewer                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              chrome.storage.local                     │  │
│  │  • chatTitleIndex: {title: version}                  │  │
│  │  • pendingInjection: {context, title, timestamp}     │  │
│  │  • messageCount: number (user setting)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Sequence

**Sequence 1: Activation Flow**
```
1. User clicks "⚡ Lite Mode" button
   ↓
2. content.js → handleLiteModeClick()
   ↓
3. Check extension context validity
   ↓
4. Extract current chat title
   DOM Query: h1, [data-testid="chat-title"], etc.
   Result: "Spring Boot Tutorial – Part 1"
   ↓
5. Get message count from settings
   chrome.storage.local.get('messageCount')
   Result: 8 (default)
   ↓
6. Extract last 8 messages
   DOM Query: [data-testid^="conversation-turn"], article, etc.
   For each message:
     - Detect role (user vs assistant)
     - Extract content (text + code blocks)
     - Remove UI elements (buttons, avatars)
   Result: Array of 8 message objects
   ↓
7. Generate versioned title
   Parse: "Spring Boot Tutorial – Part 1"
   Extract base: "Spring Boot Tutorial"
   Extract version: 1
   Increment: 2
   Store: chrome.storage.local.set({chatTitleIndex: {"Spring Boot Tutorial": 2}})
   Result: "Spring Boot Tutorial – Part 2"
   ↓
8. Build context summary
   Template with:
     - Title instruction at top
     - Original title
     - Summary (topics, concepts, questions)
     - Formatted messages
     - Continuation instruction
   Result: Formatted string (500-2000 chars)
   ↓
9. Send to background script
   chrome.runtime.sendMessage({
     action: 'CREATE_LITE_CHAT',
     payload: {contextSummary, versionedTitle, originalTitle}
   })
   ↓
10. background.js receives message
    ↓
11. Store pending injection
    chrome.storage.local.set({
      pendingInjection: {
        contextSummary,
        versionedTitle,
        originalTitle,
        timestamp: Date.now()
      }
    })
    ↓
12. Create new tab
    chrome.tabs.create({
      url: 'https://chatgpt.com/',
      active: true
    })
    ↓
13. Monitor tab load
    chrome.tabs.onUpdated → Wait for status: 'complete'
    ↓
14. New tab loads, content.js initializes
    ↓
15. Detect new chat page
    URL check: pathname === '/'
    ↓
16. Check for pending injection
    chrome.storage.local.get('pendingInjection')
    ↓
17. Wait for textarea
    Poll every 100ms for up to 15 seconds
    Try multiple selectors: #prompt-textarea, textarea[placeholder*="Message"], etc.
    ↓
18. Inject context
    - Get native textarea setter
    - Set value to contextSummary
    - Dispatch input events (bubbles: true)
    - Focus textarea
    ↓
19. Clear pending injection
    chrome.storage.local.remove('pendingInjection')
    ↓
20. Set up title rename
    - Poll every 2 seconds for title appearance
    - When detected, attempt rename
    - Try multiple strategies (click title, find rename button, etc.)
    ↓
21. Show success notification
    "Context injected! Rename chat to: [Title]"
    ↓
22. User reviews context
    ↓
23. User clicks Send
    ↓
24. ChatGPT processes and responds
    ↓
25. Auto-rename attempts
    If successful: "Chat renamed to: [Title]"
    If timeout: User can rename manually
```

**Sequence 2: Storage Flow**
```
Title Versioning Storage:

Initial State:
  chrome.storage.local = {}

After First Activation (Chat A):
  chrome.storage.local = {
    chatTitleIndex: {
      "Chat A": 1
    }
  }

After Second Activation (Chat A Part 1):
  chrome.storage.local = {
    chatTitleIndex: {
      "Chat A": 2
    }
  }

After First Activation (Chat B):
  chrome.storage.local = {
    chatTitleIndex: {
      "Chat A": 2,
      "Chat B": 1
    }
  }

Viewing Versions:
  popup.js → chrome.storage.local.get('chatTitleIndex')
  Display: "Chat A: Part 2, Chat B: Part 1"
```

### Error Handling Flow

```
Error Type 1: Extension Context Invalidated
Trigger: Extension reloaded while page open
Detection: chrome.runtime.id === undefined
Response:
  - Show notification: "Extension updated. Please refresh this page."
  - Prevent further actions
  - Log to console

Error Type 2: No Messages Found
Trigger: Activate on empty or very short chat
Detection: extractMessages() returns empty array
Response:
  - Show notification: "Chat is empty. Add more messages first."
  - Reset button state
  - Log to console

Error Type 3: Textarea Not Found
Trigger: ChatGPT UI changed, selectors fail
Detection: waitForElement() timeout
Response:
  - Show notification: "Failed to inject context. Please try again."
  - Log error with selector info
  - Clear pending injection

Error Type 4: Title Parse Error
Trigger: Unexpected title format
Detection: Exception in parseTitle()
Response:
  - Use fallback: "Untitled Chat – Part 1"
  - Continue with activation
  - Log warning

Error Type 5: Storage Quota Exceeded
Trigger: Too much data in chrome.storage.local
Detection: chrome.runtime.lastError
Response:
  - Show notification: "Storage full. Please clear old data."
  - Cleanup old pending injections
  - Attempt to proceed
```

---

## 5. Feature Descriptions

### Feature 1: Defensive DOM Selectors

**Purpose**: Handle ChatGPT's frequently changing UI structure

**How it Works:**
```
Instead of:
  document.querySelector('h1')  // Might break

We use:
  DOMSelectors.findElement([
    'h1.text-xl',                    // Try specific first
    'h1',                            // Then generic
    '[data-testid="chat-title"]',   // Then data attributes
    'header h1',                     // Then context-based
    'title'                          // Finally, fallback
  ])
```

**Visual Representation:**
```
ChatGPT DOM Structure (Can Change):

Current Version:
┌──────────────────────┐
│ <header>             │
│   <h1 class="text-xl">│  ← We find this
│     Chat Title       │
│   </h1>              │
│ </header>            │
└──────────────────────┘

After Update (hypothetical):
┌──────────────────────┐
│ <div>                │
│   <h1>               │  ← Fallback finds this
│     Chat Title       │
│   </h1>              │
│ </div>               │
└──────────────────────┘

Complete Failure:
┌──────────────────────┐
│ <title>              │  ← Last resort
│   Chat Title | ChatGPT
│ </title>             │
└──────────────────────┘
```

**Benefits:**
- Extension survives ChatGPT UI updates
- Graceful degradation (tries best, falls back)
- Logs which selectors work (for debugging)

### Feature 2: Context Extraction & Formatting

**Purpose**: Capture meaningful conversation context

**Extraction Process:**
```
Step 1: Find Message Containers
  Try selectors:
    - [data-testid^="conversation-turn"]
    - article[data-scroll-anchor]
    - .group.w-full
  Found: 47 message elements

Step 2: Get Last N Messages
  User setting: 8 messages
  Slice: messages.slice(-8)
  Result: Last 8 message elements

Step 3: For Each Message:
  a) Detect Role (User vs Assistant)
     - Check data-message-author-role attribute
     - Look for AI avatar image
     - Check for test IDs
     - Use multiple heuristics

  b) Clone Element (Don't modify original DOM)

  c) Remove UI Elements:
     - Buttons (copy, regenerate, edit)
     - Avatars and images
     - SVG icons
     - Metadata badges

  d) Extract Code Blocks:
     - Find <pre><code> elements
     - Detect language from class
     - Extract code text
     - Replace with placeholder: [[CODE_BLOCK_0]]

  e) Get Text Content:
     - Extract text from cleaned clone
     - Preserve line breaks
     - Clean excessive whitespace

  f) Restore Code Blocks:
     - Replace placeholders with markdown:
       ```javascript
       [code here]
       ```

  g) Return Message Object:
     {
       role: "user" | "assistant",
       content: "formatted text with code",
       index: 0-7
     }

Step 4: Analyze Messages
  - Extract topics (capitalized phrases from user messages)
  - Extract concepts (code patterns, technical terms)
  - Extract questions (sentences ending with ?)

Step 5: Build Summary
  Template:
    IMPORTANT: [Title instruction]

    Continuation context

    Summary bullets

    Formatted message history

    Continuation instruction
```

**Visual Example:**
```
Original ChatGPT Message:
┌────────────────────────────────────────┐
│ [Avatar] Assistant              [Copy] │
│                                        │
│ Here's how to create a controller:    │
│                                        │
│ ```java                                │
│ @RestController                        │
│ public class UserController {          │
│   // code here                         │
│ }                                      │
│ ```                                    │
│                                [Edit]  │
└────────────────────────────────────────┘

Extracted Content:
Here's how to create a controller:

```java
@RestController
public class UserController {
  // code here
}
```

[Clean, formatted, ready for injection]
```

### Feature 3: Title Versioning System

**Purpose**: Track conversation continuations with "Part X" numbering

**Parsing Logic:**
```
Input: "Spring Boot Tutorial – Part 2"

Regex: /^(.*?)\s*[–—-]\s*Part\s+(\d+)\s*$/i

Match Groups:
  Group 1: "Spring Boot Tutorial" (base title)
  Group 2: "2" (version number)

Result:
  {
    base: "Spring Boot Tutorial",
    version: 2
  }
```

**Incrementing Logic:**
```
Scenario A: Fresh Title
Input: "React Hooks Guide"
Parse: No version found
Storage Check: chatTitleIndex["React Hooks Guide"] = undefined
Next Version: 1
Output: "React Hooks Guide – Part 1"
Storage Update: {"React Hooks Guide": 1}

Scenario B: Versioned Title
Input: "React Hooks Guide – Part 1"
Parse: base="React Hooks Guide", version=1
Storage Check: chatTitleIndex["React Hooks Guide"] = 1
Next Version: 2 (increment parsed version)
Output: "React Hooks Guide – Part 2"
Storage Update: {"React Hooks Guide": 2}

Scenario C: Out of Sync
Input: "React Hooks Guide" (original)
Parse: No version
Storage Check: chatTitleIndex["React Hooks Guide"] = 3 (from previous uses)
Next Version: 4 (increment stored version)
Output: "React Hooks Guide – Part 4"
Storage Update: {"React Hooks Guide": 4}
```

**Storage Schema:**
```json
{
  "chatTitleIndex": {
    "Spring Boot Tutorial": 5,
    "React Hooks Guide": 3,
    "Python Data Science": 1,
    "TypeScript Advanced": 7
  }
}
```

**Visual Timeline:**
```
Time: T0
Chat: "Learning Rust"
Action: Activate Lite Mode
Result: "Learning Rust – Part 1"

Time: T1
Chat: "Learning Rust – Part 1"
Action: Activate Lite Mode
Result: "Learning Rust – Part 2"

Time: T2
Chat: "Learning Rust – Part 2"
Action: Activate Lite Mode
Result: "Learning Rust – Part 3"

Storage State Over Time:
T0: {}
T1: {"Learning Rust": 1}
T2: {"Learning Rust": 2}
T3: {"Learning Rust": 3}
```

### Feature 4: Automatic Title Rename

**Purpose**: Apply versioned title to new chat automatically

**Detection Strategy:**
```
After Context Injection:
  ↓
Poll every 2 seconds (max 2 minutes):
  ↓
  Check: Does title element exist?
  Check: Does it have text content?
  Check: Is text NOT just "ChatGPT"?
  ↓
  If YES → ChatGPT auto-generated a title
  ↓
  Attempt Rename
```

**Rename Strategies:**
```
Strategy 1: Find Rename Button
  Selectors:
    - button[aria-label*="Rename"]
    - button[title*="Rename"]
    - [data-testid="rename-button"]

  If found:
    1. Click button
    2. Wait 500ms
    3. Find input field
    4. Set value to versioned title
    5. Press Enter
    6. SUCCESS

Strategy 2: Click Title Direct
  If rename button not found:
    1. Click on title element
    2. Wait 500ms
    3. Look for input field
    4. Set value
    5. Press Enter
    6. SUCCESS

Strategy 3: Manual Fallback
  If all strategies fail:
    - Show notification with target title
    - User manually renames
    - Extension still tracks version in storage
```

**Visual Flow:**
```
User sends context message
         ↓
ChatGPT responds (takes 3-5 seconds)
         ↓
ChatGPT auto-generates title based on message
Title appears: "Spring Boot Discussion"
         ↓
Extension detects title (polling check)
         ↓
Extension attempts rename
         ↓
SUCCESS: Title changes to "Spring Boot – Part 2"
Notification: "Chat renamed to: Spring Boot – Part 2"

OR

FAILURE: Rename mechanism not found
Notification: "Rename chat to: Spring Boot – Part 2"
User manually renames
```

### Feature 5: Cross-Tab Communication

**Purpose**: Pass data from old chat tab to new chat tab

**Mechanism: chrome.storage.local**
```
Why not direct messaging?
  - New tab doesn't exist yet when we extract context
  - Background script can't inject directly
  - Need persistence in case of failures

How it works:
  1. Old Tab: Stores data with unique key
  2. Background: Creates new tab
  3. New Tab: Checks storage on load
  4. New Tab: Uses data, then deletes it
```

**Data Structure:**
```json
{
  "pendingInjection": {
    "contextSummary": "IMPORTANT: Please name...[full context]",
    "versionedTitle": "Spring Boot – Part 2",
    "originalTitle": "Spring Boot – Part 1",
    "timestamp": 1704567890000
  }
}
```

**Lifecycle:**
```
T0: User clicks Lite Mode
    chrome.storage.local.set({pendingInjection: {...}})
    Storage: 1 entry

T1: New tab opens, page loads
    chrome.storage.local.get('pendingInjection')
    Storage: 1 entry (read)

T2: Context injected successfully
    chrome.storage.local.remove('pendingInjection')
    Storage: 0 entries (cleaned)

Cleanup:
  - If injection succeeds: Immediate removal
  - If injection fails: Timeout after 5 minutes
  - Background worker: Periodic cleanup every hour
```

### Feature 6: Settings Persistence

**Purpose**: Remember user preferences across sessions

**Settings:**
```
1. Message Count (default: 8, range: 2-50)
   - Stored: chrome.storage.local.messageCount
   - Used: When extracting messages
   - UI: Popup number input

2. Chat Title Index (dynamic)
   - Stored: chrome.storage.local.chatTitleIndex
   - Used: Title versioning
   - UI: View-only in popup

3. Pending Injection (temporary)
   - Stored: chrome.storage.local.pendingInjection
   - Used: Cross-tab communication
   - UI: Not visible
```

**Persistence Flow:**
```
User opens popup
  ↓
Load settings:
  chrome.storage.local.get('messageCount')
  Result: 8
  Display in input field
  ↓
User changes to 12
  ↓
Input onChange event
  ↓
Save immediately:
  chrome.storage.local.set({messageCount: 12})
  ↓
Show "Settings saved!" notification
  ↓
User closes popup
  ↓
Next time: Opens popup → Shows 12 (persisted)
  ↓
Activate Lite Mode → Extracts 12 messages (uses saved value)
```

---

## 6. Visual Elements Guide

### Color Palette

**Primary Colors:**
```
Purple Gradient:
  Start: #667eea (RGB: 102, 126, 234) - Soft Purple
  End: #764ba2 (RGB: 118, 75, 162) - Deep Purple
  Usage: Buttons, backgrounds, branding

White:
  Pure: #ffffff (RGB: 255, 255, 255)
  Usage: Text on colored backgrounds, card backgrounds

Text Colors:
  Primary: #333333 (Dark Gray) - Main content
  Secondary: #666666 (Medium Gray) - Supporting text
  Disabled: #999999 (Light Gray) - Inactive elements
```

**Status Colors:**
```
Success:
  Background: #e6f4ea (Light Green)
  Text: #1e8e3e (Dark Green)
  Border: #1e8e3e

Error:
  Background: #fce8e6 (Light Red)
  Text: #c5221f (Dark Red)
  Border: #c5221f

Info:
  Background: #e8f0fe (Light Blue)
  Text: #1967d2 (Dark Blue)
  Border: #1967d2
```

### Typography

**Font Stack:**
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Reasoning:
  - System fonts for native feel
  - Fallbacks for cross-platform compatibility
  - No web font loading (faster)
```

**Font Sizes:**
```
Heading 1: 24px (Popup title)
Heading 2: 18px (Section headers)
Body: 14px (Main content, buttons)
Caption: 12px (Taglines, labels)
Small: 11px (Footer, version info)
```

**Font Weights:**
```
Light: 300 (Taglines)
Regular: 400 (Body text)
Semibold: 600 (Buttons, emphasis)
Bold: 700 (Headings)
```

### Icons & Emojis

**Lightning Bolt: ⚡**
```
Usage:
  - Floating button
  - Popup header
  - Brand identity

Meaning:
  - Speed (performance improvement)
  - Power (capability)
  - Action (activate now)

Size:
  - Floating button: 16px
  - Popup header: 24px
  - Icon files: 16px, 48px, 128px
```

**Extension Icon:**
```
Design:
  - Base: Purple gradient square
  - Content: White lightning bolt centered
  - Style: Flat, modern, minimal

Sizes:
  - 16x16: Toolbar (small)
  - 48x48: Extensions page (medium)
  - 128x128: Chrome Web Store (large)

Visual:
  ┌──────────┐
  │ ╱╲       │  Purple gradient background
  │╱  ╲      │  White lightning bolt
  │    ╲╱    │  Centered, bold
  └──────────┘
```

### Spacing & Layout

**Spacing Scale:**
```
4px: Micro (icon-text gap)
8px: Small (form field spacing)
12px: Medium (section spacing)
16px: Large (card padding)
20px: XLarge (page padding)
24px: XXLarge (component separation)
```

**Layout Grid:**
```
Popup:
  Width: 320px (fixed)
  Padding: 20px
  Content width: 280px
  Gutter: 16px between sections

Floating Button:
  Position: Fixed
  Bottom: 24px
  Right: 24px
  Size: Auto x 44px

Notifications:
  Position: Fixed
  Top: 24px
  Right: 24px
  Min-width: 280px
  Max-width: 400px
```

### Shadows & Elevation

**Depth Levels:**
```
Level 1 (Floating Button):
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4)
  Effect: Subtle purple glow

Level 2 (Button Hover):
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5)
  Effect: Elevated glow

Level 3 (Notifications):
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
  Effect: Pronounced elevation

Level 4 (Popup):
  box-shadow: None (Chrome default)
  Effect: Native appearance
```

### Animations

**Transitions:**
```
Floating Button:
  Property: transform, box-shadow
  Duration: 0.3s
  Easing: ease
  Effect: Smooth lift on hover

Notification:
  Entry: slideIn 0.3s ease
    From: translateX(400px), opacity 0
    To: translateX(0), opacity 1
  Exit: fadeOut 0.3s ease

Button Press:
  Property: transform
  Duration: 0.1s
  Easing: ease-in-out
  Effect: Quick press-release
```

### Illustrations Needed

**1. Hero Image: Problem & Solution**
```
Left Side (Problem):
  - ChatGPT window with many messages
  - Visual indicators of lag:
    - Loading spinner
    - Frozen cursor
    - "Slow" badge
  - Frustrated user (stick figure or emoji)
  - Red/orange warning colors

Right Side (Solution):
  - Clean ChatGPT window
  - Lightning bolt transition effect
  - Smooth, fast indicators:
    - Speed lines
    - "Fast" badge
  - Happy user
  - Green/purple success colors

Center:
  - Large lightning bolt (⚡) as divider
  - Arrow showing transformation
```

**2. Feature Showcase: Floating Button**
```
ChatGPT page mockup:
  - Simplified chat interface
  - 5-6 message bubbles
  - Bottom-right corner highlighted
  - Purple floating button with ⚡
  - Callout arrow: "Click here when slow"
  - Glow effect around button
```

**3. Flow Diagram: How It Works**
```
4-step visual process:

Step 1: "Click ⚡ Lite Mode"
  - Cursor clicking button
  - Button highlighted

Step 2: "Context Extracted"
  - Messages being "scanned" (selection highlight)
  - Data flowing upward
  - "8 messages" label

Step 3: "New Tab Opens"
  - New Chrome tab appearing
  - ChatGPT logo
  - Loading indicator

Step 4: "Continue Conversation"
  - Context in textarea
  - User typing
  - Smooth experience icon
```

**4. Settings Interface**
```
Popup mockup:
  - Full popup screenshot
  - Annotations:
    - "Main trigger" → pointing to button
    - "Adjust messages" → pointing to input
    - "Track versions" → pointing to versions button
  - Clean, professional style
```

**5. Title Versioning Example**
```
Timeline visualization:

Chat 1: "Spring Boot Tutorial"
  ↓ (Lite Mode)
Chat 2: "Spring Boot Tutorial – Part 1"
  ↓ (Lite Mode)
Chat 3: "Spring Boot Tutorial – Part 2"
  ↓ (Lite Mode)
Chat 4: "Spring Boot Tutorial – Part 3"

Visual: Connected boxes with arrows
Color: Progressive purple shades
Labels: Clear version numbers
```

**6. Before/After Comparison**
```
Before (Without LiteChatGPT):
  - Long chat (50+ messages)
  - Performance metrics:
    - Typing delay: 2-3 seconds
    - Scroll lag: Choppy
    - Memory: 500MB
  - Manual context copy-paste
  - Lost conversation thread

After (With LiteChatGPT):
  - Fresh chat with context
  - Performance metrics:
    - Typing delay: Instant
    - Scroll lag: Smooth
    - Memory: 150MB
  - Automatic context injection
  - Tracked conversation (Part 2)
```

**7. Architecture Diagram**
```
Simplified technical flow:
  - Old Chat (tab icon)
  - Extension (purple box with ⚡)
  - Storage (database icon)
  - New Chat (tab icon)
  - Arrows showing data flow
  - Labels: "Extract", "Store", "Inject"
  - Color-coded by component type
```

**8. Use Case Scenarios**
```
3 scenario cards:

1. Student Learning:
  - Character: Student at computer
  - Context: "Studying React Hooks"
  - Problem: Chat slow after 2 hours
  - Solution: Lite Mode → Fresh start
  - Outcome: Continued learning seamlessly

2. Developer Coding:
  - Character: Developer with code
  - Context: "Debugging Spring Boot app"
  - Problem: Browser freezing
  - Solution: Lite Mode → New session
  - Outcome: Kept debug context

3. Knowledge Worker:
  - Character: Professional writing
  - Context: "Research project"
  - Problem: Lag during note-taking
  - Solution: Lite Mode → Part 3
  - Outcome: Organized research flow
```

---

## Summary for Illustration Generation

**Key Visual Themes:**
1. **Speed & Performance**: Lightning bolt, speed lines, smooth vs choppy
2. **Continuity**: Connected parts, timeline, version numbering
3. **Simplicity**: Clean UI, minimal design, clear actions
4. **Purple Brand**: Gradient backgrounds, consistent color scheme
5. **User-Friendly**: Happy users, clear benefits, easy steps

**Illustration Style Recommendations:**
- Modern, flat design
- Purple and white color scheme
- Clear icons and symbols
- Annotated screenshots where helpful
- Flowcharts for processes
- Before/after comparisons
- Step-by-step visual guides

**Dimensions:**
- Hero image: 1200x630px (social media friendly)
- Feature showcase: 800x600px
- Flow diagrams: 1000x400px (wide format)
- Icons: 128x128px (scalable)
- Screenshots: Actual size with annotations

This documentation provides all necessary details for creating comprehensive illustrations for the LiteChatGPT README and promotional materials.
