/**
 * TaskCard — Kanban card component with drag-and-drop, priority badge, and checklist status.
 * @module TaskCard
 */

import React from 'react'
import { CheckSquare, Clock, Flag, Paperclip, MoreVertical } from 'lucide-react'
import { PRIORITY_CONFIG } from '../core/constants.js'

/**
 * @param {{
 *   task: import('../core/planner-model.js').Task,
 *   onClick: () => void,
 *   onDragStart: (e: React.DragEvent) => void,
 * }} props
 */
export function TaskCard({ task, onClick, onDragStart }) {
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

  const completedChecklistCount = task.checklist.filter((i) => i.completed).length
  const totalChecklistCount = task.checklist.length

  const isOverdue =
    task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.progress < 100

  const dueDateFormatted = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className="group relative flex cursor-grab select-none flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Top row: Priority and Milestone */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: priorityInfo.bg,
              color: priorityInfo.color,
              border: `1px solid ${priorityInfo.border}`,
            }}
          >
            {priorityInfo.label}
          </span>
          {task.isMilestone && (
            <span className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Flag className="h-2.5 w-2.5" /> Milestone
            </span>
          )}
        </div>
        <MoreVertical className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {task.description}
        </p>
      )}

      {/* Progress Bar (if > 0 and < 100) */}
      {task.progress > 0 && task.progress < 100 && (
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      )}

      {/* Bottom row: checklist count, due date, assignee */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {dueDateFormatted && (
            <span
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${
                isOverdue
                  ? 'border border-red-200 bg-red-50 font-semibold text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
              title={isOverdue ? 'Overdue' : 'Due date'}
            >
              <Clock className="h-3 w-3" />
              {dueDateFormatted}
            </span>
          )}

          {totalChecklistCount > 0 && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300"
              title="Checklist items"
            >
              <CheckSquare className="h-3 w-3" />
              {completedChecklistCount}/{totalChecklistCount}
            </span>
          )}

          {task.attachments?.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500">
              <Paperclip className="h-3 w-3" />
              {task.attachments.length}
            </span>
          )}
        </div>

        {/* Assignee initials badge */}
        {task.assignee ? (
          <div
            className="shadow-xs flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white"
            title={`Assigned to ${task.assignee}`}
          >
            {task.assignee.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <div className="h-6 w-6" />
        )}
      </div>
    </div>
  )
}
