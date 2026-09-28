# Postform — AI LinkedIn Content Automation (Frontend)

A complete, production-quality **frontend** for an AI-powered LinkedIn content
automation platform. Everything here is real, working React/TypeScript — the
only thing that's mocked is the backend: there's no real LinkedIn OAuth, no
real AI API, no database. Every async action (AI generation, image
generation, publishing, scheduling) is a genuine `Promise` with realistic
latency and an occasional simulated failure, so every loading/success/error
state in the UI is real and exercised.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · React Router 7 ·
lucide-react · Recharts

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

Sign in with **any** email/password (or "Continue with Google") — auth is
mocked. Demo data (drafts, scheduled/published/failed posts, templates,
notifications, analytics) is generated once and then persisted to
`localStorage`, so refreshing the page won't reset your demo. Use the reset
instructions below if you want to start over.

**Reset the demo:** open your browser's dev tools → Application/Storage →
Local Storage → remove the `postform:*` keys (or run
`Object.keys(localStorage).filter(k => k.startsWith('postform:')).forEach(k => localStorage.removeItem(k))`
in the console), then refresh.

## Project structure

```text
src/
├── components/
│   ├── ui/          Button, Input, Modal, Toast, Dropdown, Tabs, etc.
│   ├── layout/       Sidebar, Header, DashboardLayout (+ mobile drawer)
│   ├── posts/        PostCard, PostPreview, StatusBadge, toolbar
│   ├── scheduler/    ScheduleModal, Calendar (month view)
│   ├── analytics/    StatsCard, ChartCard
│   ├── ai/           HashtagGenerator, ImageGenerator
│   └── icons/        Small custom marks (e.g. LinkedIn badge)
├── pages/            One file per route, plus Settings/ for nested tabs
├── context/          App state: Auth, Posts, LinkedIn, AISettings,
│                     Templates, Notifications, Analytics, Theme, Toast
├── services/         mockAI.ts, mockLinkedIn.ts, mockScheduler.ts,
│                     mockPosts.ts, storage.ts (localStorage), mockCore.ts
│                     (shared latency/failure simulation)
├── data/             Seed content bank, mock data generators, option lists
├── types/            Shared TypeScript types (map directly to a future
│                     backend schema)
├── utils/            id, formatting, validators, cn (classnames), mock
│                     image generator (dependency-free inline SVG)
└── routes/           ProtectedRoute
```

## Notable design decisions

- **AI images are generated as inline SVG data URIs** (`utils/mockImage.ts`),
  not fetched from a placeholder image service. This keeps "image
  generation" fully offline and deterministic per topic/style, and sidesteps
  the fact that a real image API isn't wired up yet.
- **State lives in React Context, persisted to `localStorage`** through a
  tiny wrapper (`services/storage.ts`). Every context that owns an array
  (`PostsContext`, `NotificationContext`, `TemplatesContext`) uses the
  *functional* `setState` form so that two mutations fired in the same event
  handler (e.g. "save my edits" immediately followed by "schedule this
  post") both apply correctly instead of one clobbering the other.
- **Routes are code-split** with `React.lazy` so the initial bundle only
  ships Landing + Login; the dashboard, create-post workspace, and charts
  (Recharts is the heaviest dependency) load on demand.
- **Strict TypeScript** (`strict: true`), no `any` anywhere in the app code.

## Swapping mocks for a real backend

Every mock service documents its intended real endpoint in a comment at the
top of the file:

| Mock function | Real endpoint |
|---|---|
| `mockAI.generatePostContent()` | `POST /api/ai/generate` |
| `mockAI.reviseContent()` | `POST /api/ai/revise` |
| `mockAI.generateHashtags()` | `POST /api/ai/hashtags` |
| `mockAI.generateImage()` | `POST /api/ai/image` |
| `mockLinkedIn.connectLinkedIn()` | LinkedIn OAuth + `POST /api/linkedin/connect` |
| `mockLinkedIn.publishPost()` | `POST /api/linkedin/posts` |
| `mockScheduler.scheduleJob()` | `POST /api/scheduler/jobs` (→ BullMQ) |
| `mockPosts.fetchPosts()` | `GET /api/posts` |

Because pages and components only ever talk to `PostsContext` /
`AISettingsContext` / etc. — never to `localStorage` or the mock services
directly — swapping a mock service's internals for a real `fetch` call (and
swapping a context's `localStorage` persistence for server state / React
Query / SWR) shouldn't require touching any page or component.

## What's intentionally not implemented

Per the brief: no real LinkedIn OAuth/API, no real AI text/image API, no
MongoDB/Redis/BullMQ/cron, no backend auth, no real file storage or
analytics API. Everything above is mocked but fully wired end-to-end with
loading, success, and error states.
