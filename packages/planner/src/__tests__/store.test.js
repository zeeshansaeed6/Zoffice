import { describe, it, expect, beforeEach } from 'vitest'
import { usePlannerStore } from '../core/planner-store.js'
import { createBoard } from '../core/planner-model.js'
import { VIEW_MODES, PRIORITY } from '../core/constants.js'

describe('Planner Store', () => {
  beforeEach(() => {
    usePlannerStore.setState({
      board: createBoard({ title: 'Test Board' }),
      activeView: VIEW_MODES.KANBAN,
      searchQuery: '',
      filterPriority: 'all',
      activeTaskId: null,
    })
  })

  it('adds and updates tasks in column', () => {
    const store = usePlannerStore.getState()
    const colId = store.board.columns[0].id

    const task = store.addTask(colId, {
      title: 'Setup Electron Preload',
      priority: PRIORITY.HIGH,
    })

    expect(task.title).toBe('Setup Electron Preload')
    expect(usePlannerStore.getState().board.tasks.some((t) => t.id === task.id)).toBe(true)

    usePlannerStore.getState().updateTask(task.id, { progress: 80 })
    const updated = usePlannerStore.getState().board.tasks.find((t) => t.id === task.id)
    expect(updated.progress).toBe(80)
  })

  it('moves task between columns', () => {
    const store = usePlannerStore.getState()
    const [col1, col2] = store.board.columns
    const task = store.addTask(col1.id, { title: 'Movable Task' })

    usePlannerStore.getState().moveTask(task.id, col2.id, 0)
    const moved = usePlannerStore.getState().board.tasks.find((t) => t.id === task.id)
    expect(moved.columnId).toBe(col2.id)
  })

  it('adds, toggles, and deletes checklist items', () => {
    const store = usePlannerStore.getState()
    const task = store.board.tasks[0]

    store.addChecklistItem(task.id, 'Verify offline storage')
    let currentTask = usePlannerStore.getState().board.tasks.find((t) => t.id === task.id)
    const newItem = currentTask.checklist.find((i) => i.text === 'Verify offline storage')
    expect(newItem).toBeDefined()
    expect(newItem.completed).toBe(false)

    usePlannerStore.getState().toggleChecklistItem(task.id, newItem.id)
    currentTask = usePlannerStore.getState().board.tasks.find((t) => t.id === task.id)
    const toggled = currentTask.checklist.find((i) => i.id === newItem.id)
    expect(toggled.completed).toBe(true)

    usePlannerStore.getState().deleteChecklistItem(task.id, newItem.id)
    currentTask = usePlannerStore.getState().board.tasks.find((t) => t.id === task.id)
    expect(currentTask.checklist.some((i) => i.id === newItem.id)).toBe(false)
  })

  it('adds and removes dependencies', () => {
    const store = usePlannerStore.getState()
    const [t1, t2] = store.board.tasks

    store.addDependency(t1.id, t2.id)
    expect(usePlannerStore.getState().board.dependencies.length).toBe(1)

    const dep = usePlannerStore.getState().board.dependencies[0]
    expect(dep.predecessorId).toBe(t1.id)
    expect(dep.successorId).toBe(t2.id)

    store.removeDependency(dep.id)
    expect(usePlannerStore.getState().board.dependencies.length).toBe(0)
  })
})
