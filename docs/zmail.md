# ZMail + ZCalendar — Offline-First Desktop Communication Suite

ZMail and ZCalendar provide an offline-first desktop email, calendaring, and contacts management suite for Zoffice, located in `/packages/mail`. Built strictly according to `AGENTS.md` rules: plain ES2022+ JavaScript (no TypeScript), modular files (< 300 lines per file), zero telemetry, bundled open fonts/Lucide icons, and zero Microsoft branding or copied assets.

---

## 1. Architecture & Subsystems

ZMail integrates three interconnected productivity tools into a unified interface with an Outlook-style bottom-left app switcher:

```
┌─────────────────────────────────────────────────────────────┐
│                      Ribbon Toolbar                         │
├────┬────────────────────┬────────────────────┬──────────────┤
│ A  │ Folder Tree        │ Message List /     │ Reading Pane │
│ p  │ (Inbox, Sent,      │ Search & Threads   │ or Event/    │
│ p  │  Drafts, Archive,  │ (Subject, Senders, │ Contact Card │
│ s  │  Trash)            │  Date, Flags)      │              │
├────┴────────────────────┴────────────────────┴──────────────┤
│                       Status Bar                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mail Subsystem (`/packages/mail/src/mail`)

- **3-Pane Layout**:
  - **Left Pane (`FolderList.jsx`)**: Account selector, unread badges, standard folders (Inbox, Sent, Drafts, Archive, Junk, Trash).
  - **Middle Pane (`MessageList.jsx`)**: Search input, filter pills (All, Unread, Flagged), conversation threading, flag toggle, attachment indicators.
  - **Right Pane (`ReadingPane.jsx`)**: Full message header, reply / forward actions, recipient chips, attachment downloads, sanitized message body.
- **Compose Modal (`ComposeModal.jsx`)**: To/Cc/Bcc address entry, subject, rich content area, file attachment picker with base64 data URL persistence.
- **Account Configuration (`AccountSetupModal.jsx`)**: IMAP/SMTP host configuration with presets (Gmail, Custom), secure port handling (993/465/587), and encrypted password storage.
- **Conversation Threading (`threading.js`)**: Automatically groups replies and forwards by subject normalization (`Re:`, `Fwd:`) or RFC Message-ID / In-Reply-To references.
- **Full-Text Mail Search (`mail-search.js`)**: Real-time filtering across sender, recipient, subject, body text, attachment filenames, and folder scope.

---

## 3. Calendar Subsystem (`/packages/mail/src/calendar`)

- **Multi-View Modes**:
  - **Month View (`MonthView.jsx`)**: Full calendar month grid with day numbers, outside-month padding, event pills, and direct slot creation.
  - **Week View (`WeekView.jsx`)**: 7-day or 5-day work week hourly grid with timed event placement.
  - **Day View (`DayView.jsx`)**: Detailed 24-hour time slot schedule.
- **Recurrence Engine (`rrule.js`)**: Expands recurring events (daily, weekly, monthly, yearly with intervals and termination rules) across visible date ranges without polluting the database.
- **RFC 5545 iCalendar Support (`ics.js`)**:
  - Complete `.ics` export (`exportToIcs`) and import (`parseIcs`) engine.
  - Generates valid `VEVENT`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, `RRULE`, and `ATTENDEE` tags.

---

## 4. Contacts Subsystem (`/packages/mail/src/contacts`)

- **Address Book (`ContactList.jsx`)**: Searchable list of personal and organization contacts with initials avatars and color coding.
- **Contact Management (`ContactModal.jsx`)**: Modal dialog to add and edit contact name, email, phone, organization, and notes.
- **Quick Compose**: Single-click "Send Email" action directly launches compose targeting the selected contact.
- **RFC 6350 vCard Support (`vcard.js`)**:
  - Full `.vcf` vCard 3.0 export (`exportToVcard`) and import (`parseVcard`).
  - Supports `FN`, `EMAIL`, `TEL`, `ORG`, and `NOTE` properties.

---

## 5. Main Process Backend & Secure Storage

- **SQLite Database (`apps/desktop/src/main/mail-db.js`)**:
  - `mail_accounts`: Account configuration, server hostnames, ports, and colors.
  - `mail_credentials`: Passwords encrypted via Electron's `safeStorage` API with graceful fallback.
  - `mail_messages`: Cached emails, folders, attachments, unread states, and flags.
  - `calendar_events`: Events, schedules, attendees, and recurrence rules.
  - `contacts`: Address book entries.
- **IPC Handlers (`apps/desktop/src/main/ipc-handlers.js`)**:
  - `mail:getAccounts`, `mail:saveAccount`, `mail:deleteAccount`
  - `mail:getMessages`, `mail:saveMessage`, `mail:deleteMessage`
  - `calendar:getEvents`, `calendar:saveEvent`, `calendar:deleteEvent`
  - `contacts:getContacts`, `contacts:saveContact`, `contacts:deleteContact`
- **Preload Bridge (`apps/desktop/src/preload/index.js`)**:
  - Strictly validated type signatures exposing `window.zofficeAPI.mail`, `window.zofficeAPI.calendar`, and `window.zofficeAPI.contacts`.

---

## 6. Verification & Quality

- **Unit Tests**:
  - `packages/mail/src/__tests__/mail-model.test.js`: Models and ID generation.
  - `packages/mail/src/__tests__/threading.test.js`: Subject normalization and conversation grouping.
  - `packages/mail/src/__tests__/mail-search.test.js`: Full-text search and filtering.
  - `packages/mail/src/__tests__/calendar.test.js`: Recurrence expansion and iCalendar (.ics) roundtrip.
  - `packages/mail/src/__tests__/contacts.test.js`: Address book models and vCard (.vcf) roundtrip.
  - `packages/mail/src/__tests__/stores.test.js`: Zustand store state machines and actions.
- **E2E Tests**:
  - `apps/desktop/e2e/mail.spec.js`: Verifies launcher tile, tab opening, 3-pane email interface, compose modal, and calendar navigation.
