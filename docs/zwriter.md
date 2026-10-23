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

### Native `.docx` High-Fidelity Engine (Milestone 1A.5)

- **Direct OOXML Parser (`ooxml-parser.js`)**:
  - Direct reading and XML DOM traversal of `word/document.xml`, `word/styles.xml`, `word/numbering.xml`, `word/_rels/document.xml.rels`, and `word/media/`.
  - Full style inheritance resolution against `docDefaults` and `basedOn` hierarchy.
  - Multi-level bullet and numbered list parsing.
  - Merged-cell table extraction (`gridSpan`, cell shading, borders).
  - Inline image extraction from `word/media/` into base64 data URIs with dimensions.
  - Page setup parsing (`w:sectPr` -> page dimensions, orientation, margins mapped to `PaperCanvas`).
  - Preserves auxiliary package parts (headers, footers, settings, customXml).
  - Graceful fallback to `mammoth` if raw OOXML parsing encounters an issue.
- **DOCX Serializer (`docx-serializer.js`)**:
  - Re-serializes rich text runs, headings, tables, images, and page setup.
  - Merges preserved auxiliary package parts back into the saved `.docx` package via `docx-package-preserver.js`.
- **Fidelity CLI Tool**:
  - `pnpm docx:report <file>` analyzes feature presence and reports preservation score.

### Status Bar Metrics

- Live word count and character count updated on editor keystrokes.
- Dynamic page count calculations.
- Integrated zoom slider.

---

## 3. DOCX Support Matrix

| Category                 | Feature                 | Import       | Export       | Status    | Notes                                                |
| ------------------------ | ----------------------- | ------------ | ------------ | --------- | ---------------------------------------------------- |
| **Run Formatting**       | Font Family             | ✅           | ✅           | Full      | Preserves `w:rFonts` (Inter, Carlito, Georgia, etc.) |
|                          | Font Size               | ✅           | ✅           | Full      | Converts half-points (`w:sz`) to CSS px & back       |
|                          | Bold & Italic           | ✅           | ✅           | Full      | `w:b`, `w:i` mapped to `strong`, `em` & `TextRun`    |
|                          | Underline               | ✅           | ✅           | Full      | `w:u` preserved                                      |
|                          | Strikethrough           | ✅           | ✅           | Full      | `w:strike` mapped to `<s>` & `TextRun`               |
|                          | Sub / Superscript       | ✅           | ✅           | Full      | `w:vertAlign` mapped to `sub`, `sup`                 |
|                          | Text Color              | ✅           | ✅           | Full      | `w:color` hex values preserved                       |
|                          | Background Highlight    | ✅           | ✅           | Full      | `w:highlight` mapped to background-color             |
|                          | Small Caps              | ✅           | ✅           | Full      | `w:smallCaps` preserved in inline style              |
| **Paragraph Formatting** | Alignment               | ✅           | ✅           | Full      | Left, Center, Right, Justify (`w:jc`)                |
|                          | Headings (H1–H6, Title) | ✅           | ✅           | Full      | Mapped to `<h1>`-`<h6>` with inherited styles        |
|                          | Line Spacing            | ✅           | ✅           | Full      | Line height ratios (`1.0`, `1.15`, `1.5`, `2.0`)     |
|                          | Spacing Before / After  | ✅           | ✅           | Full      | Preserved from `w:spacing`                           |
| **Lists**                | Bullet Lists            | ✅           | ✅           | Full      | Mapped to `<ul>` and `bullet` runs                   |
|                          | Numbered Lists          | ✅           | ✅           | Full      | Multi-level decimal numbering from `numbering.xml`   |
| **Tables**               | Grid & Rows             | ✅           | ✅           | Full      | `w:tbl`, `w:tr`, `w:tc` mapped to HTML tables        |
|                          | Merged Cells            | ✅           | ✅           | Full      | Colspan (`w:gridSpan`) preserved                     |
|                          | Cell Shading            | ✅           | ✅           | Full      | Background fills (`w:shd`) preserved                 |
| **Media & Links**        | Embedded Images         | ✅           | ✅           | Full      | Extracted from `word/media/` with dimensions         |
|                          | External Hyperlinks     | ✅           | ✅           | Full      | Resolved via `_rels` to `<a>` tags and `ImageRun`    |
| **Page Setup**           | Margins                 | ✅           | ✅           | Full      | Twips to px mapping (top, bottom, left, right)       |
|                          | Orientation             | ✅           | ✅           | Full      | Portrait & Landscape mapped to canvas                |
|                          | Page Size               | ✅           | ✅           | Full      | A4 & Letter dimensions mapped to canvas              |
| **Package Preservation** | Headers & Footers       | ⚠️ Preserved | ⚠️ Preserved | Preserved | Preserved in zip package on roundtrip save           |
|                          | Settings & Theme        | ⚠️ Preserved | ⚠️ Preserved | Preserved | Unmodified XML parts copied to saved package         |

---

## 4. Milestone 1B Planned Features

- **Insert Tab**: Tables (grid picker, merge/split), images (drag-and-drop, resize, text wrap), hyperlinks, bookmarks, headers/footers, LaTeX equations via KaTeX.
- **Layout Tab**: Orientation (portrait/landscape), multi-column layout (1, 2, 3 columns), custom margin sliders.
- **Review Tab**: Electron native spellchecker, comment bubbles, track changes (record insertions/deletions with author metadata, accept/reject).
- **References Tab**: Automatic Table of Contents generated from headings, footnotes, endnotes, citations (APA, MLA).
- **View Tab**: Print Layout, Web Layout, Read Mode, Focus Mode, outline navigation pane.
- **Export & Print**: High-fidelity PDF export via Electron `printToPDF` and native system print dialog.
