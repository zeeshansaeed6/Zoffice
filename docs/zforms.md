# ZForms — Offline-First Form Builder & Response Suite

ZForms is an offline-first desktop form, survey, and quiz creation tool for Zoffice, located in `/packages/forms`. Built strictly according to `AGENTS.md` rules: plain ES2022+ JavaScript (no TypeScript), small modular files (< 300 lines per file), zero telemetry, bundled open fonts/Lucide icons, and zero Microsoft assets.

---

## 1. Architecture Overview

ZForms provides a complete alternative to Google Forms and Microsoft Forms, operating entirely offline with local SQLite storage:

```
┌─────────────────────────────────────────────────────────────┐
│                      Ribbon Toolbar                         │
├─────────────────────────────────────────────────────────────┤
│ Questions / Builder  │  Responses (N)  │ Settings │ Preview │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Form Title & Theme Banner                                  │
│  ├── Section 1 (Title, Description, Navigation Rule)        │
│  │    ├── Question 1 (Title, Type, Choices, Required)      │
│  │    └── Question 2 (Linear Scale, Min/Max Labels)         │
│  └── Section 2 Break                                        │
│       └── Question 3 (File Upload / Paragraph)              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                        Status Bar                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Question Types (`QUESTION_TYPES`)

ZForms supports 9 versatile question types:

1. **Short Answer (`short_text`)**: Single-line text input for names, emails, short IDs.
2. **Paragraph (`paragraph`)**: Multi-line textarea for essays, comments, and long feedback.
3. **Multiple Choice (`multiple_choice`)**: Single-selection radio buttons with choice-based branching logic.
4. **Checkboxes (`checkboxes`)**: Multi-selection checkboxes for picking one or more options.
5. **Dropdown (`dropdown`)**: Compact single-selection dropdown menu with choice branching.
6. **Linear Scale (`linear_scale`)**: Numerical rating scale (0-5, 1-5, 1-10) with custom low and high anchor labels.
7. **Date (`date`)**: Native calendar date picker.
8. **Time (`time`)**: 24-hour / 12-hour clock time selector.
9. **File Upload (`file_upload`)**: Local file attachments with base64 data persistence.

---

## 3. Section Breaks & Conditional Branching Logic

- **Section Breaks (`SectionCard.jsx`)**: Divide long surveys into paginated pages with individual section titles, descriptions, and completion rules.
- **Choice-Based Branching (`BranchingModal.jsx`)**: Configure destination sections based on the respondent's answer:
  - _Continue to next section_ (default)
  - _Go to section X_ (skip irrelevant sections)
  - _Submit form_ (early exit)
- **Validation Engine (`logic-engine.js`)**: Validates required questions per section before enabling pagination or submission.

---

## 4. Responses Dashboard & Analytics

- **Summary Charts (`SummaryCharts.jsx`)**:
  - Horizontal bar charts showing counts and percentage distributions for choice-based questions.
  - Column distributions for linear scale ratings.
  - Response text lists for open-ended questions.
  - Completely lightweight SVG/HTML without external heavy charting libraries.
- **Individual Responses (`IndividualResponseViewer.jsx`)**:
  - Paged stepper (`Response 1 of N`) showing exact timestamps and answers per respondent.
- **CSV / ZSheets Export (`export-csv.js`)**:
  - Exports all submissions to RFC 4180 compliant `.csv` files for direct analysis in ZSheets.
- **Embed Code Generator (`EmbedModal.jsx` & `embed-generator.js`)**:
  - Generates responsive HTML `<iframe>` embed codes with customizable dimensions and border styling for website integration.

---

## 5. Main Process Backend & SQLite Storage

- **Database Tables (`apps/desktop/src/main/forms-db.js`)**:
  - `forms`: Stores form schemas, titles, descriptions, theme colors, settings, and question definitions.
  - `form_responses`: Stores submitted response records with foreign keys and cascade deletion.
- **Preload Bridge (`apps/desktop/src/preload/forms-api.js`)**:
  - Strictly typed validation exposing `window.zofficeAPI.forms`.
- **IPC Handlers (`apps/desktop/src/main/ipc-handlers.js`)**:
  - `forms:getForms`, `forms:getForm`, `forms:saveForm`, `forms:deleteForm`
  - `forms:getResponses`, `forms:saveResponse`, `forms:deleteResponse`, `forms:clearResponses`

---

## 6. Verification & Quality

- **Unit Tests**:
  - `packages/forms/src/__tests__/models.test.js`: Models, factories, and ID generation.
  - `packages/forms/src/__tests__/logic.test.js`: Branching logic routing and section validation.
  - `packages/forms/src/__tests__/export-embed.test.js`: RFC 4180 CSV export and responsive embed generator.
  - `packages/forms/src/__tests__/store.test.js`: Zustand store actions, question management, and respondent workflow.
- **E2E Tests**:
  - `apps/desktop/e2e/forms.spec.js`: Verifies Start Screen tile, form builder mounting, adding questions, switching to Preview, filling out a form, and viewing the Responses dashboard.
