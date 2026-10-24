/**
 * ZPlanner Constants — priority levels, view modes, zoom levels, and dependency types.
 * @module constants
 */

export const PRIORITY = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  NONE: 'none',
}

export const PRIORITY_CONFIG = {
  [PRIORITY.URGENT]: {
    label: 'Urgent',
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
    darkBg: '#450a0a',
  },
  [PRIORITY.HIGH]: {
    label: 'High',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    darkBg: '#431407',
  },
  [PRIORITY.MEDIUM]: {
    label: 'Medium',
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    darkBg: '#172554',
  },
  [PRIORITY.LOW]: {
    label: 'Low',
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    darkBg: '#064e3b',
  },
  [PRIORITY.NONE]: {
    label: 'None',
    color: '#94a3b8',
    bg: '#f8fafc',
    border: '#e2e8f0',
    darkBg: '#1e293b',
  },
}

export const VIEW_MODES = {
  KANBAN: 'kanban',
  GANTT: 'gantt',
  CALENDAR: 'calendar',
}

export const GANTT_ZOOM = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
}

export const DEPENDENCY_TYPES = {
  FINISH_TO_START: 'finish_to_start',
  START_TO_START: 'start_to_start',
  FINISH_TO_FINISH: 'finish_to_finish',
}

export const DEFAULT_COLUMNS = [
  { title: 'To Do', color: '#64748b' },
  { title: 'In Progress', color: '#2563eb' },
  { title: 'In Review', color: '#7c3aed' },
  { title: 'Done', color: '#16a34a' },
]
