/**
 * ZBase View Switcher and Search Bar Component.
 * @module ViewSearchBar
 */

import React from 'react'
import { Search, Terminal } from 'lucide-react'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').TableView[]} props.views
 * @param {string} props.activeViewId
 * @param {string} props.searchQuery
 * @param {(viewId: string) => void} props.onSelectView
 * @param {(query: string) => void} props.onSearchChange
 * @param {() => void} props.onOpenSqlConsole
 */
export function ViewSearchBar({
  views = [],
  activeViewId,
  searchQuery,
  onSelectView,
  onSearchChange,
  onOpenSqlConsole,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1">
        {views.map((v) => {
          const isActive = v.id === activeViewId
          return (
            <button
              key={v.id}
              onClick={() => onSelectView(v.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {v.name}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-48 rounded-md border border-slate-200 bg-slate-50 py-1 pl-8 pr-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        <button
          onClick={onOpenSqlConsole}
          className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Terminal size={12} className="text-amber-500" />
          <span>SQL Console</span>
        </button>
      </div>
    </div>
  )
}
