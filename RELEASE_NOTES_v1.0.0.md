# Zoffice v1.0.0 Release Notes

**Release Date:** October 24, 2026  
**License:** MIT License (100% Free & Open Source)  
**Downloads:** [GitHub Releases v1.0.0](https://github.com/nicholaszoffice/zoffice/releases/tag/v1.0.0)

---

## 🚀 Welcome to Zoffice v1.0.0!

We are thrilled to announce the official **v1.0.0 general availability release of Zoffice** — the free, sovereign, offline-first desktop office suite.

Zoffice provides a familiar, modern ribbon interface to write documents, compute spreadsheets, design presentations, manage projects, and organize data without recurring fees, forced cloud logins, or telemetry tracking.

---

## 🌟 Key Highlights & Philosophy

### 1. 100% Digital Sovereignty
- **Zero Telemetry:** Zoffice transmits no usage metrics, device fingerprints, or analytics beacons.
- **Offline by Default:** Everything runs locally. You can use Zoffice completely disconnected from the internet.
- **No Accounts or Paywalls:** No email signups, product keys, or feature tier gates.

### 2. High-Performance Engineering
- **Instant Launch (< 1.5s):** Fast startup achieved through modular package lazy loading and optimized electron-vite bundling.
- **Lean Memory:** Idle Start Screen consumes under 75 MB RSS.
- **In-Process SQLite:** High-speed, ACID-compliant local database persistence.

### 3. Native Open XML & Open Standards
Read and write standard formats with high fidelity:
- Word Processing: `.docx`, `.odt`, `.txt`, `.md`
- Spreadsheets: `.xlsx`, `.ods`, `.csv`
- Presentations: `.pptx`, `.odp`, `.pdf`
- Diagrams: `.svg`, `.png`, `.zdraw`

---

## 📦 What's Inside: The 10-App Suite

### 📝 ZWriter (Word Processor)
- Document canvas with pagination, margins, headers, footers, and footnotes.
- Rich typography with open fonts (**Inter**, **Carlito**, **Liberation Sans**).
- Tables, borders, shading, and image insertion.
- High-fidelity `.docx` preservation and roundtripping.
- Included **Word Frequency Counter** plugin for vocabulary and reading-time analysis.

### 📊 ZSheets (Spreadsheet Engine)
- Virtualized canvas grid smoothly navigating 100,000+ rows.
- HyperFormula engine supporting **300+ standard Excel functions** (`SUM`, `VLOOKUP`, `INDEX/MATCH`, `XLOOKUP`, `FILTER`).
- Cell formatting for currency, percentages, dates, and custom numbers.
- Included **CSV Data Cleaner** plugin for normalizing raw datasets.

### 📽️ ZSlides (Presentation Engine)
- 16:9 presentation canvas with text boxes, geometric shapes, and tables.
- **12 Curated Designer Themes** (Midnight, Ivory, Nordic Blue, Slate, Emerald, Coral, and more).
- 60fps hardware-accelerated slide transitions and object animations.
- Fullscreen slide show view with dedicated dual-display Presenter Console.
- Printable multi-slide handout generator.

### 📒 ZNotes (Personal Notebook)
- Hierarchical organization: Notebooks → Sections → Pages.
- Free-form canvas supporting text blocks, checklists, and pen sketches.
- Instant full-text search with local SQLite indexing.

### 📬 ZMail & ZCalendar (Email & Schedule)
- Offline-first email client with IMAP/SMTP connectivity.
- Unified calendar with Day, Week, and Month views.
- Offline address book and contacts directory.
- Passwords encrypted at rest using OS-native `safeStorage` (Windows DPAPI, macOS Keychain, Linux Secret Service).

### 📋 ZForms (Form & Survey Builder)
- Drag-and-drop form designer with text, dropdown, radio, rating, and file inputs.
- Conditional branching logic based on user responses.
- Local response storage and 1-click CSV/JSON export.

### 📌 ZPlanner (Agile Project Management)
- Kanban boards with drag-and-drop cards and customizable swimlanes.
- Interactive Gantt chart timeline view with dependencies and milestones.
- Trello / CSV board import and export.

### ✏️ ZDraw (Vector Diagramming)
- Flowchart and system architecture shape libraries.
- Smart connector routing with orthogonal and curved lines.
- SVG, PNG, and native `.zdraw` export.

### 🗄️ ZBase (Relational Visual Database)
- Multi-table relational visual database.
- Grid, Kanban, and Form views for table records.
- In-app SQL query console for direct SQLite queries.

### 💾 ZDrive (Local Cloud Explorer)
- Sovereign document explorer with automatic version history tracking.
- Tag-based organization and disk storage quota monitoring.

---

## 🛠️ Phase 5 Polish & Extensibility Additions

1. **In-App Templates Gallery:** 23 original templates covering resumes, consulting invoices, business expense trackers, household budgets, startup pitch decks, agile sprints, and infrastructure diagrams.
2. **Capability-Gated Plugin Engine:** Safe, sandboxed JavaScript extension system with permission prompts (`docs/plugins.md`).
3. **Optional AI Assistant Sidebar:** Completely opt-in AI sidebar supporting **local offline models via Ollama** (`http://localhost:11434`) or user-provided OpenAI/Anthropic API keys.
4. **Comprehensive Accessibility:** WCAG 2.1 AA compliance, high-contrast theme (7:1 contrast ratio), 100% to 200% scalable UI, and roving tabindex keyboard navigation.
5. **Localization & RTL Support:** Translated into 6 languages (English, Hindi, Urdu, Spanish, French, German) with automatic Right-to-Left bidirectional layout support for Urdu.
6. **Centralized Settings Center:** Modal for theme modes, UI scale, default fonts, autosave intervals, default file formats, spellcheck, plugin management, and official privacy statement.
7. **Auto-Updater & Portable Editions:** Automatic updates via GitHub Releases alongside zero-install portable `.exe` builds for Windows.

---

## 📥 Downloads & Binary Verification

| OS | Package | File | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| **Windows** | Setup Installer | `Zoffice-Setup-1.0.0.exe` | *(published with release)* |
| **Windows** | Portable Edition | `Zoffice-1.0.0-portable.exe` | *(published with release)* |
| **Windows** | Enterprise MSI | `Zoffice-1.0.0.msi` | *(published with release)* |
| **macOS** | Universal DMG | `Zoffice-1.0.0.dmg` | *(published with release)* |
| **Linux** | Universal AppImage | `Zoffice-1.0.0.AppImage` | *(published with release)* |
| **Linux** | Debian Package | `zoffice_1.0.0_amd64.deb` | *(published with release)* |

Verify downloaded assets using the published `SHASUMS256.txt` and cryptographic signatures.

---

## 💬 Community & Feedback

- **Website:** [docs/site](docs/site/index.html) (Deployable to GitHub Pages)
- **Discussions:** [GitHub Discussions](https://github.com/nicholaszoffice/zoffice/discussions)
- **Issue Tracker:** [GitHub Issues](https://github.com/nicholaszoffice/zoffice/issues)
- **Security Inquiries:** `security@zoffice.org` / [SECURITY.md](SECURITY.md)

*Zoffice is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Microsoft Corporation.*
