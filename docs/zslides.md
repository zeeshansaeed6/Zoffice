# ZSlides — Presentation Engine Architecture & Guide

ZSlides is the offline-first presentation application of the Zoffice suite, located in `/packages/slides`. It is designed according to the strict principles in `AGENTS.md`: plain ES2022+ JavaScript (zero TypeScript), small files (< 300 lines), zero external telemetry, bundled fonts/icons, and zero Microsoft naming or assets.

---

## 1. Canvas Architecture

Rather than an opaque HTML5 canvas or heavy external canvas framework, ZSlides uses a **layered React + SVG + HTML DOM Overlay** architecture:

```
┌────────────────────────────────────────────────────────┐
│  SlideCanvas                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1. Background Layer (Colors, Gradients)          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 2. SVG Vector Layer (Shapes, Paths, Connectors)  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 3. HTML DOM Layer (ContentEditable Text, Tables, │  │
│  │    Images, Chart.js Charts)                      │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 4. Interactive Overlay (Selection bounding box,  │  │
│  │    8-point transform handles, Alignment guides)  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Advantages:

1. **Crisp Rendering at any Zoom Level**: Pure vector rendering scales seamlessly without pixelation.
2. **Native Text Editing**: In-place contentEditable elements support browser-native spellcheck, cursor positioning, and selection.
3. **Component Reusability**: Seamlessly mounts Chart.js (`ChartElement.jsx`) and HTML tables (`TableElement.jsx`) without canvas-layer hacks.
4. **Zero Heavy Canvas Dependencies**: Keeps bundle lightweight and completely auditable.

---

## 2. Coordinate System & Dimensions

Slide coordinates use a fixed logical coordinate space that scales to the container viewport via CSS transform `matrix` or `scale`:

- **Widescreen (16:9)**: `960 × 540` pixels (Default)
- **Standard (4:3)**: `960 × 720` pixels

All element positions (`x`, `y`), dimensions (`width`, `height`), and font sizes are specified relative to this fixed coordinate space.

---

## 3. Element Types

ZSlides supports 6 core element types:

- **`text`**: Rich text frames with font family (`Inter`, `Carlito`, `Liberation Sans`), font size (8-144pt), bold, italic, underline, alignment (left, center, right), and color.
- **`shape`**: 9 vector shapes (Rectangle, Rounded Rectangle, Ellipse, Triangle, Right Arrow, Left Arrow, 5-point Star, Speech Bubble, Line) with stroke, stroke width, fill, and opacity.
- **`image`**: Local or base64 images with preserve-aspect-ratio scaling and custom borders.
- **`table`**: Editable data tables with row/column cells.
- **`chart`**: Chart.js charts with Bar, Line, Pie, and Doughnut presets.
- **`connector`**: Point-to-point lines with arrow heads.

---

## 4. Layouts & Themes

### Slide Layouts (7 standard layouts)

- `title`: Main presentation title & subtitle
- `title_and_content`: Heading with bullet list / content frame
- `section_header`: Section divider with large centered heading
- `two_content`: Side-by-side comparison columns
- `comparison`: Comparison columns with individual subheadings
- `title_only`: Title banner with open layout area
- `blank`: Empty canvas

### 12 Curated Offline Themes

1. **Modern Clean**: Blue #2563eb / Slate #64748b
2. **Midnight Executive**: Indigo #6366f1 / Slate #0f172a
3. **Coral Sunrise**: Coral #f43f5e / Amber #f59e0b
4. **Emerald Forest**: Emerald #10b981 / Teal #065f46
5. **Slate Minimal**: Zinc #52525b / Zinc #18181b
6. **Royal Indigo**: Violet #7c3aed / Indigo #4338ca
7. **Nordic Frost**: Cyan #0891b2 / Blue #1e40af
8. **Sunset Glow**: Orange #ea580c / Amber #d97706
9. **Corporate Navy**: Navy #1e3a8a / Slate #334155
10. **Amber Warmth**: Amber #b45309 / Yellow #f59e0b
11. **Cyber Neon**: Neon Cyan #06b6d4 / Pink #ec4899
12. **Rose Gold**: Rose #e11d48 / Purple #be185d

---

## 5. High-Fidelity .pptx I/O

- **Writing (`pptx-writer.js`)**: Converts ZSlides decks into valid `.pptx` presentations using PptxGenJS. Maps slide backgrounds, shapes, text runs, colors, fonts, tables, and layouts into standard OOXML presentation markup.
- **Reading (`pptx-parser.js`)**: A custom OOXML parser leveraging JSZip and DOMParser (`xmldom`). Unpacks `ppt/presentation.xml`, slide trees `ppt/slides/slide{N}.xml`, shapes (`p:sp`), text paragraphs (`a:p`), text runs (`a:r`), transforms (`a:xfrm`), and color maps.

---

## 6. Slide Show & Presenter View

- **Slide Show (`SlideShowView.jsx`)**:
  - Fullscreen view with live slide transition animations (Fade, Push, Wipe, Zoom, None).
  - Keyboard navigation: Arrow Right / Space / Page Down (Next slide), Arrow Left / Page Up (Previous slide), Escape (Exit).
  - **Laser Pointer**: Toggle with `L` key to display a high-visibility glowing laser pointer that tracks the mouse.
  - **Blackout Mode**: Toggle with `B` key to instantly blackout the screen for presentation focus.
- **Presenter View (`PresenterView.jsx`)**:
  - Dual-monitor console layout.
  - Large live elapsed presentation timer.
  - Current slide view + Next slide teaser preview.
  - Dedicated Speaker Notes pane.

---

## 7. Export & Handouts Printing

- **Export Presentation (`ExportDialog.jsx`)**:
  - Download as editable `.pptx` file.
  - Download active slide as crisp vector `.svg` file.
- **Print Handouts (`export-utils.js`)**:
  - Print-ready CSS (`@media print`) and layout engine supporting:
    - **1 slide per page**: Full page presentation slides.
    - **2 slides per page**: Stacked slides with margins.
    - **3 slides per page**: The classic presentation handout (slide on left, 4 ruled lines on right for taking notes).
    - **4 slides per page**: 2×2 grid.
    - **6 slides per page**: 2×3 compact grid.
    - **Notes pages**: Slide preview on top, speaker notes formatted below.

---

## 8. Verification & Test Suite

Run unit tests:

```bash
pnpm --filter @zoffice/slides test
```

All 10 test suites pass (46 tests):

- `slide-model.test.js`
- `slide-layouts.test.js`
- `shapes-and-arrange.test.js`
- `media-elements.test.js`
- `themes.test.js`
- `transitions.test.js`
- `animations.test.js`
- `slideshow-operations.test.js`
- `export-handouts.test.js`
- `pptx-roundtrip.test.js`
