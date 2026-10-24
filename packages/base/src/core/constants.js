/**
 * ZBase Constants — field types, view types, filter operators, and rollup aggregations.
 * @module constants
 */

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  CHECKBOX: 'checkbox',
  ATTACHMENT: 'attachment',
  FORMULA: 'formula',
  LOOKUP: 'lookup',
  ROLLUP: 'rollup',
  LINK: 'link',
}

export const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.TEXT]: { label: 'Single Line Text', icon: 'Type' },
  [FIELD_TYPES.NUMBER]: { label: 'Number', icon: 'Hash' },
  [FIELD_TYPES.DATE]: { label: 'Date', icon: 'Calendar' },
  [FIELD_TYPES.SELECT]: { label: 'Single Select', icon: 'ChevronDown' },
  [FIELD_TYPES.MULTISELECT]: { label: 'Multiple Select', icon: 'CheckSquare' },
  [FIELD_TYPES.CHECKBOX]: { label: 'Checkbox', icon: 'Check' },
  [FIELD_TYPES.ATTACHMENT]: { label: 'Attachment', icon: 'Paperclip' },
  [FIELD_TYPES.FORMULA]: { label: 'Formula', icon: 'Calculator' },
  [FIELD_TYPES.LOOKUP]: { label: 'Lookup', icon: 'Search' },
  [FIELD_TYPES.ROLLUP]: { label: 'Rollup', icon: 'Sigma' },
  [FIELD_TYPES.LINK]: { label: 'Link to Record', icon: 'Link2' },
}

export const VIEW_TYPES = {
  GRID: 'grid',
  FORM: 'form',
  GALLERY: 'gallery',
  KANBAN: 'kanban',
  CALENDAR: 'calendar',
}

export const FILTER_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
}

export const ROLLUP_OPERATIONS = {
  COUNT: 'count',
  SUM: 'sum',
  AVERAGE: 'average',
  MIN: 'min',
  MAX: 'max',
}

export const SELECT_COLORS = [
  { name: 'Blue', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  { name: 'Green', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  { name: 'Amber', bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  { name: 'Red', bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  { name: 'Purple', bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
  { name: 'Teal', bg: '#f0fdfa', text: '#115e59', border: '#99f6e4' },
  { name: 'Slate', bg: '#f8fafc', text: '#334155', border: '#e2e8f0' },
]
