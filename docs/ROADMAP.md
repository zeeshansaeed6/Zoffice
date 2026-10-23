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

**Status:** In Progress ⏳ (Milestones 1A, 1A.5, & Insert Tab Completed & Verified ✅)

### Milestone 1A: Editor Core, Home Ribbon, Layout & DOCX Roundtrip

- **Status:** Completed & Verified ✅ (October 23, 2026)
- **Deliverables:**
  - **TipTap/ProseMirror Schema**: Rich character formatting, typography (`Inter`, `Carlito`), font size scale (10–36pt, A+/A-).
  - **Paragraph Controls**: Bullets, numbering, text alignment (left, center, right, justify), custom line spacing (1.0, 1.15, 1.5, 2.0).
  - **Home Ribbon**: Full ribbon layout with Clipboard, Font styling, Paragraph controls, Styles gallery, and Find & Replace modal with regex.
  - **Paper-Style Page Layout**: Authentic drop-shadow paper rendering (`PaperCanvas.jsx`), A4 & Letter presets, standard margins, zoom scaling (50%–200%), page budgeting, and visual dashed page breaks (`Ctrl+Enter`).
  - **DOCX Roundtrip Engine**: Sandboxed base64 IPC transfer, verified with test fixtures in `/test-fixtures`.
  - **Status Bar Metrics**: Real-time word count, character count, page count, and zoom control.
  - **Playwright E2E & Unit Test Coverage**: End-to-end verification and screenshot capture (`docs/screenshots/zwriter-editor.png`).

### Milestone 1A.5: DOCX Fidelity Hardening

- **Status:** Completed & Verified ✅ (October 23, 2026)
- **Deliverables:**
  - Direct OOXML engine with JSZip and XML parsing (`word/document.xml`, `styles.xml`, `numbering.xml`).
  - Style hierarchy resolution (`rPrDefault`, `pPrDefault`, `w:basedOn`) and multi-level list preservation.
  - Transparent preservation of unhandled OOXML parts and media.
  - Automated fidelity reporting CLI (`pnpm docx:report <file>`) and comprehensive test suite.

### Milestone 1B (Part 1): Insert Tab — Tables, Illustrations, Links, & Symbols

- **Status:** Completed & Verified ✅ (October 23, 2026)
- **Deliverables:**
  - **Insert Tab Ribbon**: Pages, Tables, Illustrations, Links, Text, and Symbols ribbon groups.
  - **Tables**: Interactive grid picker dialog (rows x cols up to 50x20), header row toggling, row/column insertion & deletion, cell merge/split, cell background shading.
  - **Illustrations**: Picture upload from computer (local base64) or web URL with alignment and custom width; horizontal divider rules.
  - **Links & Bookmarks**: Hyperlink creation and editing dialog; named in-document bookmark targets (`data-bookmark`).
  - **Text & Symbols**: Date & Time insertion (date, time, full formats); special character and symbol dialog (Typography, Math, Currency, Arrows, Greek).
  - **LaTeX Equations**: Inline equation rendering via bundled KaTeX with real-time live preview and formula template presets.
  - **Testing & Verification**: 5 new unit tests, Playwright Electron E2E test suite passing, zero ESLint errors/warnings, and screenshot captured (`docs/screenshots/zwriter-insert-tab.png`).

### Milestone 1B (Part 2): Layout, Review, References, View & PDF/Print

- **Status:** Next Up 🎯
- **Planned Scope:**
  - Layout Tab: Page setup (orientation, margins, multi-column layouts, breaks, line numbers).
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

---

## Phase 3: ZSlides Core Presentation Engine

**Status:** Completed & Verified ✅ (October 23, 2026)

### Deliverables:

1. **Layered Slide Canvas & Model** (`packages/slides/src/canvas` & `core`):
   - React + SVG + HTML DOM Overlay architecture ensuring crisp rendering, native contentEditable text, and lightweight performance.
   - Dual coordinate space resolution presets: 16:9 Widescreen (960×540) and 4:3 Standard (960×720).
   - 8-point interactive transform handles, drag repositioning, dynamic magnetic alignment guides with edge/center snapping.
2. **Text & Vector Shape Engine** (`packages/slides/src/elements`):
   - In-place text editing with formatting (bold, italic, underline, text alignment, font sizes).
   - Full vector shapes library: Rectangle, Rounded Rectangle, Ellipse, Triangle, Right Arrow, Left Arrow, 5-Point Star, Speech Bubble, and Line.
   - Arrange and alignment tools: Bring to Front, Send to Back, Align Center, Align Middle.
3. **Slide Layouts & Thumbnail Panel** (`packages/slides/src/thumbnails` & `dialogs`):
   - 7 standard slide layout presets: Title Slide, Title and Content, Section Header, Two Content, Comparison, Title Only, and Blank.
   - Real-time thumbnail panel supporting slide selection, addition, duplication, deletion, hiding, and drag-and-drop reordering.
4. **Slide Master & Themes Engine** (`packages/slides/src/core/theme-definitions.js`, `theme-engine.js`):
   - 12 curated offline themes (Modern Clean, Midnight Executive, Coral Sunrise, Emerald Forest, Slate Minimal, Royal Indigo, Nordic Frost, Sunset Glow, Corporate Navy, Amber Warmth, Cyber Neon, Rose Gold).
   - Theme Gallery dialog with live previews and seamless deck-wide color/font/background cascade.
5. **High-Fidelity .pptx I/O** (`packages/slides/src/pptx`):
   - Export to `.pptx` via PptxGenJS with accurate shape geometry, text runs, colors, and layout positioning.
   - Custom OOXML import parser (`pptx-parser.js` with JSZip and XML DOM) reading slide trees, shape paths, text blocks, and colors.
6. **Rich Media Elements** (`packages/slides/src/elements`):
   - Images with maintain-aspect scaling, custom illustrations, and placeholder support.
   - Editable slide tables with cell content editing and row/column structure.
   - Chart.js chart integration supporting Bar, Line, Pie, and Doughnut charts.
7. **Transitions & Slide Animations** (`packages/slides/src/animations`, `presenter`):
   - Slide transitions: Fade, Push, Wipe, Zoom, None with custom durations and "Apply to All" capability.
   - Element animation engine supporting Entrance (Fade In, Fly In, Zoom In), Emphasis (Pulse, Spin), and Exit (Fade Out, Fly Out).
   - Dedicated Animation Pane for managing order, trigger events (On Click, With Previous, After Previous), and live preview.
8. **Slide Show & Presenter View** (`packages/slides/src/presenter`):
   - Fullscreen Slide Show mode with animated transitions, keyboard navigation (Space, Arrows, PageUp/Down, Esc), laser pointer (`L`), and blackout mode (`B`).
   - Dual-screen Presenter View console with live presentation timer, current slide preview, next slide preview, and speaker notes.
9. **Export & Print Handouts** (`packages/slides/src/dialogs/ExportDialog.jsx`, `core/export-utils.js`):
   - Handouts print engine with print-ready CSS (`@media print`) supporting 1, 2, 3 (classic ruled conference lines for taking notes), 4, 6 slides per page, and speaker notes pages.
   - Standalone SVG slide export and direct `.pptx` download.
10. **Test Coverage & Zero Warnings**:
    - Comprehensive Vitest unit test suite (10 test suites, 46 tests passing in `@zoffice/slides`).
    - Zero ESLint errors or warnings across the monorepo.
