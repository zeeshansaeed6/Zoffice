# ZNotes — Notebook & Canvas Architecture Guide

ZNotes is the offline-first digital notebook application of the Zoffice suite, located in `/packages/notes`. Built strictly according to `AGENTS.md` rules: plain ES2022+ JavaScript (no TypeScript), modular files (< 300 lines), zero telemetry, bundled open fonts/Lucide icons, and zero Microsoft assets.

---

## 1. Hierarchy & Data Model

ZNotes organizes information in a 4-level hierarchy:

```
Notebook (title, color, created/updated timestamps)
 └── Section (title, color, order)
      └── Page (title, tags, order)
           └── Block (type, content, x, y, width, height, order)
```

Each entity has a uniquely prefixed ID (`nb-`, `sec-`, `page-`, `block-`) with millisecond timestamps and random collision prevention.

---

## 2. Free-Form Canvas Architecture

Unlike linear document processors, ZNotes features an infinite free-form 2D canvas (`NoteCanvas.jsx`):

- **Absolute Positioning**: Any block can be placed, dragged, and rearranged anywhere on the canvas grid (`x`, `y`).
- **Dynamic Insertion**: New blocks can be inserted via the contextual canvas bar or the application Ribbon.
- **Auto-expansion**: Canvas boundaries automatically expand as blocks are added and moved.

---

## 3. Block Types

ZNotes supports 6 core block types:

1. **`text`**: Rich text editing with inline styles and contentEditable syncing.
2. **`checklist`**: Interactive task checklist with individual checkboxes, task progress bar, and item addition/removal.
3. **`table`**: Dynamic editable grid with configurable rows, columns, and header styling.
4. **`image`**: Local image insertion with base64 data URL offline persistence and alt descriptions.
5. **`ink`**: Canvas-based drawing/sketching surface with pen colors, stroke weights, undo stack, and path serialization.
6. **`audio`**: Web Audio API (`MediaRecorder`) voice note recorder and playback player stored directly inside the note.

---

## 4. Key Features

### Tagging System

Pages support quick categorization with color-coded tags:

- **`todo`** (Blue, CheckSquare)
- **`important`** (Red, Star)
- **`question`** (Amber, HelpCircle)
- **`remember`** (Emerald, Bookmark)

### Full-Text Search

The built-in search engine (`search-engine.js`) searches across all notebooks, sections, and pages in real-time, matching:

- Page titles
- Tags
- Text blocks, checklist items, and table cells
  Provides contextual snippets and one-click navigation to matched pages.

### Internal Page Linking

Wiki-style page linking (`[[PageTitle|pageId]]`):

- Modal picker to link any page across notebooks
- Automatic parsing and resolution
- Human-readable link preview (`🔗 PageTitle`)

### Predefined Page Templates

Jumpstart notes with curated templates:

- **Blank Page**: Clean slate
- **Meeting Notes**: Agenda, attendees, action items
- **To-Do List**: Categorized task list
- **Project Plan**: Goals and milestone tracking
- **Lecture Notes**: Key concepts and questions

### Web Clipper

Sanitizes pasted HTML from external websites and web pages, stripping unsafe scripts and styles, and converts HTML paragraphs, tables, and images directly into native note blocks.

---

## 5. Storage & Export

1. **SQLite Database Persistence**: Main process SQLite tables (`notes_notebooks`, `notes_sections`, `notes_pages`, `notes_blocks`) with cascade deletion and foreign key indexing.
2. **Portable ZIP Export**: Exports any notebook to a `.zip` archive containing:
   - Sanitized folders per section
   - Standard Markdown files (`.md`) per page with proper GFM checklists and tables
   - Extracted images into an `assets/` subfolder
   - `metadata.json` for full portability

---

## 6. Offline-First Guarantee

- **No Remote Calls**: All recordings, sketches, clipping, and exports happen locally in memory and SQLite.
- **Zero Account Dependency**: Works immediately out of the box with zero logins.
