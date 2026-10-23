# AGENTS.md — Non-Negotiable Rules for AI Agents and Contributors

These rules apply to **every** contribution — human or AI. Violating them is grounds
for rejecting a PR without further review.

---

## 1. Language

- **Plain JavaScript only** (ES2022+, ES modules). **No TypeScript anywhere.**
- Use **JSDoc** comments (`@param`, `@returns`, `@typedef`) for documentation and
  editor hints.
- React components use **`.jsx`** files.

## 2. Branding

- The suite is called **Zoffice**.
- Apps are named: **ZWriter, ZSheets, ZSlides** (future: ZNotes, ZMail, ZCalendar,
  ZForms, ZPlanner, ZDraw, ZBase, ZDrive).
- **Never** use Microsoft names, logos, icons, fonts (Calibri, Segoe) or copied assets.
- Use **Lucide** icons and open fonts (**Inter**, **Carlito**, **Liberation Sans**).
- **Never** claim affiliation with Microsoft.

## 3. Offline-First

- Everything works **fully offline**.
- **No accounts**, **no telemetry**, **no paywalls**.
- Fonts and icons must be **bundled**, not loaded from a CDN.

## 4. Code Quality

- **ESLint** (flat config) + **Prettier** — lint must pass with **zero errors and
  zero warnings**.
- Small files: **< 300 lines**.
- Clear folder structure, meaningful comments, no dead code.

## 5. Security

- Electron `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- A **preload script** exposing a minimal, validated IPC API.
  - Only whitelisted channels.
  - Argument types validated for every channel.
- Strict **Content-Security-Policy** — no remote code loading.
- Validate all file paths and allowed extensions on file operations.
- Block `window.open` and unexpected navigation in the main process.

## 6. Tech Stack

| Layer         | Technology                 |
| ------------- | -------------------------- |
| Framework     | Electron (latest stable)   |
| Build         | electron-vite, Vite        |
| UI            | React (JSX), Tailwind CSS  |
| State         | Zustand                    |
| Local storage | better-sqlite3             |
| Unit tests    | Vitest                     |
| E2E tests     | Playwright                 |
| Packaging     | electron-builder           |
| Pkg manager   | pnpm workspaces (monorepo) |

## 7. Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(writer): add paragraph formatting toolbar
fix(core): prevent autosave race condition
docs: update ARCHITECTURE.md with IPC diagram
chore: upgrade electron to v34
```
