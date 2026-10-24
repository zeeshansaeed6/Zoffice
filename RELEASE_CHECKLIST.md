# Zoffice v1.0.0 Public Release Checklist

This document is the definitive pre-flight and release day checklist for publishing official Zoffice releases.

---

## 1. Pre-Flight Code Quality & Architecture Verification

- [x] **Zero TypeScript:** Verified repository contains strictly ES2022+ JavaScript and JSX. Zero `.ts` or `.tsx` files present.
- [x] **File Size Constraint:** All files strictly under 300 lines per `AGENTS.md`.
- [x] **Zero ESLint Warnings:** `pnpm lint` completes with **0 errors and 0 warnings**.
- [x] **Zero Prettier Violations:** `pnpm format:check` passes across all files.
- [x] **100% Test Suite Green:** All 57 test files and 304 unit tests pass (`pnpm test`).
- [x] **Playwright E2E Smoke Tests:** Playwright electron test suite completes successfully (`pnpm test:e2e`).
- [x] **Branding Audit:** No Microsoft names, icons, or proprietary fonts (Calibri, Segoe). Open fonts (Inter, Carlito, Liberation Sans) and Lucide icons only.
- [x] **Offline Sovereignty:** Confirmed zero network requests during normal operations, zero telemetry, zero analytics tracking.

---

## 2. Performance & Accessibility Verification

- [x] **Startup Time Benchmark:** Startup time verified at **1.34s** (exceeding target of < 3.0s) via package lazy loading (`docs/performance.md`).
- [x] **Memory Footprint:** Initial Start Screen memory footprint under **75 MB RSS** (62.6% reduction).
- [x] **Accessibility (a11y) Audit:** WCAG 2.1 AA compliance verified with `axe-core` in `packages/ui/src/__tests__/a11y.test.jsx` (0 critical or serious violations).
- [x] **High-Contrast Theme:** Verified 7:1 contrast ratio and yellow outline focus indicators in `ThemeProvider.jsx`.
- [x] **Display Scaling:** Verified scalable UI engine (100% to 200%) dynamically updates CSS custom properties.
- [x] **Keyboard Navigation:** Full roving tabindex and arrow navigation across TabBar, Ribbon, Dialogs, and Menus.

---

## 3. Extensibility & Features Verification

- [x] **Plugin Engine:** Sandboxed JavaScript plugin runner with capability permissions (`docs/plugins.md`).
- [x] **Reference Plugins:** Word Frequency Counter (`plugins/word-counter/`) and CSV Cleaner (`plugins/csv-cleaner/`) verified.
- [x] **Templates Gallery:** 23 original templates across 5 categories in `@zoffice/core` accessible via Start Screen and `TemplatesGalleryModal`.
- [x] **Optional AI Assistant:** Verified off-by-default, zero network calls without user configuration, local Ollama (`localhost:11434`) and API key support in ZWriter, ZSheets, and ZSlides.
- [x] **Localization:** 6 complete language dictionaries (`en`, `hi`, `ur`, `es`, `fr`, `de`) with automated RTL layout for Urdu.
- [x] **Settings Center:** Themes, UI scale, typography defaults, autosave interval, default formats, spellcheck, plugin manager, and privacy statement in `SettingsModal`.

---

## 4. Release Engineering & Build Verification

- [x] **Version Bump:** `package.json` and `apps/desktop/package.json` set to `1.0.0`.
- [x] **electron-updater:** Configured in `apps/desktop/src/main/auto-updater.js` for GitHub Releases with opt-in user sovereignty.
- [x] **Portable Windows Target:** `portable` target configured in `apps/desktop/package.json`.
- [x] **Code Signing Documentation:** Complete guide in [`docs/code-signing.md`](docs/code-signing.md) for Windows Authenticode, macOS Gatekeeper / Notarization, and Linux GPG package signatures.
- [x] **GitHub Actions Workflow:** `.github/workflows/release.yml` configured to build and publish Windows (`.exe`, portable, `.msi`), macOS (`.dmg`), and Linux (`.AppImage`, `.deb`) on tag push (`v*.*.*`).
- [x] **Changelog Automation:** `pnpm changelog` generates categorized markdown in `CHANGELOG.md`.
- [x] **Security Policy:** [`SECURITY.md`](SECURITY.md) published with vulnerability reporting SLA and isolation details.
- [x] **Post-v1.0 Roadmap:** Future vision for v1.1, v1.2, and v2.0 published in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 5. Release Day Execution Steps

1. **Tag the Release:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0 - The Sovereign Desktop Office Suite"
   git push origin v1.0.0
   ```
2. **Monitor GitHub Actions Build:**
   Verify matrix builds succeed on `windows-latest`, `macos-latest`, and `ubuntu-latest`.
3. **Verify Published Assets on GitHub Release:**
   - `Zoffice-Setup-1.0.0.exe`
   - `Zoffice-1.0.0-portable.exe`
   - `Zoffice-1.0.0.msi`
   - `Zoffice-1.0.0.dmg`
   - `Zoffice-1.0.0.AppImage`
   - `zoffice_1.0.0_amd64.deb`
   - `SHASUMS256.txt` and `SHASUMS256.txt.asc`
4. **Publish Release Notes:** Copy contents from `RELEASE_NOTES_v1.0.0.md` into the GitHub Release body.
5. **Deploy Landing Page:** Deploy `docs/site` to GitHub Pages.
6. **Community Announcements:** Publish announcement in GitHub Discussions, Reddit (`r/opensource`, `r/linux`), and Hacker News.
