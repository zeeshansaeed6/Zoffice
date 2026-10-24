/**
 * ZForms Constants — question types, branching actions, scale defaults, and theme palettes.
 * @module constants
 */

export const QUESTION_TYPES = {
  SHORT_TEXT: 'short_text',
  PARAGRAPH: 'paragraph',
  MULTIPLE_CHOICE: 'multiple_choice',
  CHECKBOXES: 'checkboxes',
  DROPDOWN: 'dropdown',
  LINEAR_SCALE: 'linear_scale',
  DATE: 'date',
  TIME: 'time',
  FILE_UPLOAD: 'file_upload',
}

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SHORT_TEXT]: 'Short Answer',
  [QUESTION_TYPES.PARAGRAPH]: 'Paragraph',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QUESTION_TYPES.CHECKBOXES]: 'Checkboxes',
  [QUESTION_TYPES.DROPDOWN]: 'Dropdown',
  [QUESTION_TYPES.LINEAR_SCALE]: 'Linear Scale',
  [QUESTION_TYPES.DATE]: 'Date',
  [QUESTION_TYPES.TIME]: 'Time',
  [QUESTION_TYPES.FILE_UPLOAD]: 'File Upload',
}

export const BRANCHING_ACTIONS = {
  NEXT_SECTION: 'next_section',
  GO_TO_SECTION: 'go_to_section',
  SUBMIT_FORM: 'submit_form',
}

export const THEME_COLORS = [
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5', light: '#eef2ff' },
  { id: 'blue', name: 'Ocean Blue', primary: '#2563eb', light: '#eff6ff' },
  { id: 'purple', name: 'Purple', primary: '#7c3aed', light: '#f5f3ff' },
  { id: 'emerald', name: 'Emerald', primary: '#059669', light: '#ecfdf5' },
  { id: 'amber', name: 'Amber', primary: '#d97706', light: '#fffbeb' },
  { id: 'rose', name: 'Rose', primary: '#e11d48', light: '#fff1f2' },
  { id: 'slate', name: 'Slate', primary: '#475569', light: '#f8fafc' },
]

export const FORM_TABS = {
  BUILDER: 'builder',
  PREVIEW: 'preview',
  RESPONSES: 'responses',
  SETTINGS: 'settings',
}
