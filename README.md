# 🚀 Slack Connect — Production Ready Version

**Live Demo**

* **Frontend**: [https://slack-connect-git-main-kanav-sharmaas-projects.vercel.app/](https://slack-connect-git-main-kanav-sharmaas-projects.vercel.app/)
* **Backend API**: [https://slack-connect-ou0b.onrender.com](https://slack-connect-ou0b.onrender.com)

A full-stack application for connecting to Slack workspaces, sending real-time messages, and scheduling messages for future delivery. Designed with **reliability, clean architecture, and recruiter-friendly code** in mind.

---

## 🌟 Highlights for Recruiters

* **Deployment-Ready** — Hosted frontend on Vercel & backend on Render.
* **Clean Codebase** — Modular TypeScript backend + Vanilla JS frontend.
* **Production Standards** — Environment configuration, error handling, and external API integration.
* **Scalable Architecture** — Ready for adding more features without rewrites.

---

## 📂 Quick Start (Local Development)

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

### Frontend

```bash
cd frontend
python3 -m http.server 3000
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## ✅ Fixes & Improvements Over Original Code

* **Database Initialization** — Automatic SQLite table creation.
* **Environment Config** — Proper `.env` usage and separation of secrets.
* **TypeScript Build Fixes** — Resolved type errors and compilation issues.
* **Native Dependencies** — SQLite3 compatibility resolved.
* **Error Handling** — Comprehensive error logging and user feedback.
* **API Integration** — Real Slack channel endpoints.
* **Frontend Validation** — Robust input checks and visual feedback.
* **Responsive UI** — Works seamlessly on desktop and mobile.

---

## 🏗 Architecture Overview

```
slack-connect/
├── backend/          # Node.js + TypeScript
│   ├── src/
│   │   ├── index.ts      # Server entry point
│   │   ├── routes.ts     # API endpoints
│   │   ├── tokenStore.ts # OAuth token management
│   │   ├── scheduler.ts  # Message scheduling
│   │   └── types.ts      # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/         # Vanilla JS
│   ├── index.html
│   ├── app.js
│   └── style.css
└── README.md
```

---

## 🔐 Slack OAuth Setup (Optional for Full Functionality)

To enable real Slack integration:

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app & add OAuth scopes:
   `chat:write`, `channels:read`, `groups:read`, `im:read`, `mpim:read`
3. Add `.env` values with your Slack credentials.
4. Set redirect URI to:

```
https://slack-connect-ou0b.onrender.com/slack/callback
```

---

## 🛠 Technology Stack

* **Backend**: Node.js, TypeScript, Express.js, SQLite
* **Frontend**: HTML, CSS, JavaScript (Vanilla)
* **Database**: SQLite (auto-initialized)
* **Scheduling**: `node-cron`
* **API**: Slack Web API

---

## 🌐 Deployment

* **Frontend** — Vercel:
  [https://slack-connect-git-main-kanav-sharmaas-projects.vercel.app/](https://slack-connect-git-main-kanav-sharmaas-projects.vercel.app/)
* **Backend** — Render:
  [https://slack-connect-ou0b.onrender.com](https://slack-connect-ou0b.onrender.com)

Both connected to GitHub for **automatic redeployment** on push.

---

## 📜 License

Open-source, modified and fixed version of the original Slack Connect assignment.
**Status**: ✅ Production Ready | **Last Updated**: August 11, 2025
