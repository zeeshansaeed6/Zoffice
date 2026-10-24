# ZDrive — Offline Local Cloud Drive & Version Control Suite

## 1. Overview

**ZDrive** is the offline-first personal document cloud and file catalog application of the **Zoffice** suite. Designed as a secure, private, telemetry-free alternative to Google Drive, Dropbox, and Microsoft OneDrive, ZDrive provides a centralized hub to organize, explore, tag, version, and inspect all documents created within Zoffice (`.docx`, `.xlsx`, `.pptx`, `.znotes`, `.zbase`, `.zdraw`, `.zform`, `.zplan`, etc.) directly on the local machine.

In strict compliance with `AGENTS.md`, ZDrive uses **plain modern JavaScript (ES2022+)**, React JSX, Tailwind CSS, Zustand, Lucide icons, and offline SQLite storage with 100% offline functionality.

---

## 2. Features & Capabilities

- **Folder Hierarchy & Navigation:**
  - Multi-level folder nesting with visual breadcrumb trail navigation (`My Drive / Documents / ...`).
  - Color tagging with 6 distinct color presets (Red, Orange, Yellow, Green, Blue, Purple).
  - Starred items section for quick access to critical files and favorites.
  - Full-text and file name search filter with instant UI updates.
- **Dual View Layouts:**
  - **Grid View:** Visual card layout with distinct icons and theme colors for each Zoffice document kind (Writer=blue, Sheets=green, Slides=amber, Notes=violet, Base=purple, Draw=cyan, Forms=teal, Planner=rose).
  - **List View:** Detailed data table displaying Name, Type, Last Modified Date, File Size, Color Tag, Star toggle, Version history action, and Trash action.
- **Version History & Rollback:**
  - Local revision snapshotting engine (`drive_versions`).
  - Tracks version numbers, timestamps, snapshot descriptions, and file sizes.
  - Interactive snapshot creation dialog with custom user comments.
  - One-click version rollback restoring any past snapshot.
- **Storage & Quota Analytics:**
  - Real-time disk space usage calculator with human-readable formatting (`KB`, `MB`, `GB`).
  - Multi-color storage distribution progress meter showing percentage breakdown by document type.
  - Summary metrics: total storage used, total organized folders, total files, and category counts.
  - "Largest Files" leaderboard ranking top storage consumers.
- **Trash & Lifecycle Management:**
  - Soft-delete moving items to Trash.
  - One-click restore returning files to their original parent folder.
  - Permanent deletion from SQLite database.

---

## 3. Architecture & File Structure

```
packages/drive/
├── package.json
├── vitest.config.js
├── src/
│   ├── index.js                     # Package public exports
│   ├── ZDrive.jsx                   # Main composite application (<300 lines)
│   ├── ribbon-config.jsx            # Data-driven ribbon layout
│   ├── core/
│   │   ├── constants.js             # File kinds, extensions map, color tags, view modes
│   │   ├── drive-model.js           # Drive item and version factories, size formatters
│   │   ├── storage-calculator.js    # Quota and distribution analytics engine
│   │   ├── drive-storage.js         # Preload bridge helper for SQLite persistence
│   │   └── drive-store.js           # Zustand state management store (<300 lines)
│   ├── components/
│   │   ├── DriveSidebar.jsx         # Section navigation & storage meter widget
│   │   ├── DriveToolbar.jsx         # Breadcrumbs, search, view switcher, bulk actions
│   │   └── FileIcon.jsx             # Distinct colored Lucide icons per document kind
│   ├── views/
│   │   ├── DriveGridView.jsx        # Cards layout for folders and files
│   │   ├── DriveListView.jsx        # Table layout for detailed file attributes
│   │   └── StorageAnalyticsView.jsx # Comprehensive disk distribution dashboard
│   ├── dialogs/
│   │   ├── VersionHistoryModal.jsx  # Revision history and rollback modal
│   │   └── NewFolderModal.jsx       # Folder creation dialog
│   └── __tests__/
│       ├── models.test.js           # Unit tests for drive models and formatters
│       ├── storage.test.js          # Unit tests for storage analytics calculator
│       └── store.test.js            # Unit tests for Zustand store actions
```

---

## 4. Desktop Integration

- **SQLite Database:** `apps/desktop/src/main/drive-db.js` stores items in `drive_items` table.
- **Preload API:** `apps/desktop/src/preload/drive-api.js` exposes typed `zofficeAPI.drive` methods.
- **Start Screen:** Registered as **ZDrive** launcher tile with HardDrive icon and sky accent.
- **Tab Management:** Added to `useTabStore` with default title `'Drive'`.
- **E2E Testing:** Playwright test suite in `apps/desktop/e2e/drive.spec.js`.
