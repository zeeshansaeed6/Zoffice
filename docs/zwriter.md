# ZWriter — Document Processor

ZWriter is the full-featured, offline-first desktop word processor for Zoffice. It is designed to combine modern rich-text document editing with familiar ribbon workflow and native `.docx` document compatibility.

---

## 1. Architecture Overview

ZWriter is built as a modular package inside `/packages/writer`:

```
packages/writer/
├── src/
│   ├── core/                  # TipTap & ProseMirror schema, custom extensions, and state hook
│   │   ├── editor-schema.js
│   │   ├── use-writer-editor.js
│   │   ├── line-spacing-extension.js
│   │   └── page-break-extension.js
│   ├── page-layout/           # Paper canvas, A4/Letter budgeting, zoom, and margins
│   │   ├── PaperCanvas.jsx
│   │   └── page-utils.js
│   ├── ribbon/                # Data-driven ribbon binding and action dispatchers
│   │   ├── ribbon-config.jsx
│   │   ├── home-actions.js
│   │   └── format-painter.js
│   ├── dialogs/               # Modals (Find & Replace)
│   │   └── FindReplaceDialog.jsx
│   ├── docx/                  # Native .docx serialization and deserialization
│   │   ├── docx-serializer.js
│   │   ├── docx-parser.js
│   │   └── index.js
│   ├── ZWriter.jsx            # Composite document component
│   └── index.js               # Package entry exports
```

---

## 2. Milestone 1A Implemented Features

### Rich Text Engine

- **TipTap / ProseMirror**: Headless, robust schema backing rich typography and block nodes.
- **Character Formatting**: Bold, italic, underline, strikethrough, subscript, superscript, custom font colors, background highlight, and clear formatting.
- **Font Selection**: Bundled offline open fonts (`Inter`, `Carlito`, System UI, Monospace, Serif) and dynamic font sizing (10–36pt, A+/A- grow/shrink).
- **Paragraph Controls**:
  - Bulleted lists and numbered lists.
  - Alignment: Left, Center, Right, Justify.
  - Line Spacing: 1.0, 1.15, 1.5, 2.0 lines.
- **Styles Gallery**: Quick styling for Normal, Heading 1–6, Quote block, and Monospace Code block.
- **Clipboard & Format Painter**:
  - Cut, Copy, Paste plain text.
  - Format Painter: copies marks (bold, italic, colors, alignment) at cursor and applies them onto the next selection.
- **Find & Replace**:
  - Modal dialog with real-time match counting.
  - Case-sensitive matching (`Match case`).
  - Regular expression search support (`Use Regular Expressions`).
  - Replace all occurrences across document HTML.

### Paper-Style Page Layout

- **Page Canvas**: Authentic paper rendering (`PaperCanvas.jsx`) with realistic page drop-shadows and margin gutters.
- **Page Presets**:
  - **A4**: `210mm × 297mm` (794px × 1123px at 96 DPI).
  - **Letter**: `8.5in × 11in` (816px × 1056px at 96 DPI).
- **Margins**: Normal (1in / 96px), Narrow (0.5in / 48px), Moderate, Wide.
- **Page Budgeting**: Continuous height tracking computing accurate page counts (`Page X of Y`).
- **Page Breaks**: Manual page breaks via Ctrl+Enter and visual dashed dividers.
- **Zoom**: Smooth scaling from 50% to 200% transform via bottom status bar slider.

### Native `.docx` Open & Save

- **Reading (`docx-parser.js`)**:
  - Powered by `mammoth` and `jszip`.
  - Preserves headings (H1–H6), bold, italic, underline, bullet/numbered lists, and tables.
  - Decodes base64 binary buffer received across sandboxed IPC without corruption.
- **Writing (`docx-serializer.js`)**:
  - Powered by `docx` library.
  - Transforms ProseMirror JSON document tree into OpenXML `.docx` binary.
  - Preserves headings, text runs, font styling, colors, alignment, lists, tables, and page breaks.
- **Round-Trip Testing**:
  - Verified with fixtures in `/test-fixtures/sample-basic.docx` and `/test-fixtures/sample-formatted.docx`.

### Status Bar Metrics

- Live word count and character count updated on editor keystrokes.
- Dynamic page count calculations.
- Integrated zoom slider.

---

## 3. Milestone 1B Planned Features

- **Insert Tab**: Tables (grid picker, merge/split), images (drag-and-drop, resize, text wrap), hyperlinks, bookmarks, headers/footers, LaTeX equations via KaTeX.
- **Layout Tab**: Orientation (portrait/landscape), multi-column layout (1, 2, 3 columns), custom margin sliders.
- **Review Tab**: Electron native spellchecker, comment bubbles, track changes (record insertions/deletions with author metadata, accept/reject).
- **References Tab**: Automatic Table of Contents generated from headings, footnotes, endnotes, citations (APA, MLA).
- **View Tab**: Print Layout, Web Layout, Read Mode, Focus Mode, outline navigation pane.
- **Export & Print**: High-fidelity PDF export via Electron `printToPDF` and native system print dialog.
