# ZPlanner — Offline-First Project Management & Planning Suite

ZPlanner is a native, offline-first desktop project planning, Kanban, and Gantt tracking tool for Zoffice, located in `/packages/planner`. Built strictly according to `AGENTS.md` guidelines: plain ES2022+ JavaScript (no TypeScript), small modular files (< 300 lines per file), zero external telemetry, bundled open fonts and Lucide icons, and zero Microsoft assets.

---

## 1. Architecture Overview

ZPlanner provides a unified, local alternative to Trello, Asana, and Microsoft Planner/Project, operating entirely offline with local SQLite storage:

```
┌─────────────────────────────────────────────────────────────┐
│                      Ribbon Toolbar                         │
│ [New Task] [New Col] │ [Kanban] [Gantt] [Calendar] │ [Zoom] │
├─────────────────────────────────────────────────────────────┤
│ Board Title │ Search Input │ Priority Filter: [All v]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Kanban Mode:                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐ │
│  │   TO DO    │ │IN PROGRESS │ │ IN REVIEW  │ │   DONE    │ │
│  │ ┌────────┐ │ │ ┌────────┐ │ │ ┌────────┐ │ │ ┌───────┐ │ │
│  │ │Task A  │ │ │ │Task B  │ │ │ │Task C  │ │ │ │Task D │ │ │
│  │ └────────┘ │ │ └────────┘ │ │ └────────┘ │ │ └───────┘ │ │
│  └────────────┘ └────────────┘ └────────────┘ └───────────┘ │
│                                                             │
│  Gantt Mode:                                                │
│  [Task List]  │  [Timeline Grid: Day / Week / Month Zoom]   │
│  Task A       │  █████████───► [SVG Dependency Link]        │
│  Task B       │             ████████ (Milestone: ◆)         │
│                                                             │
│  Calendar Mode:                                             │
│  [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]                  │
│  Monthly calendar grid displaying tasks on due dates        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                        Status Bar                           │
│ N tasks │ N completed │ N columns │ Offline SQLite Connected│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Views

### 1. Kanban Board (`/kanban/`)

- **Columns (`KanbanColumn.jsx`)**: Reorderable, customizable columns with color indicators and task count badges.
- **Task Cards (`TaskCard.jsx`)**: HTML5 native drag-and-drop between columns, color-coded priority pills (`urgent`, `high`, `medium`, `low`, `none`), progress bar, overdue indicators, checklist counts (`X/Y`), and assignee initials avatar.
- **Task Detail Inspector (`TaskDetailModal.jsx`)**: Full modal editor for title, description, priority, column assignment, start and due dates, progress slider (0–100%), milestone checkbox, checklist item manager, and predecessor dependency selectors.

### 2. Gantt Chart Timeline (`/gantt/`)

- **Left Task Pane (`GanttView.jsx`)**: Sticky task list with priority dot, task name, and completion status.
- **Timeline Engine (`gantt-engine.js`)**:
  - Automatically computes project timeline boundaries with padding.
  - Three distinct zoom scales: **Day** (44px per day), **Week** (100px per 7-day interval), and **Month** (140px per calendar month).
  - SVG dependency arrow connectors calculating smooth right-to-left and loopback paths (`calculateDependencyPath`).
  - Milestone rendering as rotated 45° diamond markers.

### 3. Task Calendar (`/calendar/`)

- **Monthly Grid (`TaskCalendarView.jsx`)**: Full month view mapping tasks to their exact start and due dates.
- Previous / Next month navigation, Today jump button, and direct task clicking to open the task detail inspector.

---

## 3. Data Portability & Trello Integration (`trello-importer.js`)

- **Trello JSON Importer (`importTrelloBoard`)**:
  - Automatically parses standard Trello export files.
  - Open lists map directly to ZPlanner columns.
  - Cards convert to tasks preserving start/due dates, checklist items, and descriptions.
  - Trello color labels (red, orange, yellow, green) intelligently map to ZPlanner priorities.
- **Native JSON Export (`exportBoardToJson`)**:
  - Exports the complete board schema, tasks, checklists, and dependency linkages to a portable JSON file.

---

## 4. SQLite Storage Schema (`apps/desktop/src/main/planner-db.js`)

All boards, columns, and tasks are persisted locally in SQLite:

- `planner_boards`:
  - `id` (TEXT PRIMARY KEY)
  - `title` (TEXT NOT NULL)
  - `description` (TEXT)
  - `data_json` (TEXT NOT NULL)
  - `created_at` (INTEGER NOT NULL)
  - `updated_at` (INTEGER NOT NULL)

Preload bridge (`apps/desktop/src/preload/planner-api.js`) exposes validated methods:
`window.zofficeAPI.planner.getBoards()`
`window.zofficeAPI.planner.getBoard(id)`
`window.zofficeAPI.planner.saveBoard(board)`
`window.zofficeAPI.planner.deleteBoard(id)`

---

## 5. Verification & Tests

- **Unit Tests (`packages/planner/src/__tests__/`)**:
  - `models.test.js`: Validates factory defaults, starter tasks, columns, and dependencies.
  - `gantt.test.js`: Verifies timeline boundaries, day/week/month zoom grids, and SVG connector math.
  - `trello.test.js`: Verifies Trello JSON import and native export roundtrip.
  - `store.test.js`: Tests Kanban column movement, checklist toggling, and dependency management.
- **E2E Playwright Suite (`apps/desktop/e2e/planner.spec.js`)**:
  - Tests launching ZPlanner from Start Screen.
  - Validates switching between Kanban, Gantt, and Calendar views.
  - Tests task detail modal interactions.
