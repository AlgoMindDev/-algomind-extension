# Chrome Web Store Rejection-Proof Submission Guide

Copy-paste these exact text fields into your **Chrome Developer Console** listing to pass Google Web Store Review smoothly on your first submission.

---

## 1. Basic Information (Store Listing Tab)

### Item Name / Title
AlgoMind - DSA Revision Tracker

### Summary (Short Description - max 132 chars)
Automatically track solved coding problems and schedule spaced repetition revisions to master Data Structures & Algorithms.

### Category
- Primary Category: Developer Tools
- Secondary Category: Productivity

### Support Information
- Support Email: algomind.help@gmail.com
- Support Website: https://algominddev.vercel.app/support

---

## 2. Detailed Description (Store Listing Tab)

AlgoMind is an AI-powered DSA revision companion and spaced repetition tracker designed for developers, computer science students, and software engineers preparing for coding interviews.

Never forget a problem you solved weeks ago! AlgoMind seamlessly bridges your coding practice across top competitive programming platforms with active recall memory science.

🚀 KEY FEATURES:

1. Automatic Problem Detection
AlgoMind automatically detects problem titles, difficulty levels (Easy, Medium, Hard), problem tags, and accepted code submissions from your favorite coding platforms.

2. Multi-Platform Support
Works seamlessly across:
• LeetCode (leetcode.com)
• GeeksforGeeks (geeksforgeeks.org)
• Codeforces (codeforces.com)
• AtCoder (atcoder.jp)
• CodeChef (codechef.com)
• HackerRank (hackerrank.com)

3. Spaced Repetition Engine
Calculates optimal revision intervals based on your active recall performance, confidence score, and problem difficulty. Never waste time re-solving easy problems or forgetting complex pattern logic.

4. Real-Time Cloud Sync
Syncs your solved problems, revision queue, and study streaks directly to your personal AlgoMind Web Dashboard.

5. Daily Revision Reminders
Uses background Chrome alarm notifications to remind you when key problem patterns are due for revision before memory decay sets in.

PRIVACY & SECURITY:
• AlgoMind only runs on supported coding platform domain pages.
• Your code submissions and notes are stored securely and synced only to your authenticated AlgoMind dashboard account.
• No tracking, telemetry, or third-party ad networks.

Master coding interview patterns efficiently with AlgoMind!

---

## 3. Privacy & Single Purpose (Privacy Tab)

### Single Purpose Description
The single purpose of AlgoMind is to detect accepted DSA problem submissions on supported coding websites and schedule spaced repetition revision reminders to help developers retain coding patterns.

---

## 4. Permission Justifications (Privacy Tab)

- storage: Required to save user revision queues, settings, authentication tokens, and cached motivational quotes locally in browser storage.
- notifications: Required to trigger Chrome system notifications reminding users when scheduled problem revisions are due for active recall.
- alarms: Required to schedule background periodic checks to calculate due revision items and trigger daily study reminders.
- activeTab / tabs: Required to inspect the current active browser tab URL to check if the user is on a supported coding problem page (e.g. LeetCode, GFG).
- host_permissions: Required to inject content scripts into supported coding platforms (LeetCode, GFG, Codeforces, AtCoder, CodeChef, HackerRank) to capture problem metadata upon accepted code submissions, and to communicate with the AlgoMind API backend.
