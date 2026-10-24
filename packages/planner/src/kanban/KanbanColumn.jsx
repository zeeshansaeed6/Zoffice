/**
 * KanbanColumn — column container with drag-and-drop target, task list, and quick add.
 * @module KanbanColumn
 */

import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check } from 'lucide-react'
import { TaskCard } from './TaskCard.jsx'

/**
 * @param {{
 *   column: import('../core/planner-model.js').BoardColumn,
 *   tasks: import('../core/planner-model.js').Task[],
 *   onTaskClick: (taskId: string) => void,
 *   onAddTask: (columnId: string, title?: string) => void,
 *   onUpdateColumn: (columnId: string, updates: Partial<import('../core/planner-model.js').BoardColumn>) => void,
 *   onDeleteColumn: (columnId: string) => void,
 *   onMoveTask: (taskId: string, targetColId: string, newIndex: number) => void,
 * }} props
 */
export function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onUpdateColumn,
  onDeleteColumn,
  onMoveTask,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [columnTitle, setColumnTitle] = useState(column.title)
  const [isDragOver, setIsDragOver] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')
  const [isQuickAdding, setIsQuickAdding] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onMoveTask(taskId, column.id, tasks.length)
    }
  }

  const saveTitle = () => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      onUpdateColumn(column.id, { title: columnTitle.trim() })
    }
    setIsEditingTitle(false)
  }

  const submitQuickAdd = (e) => {
    e.preventDefault()
    if (quickTitle.trim()) {
      onAddTask(column.id, quickTitle.trim())
      setQuickTitle('')
      setIsQuickAdding(false)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex max-h-full w-72 shrink-0 flex-col rounded-xl border bg-slate-100/90 p-3 transition-all dark:bg-slate-900/70 ${
        isDragOver
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Column Header */}
      <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <div className="mr-2 flex flex-1 items-center gap-2">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: column.color || '#64748b' }}
          />
          {isEditingTitle ? (
            <div className="flex flex-1 items-center gap-1">
              <input
                type="text"
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                className="w-full rounded border border-blue-400 bg-white px-1 py-0.5 text-xs font-semibold dark:bg-slate-800 dark:text-slate-100"
                autoFocus
              />
              <button
                type="button"
                onClick={saveTitle}
                className="p-0.5 text-slate-500 hover:text-slate-700"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <span
              onDoubleClick={() => setIsEditingTitle(true)}
              className="cursor-pointer select-none truncate text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200"
            >
              {column.title}
            </span>
          )}
          <span className="py-0.2 shrink-0 rounded-full bg-slate-200/70 px-1.5 text-[11px] font-semibold text-slate-400 dark:bg-slate-800">
            {tasks.length}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="rounded p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            title="Edit column title"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDeleteColumn(column.id)}
            className="rounded p-1 text-slate-400 transition-colors hover:text-red-600"
            title="Delete column"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="min-h-[50px] flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task.id)}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id)
            }}
          />
        ))}
      </div>

      {/* Quick Add or Add Button */}
      <div className="mt-1 pt-2">
        {isQuickAdding ? (
          <form onSubmit={submitQuickAdd} className="space-y-1.5">
            <input
              type="text"
              placeholder="Task title..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="shadow-xs focus:outline-hidden w-full rounded border border-blue-400 bg-white p-2 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100"
              autoFocus
            />
            <div className="flex items-center gap-1.5">
              <button
                type="submit"
                className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsQuickAdding(false)}
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsQuickAdding(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:hover:text-blue-400"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </button>
        )}
      </div>
    </div>
  )
}
