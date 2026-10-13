<h1 align="center">Team Pulse</h1>

<p align="center">
  The lightweight original of the YLY evaluation suite — a bilingual (English / العربية) team-performance tracker built with React, Vite and TypeScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Excel%20export-217346?style=for-the-badge&logo=microsoftexcel&logoColor=white" alt="Excel export" />
</p>

## About

Team Pulse is a small single-page dashboard for a team lead: add members, log evaluations against them, and watch each
member's points and 0–10 performance rate update instantly. Everything runs in the browser — data is persisted in
`localStorage`, and the whole team's evaluation history can be exported as an `.xlsx` sheet or handed off over WhatsApp.
The code follows a tiny Clean Architecture split (domain → data → presentation) and ships a full Arabic translation with
automatic RTL layout.

> Looking for the committee-specific, offline-first PWAs? See the Next.js siblings:
> [YLY-web-HR](https://github.com/youssef336/YLY-web-HR) · [YLY-web-PR](https://github.com/youssef336/YLY-web-PR) ·
> [YLY-web-or](https://github.com/youssef336/YLY-web-or) · [YLY-web-sm](https://github.com/youssef336/YLY-web-sm)

## ✨ Features

- 👥 **Team overview** — member cards with avatar, points and a colour-coded performance rate, plus "active this month", team-average and total-points metrics.
- ➕ **Add members** from a modal; members can be removed (soft-deleted, so they disappear from the dashboard and exports).
- 📝 **Evaluations** per member with an action status (`Completed`, `Excuse`, `Else`), title, details, point change and task date.
- ✏️ **Edit & undo** — every saved evaluation is listed in the member's transaction history and can be edited or removed.
- 📊 **Performance rate** — `clamp(round(5 + totalPoints / 4), 0, 10)`, computed in the domain layer.
- 📤 **Excel export** — one row per evaluation (member, role, rate, total points, date, status, type, title…) generated client-side with SheetJS.
- 💬 **WhatsApp hand-off** — downloads the evaluation sheet and opens a pre-filled `wa.me` chat to attach it.
- 🌍 **English / Arabic** UI with `dir="rtl"` switching; the language choice is remembered.
- 💾 **No backend** — all data lives in the browser's `localStorage`, seeded with sample members on first run.

## 🛠 Tech stack

| Concern | Choice |
| --- | --- |
| UI | React (function components + hooks) |
| Language | TypeScript |
| Build tool | Vite (`@vitejs/plugin-react`) |
| Spreadsheet | [`xlsx`](https://www.npmjs.com/package/xlsx) (SheetJS) |
| Persistence | `localStorage` behind a repository interface |
| i18n | Hand-rolled typed dictionary (`en` / `ar`) |

## 🏗 Architecture

```
src/
├── domain/
│   ├── entities.ts           # Member, Activity, ActionStatus
│   ├── repositories.ts       # MemberRepository interface
│   └── useCases.ts           # TeamUseCases, totalPoints, performanceRate
├── data/
│   └── memberRepository.ts   # LocalMemberRepository (localStorage + seed data)
├── presentation/
│   ├── App.tsx               # dashboard, member profile, modals, export
│   ├── i18n.ts               # English + Arabic messages
│   └── styles.css
└── main.tsx
```

The presentation layer only talks to `TeamUseCases`, which depends on the `MemberRepository` interface — swapping
`localStorage` for a real API means writing one new repository class.

## 🚀 Getting started

Prerequisites: Node.js 18+.

```bash
npm install
npm run dev       # start the Vite dev server
npm run build     # type-check (tsc -b) and build for production
npm run preview   # preview the production build
```

No environment variables are required.

## 👤 Author

**Youssef Belal Zakaria** · [GitHub @youssef336](https://github.com/youssef336)

⭐ If you like this project, give it a star!
