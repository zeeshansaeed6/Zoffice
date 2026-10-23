# Contributing to Zoffice

Thank you for your interest in contributing to Zoffice! This guide will help you
get started.

## Development Setup

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Git**

### Getting Started

```bash
# Clone the repository
git clone https://github.com/nicholaszoffice/zoffice.git
cd zoffice

# Install dependencies (also rebuilds native modules for Electron)
pnpm install

# Start the development server with hot reload
pnpm dev

# Run linting
pnpm lint

# Run unit tests
pnpm test

# Run end-to-end tests (builds first)
pnpm test:e2e
```

## Project Structure

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed overview of the
monorepo layout and data flow.

## Code Standards

1. **Read [AGENTS.md](AGENTS.md)** — these are non-negotiable rules.
2. **Plain JavaScript only** — no TypeScript. Use JSDoc for type hints.
3. **ESLint + Prettier** — run `pnpm lint` before pushing. Zero warnings allowed.
4. **Small files** — keep files under 300 lines.
5. **Meaningful names** — descriptive variable, function, and file names.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(writer): add paragraph formatting toolbar
fix(core): prevent autosave race condition
docs: update ARCHITECTURE.md with IPC diagram
chore: upgrade electron to v34
test(ui): add ribbon collapse test
```

## Pull Request Process

1. Fork the repo and create a feature branch from `main`.
2. Make your changes in small, focused commits.
3. Ensure `pnpm lint` and `pnpm test` pass.
4. Fill out the PR template completely.
5. Request review from a maintainer.

## Reporting Bugs

Use the [Bug Report](https://github.com/nicholaszoffice/zoffice/issues/new?template=bug_report.md)
template. Include steps to reproduce, expected vs actual behavior, and your OS/Electron version.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind,
be respectful, be constructive.
