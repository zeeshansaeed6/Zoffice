/**
 * KanbanBoard — horizontal scrollable board container with columns and tasks.
 * @module KanbanBoard
 */

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { KanbanColumn } from './KanbanColumn.jsx'
import { usePlannerStore } from '../core/planner-store.js'

/**
 * KanbanBoard view
 */
export function KanbanBoard() {
  const {
    board,
    searchQuery,
    filterPriority,
    setActiveTaskId,
    addTask,
    updateColumn,
    deleteColumn,
    addColumn,
    moveTask,
  } = usePlannerStore()

  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColTitle, setNewColTitle] = useState('')

  const handleCreateColumn = (e) => {
    e.preventDefault()
    if (newColTitle.trim()) {
      addColumn(newColTitle.trim())
      setNewColTitle('')
      setIsAddingColumn(false)
    }
  }

  // Filter tasks according to search and priority filter
  const filteredTasks = board.tasks.filter((task) => {
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority

    return matchesSearch && matchesPriority
  })

  return (
    <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto bg-slate-50 p-4 dark:bg-slate-950">
      {board.columns
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((column) => {
          const colTasks = filteredTasks
            .filter((t) => t.columnId === column.id)
            .sort((a, b) => a.order - b.order)

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={colTasks}
              onTaskClick={(id) => setActiveTaskId(id)}
              onAddTask={(colId, title) => addTask(colId, { title })}
              onUpdateColumn={updateColumn}
              onDeleteColumn={deleteColumn}
              onMoveTask={moveTask}
            />
          )
        })}

      {/* Add New Column block */}
      <div className="w-72 shrink-0">
        {isAddingColumn ? (
          <form
            onSubmit={handleCreateColumn}
            className="rounded-xl border border-blue-400 bg-white p-3 shadow-sm dark:border-blue-500 dark:bg-slate-900"
          >
            <input
              type="text"
              placeholder="Column name..."
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              className="focus:outline-hidden mb-2 w-full rounded border border-slate-300 p-2 text-xs text-slate-800 dark:border-slate-700 dark:text-slate-100"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Add Column
              </button>
              <button
                type="button"
                onClick={() => setIsAddingColumn(false)}
                className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingColumn(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-xs font-semibold text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:hover:text-blue-400"
          >
            <Plus className="h-4 w-4" /> Add Column
          </button>
        )}
      </div>
    </div>
  )
}
