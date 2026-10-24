# ZBase — Relational Database and Offline Structured Data Suite

## 1. Overview

**ZBase** is the offline-first relational database and structured record management application of the **Zoffice** suite. Designed as an open, private alternative to tools like Airtable and Microsoft Access, ZBase empowers users to design multi-table relational databases, link records across tables, write dynamic mathematical and lookup formulas, query data using a built-in SQL console, and visualize records through five distinct synchronized views (Grid, Kanban, Calendar, Gallery, and Form).

In adherence to `AGENTS.md`, ZBase is built entirely with **plain modern JavaScript (ES2022+)**, React JSX, Tailwind CSS, Zustand, Lucide icons, and offline SQLite storage with strict zero telemetry and zero cloud dependencies.

---

## 2. Features & Capabilities

- **Relational Data Architecture:**
  - Multiple tables per base (`base_databases` SQLite table).
  - Primary, text, number, date, single select, multiselect, checkbox, formula, lookup, rollup, and relational link fields.
- **Synchronized View Engines:**
  - **Grid View:** Spreadsheet-style editable table with column menus, row ordering, and quick inline cell editors.
  - **Kanban View:** Visual board grouped by select field options (e.g. Status) with customizable color chips and card counts.
  - **Calendar View:** Month-based scheduling view placing records on dates according to designated date fields.
  - **Gallery View:** High-density visual card grid showcasing key record attributes and badges.
  - **Form View:** Responsive, distraction-free record entry form supporting offline submissions directly into the database.
- **Formula, Lookup & Rollup Engine:**
  - Arithmetic operations (`+`, `-`, `*`, `/`) and string concatenations (`&`).
  - Token replacement for `{Field Name}` references.
  - Relational lookups resolving fields from linked tables.
  - Rollup calculations computing `sum`, `average`, `count`, `min`, and `max` across linked records.
- **In-Memory SQL Console:**
  - Safe in-memory SQL execution supporting standard `SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...` syntax.
  - Case-insensitive table and column matching (including quoted columns like `"Budget ($)"`).
  - Filtering operators: `=`, `!=`, `<>`, `>`, `<`, `>=`, `<=`, and `LIKE` pattern matching.
  - Direct execution output table with row counts and query error alerts.
- **Export & Portability:**
  - One-click CSV export with quoted fields and headers.
  - SQLite persistence via validated Electron IPC bridge (`base:getBases`, `base:getBase`, `base:saveBase`, `base:deleteBase`).

---

## 3. Architecture & File Structure

```
packages/base/
├── package.json
├── vitest.config.js
├── src/
│   ├── index.js                     # Package exports
│   ├── ZBase.jsx                    # Top-level composite application (<300 lines)
│   ├── ribbon-config.jsx            # Data-driven ribbon configuration
│   ├── core/
│   │   ├── constants.js             # Field types, view types, operators, colors
│   │   ├── base-model.js            # Factory functions for bases, tables, fields, records
│   │   ├── formula-engine.js        # Arithmetic formula, lookup, and rollup engine
│   │   ├── sql-console-engine.js    # In-memory SQL query parsing and execution
│   │   ├── base-storage.js          # Preload bridge helper for SQLite persistence
│   │   └── base-store.js            # Zustand state management (<300 lines)
│   ├── components/
│   │   ├── TableNavTabs.jsx         # Table navigation tabs with add table button
│   │   └── ViewSearchBar.jsx        # View switcher tabs and search bar
│   ├── views/
│   │   ├── GridView.jsx             # Interactive spreadsheet data grid
│   │   ├── KanbanView.jsx           # Board grouped by select options
│   │   ├── GalleryView.jsx          # Card grid view
│   │   ├── CalendarView.jsx         # Monthly calendar scheduling view
│   │   └── FormView.jsx             # Clean form submission interface
│   ├── dialogs/
│   │   ├── FieldModal.jsx           # Field creation and configuration dialog
│   │   ├── RecordDetailModal.jsx    # Record inspector and editor dialog
│   │   └── SqlQueryConsoleModal.jsx # Interactive SQL query runner modal
│   └── __tests__/
│       ├── models.test.js           # Unit tests for models
│       ├── formula.test.js          # Unit tests for formulas, lookups, and rollups
│       ├── sql.test.js              # Unit tests for SQL console engine
│       └── store.test.js            # Unit tests for Zustand store
```

---

## 4. Desktop Integration

- **SQLite Persistence:** `apps/desktop/src/main/base-db.js` persists databases into `base_databases`.
- **Preload API:** `apps/desktop/src/preload/base-api.js` exposes validated `zofficeAPI.base` methods.
- **Start Screen:** Registered as **ZBase** launcher tile with Database icon and purple accent.
- **Tab Management:** Added to `useTabStore` with default title `'Database'`.
- **E2E Testing:** Playwright test suite in `apps/desktop/e2e/base.spec.js`.
