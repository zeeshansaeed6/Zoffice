# Zoffice

> A free, open-source, desktop-only office suite with a familiar ribbon-style workflow and full compatibility with `.docx`, `.xlsx`, and `.pptx` documents.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/nicholaszoffice/zoffice/actions/workflows/ci.yml/badge.svg)](https://github.com/nicholaszoffice/zoffice/actions/workflows/ci.yml)

---

## 🌟 Vision

**Zoffice** delivers a premium desktop office experience inspired by modern ribbon interfaces, but built with a steadfast commitment to user privacy, open-source software, and offline reliability:

- **100% Offline-First**: No accounts, no subscriptions, no cloud forced logins, no telemetry.
- **Familiar Ribbon Interface**: Data-driven, collapsible ribbon toolbar, quick access toolbar, tabs, and status bar.
- **Full Format Compatibility**: Built to read and write `.docx`, `.xlsx`, and `.pptx` natively.
- **Modern Performance**: Fast Electron + React + Vite architecture with zero bloat.
- **Cross-Platform**: First-class support for Windows, macOS, and Linux.

---

## 📦 Applications

| App         | Description                                                               | Supported Formats                      |
| :---------- | :------------------------------------------------------------------------ | :------------------------------------- |
| **ZWriter** | Word processing with document formatting, margins, word count, and styles | `.docx`, `.odt`, `.rtf`, `.txt`, `.md` |
| **ZSheets** | Spreadsheets with formulas, grid navigation, and sorting                  | `.xlsx`, `.ods`, `.csv`                |
| **ZSlides** | Presentation designer with slide layouts, 16:9 canvas, and transitions    | `.pptx`                                |

_(Future releases: ZNotes, ZMail, ZCalendar, ZForms, ZPlanner, ZDraw, ZBase, ZDrive)_

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 20.0.0)
- [pnpm](https://pnpm.io/) (>= 9.0.0)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/nicholaszoffice/zoffice.git
cd zoffice

# Install dependencies (automatically rebuilds native better-sqlite3 for Electron)
pnpm install

# Start the desktop application in development mode with hot reload
pnpm dev
```

### Running Tests & Linting

```bash
# Run unit tests
pnpm test

# Run ESLint (zero warnings allowed)
pnpm lint

# Check code formatting
pnpm format:check

# Run Playwright E2E smoke tests
pnpm test:e2e
```

### Production Packaging

```bash
# Build production bundle
pnpm build

# Package unpacked desktop binary
pnpm -F @zoffice/desktop pack
```

---

## 🏗️ Monorepo Architecture

```
zoffice/
├── apps/
│   └── desktop/          # Electron main process, preload, and React renderer shell
├── packages/
│   ├── core/             # Shared logic (i18n, shortcuts, undo/redo, file manager, autosave)
│   ├── ui/               # Shared React UI components (Ribbon, StatusBar, Dialogs, Theme)
│   ├── writer/           # ZWriter word processor
│   ├── sheets/           # ZSheets spreadsheet app
│   └── slides/           # ZSlides presentation designer
└── docs/                 # Architecture & roadmap documentation
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architectural specifications.

---

## 📜 Contributing & Rules

Contributions are welcome! Please review:

- [AGENTS.md](AGENTS.md) — Non-negotiable coding and architectural standards.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Step-by-step contribution guidelines.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — Contributor Covenant code of conduct.

---

## 📄 License

Zoffice is released under the [MIT License](LICENSE).
