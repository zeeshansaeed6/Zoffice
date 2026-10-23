import React, { useState } from 'react'
import { Plus } from 'lucide-react'

/**
 * Bottom Sheet Tab Bar for switching, adding, and renaming sheets.
 *
 * @param {Object} props
 * @param {Array<{ id: string, name: string }>} props.sheets
 * @param {string} props.activeSheetId
 * @param {(sheetId: string) => void} props.onSelectSheet
 * @param {() => void} props.onAddSheet
 * @param {(sheetId: string, newName: string) => void} [props.onRenameSheet]
 */
export function SheetTabBar({ sheets, activeSheetId, onSelectSheet, onAddSheet, onRenameSheet }) {
  const [editingSheetId, setEditingSheetId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleStartRename = (sheet) => {
    setEditingSheetId(sheet.id)
    setEditName(sheet.name)
  }

  const handleFinishRename = (sheetId) => {
    if (editName.trim() && onRenameSheet) {
      onRenameSheet(sheetId, editName.trim())
    }
    setEditingSheetId(null)
  }

  return (
    <div
      data-testid="sheet-tab-bar"
      className="flex h-7 select-none items-center border-t border-neutral-200 bg-neutral-100 px-2 text-xs dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Add Sheet Button */}
      <button
        type="button"
        title="New Sheet"
        onClick={onAddSheet}
        className="mr-2 flex h-5 w-5 items-center justify-center rounded text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      >
        <Plus size={14} />
      </button>

      {/* Sheet Tabs */}
      <div className="flex h-full items-center gap-1 overflow-x-auto">
        {sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId
          const isEditing = sheet.id === editingSheetId

          if (isEditing) {
            return (
              <input
                key={sheet.id}
                type="text"
                value={editName}
                autoFocus
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleFinishRename(sheet.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFinishRename(sheet.id)
                  if (e.key === 'Escape') setEditingSheetId(null)
                }}
                className="h-6 rounded border border-blue-500 bg-white px-2 py-0.5 text-xs text-neutral-900 outline-none dark:bg-neutral-800 dark:text-neutral-100"
              />
            )
          }

          return (
            <button
              key={sheet.id}
              type="button"
              onClick={() => onSelectSheet(sheet.id)}
              onDoubleClick={() => handleStartRename(sheet)}
              className={`flex h-full items-center border-b-2 px-3 font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 bg-white text-blue-600 dark:border-blue-400 dark:bg-neutral-950 dark:text-blue-400'
                  : 'border-transparent text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              {sheet.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
