# Contributing to Zoffice

Thank you for your interest in contributing to Zoffice! We are a community of open-source enthusiasts building a sovereign, offline-first productivity suite.

---

## 🧭 Non-Negotiable Rules (From AGENTS.md)

Every pull request must strictly comply with these core rules:

1. **Plain JavaScript Only:** ES2022+ modules only. **Zero TypeScript anywhere in the repository.** Use rich JSDoc (`@param`, `@returns`, `@typedef`) for editor autocompletion and static analysis.
2. **Small Files:** Every file must remain **strictly under 300 lines**. Split components, stores, and helpers into focused modules.
3. **No Microsoft Assets or Branding:** Never use Microsoft product names, icons, or proprietary fonts (such as Calibri or Segoe). Use open fonts (**Inter**, **Carlito**, **Liberation Sans**) and **Lucide** icons.
4. **100% Offline-First:** No accounts, no user telemetry, no cloud phone-homes. Fonts and icons must be bundled locally, never loaded from CDNs.
5. **Zero Lint Errors & Warnings:** ESLint (flat config) and Prettier must pass with **0 errors and 0 warnings** (`pnpm lint`).
6. **Electron Isolation:** Context isolation enabled, node integration disabled, sandbox enabled, validated preload IPC boundary.

---

## 🚀 Development Setup

### Prerequisites
- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Git**
- C++ / Python build tools (for native `better-sqlite3` rebuilds)

### Clone & Run
```bash
# Clone repository
git clone https://github.com/nicholaszoffice/zoffice.git
cd zoffice

# Install dependencies (automatically rebuilds native modules for Electron)
pnpm install

# Start in development mode with hot-reload
pnpm dev

# Run unit test suite
pnpm test

# Run linter
pnpm lint

# Check code formatting
pnpm format:check
```

---

## 🏷️ Finding "Good First Issues"

If you are new to the codebase, look for issues labeled:

- `good first issue` — bite-sized tasks perfect for first-time contributors.
- `help wanted` — well-scoped features and bug fixes looking for an owner.
- `docs` — improvements to documentation, tutorials, or architecture guides.
- `localization` — translating strings into new languages in `@zoffice/core/i18n/dictionaries/`.
- `plugin` — creating and sharing new capability-sandboxed plugins in `plugins/`.
- `template` — creating original templates in `packages/core/src/templates/`.

### Recommended First Tasks
1. **Add a New Localization**:
   Add a new dictionary file (e.g. `it.json`, `pt.json`, `ar.json`) in `packages/core/src/i18n/dictionaries/` and register it in `i18n.js`.
2. **Build a Sandboxed Plugin**:
   Create a new plugin under `plugins/my-plugin/` with a `manifest.json` and `index.js`.
3. **Contribute Document Templates**:
   Add an original resume, budget, or presentation template to `@zoffice/core/templates/`.
4. **Formula Engine Extensions**:
   Implement additional Excel/Spreadsheet formula functions with tests in `packages/sheets/`.

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(writer): add paragraph formatting toolbar
fix(core): prevent autosave race condition
perf(sheets): optimize virtualized canvas scrolling
docs: update ARCHITECTURE.md with IPC diagram
chore: upgrade electron to v34
test(ui): add ribbon collapse test
```

---

## 🔍 Pull Request Process

1. Fork the repo and create a topic branch from `main` (`git checkout -b feat/my-feature`).
2. Implement your changes keeping all files under 300 lines.
3. Add unit tests for new functionality in `__tests__/`.
4. Ensure `pnpm lint` and `pnpm test` pass with 100% green status.
5. Commit using conventional commit format.
6. Submit a Pull Request targeting `main`. Fill in the PR template completely. Maintainers will review within 48 hours.

---

## 💬 Community & Questions

- **GitHub Discussions:** Join our community forum at [github.com/nicholaszoffice/zoffice/discussions](https://github.com/nicholaszoffice/zoffice/discussions).
- **Code of Conduct:** Please review our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, welcoming, and collaborative.
