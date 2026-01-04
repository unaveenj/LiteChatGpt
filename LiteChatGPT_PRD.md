# 📘 Product Requirements Document (PRD)

## Product Name
# **LiteChatGPT**

### Slogan
**Making your ChatGPT sessions lighter and smoother**

---

## 1. Problem Statement

Power users of the ChatGPT web application frequently experience **lag, browser freezes, and degraded performance** when chat sessions become long.

This typically occurs during:
- Learning and study sessions
- Coding and debugging workflows
- Deep exploratory conversations
- Long note-taking interactions

Currently, users have **no way to reduce chat heaviness** without losing valuable context or manually starting over.

---

## 2. Product Goal

LiteChatGPT provides a **user-triggered Lite Mode** that allows users to:

- Instantly recover performance when a chat becomes laggy
- Preserve learning and conversation context
- Continue seamlessly in a fresh chat session
- Avoid fragile or unsafe manipulation of ChatGPT internals

---

## 3. Target Users

- Students using ChatGPT as a study companion
- Developers using ChatGPT for coding and debugging
- Knowledge workers with long reasoning sessions
- Power users experiencing browser slowdowns on long chats

---

## 4. Core User Experience

### Primary Flow (Recommended)

1. User notices the chat becoming slow or laggy  
2. User clicks **⚡ Lite Mode**  
3. LiteChatGPT extracts recent context  
4. A new ChatGPT chat session is opened  
5. Context is injected into the new chat  
6. Chat title is automatically versioned:  
   `<Original Chat Title> – Part X`  
7. User continues smoothly in a fast, clean session  

---

## 5. Key Features

### 5.1 User-Triggered Lite Mode

- Lite Mode activates only when explicitly triggered by the user
- No automatic triggers based on message count

Trigger options:
- Floating action button: `⚡ Lite Mode`
- Extension popup button
- Optional right-click context menu

---

### 5.2 Context Extraction

Design principles:
- Read-only DOM access
- No modification of ChatGPT internal state

Extracted content:
- Last N messages (default: 8, configurable)
- User questions
- Assistant responses
- Code blocks
- Bullet points and headings

Out of scope:
- Message deletion
- DOM mutation
- React state manipulation

---

### 5.3 Context Injection Template

```
Context from previous chat:
Source: <Original Chat Title>

Summary:
• Main topic:
• Concepts covered:
• Open questions / next steps:

Continue from here.
```

---

### 5.4 New Chat Creation

- Open a fresh ChatGPT chat session
- Inject extracted context immediately
- Ensure performance improvement

---

## 6. Chat Title Versioning (Critical Requirement)

### Title Format

`<Original Chat Title> – Part X`

### Version Logic

- If title ends with `– Part N`, increment to `N+1`
- If no suffix exists, start with `Part 1`

Examples:
- Spring Boot Observability → Spring Boot Observability – Part 1
- Kafka Learning – Part 1 → Kafka Learning – Part 2

Edge cases:
- Manual title edits reset numbering
- Increment only on new chat creation with injection
- Never truncate titles

---

### Storage

Uses `chrome.storage.local`:

```
{
  "chatTitleIndex": {
    "Spring Boot Observability": 2,
    "Kafka Learning": 1
  }
}
```

---

## 7. Optional Feature: Lite View (v2)

- Collapse older messages visually
- CSS-only implementation
- No message deletion

---

## 8. Non-Goals

LiteChatGPT must NOT:
- Modify ChatGPT React internals
- Permanently remove messages
- Intercept infinite scrolling
- Auto-trigger without user intent

---

## 9. Performance & Safety Principles

- Explicit user action only
- No continuous observers
- Fail gracefully on selector changes

---

## 10. Required Chrome Permissions

```
{
  "permissions": ["activeTab", "storage", "scripting"],
  "host_permissions": ["https://chatgpt.com/*"]
}
```

---

## 11. UX Copy

Primary button:
`⚡ Enter Lite Mode`

Confirmation dialog:
```
This chat is getting heavy.

Choose how you want to proceed:
• Continue in a fresh chat (recommended)
• Archive only
• Stay in Lite View
```

---

## 12. Success Metrics

- Reduced browser lag and freezes
- Faster scrolling and typing
- High usage of fresh-chat continuation
- Positive power-user feedback

---

## 13. Future Enhancements

- Auto summarization
- Obsidian / Notion export
- Resume map across Part X sessions
- Topic auto-tagging
- Memory usage insights

---

## 14. Product Philosophy

**LiteChatGPT doesn’t fight ChatGPT.  
It makes long conversations lighter, smoother, and easier to continue.**
