/**
 * ZPlanner Store — state management for boards, tasks, columns, dependencies, and views.
 * @module planner-store
 */

import { create } from 'zustand'
import { VIEW_MODES, GANTT_ZOOM } from './constants.js'
import {
  createBoard,
  createColumn,
  createTask,
  createChecklistItem,
  createDependency,
} from './planner-model.js'

/**
 * @typedef {import('./planner-model.js').Board} Board
 * @typedef {import('./planner-model.js').Task} Task
 * @typedef {import('./planner-model.js').BoardColumn} BoardColumn
 */

export const usePlannerStore = create((set, get) => ({
  board: createBoard(),
  activeView: VIEW_MODES.KANBAN,
  ganttZoom: GANTT_ZOOM.DAY,
  activeTaskId: null,
  isImportModalOpen: false,
  searchQuery: '',
  filterPriority: 'all',

  setActiveView: (view) => set({ activeView: view }),
  setGanttZoom: (zoom) => set({ ganttZoom: zoom }),
  setActiveTaskId: (id) => set({ activeTaskId: id }),
  setIsImportModalOpen: (isOpen) => set({ isImportModalOpen: isOpen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  setBoard: (board) => set({ board }),

  updateBoardInfo: (updates) =>
    set((state) => ({
      board: {
        ...state.board,
        ...updates,
        updatedAt: Date.now(),
      },
    })),

  addTask: (columnId, data = {}) => {
    let newTask = null
    set((state) => {
      const colId = columnId || state.board.columns[0]?.id || ''
      const existingInCol = state.board.tasks.filter((t) => t.columnId === colId)
      newTask = createTask(colId, state.board.id, {
        ...data,
        order: existingInCol.length,
      })
      return {
        board: {
          ...state.board,
          tasks: [...state.board.tasks, newTask],
          updatedAt: Date.now(),
        },
      }
    })
    return newTask
  },

  updateTask: (taskId, updates) =>
    set((state) => ({
      board: {
        ...state.board,
        tasks: state.board.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates, updatedAt: Date.now() } : t,
        ),
        updatedAt: Date.now(),
      },
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      board: {
        ...state.board,
        tasks: state.board.tasks.filter((t) => t.id !== taskId),
        dependencies: state.board.dependencies.filter(
          (d) => d.predecessorId !== taskId && d.successorId !== taskId,
        ),
        updatedAt: Date.now(),
      },
      activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId,
    })),

  moveTask: (taskId, targetColumnId, newIndex = -1) =>
    set((state) => {
      const task = state.board.tasks.find((t) => t.id === taskId)
      if (!task) return state

      const otherTasks = state.board.tasks.filter((t) => t.id !== taskId)
      const targetColumnTasks = otherTasks
        .filter((t) => t.columnId === targetColumnId)
        .sort((a, b) => a.order - b.order)

      const updatedTask = { ...task, columnId: targetColumnId, updatedAt: Date.now() }

      if (newIndex >= 0 && newIndex <= targetColumnTasks.length) {
        targetColumnTasks.splice(newIndex, 0, updatedTask)
      } else {
        targetColumnTasks.push(updatedTask)
      }

      // Re-index target column tasks
      const reindexed = targetColumnTasks.map((t, idx) => ({ ...t, order: idx }))
      const untouchedTasks = otherTasks.filter((t) => t.columnId !== targetColumnId)

      return {
        board: {
          ...state.board,
          tasks: [...untouchedTasks, ...reindexed],
          updatedAt: Date.now(),
        },
      }
    }),

  addColumn: (title = 'New Column', color = '#64748b') => {
    let newCol = null
    set((state) => {
      newCol = createColumn(state.board.id, title, {
        color,
        order: state.board.columns.length,
      })
      return {
        board: {
          ...state.board,
          columns: [...state.board.columns, newCol],
          updatedAt: Date.now(),
        },
      }
    })
    return newCol
  },

  updateColumn: (columnId, updates) =>
    set((state) => ({
      board: {
        ...state.board,
        columns: state.board.columns.map((c) => (c.id === columnId ? { ...c, ...updates } : c)),
        updatedAt: Date.now(),
      },
    })),

  deleteColumn: (columnId) =>
    set((state) => ({
      board: {
        ...state.board,
        columns: state.board.columns.filter((c) => c.id !== columnId),
        tasks: state.board.tasks.filter((t) => t.columnId !== columnId),
        updatedAt: Date.now(),
      },
    })),

  addChecklistItem: (taskId, text) =>
    set((state) => ({
      board: {
        ...state.board,
        tasks: state.board.tasks.map((t) => {
          if (t.id !== taskId) return t
          const item = createChecklistItem(text)
          return { ...t, checklist: [...t.checklist, item], updatedAt: Date.now() }
        }),
        updatedAt: Date.now(),
      },
    })),

  toggleChecklistItem: (taskId, itemId) =>
    set((state) => ({
      board: {
        ...state.board,
        tasks: state.board.tasks.map((t) => {
          if (t.id !== taskId) return t
          const updatedChecklist = t.checklist.map((c) =>
            c.id === itemId ? { ...c, completed: !c.completed } : c,
          )
          const completedCount = updatedChecklist.filter((c) => c.completed).length
          const progress = updatedChecklist.length
            ? Math.round((completedCount / updatedChecklist.length) * 100)
            : t.progress
          return {
            ...t,
            checklist: updatedChecklist,
            progress,
            updatedAt: Date.now(),
          }
        }),
        updatedAt: Date.now(),
      },
    })),

  deleteChecklistItem: (taskId, itemId) =>
    set((state) => ({
      board: {
        ...state.board,
        tasks: state.board.tasks.map((t) => {
          if (t.id !== taskId) return t
          const updatedChecklist = t.checklist.filter((c) => c.id !== itemId)
          return { ...t, checklist: updatedChecklist, updatedAt: Date.now() }
        }),
        updatedAt: Date.now(),
      },
    })),

  addDependency: (predecessorId, successorId, type) =>
    set((state) => {
      if (predecessorId === successorId) return state
      const exists = state.board.dependencies.some(
        (d) => d.predecessorId === predecessorId && d.successorId === successorId,
      )
      if (exists) return state

      const dep = createDependency(predecessorId, successorId, type)
      return {
        board: {
          ...state.board,
          dependencies: [...state.board.dependencies, dep],
          updatedAt: Date.now(),
        },
      }
    }),

  removeDependency: (depId) =>
    set((state) => ({
      board: {
        ...state.board,
        dependencies: state.board.dependencies.filter((d) => d.id !== depId),
        updatedAt: Date.now(),
      },
    })),

  saveToBackend: async () => {
    const { board } = get()
    const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
    if (api?.planner?.saveBoard) {
      try {
        await api.planner.saveBoard(board)
      } catch (err) {
        console.error('Failed to save board to planner-db:', err)
      }
    }
  },

  loadFromBackend: async (boardId) => {
    const api = typeof window !== 'undefined' ? window.zofficeAPI || window.api : null
    if (api?.planner?.getBoard) {
      try {
        const loaded = await api.planner.getBoard(boardId)
        if (loaded) {
          set({ board: loaded })
        }
      } catch (err) {
        console.error('Failed to load board from planner-db:', err)
      }
    }
  },
}))
