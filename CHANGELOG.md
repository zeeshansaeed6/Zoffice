# Changelog

All notable changes to Zoffice are documented in this file.

## [v1.0.0] - 2026-10-24

### Features & Enhancements

- **settings**: implement centralized settings center modal with privacy statement (`7bd5298`)
- **updater**: configure electron-updater for GitHub Releases, portable builds, and code-signing documentation (`76f70e0`)
- **i18n**: expand localization to 6 languages with full RTL layout support (`40639d9`)
- **ai**: add opt-in privacy-preserving AI assistant sidebar with local Ollama support (`50d8737`)
- **templates**: implement in-app templates gallery with 23 original templates (`d05e488`)
- **plugins**: implement sandboxed plugin engine, permission model, and sample plugins (`e2cc74c`)
- **a11y**: implement high-contrast theme, scalable UI, and comprehensive ARIA keyboard navigation (`dca53d6`)
- **perf**: add lazy loading for all app packages and startup profiling docs (`3e2d644`)
- **design**: standardize cross-app UI consistency and create design system documentation (`b690c5a`)
- **drive**: implement ZDrive offline local cloud drive, version control, and storage quota suite (`3ed099a`)
- **base**: implement ZBase relational database suite with Grid, Kanban, Form, and SQL console (`bdc470d`)
- **draw**: implement ZDraw vector diagramming, routing connectors, and shape suite (`a5229b0`)
- **planner**: implement ZPlanner Kanban, Gantt timeline, and calendar suite (`55498bd`)
- **forms**: implement ZForms builder, preview, responses, and branching logic with SQLite persistence (`eb12a72`)
- **mail**: implement ZMail, ZCalendar, and contacts with SQLite and safeStorage (`35fe525`)
- **notes**: implement ZNotes notebook app with free-form canvas and SQLite persistence (`e152a91`)
- **slides**: implement export and print handouts with documentation (`fdaad06`)
- **slides**: implement slide show fullscreen view and presenter console (`7808e95`)
- **slides**: implement animation engine, triggers, and animation pane (`d5328b9`)
- **slides**: implement 60fps transitions engine, transition types, and ribbon controls (`9612bab`)
- **slides**: implement slide tables, Chart.js visualizations, and image elements (`c5ee30f`)
- **slides**: implement .pptx export and import with XML parsing and roundtrip tests (`8078330`)
- **slides**: implement 12 curated themes, theme gallery, and theme engine (`e3022c3`)
- **slides**: implement slide thumbnails panel, drag-to-reorder, and layout picker (`d2098fe`)
- **slides**: implement text boxes, rich shapes library, WordArt styles, and arrange utilities (`85d886a`)
- **slides**: implement slide canvas, slide model, selection, and transform handles (`2705d63`)
- **sheets**: integrate HyperFormula engine with comprehensive 300+ function support and tests (`99c5b20`)
- **sheets**: implement virtualized canvas grid, cell editing, and formula bar (`5861853`)
- **writer**: harden docx fidelity with direct ooxml parsing, preservation, and report tool (`5eb813e`)
- **writer**: implement milestone 1a tiptap core, ribbon, and docx roundtrip (`2900af5`)

### Maintenance & Infrastructure

- fixed errors and contuniung phhae 4 (`9b83116`)
- adding mail to packages (`9ed4946`)
- config edited --- imp (`c28ceb5`)
- Phase 4 started and updating opacxkages till now (`167ef93`)
- added files and edited in package and changed global.css (`d282753`)
- updating changed in phase 1 (`bc492ad`)
- phase 1 started (`75090f2`)
- First commit (`9c3846c`)

### Bug Fixes

- **slides**: export writePptxFile and parsePptxFile to fix electron-vite dependency bundling (`8ec6628`)
- **writer**: export convertJsonToDocxElements to resolve dev server build error (`2ffcd54`)
- **desktop**: resolve electron preload path, lucide dependencies, and verify phase 0 (`ca00aa7`)

### Other Improvements

- Zwriter inserted tab (`be3e778`)
