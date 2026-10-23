# Zoffice Development Roadmap

This roadmap outlines the planned phases for building Zoffice into a full-featured, offline-first open-source desktop office suite.

---

## Phase Overview

- [x] **Phase 0 — Monorepo, Shell & Core Foundations** _(Completed)_
- [ ] **Phase 1 — ZWriter Core Document Engine (.docx reading & writing)**
- [ ] **Phase 2 — ZSheets Core Spreadsheet Engine (.xlsx calculation & grid)**
- [ ] **Phase 3 — ZSlides Core Presentation Engine (.pptx renderer & slide deck)**
- [ ] **Phase 4 — Advanced Formatting, Tables, Charts & Drawing Tools**
- [ ] **Phase 5 — Offline Collaboration, Export & Extensibility**
- [ ] **Phase 6 — Extended Suite Applications (ZNotes, ZMail, ZCalendar, ZForms, ZDraw)**

---

## Phase 0: Monorepo, Shell & Core Foundations

**Status:** Completed ✅

### Deliverables Completed:

1. **Monorepo & Tooling**:
   - `pnpm` workspaces monorepo architecture (`apps/desktop`, `@zoffice/core`, `@zoffice/ui`, `@zoffice/writer`, `@zoffice/sheets`, `@zoffice/slides`).
   - ESLint v9 flat config with zero errors and zero warnings.
   - Prettier formatting with Tailwind plugin.
   - Vitest test runners configured across packages.
   - Playwright end-to-end testing setup with automated Electron smoke tests.
   - GitHub Actions CI workflow for Linux, Windows, and macOS.
2. **Security & Electron Foundation**:
   - Sandboxed BrowserWindow (`sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`).
   - Validated IPC bridge exposing strictly whitelisted channels.
   - Strict Content-Security-Policy headers and navigation blockers.
   - Allowed file extension validation (`.docx`, `.xlsx`, `.pptx`, `.odt`, `.ods`, `.txt`, `.md`, `.csv`, `.html`, `.rtf`).
3. **Zoffice Start Screen & Multi-Document Shell**:
   - Modern Office 365 style Start Screen with app launch tiles, "Open File", and templates placeholder.
   - SQLite backed persistent recent files list (`better-sqlite3`).
   - Multi-document tabbed shell with drag-to-reorder, dirty state tracking, and close confirmation.
4. **Shared UI & Data-Driven Ribbon**:
   - Declarative data-driven Ribbon component with tabs, groups, large/small buttons, dropdowns, and toggles.
   - Quick Access Toolbar (Save, Undo, Redo, Theme Switcher).
   - Collapsible ribbon toolbar.
   - Bottom status bar with word count, page count, and interactive zoom slider.
   - Light and dark themes with persistent storage and system theme syncing.
   - Bundled open fonts (`Inter`, `Carlito`) and Lucide icons (100% offline).
5. **Core Services**:
   - Dot-notation i18n localization engine with variable interpolation.
   - Centralized keyboard shortcut registry (Ctrl+S, Ctrl+O, Ctrl+N, Ctrl+W, Ctrl+Z, Ctrl+Y).
   - Undo/redo history stack with configurable snapshot depth.
   - 30-second periodic autosave and crash recovery prompt on startup.
6. **Documentation & Standards**:
   - [AGENTS.md](../AGENTS.md) — strict non-negotiable standards.
   - [README.md](../README.md) & [ARCHITECTURE.md](ARCHITECTURE.md).
   - Issue and Pull Request templates.

### Phase 0 Verified (E2E & Security Testing)

- **Verification Date:** October 23, 2026
- **Test Suite Results:**
  - Vitest Unit Tests: 7 passed files, 22 passed tests.
  - Playwright Electron Smoke Tests: 6 passed tests (15.1s).
  - ESLint & Prettier: 0 errors, 0 warnings.
  - Packaged App: `Zoffice.exe` unpacked build verified and opens successfully.
- **Evidence Verified:**
  - Automated Start Screen screenshot captured to `docs/screenshots/start-screen.png`.
  - `better-sqlite3` native module loads in Electron main process; verified persistent storage of recent files across cold app restarts.
  - Multi-app tab switching (ZWriter, ZSheets, ZSlides), dirty-state confirmation dialog on close, and HTML5 drag reordering.
  - QuickAccessToolbar theme toggle switches between light and dark modes and persists state.
  - Runtime offline verification confirmed 0 external network requests (fonts and icons bundled locally).
  - Security configuration verified: `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`, strict CSP headers and meta tag, blocked `window.open` and unexpected navigation, and whitelist-only typed preload bridge.
- **Known Limitations:**
  - Document editors in ZWriter, ZSheets, and ZSlides currently use simplified placeholder views pending their respective engine phases (TipTap/Canvas).
  - Templates on the Start Screen are informational placeholders slated for Phase 1.
  - Windows code-signing is disabled (`signAndEditExecutable: false`) for local unpacked developer builds.

---

## Phase 1: ZWriter Core Document Engine

**Status:** In Progress ⏳ (Milestone 1A Completed & Verified ✅)

### Milestone 1A: Editor Core, Home Ribbon, Layout & DOCX Roundtrip

- **Status:** Completed & Verified ✅ (October 23, 2026)
- **Deliverables:**
  - **TipTap/ProseMirror Schema**: Rich character formatting (bold, italic, underline, strike, sub/super, font colors, highlights, clear formatting), typography (Inter, Carlito, system fonts), font size scale (10–36pt, A+/A-).
  - **Paragraph Controls**: Bullets, numbering, text alignment (left, center, right, justify), custom line spacing extension (1.0, 1.15, 1.5, 2.0).
  - **Home Ribbon**: Full ribbon layout with Clipboard (Cut, Copy, Paste, Format Painter state machine), Font styling, Paragraph controls, Styles gallery (Normal, H1–H3, Quote, Code), and Find & Replace modal with regex and case-sensitive options.
  - **Paper-Style Page Layout**: Authentic drop-shadow paper rendering (`PaperCanvas.jsx`), A4 & Letter presets, standard margins, zoom scaling (50%–200%), page budgeting, and visual dashed page breaks (`Ctrl+Enter`).
  - **DOCX Roundtrip Engine**: Native OOXML reading via `mammoth` and writing via `docx` without external servers; sandboxed binary base64 IPC transfer; verified with test fixtures in `/test-fixtures`.
  - **Status Bar Metrics**: Real-time word count, character count, page count, and zoom control.
  - **Playwright E2E & Unit Test Coverage**: End-to-end verification of document typing, styling, status bar updates, docx saving, and screenshot capture (`docs/screenshots/zwriter-editor.png`).

### Milestone 1B: Insert, Layout, Review, References, View & PDF/Print

- **Status:** Pending Review & Approval 🎯
- **Planned Scope:**
  - Insert Tab: Tables, image embed/resize, hyperlinks, headers/footers, math equations.
  - Layout Tab: Portrait/landscape orientation, multi-column layouts, custom margins.
  - Review Tab: Native spellcheck, comment bubbles, track changes (insertions/deletions, accept/reject).
  - References Tab: Table of contents generation, footnotes, citations.
  - View Tab: Print layout, Web layout, Read mode, Outline navigation.
  - PDF & Print: High-fidelity export via `printToPDF` and native system print dialog.

---

## Phase 2: ZSheets Core Spreadsheet Engine

**Status:** Backlog

### Goals:

1. High-performance canvas/DOM virtualized grid capable of handling 100,000+ rows smoothly.
2. Fast calculation engine supporting 200+ standard Excel functions (`SUM`, `AVERAGE`, `VLOOKUP`, `INDEX`, `MATCH`, `IF`, `XLOOKUP`).
3. Native `.xlsx` read/write via OOXML zip parsing.
4. Cell formatting (Currency, Percent, Dates, Decimals).
5. Sorting, filtering, and formula error handling (`#DIV/0!`, `#N/A`, `#REF!`).

---

## Phase 3: ZSlides Core Presentation Engine

**Status:** Backlog

### Goals:

1. Presentation canvas with vector shapes, text frames, and images.
2. Native `.pptx` reading and writing.
3. Slide master layouts and color palettes.
4. Slide sorter, reordering, duplicate, and delete.
5. Fullscreen presentation view with presenter notes support.
