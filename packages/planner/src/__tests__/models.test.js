import { describe, it, expect } from 'vitest'
import {
  createBoard,
  createColumn,
  createTask,
  createChecklistItem,
  createDependency,
} from '../core/planner-model.js'
import { PRIORITY, DEPENDENCY_TYPES } from '../core/constants.js'

describe('ZPlanner Models', () => {
  it('creates a default board with columns and starter tasks', () => {
    const board = createBoard({ title: 'Sprint 42' })
    expect(board.title).toBe('Sprint 42')
    expect(board.columns.length).toBe(4)
    expect(board.columns.map((c) => c.title)).toEqual(['To Do', 'In Progress', 'In Review', 'Done'])
    expect(board.tasks.length).toBeGreaterThan(0)
    expect(board.dependencies).toEqual([])
  })

  it('creates custom columns and tasks', () => {
    const col = createColumn('b1', 'Backlog', { order: 1, color: '#f59e0b' })
    expect(col.boardId).toBe('b1')
    expect(col.title).toBe('Backlog')
    expect(col.color).toBe('#f59e0b')

    const task = createTask(col.id, 'b1', {
      title: 'Fix SQLite memory leak',
      priority: PRIORITY.URGENT,
      isMilestone: true,
      progress: 75,
    })

    expect(task.columnId).toBe(col.id)
    expect(task.title).toBe('Fix SQLite memory leak')
    expect(task.priority).toBe(PRIORITY.URGENT)
    expect(task.isMilestone).toBe(true)
    expect(task.progress).toBe(75)
    expect(task.startDate).toBeDefined()
    expect(task.dueDate).toBeDefined()
  })

  it('creates checklist items and dependencies', () => {
    const item = createChecklistItem('Run test suite', true)
    expect(item.text).toBe('Run test suite')
    expect(item.completed).toBe(true)

    const dep = createDependency('t1', 't2', DEPENDENCY_TYPES.START_TO_START)
    expect(dep.predecessorId).toBe('t1')
    expect(dep.successorId).toBe('t2')
    expect(dep.type).toBe(DEPENDENCY_TYPES.START_TO_START)
  })
})
