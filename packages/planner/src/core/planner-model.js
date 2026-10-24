/**
 * ZPlanner Data Models — factory functions for boards, columns, tasks, and dependencies.
 * @module planner-model
 */

import { PRIORITY, DEPENDENCY_TYPES, DEFAULT_COLUMNS } from './constants.js'

/**
 * Generate unique entity ID.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 */

/**
 * Create a checklist task item.
 * @param {string} [text='']
 * @param {boolean} [completed=false]
 * @param {Partial<ChecklistItem>} [overrides={}]
 * @returns {ChecklistItem}
 */
export function createChecklistItem(text = '', completed = false, overrides = {}) {
  return {
    id: overrides.id || generateId('chk'),
    text: overrides.text !== undefined ? overrides.text : text,
    completed: overrides.completed !== undefined ? overrides.completed : completed,
  }
}

/**
 * @typedef {Object} TaskDependency
 * @property {string} id
 * @property {string} predecessorId - Task that must complete first
 * @property {string} successorId - Task that depends on predecessor
 * @property {string} type - One of DEPENDENCY_TYPES
 */

/**
 * Create a task dependency link.
 * @param {string} predecessorId
 * @param {string} successorId
 * @param {string} [type=DEPENDENCY_TYPES.FINISH_TO_START]
 * @param {Partial<TaskDependency>} [overrides={}]
 * @returns {TaskDependency}
 */
export function createDependency(
  predecessorId,
  successorId,
  type = DEPENDENCY_TYPES.FINISH_TO_START,
  overrides = {},
) {
  return {
    id: overrides.id || generateId('dep'),
    predecessorId,
    successorId,
    type: overrides.type || type,
  }
}

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} boardId
 * @property {string} columnId
 * @property {string} title
 * @property {string} description
 * @property {string} assignee
 * @property {string} priority - One of PRIORITY
 * @property {string} startDate - ISO string
 * @property {string} dueDate - ISO string
 * @property {number} progress - 0 to 100
 * @property {boolean} isMilestone
 * @property {number} order
 * @property {ChecklistItem[]} checklist
 * @property {string[]} dependencyIds - IDs of predecessor tasks
 * @property {Array<{ id: string, name: string, url: string }>} attachments
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a new task card.
 * @param {string} columnId
 * @param {string} boardId
 * @param {Partial<Task>} [overrides={}]
 * @returns {Task}
 */
export function createTask(columnId = '', boardId = '', overrides = {}) {
  const now = new Date()
  const todayIso = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const dueIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3).toISOString()

  return {
    id: overrides.id || generateId('task'),
    boardId: overrides.boardId || boardId,
    columnId: overrides.columnId || columnId,
    title: overrides.title || 'Untitled Task',
    description: overrides.description || '',
    assignee: overrides.assignee || '',
    priority: overrides.priority || PRIORITY.MEDIUM,
    startDate: overrides.startDate || todayIso,
    dueDate: overrides.dueDate || dueIso,
    progress: overrides.progress ?? 0,
    isMilestone: overrides.isMilestone ?? false,
    order: overrides.order ?? 0,
    checklist: overrides.checklist || [],
    dependencyIds: overrides.dependencyIds || [],
    attachments: overrides.attachments || [],
    createdAt: overrides.createdAt || Date.now(),
    updatedAt: overrides.updatedAt || Date.now(),
  }
}

/**
 * @typedef {Object} BoardColumn
 * @property {string} id
 * @property {string} boardId
 * @property {string} title
 * @property {string} color
 * @property {number} order
 */

/**
 * Create a Kanban column.
 * @param {string} boardId
 * @param {string} title
 * @param {Partial<BoardColumn>} [overrides={}]
 * @returns {BoardColumn}
 */
export function createColumn(boardId = '', title = 'Column', overrides = {}) {
  return {
    id: overrides.id || generateId('col'),
    boardId,
    title: overrides.title || title,
    color: overrides.color || '#64748b',
    order: overrides.order ?? 0,
  }
}

/**
 * @typedef {Object} Board
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {BoardColumn[]} columns
 * @property {Task[]} tasks
 * @property {TaskDependency[]} dependencies
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a new project board with default columns and sample starter tasks.
 * @param {Partial<Board>} [overrides={}]
 * @returns {Board}
 */
export function createBoard(overrides = {}) {
  const boardId = overrides.id || generateId('brd')
  const now = Date.now()

  const defaultCols = DEFAULT_COLUMNS.map((def, idx) =>
    createColumn(boardId, def.title, { color: def.color, order: idx }),
  )

  const todoColId = defaultCols[0].id
  const inProgressColId = defaultCols[1].id
  const doneColId = defaultCols[3].id

  const starterTasks = [
    createTask(todoColId, boardId, {
      title: 'Architect offline storage pipeline',
      description: 'Setup SQLite tables and preload bridge with validated IPC schemas.',
      priority: PRIORITY.HIGH,
      assignee: 'Alice',
      order: 0,
      checklist: [
        createChecklistItem('Design schema', true),
        createChecklistItem('Add indexes', false),
      ],
    }),
    createTask(inProgressColId, boardId, {
      title: 'Implement drag-and-drop Kanban interface',
      description: 'Add column drop targets and card reordering.',
      priority: PRIORITY.URGENT,
      assignee: 'Bob',
      order: 0,
      progress: 50,
    }),
    createTask(doneColId, boardId, {
      title: 'Initialize ZPlanner monorepo package',
      description: 'Create package.json, vitest config, and models.',
      priority: PRIORITY.LOW,
      assignee: 'Carol',
      order: 0,
      progress: 100,
      isMilestone: true,
    }),
  ]

  return {
    id: boardId,
    title: overrides.title || 'Project Board',
    description: overrides.description || 'Sprint and timeline tracker',
    columns: overrides.columns || defaultCols,
    tasks: overrides.tasks || starterTasks,
    dependencies: overrides.dependencies || [],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}
