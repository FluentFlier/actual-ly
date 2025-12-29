# Actual.ly — Project Documentation

> "A social platform where every human is verified, every post is real, and everyone has an AI agent working for them."

---

## 📁 Files

| File | Description |
|------|-------------|
| `SPEC.md` | Complete product specification |
| `ISSUES.md` | GitHub issues breakdown (47 issues) |
| `create-issues.sh` | Script to create GitHub issues |
| `IMPLEMENTATION_PLAN.md` | Step-by-step implementation guide |

---

## 🚀 Quick Start

### 1. Create GitHub Repository

```bash
gh repo create actual-ly --public --description "Verified humans. Real posts. AI agents."
```

### 2. Create Issues

```bash
chmod +x create-issues.sh
./create-issues.sh
```

### 3. Start Building

Each issue is designed to be:
- **Atomic:** One focused task
- **Clear:** Explicit acceptance criteria
- **AI-friendly:** Can be solved by an AI coding agent

---

## 📊 Milestones

| Milestone | Issues | Focus |
|-----------|--------|-------|
| M1 | #1-6 | Project Setup |
| M2 | #7-14 | Identity Layer |
| M3 | #15-22 | Dashboard Core |
| M4 | #23-32 | Agent Core |
| M5 | #33-40 | Social Layer |
| M6 | #41-47 | Polish & Deploy |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          ACTUAL.LY                              │
├─────────────┬─────────────┬─────────────┬─────────────┬────────┤
│  IDENTITY   │   SOCIAL    │    AGENT    │  DASHBOARD  │INSIGHTS│
│             │             │             │             │        │
│ Phone Verify│ Feed        │ Chat        │ Control     │ Stats  │
│ Trust Score │ Posts       │ Actions     │ Settings    │ Trends │
│ Profiles    │ Connections │ Integratic  │ History     │ Health │
└─────────────┴─────────────┴─────────────┴─────────────┴────────┘
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind, shadcn/ui
- **Backend:** Next.js API Routes, Supabase
- **Auth:** Clerk (phone + email verification)
- **AI:** Cerebras API
- **Messaging:** Twilio
- **Deploy:** Vercel

---

## 🎯 MVP Focus

For the initial demo, prioritize:

1. ✅ Landing page with username claim
2. ✅ Phone + email verification (real)
3. ✅ Profile page
4. ✅ Dashboard with sidebar
5. ✅ Agent chat (web interface)
6. ✅ Link analysis + save
7. ✅ Basic feed

---

## 📝 How to Use with AI Coding Agent

Each issue in `ISSUES.md` is formatted to be:

1. **Copy-paste ready** — Give the issue to your AI agent
2. **Self-contained** — All context included
3. **Testable** — Clear acceptance criteria

Example workflow:

```
You: "Implement Issue #7: Create Landing Page"

AI: [Reads issue details, implements, tests]

You: [Review, merge, move to next issue]
```

---

## 🔗 Resources

- [Actual.ly Website](https://actual.ly)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cerebras Documentation](https://inference-docs.cerebras.ai)
- [Cerebras Documentation](https://inference-docs.cerebras.ai)

---

## 📅 Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Setup + Identity | Working auth, profiles |
| 2 | Dashboard + Agent | Chat interface, link analysis |
| 3 | Social | Feed, posts, connections |
| 4 | Polish | Animations, mobile, deploy |

---

Made for the Actual.ly internship application.
