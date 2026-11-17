# Zoffice Plugin & Extension Developer Guide

**Version:** 1.0.0  
**Status:** Official Specification  
**Architecture:** Sandboxed ES Modules, Declarative Manifest, Explicit Permission Prompts

---

## 1. Overview & Security Architecture

Zoffice features a private, offline-first extension system allowing developers to extend desktop office applications without compromising user security or privacy.

### Security Guarantees

1. **Isolated Execution**: Plugins run in an isolated execution sandbox. Direct references to `window`, `document`, `process`, and `require` are masked and inaccessible.
2. **Explicit Permission Consent**: Plugins cannot access document data or UI components without user consent. Every permission requested in `manifest.json` is displayed to the user prior to installation and can be audited or revoked at any time.
3. **Offline & Private**: Plugins are forbidden from making remote network requests. All dependencies must be bundled locally inside the plugin package.

---

## 2. Plugin Directory Structure

A Zoffice plugin is a folder containing a `manifest.json` descriptor and one or more JavaScript files:

```
my-zoffice-plugin/
├── manifest.json       # Required metadata, permissions, and contributions
├── index.js            # Entry point executing inside sandbox
├── README.md           # Documentation for users
└── assets/             # Optional icons and local assets
```

---

## 3. The `manifest.json` Specification

### Complete Schema Example

```json
{
  "id": "com.example.wordcounter",
  "name": "Word Frequency Counter",
  "version": "1.0.0",
  "description": "Calculates vocabulary diversity and word frequency stats.",
  "author": "Jane Doe",
  "targetApps": ["writer"],
  "main": "index.js",
  "permissions": ["active-document:read", "ui:ribbon", "ui:sidebar"],
  "contributions": {
    "ribbonButtons": [
      {
        "id": "btn-word-freq",
        "tabId": "review",
        "groupId": "proof",
        "label": "Word Stats",
        "icon": "BarChart3",
        "action": "openStats"
      }
    ],
    "sidebarPanels": [
      {
        "id": "panel-word-freq",
        "title": "Word Frequency",
        "icon": "BarChart3",
        "render": "renderSidebar"
      }
    ],
    "fileFormatHandlers": [
      {
        "extension": "customdoc",
        "mimeType": "application/x-custom",
        "handler": "parseCustomDoc"
      }
    ]
  }
}
```

### Manifest Fields

| Field           | Type       | Required | Description                                                                                  |
| :-------------- | :--------- | :------- | :------------------------------------------------------------------------------------------- |
| `id`            | `string`   | **Yes**  | Unique identifier (e.g. `zoffice-plugin-word-counter`). Lowercase letters, numbers, hyphens. |
| `name`          | `string`   | **Yes**  | Human-readable plugin display name.                                                          |
| `version`       | `string`   | **Yes**  | Semver string (e.g. `1.0.0`).                                                                |
| `main`          | `string`   | **Yes**  | Relative path to entry JavaScript file.                                                      |
| `targetApps`    | `string[]` | No       | Target applications (`['writer']`, `['sheets']`, etc., or `['*']` for all).                  |
| `permissions`   | `string[]` | No       | Permissions requested from the user.                                                         |
| `contributions` | `object`   | No       | UI and format hooks (`ribbonButtons`, `sidebarPanels`, `fileFormatHandlers`).                |

---

## 4. Permission Model & User Consent

Plugins must declare all required capabilities. The user is prompted with human-readable descriptions before enabling the plugin:

| Permission              | Description                                                            |
| :---------------------- | :--------------------------------------------------------------------- |
| `active-document:read`  | Read the active document's text and content structure.                 |
| `active-document:write` | Insert text, format selections, or update active document content.     |
| `ui:ribbon`             | Add custom action buttons, groups, or toggles into the Ribbon toolbar. |
| `ui:sidebar`            | Register custom interactive side panels and inspectors.                |
| `ui:menu`               | Add custom commands into app menus and context menus.                  |
| `file-format:handler`   | Register custom file import and export parser routines.                |
| `storage:local`         | Persist key-value plugin settings in local offline storage.            |

Attempting to call an ungranted API method results in a runtime error:
`Error: Permission denied: "active-document:write" required to modify document content.`

---

## 5. Sandboxed Runtime API (`zoffice.*`)

Inside `index.js`, the global `zoffice` object exposes permission-gated capabilities:

### 5.1 Document API (`zoffice.document`)

- `zoffice.document.getContent()`: Returns full text/content of current active tab (requires `active-document:read`).
- `zoffice.document.setContent(newContent)`: Sets active tab document content (requires `active-document:write`).
- `zoffice.document.getSelectedText()`: Returns user's currently highlighted text (requires `active-document:read`).

### 5.2 Storage API (`zoffice.storage`)

- `zoffice.storage.get(key)`: Reads a persistent string or JSON object (requires `storage:local`).
- `zoffice.storage.set(key, value)`: Saves persistent data scoped to the plugin (requires `storage:local`).
- `zoffice.storage.remove(key)`: Deletes stored key (requires `storage:local`).

### 5.3 UI API (`zoffice.ui`)

- `zoffice.ui.showToast(message)`: Displays a notification banner in the bottom-right corner.

---

## 6. Included Example Plugins

Zoffice bundles two reference plugins located in `/plugins`:

### 1. Word Frequency Counter (`plugins/word-counter`)

- **Target App**: ZWriter
- **Permissions**: `active-document:read`, `ui:ribbon`, `ui:sidebar`
- **Capabilities**: Parses document text, computes total words, unique words, estimated reading time, and ranks the top 10 most frequent words. Displays results via ribbon button and sidebar panel.

### 2. CSV Data Cleaner (`plugins/csv-cleaner`)

- **Target App**: ZSheets
- **Permissions**: `active-document:read`, `active-document:write`, `ui:ribbon`, `file-format:handler`
- **Capabilities**: Trims excess whitespace from every cell, normalizes CRLF line breaks to LF, prunes empty delimiters, and removes duplicate rows.
