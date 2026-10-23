# Zoffice Architecture

This document describes the technical architecture, security model, and data flow of Zoffice.

---

## 1. Monorepo Overview

Zoffice is organized as a `pnpm` workspace monorepo:

| Package           | Responsibility                                                   | Dependencies                         |
| :---------------- | :--------------------------------------------------------------- | :----------------------------------- |
| `apps/desktop`    | Electron main process, preload, and React renderer shell         | `@zoffice/core`, `@zoffice/ui`, apps |
| `packages/core`   | Headless logic: i18n, shortcut registry, undo/redo, file manager | None (zero external dependencies)    |
| `packages/ui`     | Shared React components: Ribbon, StatusBar, Dialogs, Theme       | `react`, `lucide-react`              |
| `packages/writer` | ZWriter document processing application                          | `@zoffice/core`, `@zoffice/ui`       |
| `packages/sheets` | ZSheets spreadsheet application                                  | `@zoffice/core`, `@zoffice/ui`       |
| `packages/slides` | ZSlides presentation application                                 | `@zoffice/core`, `@zoffice/ui`       |

---

## 2. Process Separation & Security Model

Zoffice strictly enforces the principle of least privilege using Electron's multi-process model:

```
┌────────────────────────────────────────────────────────┐
│                    Renderer Process                    │
│   (React 19, Zustand, Tailwind, Offline Bundled UI)     │
│   - sandbox: true                                      │
│   - contextIsolation: true                             │
│   - nodeIntegration: false                             │
└──────────────────────────┬─────────────────────────────┘
                           │ IPC via contextBridge
                           ▼
┌────────────────────────────────────────────────────────┐
│                     Preload Script                     │
│   - Exposes window.zofficeAPI                          │
│   - Validates argument types for every single channel   │
│   - No arbitrary ipcRenderer access                     │
└──────────────────────────┬─────────────────────────────┘
                           │ Validated IPC Channels
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Main Process (Node.js)               │
│   - File Dialogs & Disk I/O (Strict Extension Check)   │
│   - SQLite Persistence (better-sqlite3)                │
│   - Autosave / Crash Recovery File Store               │
│   - Application Menu & Global Shortcuts                │
│   - Blocks unexpected navigation and window.open       │
└────────────────────────────────────────────────────────┘
```

### Content-Security-Policy (CSP)

Strict CSP is enforced via both `<meta>` tag in `index.html` and `webRequest.onHeadersReceived`:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
img-src 'self' data:;
connect-src 'self';
```

No external scripts, CDNs, or network connections are permitted.

---

## 3. Validated IPC Channels

Preload exposes only the following whitelisted channels under `window.zofficeAPI`:

| Channel           | Method   | Validation Rules                                     | Description                                          |
| :---------------- | :------- | :--------------------------------------------------- | :--------------------------------------------------- |
| `file:open`       | `invoke` | None (triggers dialog)                               | Opens file via native dialog and validates extension |
| `file:save`       | `invoke` | `filePath: string`, `content: string`                | Saves content to specified path                      |
| `file:saveAs`     | `invoke` | `name: string`, `content: string`, `ext: string`     | Opens native Save As dialog                          |
| `recent:list`     | `invoke` | `limit: number`                                      | Fetches recent files from SQLite                     |
| `recent:add`      | `invoke` | `{ filePath, title, appId }`                         | Inserts or touches recent file in SQLite             |
| `recent:clear`    | `invoke` | None                                                 | Clears recent file history                           |
| `settings:get`    | `invoke` | `key: string`                                        | Gets configuration setting from SQLite               |
| `settings:set`    | `invoke` | `key: string`, `value: any`                          | Sets configuration setting in SQLite                 |
| `autosave:save`   | `invoke` | `{ id, title, appId, filePath, content, timestamp }` | Backs up dirty document                              |
| `autosave:list`   | `invoke` | None                                                 | Lists unrecovered autosaves                          |
| `autosave:remove` | `invoke` | `id: string`                                         | Cleans up autosave file                              |
| `theme:get`       | `invoke` | None                                                 | Retrieves persistent theme setting                   |
| `theme:set`       | `invoke` | `mode: string`                                       | Saves persistent theme setting                       |
| `onMenuAction`    | `on`     | `callback: function`                                 | Listens for menu triggers                            |

---

## 4. Local Offline Persistence

1. **SQLite Database (`zoffice.db`)**:
   - Location: Electron `app.getPath('userData')/zoffice.db`.
   - Uses `better-sqlite3` in WAL mode for synchronous, performant, zero-configuration local storage.
   - Stores settings key-value pairs and recent document history.
2. **Autosave Recovery Directory**:
   - Location: `app.getPath('userData')/autosave/`.
   - Writes individual JSON documents every 30 seconds for any modified document tab.
   - On application startup, the shell queries this directory. If files are found, the user is presented with a crash recovery dialog to restore or discard work.

---

## 5. Data-Driven Ribbon Architecture

The Ribbon component in `@zoffice/ui` is completely declarative. Each application (`ZWriter`, `ZSheets`, `ZSlides`) defines its controls via a JSON/JavaScript object structure:

```javascript
{
  appId: 'writer',
  tabs: [
    {
      id: 'home',
      label: 'Home',
      groups: [
        {
          id: 'font',
          label: 'Font',
          controls: [ ... ]
        }
      ]
    }
  ]
}
```

The Ribbon renders:

- Quick Access Toolbar (Save, Undo, Redo, Theme toggle)
- Application File menu button
- Horizontal tab selection
- Contextual tabs with accent highlights
- Collapsible groups with large buttons, small buttons, toggles, and dropdowns
- Chevron toggle to collapse/expand the ribbon strip.

---

## 6. Open Fonts & Offline Design

All fonts and icons are strictly open-source and bundled inside the application distribution:

- **Fonts**: `@fontsource-variable/inter`, `@fontsource/carlito`, Liberation Sans.
- **Icons**: `lucide-react`.
- Zero external CDN dependencies.
