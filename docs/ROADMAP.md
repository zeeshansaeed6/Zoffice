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

---

## Phase 1: ZWriter Core Document Engine

**Status:** Ready to start 🎯

### Goals:

1. **Document Model & Rendering**:
   - Integration of a robust rich-text document model (ProseMirror / TipTap) with standard paragraph styles, headings, lists, and character formatting.
2. **Native `.docx` Parser & Serializer**:
   - Full OOXML parser to open `.docx` files without third-party web servers.
   - Round-trip fidelity preserving paragraphs, fonts, colors, and margins.
3. **Page Layout Engine**:
   - Accurate page budgeting, page breaks, margins (Letter, A4), headers and footers.
4. **Find & Replace**:
   - In-document search, replace, and case-sensitive matching.
5. **Print & PDF Export**:
   - High-fidelity PDF export and native OS print dialog integration.

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
