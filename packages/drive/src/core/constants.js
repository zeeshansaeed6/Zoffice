/**
 * ZDrive Core Constants and Types.
 * @module constants
 */

/**
 * Supported document kinds in Zoffice suite.
 * @enum {string}
 */
export const FILE_KINDS = {
  FOLDER: 'folder',
  WRITER: 'writer',
  SHEETS: 'sheets',
  SLIDES: 'slides',
  NOTES: 'notes',
  MAIL: 'mail',
  FORMS: 'forms',
  PLANNER: 'planner',
  DRAW: 'draw',
  BASE: 'base',
  OTHER: 'other',
}

/**
 * File extension mapping to file kinds.
 */
export const EXTENSION_MAP = {
  docx: FILE_KINDS.WRITER,
  doc: FILE_KINDS.WRITER,
  xlsx: FILE_KINDS.SHEETS,
  xls: FILE_KINDS.SHEETS,
  pptx: FILE_KINDS.SLIDES,
  ppt: FILE_KINDS.SLIDES,
  znotes: FILE_KINDS.NOTES,
  zbase: FILE_KINDS.BASE,
  zdraw: FILE_KINDS.DRAW,
  zform: FILE_KINDS.FORMS,
  zplan: FILE_KINDS.PLANNER,
  pdf: FILE_KINDS.OTHER,
  png: FILE_KINDS.OTHER,
  jpg: FILE_KINDS.OTHER,
  txt: FILE_KINDS.OTHER,
}

/**
 * Color tags available for labeling files.
 */
export const COLOR_TAGS = [
  { id: 'none', label: 'None', color: 'transparent' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'yellow', label: 'Yellow', color: '#eab308' },
  { id: 'green', label: 'Green', color: '#22c55e' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
]

/**
 * Drive navigation sections.
 */
export const DRIVE_SECTIONS = {
  MY_DRIVE: 'my_drive',
  RECENT: 'recent',
  STARRED: 'starred',
  TRASH: 'trash',
  STORAGE: 'storage',
}

/**
 * File Explorer view layout modes.
 */
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
}

/**
 * Sort options.
 */
export const SORT_FIELDS = {
  NAME: 'name',
  UPDATED_AT: 'updatedAt',
  SIZE: 'size',
  KIND: 'kind',
}
