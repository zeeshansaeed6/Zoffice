/**
 * TaskDetailModal — detailed task inspector for editing properties, checklist, and dependencies.
 * @module TaskDetailModal
 */

import React from 'react'
import { X, Trash2, Calendar, User, Flag } from 'lucide-react'
import { usePlannerStore } from '../core/planner-store.js'
import { PRIORITY, PRIORITY_CONFIG } from '../core/constants.js'
import { TaskChecklist } from './TaskChecklist.jsx'
import { TaskDependencies } from './TaskDependencies.jsx'

export function TaskDetailModal() {
  const {
    board,
    activeTaskId,
    setActiveTaskId,
    updateTask,
    deleteTask,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    addDependency,
    removeDependency,
  } = usePlannerStore()

  if (!activeTaskId) return null
  const task = board.tasks.find((t) => t.id === activeTaskId)
  if (!task) return null

  const toInputDate = (iso) => (iso ? iso.slice(0, 10) : '')
  const fromInputDate = (val) => (val ? new Date(val).toISOString() : '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="focus:outline-hidden mr-4 w-full border-b border-transparent bg-transparent text-lg font-bold text-slate-800 hover:border-slate-300 focus:border-blue-500 dark:text-slate-100"
            placeholder="Task Title"
          />
          <button
            type="button"
            onClick={() => setActiveTaskId(null)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-800/50">
            {/* Column / Status */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Column
              </label>
              <select
                value={task.columnId}
                onChange={(e) => updateTask(task.id, { columnId: e.target.value })}
                className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {board.columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value })}
                className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {Object.values(PRIORITY).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_CONFIG[p]?.label || p}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1 block flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3 w-3" /> Start
              </label>
              <input
                type="date"
                value={toInputDate(task.startDate)}
                onChange={(e) => updateTask(task.id, { startDate: fromInputDate(e.target.value) })}
                className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1 block flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3 w-3" /> Due
              </label>
              <input
                type="date"
                value={toInputDate(task.dueDate)}
                onChange={(e) => updateTask(task.id, { dueDate: fromInputDate(e.target.value) })}
                className="w-full rounded border border-slate-300 bg-white p-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Assignee & Milestone & Progress */}
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <User className="h-3.5 w-3.5" /> Assignee
              </label>
              <input
                type="text"
                placeholder="Unassigned"
                value={task.assignee}
                onChange={(e) => updateTask(task.id, { assignee: e.target.value })}
                className="w-full rounded border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Progress
                </label>
                <span className="text-xs font-bold text-blue-600">{task.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={task.progress}
                onChange={(e) => updateTask(task.id, { progress: Number(e.target.value) })}
                className="w-full cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center sm:pt-4">
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.isMilestone}
                  onChange={(e) => updateTask(task.id, { isMilestone: e.target.checked })}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Flag className="h-3.5 w-3.5 text-amber-500" /> Mark as Milestone
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={3}
              value={task.description}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Add details, notes, or acceptance criteria..."
              className="focus:outline-hidden w-full resize-none rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Checklist */}
          <TaskChecklist
            taskId={task.id}
            checklist={task.checklist}
            onAddItem={addChecklistItem}
            onToggleItem={toggleChecklistItem}
            onDeleteItem={deleteChecklistItem}
          />

          {/* Dependencies */}
          <TaskDependencies
            task={task}
            board={board}
            onAddDependency={addDependency}
            onRemoveDependency={removeDependency}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" /> Delete Task
          </button>
          <button
            type="button"
            onClick={() => setActiveTaskId(null)}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
