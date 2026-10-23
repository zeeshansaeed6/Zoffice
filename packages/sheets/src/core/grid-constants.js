/**
 * Grid layout dimensions and styling constants for ZSheets.
 */

export const ROW_HEADER_WIDTH = 50
export const COL_HEADER_HEIGHT = 26
export const DEFAULT_COL_WIDTH = 100
export const DEFAULT_ROW_HEIGHT = 24
export const MIN_COL_WIDTH = 25
export const MIN_ROW_HEIGHT = 16
export const RESIZE_HANDLE_ZONE = 5

export const MAX_ROWS = 100000
export const MAX_COLS = 16384

export const THEME_COLORS = {
  light: {
    bg: '#ffffff',
    gridline: '#e2e8f0',
    headerBg: '#f8fafc',
    headerHover: '#edf2f7',
    headerActive: '#cbd5e1',
    headerText: '#475569',
    headerActiveText: '#1e293b',
    headerBorder: '#cbd5e1',
    text: '#0f172a',
    selectionBorder: '#2563eb',
    selectionFill: 'rgba(37, 99, 235, 0.1)',
    activeCellBorder: '#2563eb',
    fillHandle: '#2563eb',
    resizeGuide: '#3b82f6',
  },
  dark: {
    bg: '#090d16',
    gridline: '#1f2937',
    headerBg: '#111827',
    headerHover: '#1f2937',
    headerActive: '#374151',
    headerText: '#94a3b8',
    headerActiveText: '#f8fafc',
    headerBorder: '#374151',
    text: '#f8fafc',
    selectionBorder: '#3b82f6',
    selectionFill: 'rgba(59, 130, 246, 0.18)',
    activeCellBorder: '#3b82f6',
    fillHandle: '#3b82f6',
    resizeGuide: '#60a5fa',
  },
}
