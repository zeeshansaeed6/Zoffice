/**
 * ZNotes constants — block types, tag types, and default templates.
 */

/** @enum {string} Block types for the note canvas */
export const BLOCK_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  TABLE: 'table',
  CHECKLIST: 'checklist',
  INK: 'ink',
  AUDIO: 'audio',
}

/** @enum {string} Tag types for pages */
export const TAG_TYPES = {
  TODO: 'todo',
  IMPORTANT: 'important',
  QUESTION: 'question',
  REMEMBER: 'remember',
  DEFINITION: 'definition',
  CUSTOM: 'custom',
}

/** Tag display metadata */
export const TAG_META = {
  [TAG_TYPES.TODO]: { label: 'To Do', color: '#3b82f6', icon: 'CheckSquare' },
  [TAG_TYPES.IMPORTANT]: { label: 'Important', color: '#ef4444', icon: 'Star' },
  [TAG_TYPES.QUESTION]: { label: 'Question', color: '#f59e0b', icon: 'HelpCircle' },
  [TAG_TYPES.REMEMBER]: { label: 'Remember', color: '#10b981', icon: 'BookMarked' },
  [TAG_TYPES.DEFINITION]: { label: 'Definition', color: '#8b5cf6', icon: 'BookOpen' },
  [TAG_TYPES.CUSTOM]: { label: 'Custom', color: '#6b7280', icon: 'Tag' },
}

/** Default notebook colors */
export const NOTEBOOK_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#84cc16', '#06b6d4', '#d946ef',
]

/** Default section colors */
export const SECTION_COLORS = [
  '#dbeafe', '#fee2e2', '#d1fae5', '#fef3c7',
  '#ede9fe', '#fce7f3', '#ccfbf1', '#ffedd5',
]

/** Default block dimensions */
export const DEFAULT_BLOCK = {
  width: 300,
  height: 40,
  minWidth: 80,
  minHeight: 30,
}

/** Canvas defaults */
export const CANVAS = {
  WIDTH: 3000,
  HEIGHT: 3000,
  GRID_SIZE: 20,
  SNAP_THRESHOLD: 10,
}
