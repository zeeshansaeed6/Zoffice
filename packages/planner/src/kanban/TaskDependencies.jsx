import React, { useState } from 'react'
import { Link2, Trash2, Plus } from 'lucide-react'

/**
 * TaskDependencies — Predecessor dependency selector and list for a task.
 *
 * @param {Object} props
 * @param {import('../core/planner-model.js').Task} props.task
 * @param {import('../core/planner-model.js').Board} props.board
 * @param {(predecessorId: string, successorId: string) => void} props.onAddDependency
 * @param {(depId: string) => void} props.onRemoveDependency
 */
export function TaskDependencies({ task, board, onAddDependency, onRemoveDependency }) {
  const [selectedPredId, setSelectedPredId] = useState('')

  const activeDependencies = board.dependencies.filter((d) => d.successorId === task.id)

  const availablePredecessors = board.tasks.filter(
    (t) => t.id !== task.id && !activeDependencies.some((d) => d.predecessorId === t.id),
  )

  const handleAdd = () => {
    if (selectedPredId && selectedPredId !== task.id) {
      onAddDependency(selectedPredId, task.id)
      setSelectedPredId('')
    }
  }

  return (
    <div>
      <label className="mb-2 block flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Link2 className="h-3.5 w-3.5" /> Dependencies (Predecessors)
      </label>
      <div className="mb-2 space-y-1.5">
        {activeDependencies.map((dep) => {
          const predTask = board.tasks.find((t) => t.id === dep.predecessorId)
          return (
            <div
              key={dep.id}
              className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
            >
              <span>
                Depends on:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {predTask ? predTask.title : 'Unknown task'}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => onRemoveDependency(dep.id)}
                className="p-1 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      {availablePredecessors.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedPredId}
            onChange={(e) => setSelectedPredId(e.target.value)}
            className="flex-1 rounded border border-slate-300 bg-white p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Select predecessor task...</option>
            {availablePredecessors.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedPredId}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
