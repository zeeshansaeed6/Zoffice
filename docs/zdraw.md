# ZDraw — Offline-First Vector Diagramming & Schema Suite

ZDraw is a native, offline-first vector diagramming and flowchart suite for Zoffice, located in `/packages/draw`. Built strictly according to `AGENTS.md` guidelines: plain ES2022+ JavaScript (no TypeScript), small modular files (< 300 lines per file), zero external telemetry, bundled open fonts and Lucide icons, and zero Microsoft assets.

---

## 1. Architecture Overview

ZDraw provides a fast, offline alternative to Microsoft Visio, Lucidchart, and draw.io, operating entirely offline with local SQLite storage:

```
┌─────────────────────────────────────────────────────────────┐
│                      Ribbon Toolbar                         │
│ [Select] [Pan] [Text] │ [Align] [Distribute] [Group] │ [SVG]│
├─────────────────────────────────────────────────────────────┤
│ Shape Library   │  Infinite SVG Canvas      │ Properties    │
│                 │                           │               │
│ [Flowchart]     │  ┌──────────┐             │ Fill Color    │
│  - Process      │  │ Start    │             │ Stroke Color  │
│  - Decision     │  └────┬─────┘             │ Stroke Width  │
│  - Terminator   │       │ (Orthogonal link) │ Line Style    │
│                 │  ┌────▼─────┐             │               │
│ [UML / ERD]     │  │ Decision │             │ Dimensions:   │
│  - Entity       │  └────┬─────┘             │  W: 140 H: 70 │
│  - Class Box    │       └──► [Action]       │               │
│                 │                           │ Alignment:    │
│ [Network]       │                           │ [L] [C] [R]   │
│  - Server/Cloud │                           │               │
├─────────────────────────────────────────────────────────────┤
│                        Status Bar                           │
│ N shapes │ N connectors │ Zoom: 100% │ Offline Vector Engine│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Capabilities

### 1. Shape Library (`/sidebar/ShapeLibraryPanel.jsx`)

- **Flowchart**: Process, Decision, Start/End Terminator, Document, Input/Output (Data).
- **Basic Geometries**: Rectangle, Rounded Rectangle, Ellipse/Circle, Diamond, Triangle, 5-Point Star, Cylinder, Hexagon.
- **UML**: Class Box, Interface, Package, Use Case, Actor.
- **ERD**: Entity, Weak Entity, Relationship, Attribute.
- **Network Architecture**: Server Host, Router, Switch, Cloud Network, Firewall, Database Cluster.
- **Drag-and-Drop**: Drag any shape directly onto the canvas at cursor drop coordinates.

### 2. Smart Connector Routing (`/core/connector-router.js`)

- **Routing Algorithms**:
  - **Orthogonal (90° steps)**: Clean right-angle paths with automated collision-avoidance loops (`calculateOrthogonalPath`).
  - **Curved (Cubic Bezier)**: Smooth organic curves respecting start/end anchor tangents.
  - **Straight Line**: Direct point-to-point connections.
- **Dynamic Anchors**: Anchors automatically lock to `top`, `right`, `bottom`, `left`, and `center` connection points on shapes, maintaining connections when shapes are moved.
- **Midpoint Text Labels**: Connectors support editable labels positioned automatically at the path midpoint.

### 3. Layout, Arrange, & Grouping (`/core/align-distribute.js`)

- **Alignment**: Align Left, Align Center, Align Right, Align Top, Align Middle, Align Bottom.
- **Distribution**: Distribute Horizontally, Distribute Vertically with equal spacing.
- **Z-Order Ordering**: Bring to Front, Send to Back.
- **Grouping**: Group multiple shapes into a single unit or ungroup.

### 4. Custom Shapes from SVG Paths (`/dialogs/CustomShapeModal.jsx`)

- Allows users to define custom shapes by pasting SVG path definitions (`d="..."`).
- Custom shapes can be styled with fills, strokes, labels, and participate in connector routing.

### 5. Multi-Format High-Fidelity Export (`/core/svg-exporter.js` & `ExportModal.jsx`)

- **SVG Vector (.svg)**: Standalone XML vector file with infinite scalability.
- **PNG Raster (.png)**: Lossless raster image via local offscreen canvas rendering.
- **PDF Print (.pdf)**: High-resolution print output via native print engine.

---

## 3. SQLite Storage Schema (`apps/desktop/src/main/draw-db.js`)

All diagrams and custom shapes are stored locally in SQLite:

- `draw_diagrams`:
  - `id` (TEXT PRIMARY KEY)
  - `title` (TEXT NOT NULL)
  - `data_json` (TEXT NOT NULL)
  - `created_at` (INTEGER NOT NULL)
  - `updated_at` (INTEGER NOT NULL)

Preload IPC bridge (`apps/desktop/src/preload/draw-api.js`):

- `window.zofficeAPI.draw.getDiagrams()`
- `window.zofficeAPI.draw.getDiagram(id)`
- `window.zofficeAPI.draw.saveDiagram(diagram)`
- `window.zofficeAPI.draw.deleteDiagram(id)`

---

## 4. Test Coverage & Verification

- **Unit Tests (`packages/draw/src/__tests__/`)**:
  - `models.test.js`: Shape, connector, layer factories, and anchor calculation math.
  - `routing.test.js`: Straight, curved Bezier, orthogonal right-angle routing, and waypoints.
  - `align.test.js`: Alignment, distribution, grouping, and z-ordering.
  - `svg-export.test.js`: Complete SVG XML serialization and markup validation.
  - `store.test.js`: Zustand store mutations, undo/redo, shape addition, and deletion.
- **Playwright E2E (`apps/desktop/e2e/draw.spec.js`)**:
  - Start screen launch, shape addition, properties inspection, and export dialog.
