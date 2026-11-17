# Zoffice Design System Specification

**Version:** 1.0.0  
**Status:** Approved & Unified  
**Scope:** All 10 Zoffice Applications (ZWriter, ZSheets, ZSlides, ZNotes, ZMail/ZCalendar, ZForms, ZPlanner, ZDraw, ZBase, ZDrive)

---

## 1. Design Philosophy & Principles

Zoffice is an offline-first, private, open-source productivity suite built for desktop environments. The design system is engineered around four guiding tenets:

1. **Independent Visual Identity**: Zero Microsoft naming, branding, logos, copied assets, or fonts (such as Calibri, Segoe UI). Zoffice uses open typography (**Inter**, **Carlito**, **Liberation Sans**) and curated Lucide iconography.
2. **100% Offline-First Asset Bundling**: Fonts, icon SVGs, color definitions, and themes are bundled directly with the application packages. Zero external network calls or CDN requests are ever made.
3. **Ergonomic Familiarity**: Users transitioning from traditional desktop office suites encounter familiar mental models: an expressive Ribbon toolbar, a multi-document tab bar, consistent modal dialogs, and a responsive status bar.
4. **Extreme Performance & Restraint**: Animations are snappy (<= 150ms ease-out transitions), canvases are virtualized or lightweight SVG/HTML DOM overlays, and memory footprints remain low.

---

## 2. Color System & Themes

Zoffice supports three global themes: **Light**, **Dark**, and **High-Contrast (Accessible)**. The design system relies on Tailwind CSS palette tokens mapped to semantic color roles.

### 2.1 Theme Modes

| Role                          | Light Theme             | Dark Theme              | High-Contrast Theme           |
| :---------------------------- | :---------------------- | :---------------------- | :---------------------------- |
| **Window Background**         | `#f8fafc` (`slate-50`)  | `#0f172a` (`slate-950`) | `#000000` (Pure Black)        |
| **Surface / Card Background** | `#ffffff` (`white`)     | `#1e293b` (`slate-800`) | `#0a0a0a` (Solid Dark)        |
| **Surface Alt / Header**      | `#f1f5f9` (`slate-100`) | `#0f172a` (`slate-900`) | `#121212`                     |
| **Primary Text**              | `#0f172a` (`slate-900`) | `#f8fafc` (`slate-50`)  | `#ffffff` (Pure White)        |
| **Secondary Text**            | `#64748b` (`slate-500`) | `#94a3b8` (`slate-400`) | `#e2e8f0` (`slate-200`)       |
| **Border / Divider**          | `#e2e8f0` (`slate-200`) | `#334155` (`slate-700`) | `#ffffff` (2px Solid White)   |
| **Focus Visible Outline**     | `#2563eb` (`blue-600`)  | `#60a5fa` (`blue-400`)  | `#facc15` (`yellow-400`, 3px) |

### 2.2 Suite Application Accent Palette

Each app is distinguished by a signature accent color used in tab badges, launcher cards, and primary ribbon buttons:

| App | App Name         | Primary Accent | Tailwind Class                       | Role                          |
| :-- | :--------------- | :------------- | :----------------------------------- | :---------------------------- |
| 📝  | **ZWriter**      | `#2563eb`      | `text-blue-600`, `bg-blue-600`       | Word Processing               |
| 📊  | **ZSheets**      | `#059669`      | `text-emerald-600`, `bg-emerald-600` | Spreadsheets & Calculation    |
| 📽️  | **ZSlides**      | `#d97706`      | `text-amber-600`, `bg-amber-600`     | Presentations & Slide Decks   |
| 📓  | **ZNotes**       | `#7c3aed`      | `text-violet-600`, `bg-violet-600`   | Freeform Canvas & Notebooks   |
| ✉️  | **ZMail / ZCal** | `#0284c7`      | `text-sky-600`, `bg-sky-600`         | Email, Recurrence & Calendar  |
| 📋  | **ZForms**       | `#4f46e5`      | `text-indigo-600`, `bg-indigo-600`   | Forms, Surveys & Responses    |
| 📅  | **ZPlanner**     | `#0d9488`      | `text-teal-600`, `bg-teal-600`       | Kanban, Gantt & Timelines     |
| 🎨  | **ZDraw**        | `#e11d48`      | `text-rose-600`, `bg-rose-600`       | Vector Diagrams & Flowcharts  |
| 🗄️  | **ZBase**        | `#9333ea`      | `text-purple-600`, `bg-purple-600`   | Relational Data & SQL         |
| 💾  | **ZDrive**       | `#0891b2`      | `text-cyan-600`, `bg-cyan-600`       | Local Cloud & Version Control |

---

## 3. Typography Standards

All fonts in Zoffice are open-source, bundled locally, and render crisp typography across Windows, macOS, and Linux.

- **UI Shell & Controls**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI` (fallback only), `sans-serif`.
- **Document & Reading Body**: `Carlito` (open-source metric-compatible sans), `Liberation Sans`.
- **Spreadsheet / Monospace**: `JetBrains Mono`, `Consolas`, `monospace`.

### Type Scale

| Token         | Size            | Line Height | Usage                                               |
| :------------ | :-------------- | :---------- | :-------------------------------------------------- |
| `text-[10px]` | 10px / 0.625rem | 14px        | Micro tags, status flags, shortcut hints            |
| `text-xs`     | 12px / 0.75rem  | 16px        | Status bar, ribbon labels, property fields          |
| `text-sm`     | 14px / 0.875rem | 20px        | Standard dialog text, sidebar items, dropdown items |
| `text-base`   | 16px / 1.0rem   | 24px        | Default document body, modal headings               |
| `text-lg`     | 18px / 1.125rem | 28px        | Section titles, card headers                        |
| `text-xl`     | 20px / 1.25rem  | 28px        | Application title, dialog titles                    |
| `text-2xl`    | 24px / 1.5rem   | 32px        | Start Screen hero headers, large metrics            |

---

## 4. Layout Architecture & Anatomy

Every application window adheres to a rigid, standardized top-to-bottom hierarchy:

```
+---------------------------------------------------------------+
| Quick Access Toolbar (Save, Undo, Redo, Theme, Help)          |
+---------------------------------------------------------------+
| Multi-Document TabBar (Drag reorder, Dirty dot, Close button) |
+---------------------------------------------------------------+
| Office-Style Ribbon Toolbar (Tabs -> Groups -> Controls)       |
+---------------------------------------------------------------+
| [Optional Left Sidebar]  | Workspace Canvas / Grid / Tree     |
| (Hierarchy / Toolboxes)  | (PaperCanvas, Grid, Slide, SVG)    |
+---------------------------------------------------------------+
| Status Bar (Metrics, App Status, View Selectors, Zoom Slider) |
+---------------------------------------------------------------+
```

### 4.1 Quick Access Toolbar (QAT)

- Located above or inside the top ribbon frame.
- Fixed height: `h-8` (32px).
- Displays Quick Save (`Ctrl+S`), Undo (`Ctrl+Z`), Redo (`Ctrl+Y`), Theme Switcher (Light/Dark/High-Contrast), and Document Title.

### 4.2 TabBar

- Manages multi-document tabs across the entire suite.
- Height: `h-9` (36px).
- Supports HTML5 drag-and-drop tab reordering.
- Unsaved changes indicator: solid orange/blue dot beside title.
- Tab close button (`X`, 14px icon) with confirm dialog when dirty.

### 4.3 Ribbon Toolbar

- Declarative data-driven component (`Ribbon.jsx`).
- Props: `<Ribbon config={ribbonConfig} />` (with fallback to `{...props}`).
- Contains Tab strip (`Home`, `Insert`, `Layout`, `View`, `Tools`).
- Active tab indicator: 2px solid primary color bottom border.
- Collapsible toggle: double click tab or Chevron button on right.
- Ribbon groups separated by subtle vertical border dividers (`border-r border-slate-200 dark:border-slate-800`).

### 4.4 Status Bar

- Fixed bottom bar: `h-6` (24px), `px-3 py-0.5 text-xs select-none`.
- Flex layout: `leftContent` (or children slots), `centerContent` (status message), `rightContent` (view mode buttons and `ZoomSlider`).
- Accessible zoom scale: 50% to 200% with slider and reset-to-100% button.

---

## 5. Iconography Standards

All icons are sourced exclusively from `lucide-react` with `strokeWidth={2}` for balanced clarity.

| Context                              | Icon Size     | Example                             |
| :----------------------------------- | :------------ | :---------------------------------- |
| **Ribbon Small Action / Toggle**     | `13px`–`14px` | Bold, Italic, Align Left, Cut, Copy |
| **Ribbon Tab / Menu / Dialog Close** | `16px`        | File, Home, Insert, X, Settings     |
| **Ribbon Large Action Button**       | `18px`–`20px` | Table, Picture, Equation, Chart     |
| **Sidebar Navigation & Tree Nodes**  | `16px`        | Folder, Section, Page, Filter       |
| **Start Screen & Feature Cards**     | `24px`–`32px` | App Tiles, Template Previews        |

---

## 6. Dialog & Modal Standards

All dialogs and modals across all 10 apps follow the unified modal contract:

1. **Accessibility**: Must have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
2. **Backdrop**: Fixed full-screen overlay with `bg-black/50 backdrop-blur-sm` (never invalid `backdrop-blur-xs`).
3. **Dismissal**:
   - Clicking outside the modal container (on the backdrop) closes the dialog.
   - Pressing the **`Escape`** key immediately closes the dialog.
   - Dedicated close button (`<X size={16} />`) in the top-right corner.
4. **Size Scale**:
   - `sm`: `max-w-sm` (384px) — Confirmations, alerts, rename prompts
   - `md`: `max-w-md` (448px) — Field edits, hyperlinks, symbol pickers
   - `lg`: `max-w-lg` (512px) — Trello imports, branching logic, record inspectors
   - `xl`: `max-w-xl` (576px) — Version history, multi-column configurations
   - `2xl`: `max-w-2xl` (672px) — Task inspectors, compose message
   - `3xl`: `max-w-3xl` (768px) — SQL Console, template gallery
   - `full`: `max-w-5xl` (1024px) — Fullscreen preview consoles

### Button Layout in Modals

- **Footer Container**: `flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 p-4`.
- **Cancel / Close**: Bordered neutral button (`border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-3 py-1.5 text-xs font-medium`).
- **Primary / Submit**: Solid accent button (`bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:ring-blue-500`).
- **Destructive Action**: Red button (`bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1.5 text-xs font-medium`).

---

## 7. Global Keyboard Shortcuts Matrix

| Key Combination           | Action                    | Scope               | Handler                                  |
| :------------------------ | :------------------------ | :------------------ | :--------------------------------------- |
| `Ctrl+S` / `Cmd+S`        | Save Active Document      | Global Shell        | `Shell.jsx` -> `saveFile` / `saveFileAs` |
| `Ctrl+O` / `Cmd+O`        | Open Existing File        | Global Shell        | `Shell.jsx` -> `openFile`                |
| `Ctrl+N` / `Cmd+N`        | New Document Tab          | Global Shell        | `Shell.jsx` -> `openTab('writer')`       |
| `Ctrl+W` / `Cmd+W`        | Close Active Document Tab | Global Shell        | `Shell.jsx` -> `closeTab`                |
| `Ctrl+Z` / `Cmd+Z`        | Undo                      | App Canvas / Ribbon | App Undo Stack / `QAT`                   |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo                      | App Canvas / Ribbon | App Redo Stack / `QAT`                   |
| `Ctrl+F` / `Cmd+F`        | Find & Replace            | Document / Editor   | App Search / Find Dialog                 |
| `Escape`                  | Close Dialog / Deselect   | Global / Modal      | Accessible Dialog Handler                |
| `Ctrl+Plus` / `Ctrl+=`    | Zoom In                   | Status Bar          | `ZoomSlider` (+10%)                      |
| `Ctrl+Minus` / `Ctrl+-`   | Zoom Out                  | Status Bar          | `ZoomSlider` (-10%)                      |
| `Ctrl+0`                  | Reset Zoom to 100%        | Status Bar          | `ZoomSlider` (100%)                      |

---

## 8. Accessibility & Compliance (WCAG 2.1 AA)

1. **Color Contrast**: All text and meaningful icons maintain a minimum contrast ratio of **4.5:1** against backgrounds in standard modes, and **7:1** in High-Contrast mode.
2. **Keyboard Focus Rings**: Interactive elements feature high-visibility focus indicators using Tailwind's `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none`.
3. **Screen Reader Text**: Every icon-only button includes descriptive `aria-label` or `title` attributes (e.g., `aria-label="Save changes"`, `aria-label="Close dialog"`).
4. **Scalable UI**: Layouts accommodate dynamic zoom scaling between 100% and 200% without clipped content or horizontal viewport overflows.
