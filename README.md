# AlgoMind - AI-Powered DSA Revision System

AlgoMind is a production-ready Chrome Extension + Full Stack Web Application that helps developers retain coding patterns and actually remember solved data structures and algorithms (DSA) problems. It schedules revision sessions automatically using spaced repetition, tracks problem submissions across multiple coding platforms, and provides extensive dashboard analytics.

## Core Features
1. **Auto-Detection**: Automatically detects problem names, difficulties, and URLs from supported platforms (LeetCode, GFG, Codeforces, AtCoder, CodeChef, HackerRank).
2. **Accepted Submissions**: Captures successful code submissions and logs them to the database.
3. **Spaced Repetition Engine**: Calculates next revision dates based on active recall, memory scores, and confidence level.
4. **Learning Dashboard**: A detailed React dashboard with streaks, memory heatmaps, progress analytics, and AI recommendations.
5. **Gamification**: XP points, badges, and streaks to motivate consistent revision.

## Tech Stack
*   **Backend**: Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication.
*   **Frontend**: React (Vite), Tailwind CSS, Recharts.
*   **Chrome Extension**: Manifest V3, Chrome Storage & Notifications API, Content scripts, Background service worker.

## Project Structure
```
AlgoMind/
├── backend/            # Express REST API
│   ├── src/
│   │   ├── config/     # Database and configuration
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/ # Auth & error middleware
│   │   ├── models/     # Mongoose Schemas
│   │   ├── routes/     # Express route handlers
│   │   ├── app.js      # App middleware setup
│   │   └── server.js   # Main execution entry
│   └── package.json
│
├── frontend/           # React Web Application
│   ├── src/
│   │   ├── assets/     # Static visual assets
│   │   ├── components/ # Reusable React UI elements
│   │   ├── context/    # Global state (Auth, Theme)
│   │   ├── pages/      # Pages (Dashboard, History, etc.)
│   │   ├── App.jsx     # App component and routing
│   │   ├── index.css   # Main CSS & Tailwind imports
│   │   └── main.jsx    # DOM mounting entry
│   ├── package.json
│   └── tailwind.config.js
│
└── extension/          # Manifest V3 Chrome Extension
    ├── popup/          # HTML, JS, CSS for browser action popup
    ├── background.js   # Extension service worker (handles tab events, storage, API sync)
    ├── content.js      # Content scripts injected into coding sites to scrape metadata
    └── manifest.json   # Extension configuration manifest
```
