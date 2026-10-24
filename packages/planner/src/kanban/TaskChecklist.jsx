import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'

/**
 * TaskChecklist — Checklist editor and progress display for a task.
 *
 * @param {Object} props
 * @param {string} props.taskId
 * @param {import('../core/planner-model.js').ChecklistItem[]} props.checklist
 * @param {(taskId: string, text: string) => void} props.onAddItem
 * @param {(taskId: string, itemId: string) => void} props.onToggleItem
 * @param {(taskId: string, itemId: string) => void} props.onDeleteItem
 */
export function TaskChecklist({ taskId, checklist = [], onAddItem, onToggleItem, onDeleteItem }) {
  const [newText, setNewText] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newText.trim()) {
      onAddItem(taskId, newText.trim())
      setNewText('')
    }
  }

  const completedCount = checklist.filter((i) => i.completed).length

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Checklist ({completedCount}/{checklist.length})
      </label>
      <div className="mb-2 space-y-2">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60"
          >
            <label className="flex flex-1 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleItem(taskId, item.id)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`text-xs ${
                  item.completed
                    ? 'text-slate-400 line-through'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.text}
              </span>
            </label>
            <button
              type="button"
              onClick={() => onDeleteItem(taskId, item.id)}
              className="p-1 text-slate-400 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Add an item..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 rounded border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Add
        </button>
      </form>
    </div>
  )
}
