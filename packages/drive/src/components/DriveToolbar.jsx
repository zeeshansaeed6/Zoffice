/**
 * ZDrive Toolbar Component — breadcrumbs, search, view switcher, and actions.
 * @module DriveToolbar
 */

import React from 'react'
import {
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  Home,
  Trash2,
  Star,
  History,
  ArrowUpDown,
} from 'lucide-react'
import { VIEW_MODES, SORT_FIELDS, COLOR_TAGS } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {string} props.searchQuery
 * @param {string} props.viewMode
 * @param {string} props.sortField
 * @param {string} props.sortDirection
 * @param {string|null} props.currentFolderId
 * @param {import('../core/drive-model.js').DriveItem[]} props.items
 * @param {string[]} props.selectedItemIds
 * @param {(query: string) => void} props.onSearchChange
 * @param {(mode: string) => void} props.onViewModeChange
 * @param {(field: string, direction: 'asc'|'desc') => void} props.onSortChange
 * @param {(folderId: string|null) => void} props.onNavigateFolder
 * @param {() => void} props.onDeleteSelected
 * @param {() => void} props.onStarSelected
 * @param {(color: string) => void} props.onTagSelected
 * @param {() => void} props.onOpenVersions
 */
export function DriveToolbar({
  searchQuery,
  viewMode,
  sortField,
  sortDirection,
  currentFolderId,
  items,
  selectedItemIds,
  onSearchChange,
  onViewModeChange,
  onSortChange,
  onNavigateFolder,
  onDeleteSelected,
  onStarSelected,
  onTagSelected,
  onOpenVersions,
}) {
  // Build breadcrumbs path
  const breadcrumbs = []
  let curr = items.find((i) => i.id === currentFolderId)
  while (curr) {
    breadcrumbs.unshift(curr)
    curr = items.find((i) => i.id === curr.parentId)
  }

  const hasSelection = selectedItemIds.length > 0

  return (
    <div className="flex flex-col border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Top search & views bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onNavigateFolder(null)}
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home size={14} />
            <span>My Drive</span>
          </button>
          {breadcrumbs.map((folder) => (
            <React.Fragment key={folder.id}>
              <ChevronRight size={13} className="text-slate-400" />
              <button
                onClick={() => onNavigateFolder(folder.id)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search, Sort & View Mode */}
        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in Drive..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 rounded-md border border-slate-200 bg-slate-50 py-1 pl-8 pr-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <ArrowUpDown size={12} className="text-slate-400" />
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split('-')
                onSortChange(f, d)
              }}
              className="bg-transparent text-xs text-slate-700 focus:outline-none dark:text-slate-300"
            >
              <option value={`${SORT_FIELDS.UPDATED_AT}-desc`}>Last modified</option>
              <option value={`${SORT_FIELDS.NAME}-asc`}>Name (A-Z)</option>
              <option value={`${SORT_FIELDS.NAME}-desc`}>Name (Z-A)</option>
              <option value={`${SORT_FIELDS.SIZE}-desc`}>File size (large)</option>
            </select>
          </div>

          {/* Grid/List Switcher */}
          <div className="flex items-center rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
            <button
              onClick={() => onViewModeChange(VIEW_MODES.GRID)}
              className={`rounded p-1 ${
                viewMode === VIEW_MODES.GRID
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => onViewModeChange(VIEW_MODES.LIST)}
              className={`rounded p-1 ${
                viewMode === VIEW_MODES.LIST
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Selected items action strip */}
      {hasSelection && (
        <div className="flex items-center justify-between bg-blue-50/70 px-4 py-1.5 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          <span>{selectedItemIds.length} item(s) selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onStarSelected}
              className="flex items-center gap-1 rounded px-2 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              <Star size={13} />
              <span>Star</span>
            </button>
            {selectedItemIds.length === 1 && (
              <button
                onClick={onOpenVersions}
                className="flex items-center gap-1 rounded px-2 py-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              >
                <History size={13} />
                <span>Version History</span>
              </button>
            )}
            <div className="flex items-center gap-1 px-1">
              {COLOR_TAGS.filter((t) => t.id !== 'none').map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTagSelected(t.id)}
                  className="h-3 w-3 rounded-full transition hover:scale-125"
                  style={{ backgroundColor: t.color }}
                  title={`Tag ${t.label}`}
                />
              ))}
            </div>
            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-1 rounded px-2 py-0.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 size={13} />
              <span>Trash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
