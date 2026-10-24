# Security Policy & Vulnerability Disclosure

Zoffice is designed with an offline-first, privacy-by-default architecture. We take software security, process isolation, and user data confidentiality seriously.

---

## Supported Versions

Only the latest release family receives security updates and vulnerability patches:

| Version | Supported          | Security Patches |
| ------- | ------------------ | ---------------- |
| 1.0.x   | :white_check_mark: | Active           |
| < 1.0   | :x:                | Unsupported      |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Zoffice, **please do not disclose it publicly or open a public issue.**

Instead, please report it via one of the following confidential channels:

1. **GitHub Private Security Advisory (Recommended):**
   Open a private disclosure report at [github.com/nicholaszoffice/zoffice/security/advisories/new](https://github.com/nicholaszoffice/zoffice/security/advisories/new).
2. **Security Team Email:**
   Send a detailed vulnerability report to `security@zoffice.org` (PGP key available upon request).

### What to Include
To help us triage and resolve the issue quickly, please provide:
- A clear description of the vulnerability and its potential impact.
- Step-by-step instructions or a minimal Proof of Concept (PoC) to reproduce the issue.
- Operating system version and Zoffice release version.
- Any suggested remediation or defensive patch.

### Our Response SLA
- **Initial Acknowledgement:** Within **48 hours** of receiving your report.
- **Triage & Assessment:** Within **5 business days**, confirming reproduction and severity.
- **Resolution & Patch:** Coordinated security advisory and release within **14 calendar days** for high/critical vulnerabilities.

---

## Security Architecture & Defense in Depth

### 1. Electron Isolation & Sandboxing
The desktop application strictly enforces standard Electron hardening best practices:
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- `webSecurity: true`
- `allowRunningInsecureContent: false`

### 2. Preload IPC Boundary
Renderer processes have zero direct access to Node.js or Electron internals. All host interactions pass through a validated preload bridge with strict type validation on all channel arguments.

### 3. Strict Content Security Policy (CSP)
Every window enforces a strict Content Security Policy HTTP header:
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'self';
```
Remote code execution, unvetted external scripts, and arbitrary `eval()` are prevented.

### 4. Navigation & Window Controls
- `window.open()` and new tab requests are intercepted and denied. External web links explicitly open in the user's default system browser via `shell.openExternal`.
- Arbitrary navigation (`will-navigate`) is prevented, confining the renderer to local bundled assets.

### 5. Credential Encryption at Rest
Credentials stored for email or account connections (e.g. SMTP/IMAP in ZMail) are encrypted on disk using Electron's native `safeStorage` API:
- **Windows:** Protected via Windows DPAPI (Data Protection API).
- **macOS:** Protected via Apple Keychain Services.
- **Linux:** Protected via Freedesktop Secret Service API / GNOME Keyring / KWallet.

### 6. Plugin Sandbox Model
Third-party extensions execute inside isolated closures without direct DOM, filesystem, or network access. Permissions are capability-based and require explicit user consent.

### 7. Zero Telemetry & Offline Sovereignty
Zoffice transmits zero analytics, usage logs, device fingerprints, or document contents to any external servers. Optional AI features only connect to endpoints explicitly configured with user-provided API keys or local instances (Ollama).
