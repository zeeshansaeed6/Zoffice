/**
 * ZDrive Grid View Component — cards layout for folders and files.
 * @module DriveGridView
 */

import React from 'react'
import { Star } from 'lucide-react'
import { FILE_KINDS, COLOR_TAGS } from '../core/constants.js'
import { formatFileSize } from '../core/drive-model.js'
import { FileIcon } from '../components/FileIcon.jsx'

/**
 * @param {Object} props
 * @param {import('../core/drive-model.js').DriveItem[]} props.items
 * @param {string[]} props.selectedItemIds
 * @param {(id: string, multi?: boolean) => void} props.onToggleSelect
 * @param {(folderId: string) => void} props.onNavigateFolder
 * @param {(id: string) => void} props.onToggleStar
 * @param {(file: import('../core/drive-model.js').DriveItem) => void} props.onOpenFile
 */
export function DriveGridView({
  items,
  selectedItemIds,
  onToggleSelect,
  onNavigateFolder,
  onToggleStar,
  onOpenFile,
}) {
  const folders = items.filter((i) => i.kind === FILE_KINDS.FOLDER)
  const files = items.filter((i) => i.kind !== FILE_KINDS.FOLDER)

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-y-auto bg-slate-50/50 p-6 dark:bg-slate-900/40">
      {/* Folders Section */}
      {folders.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Folders
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {folders.map((folder) => {
              const isSelected = selectedItemIds.includes(folder.id)
              return (
                <div
                  key={folder.id}
                  onClick={(e) => onToggleSelect(folder.id, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => onNavigateFolder(folder.id)}
                  className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isSelected
                      ? 'shadow-xs border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                      : 'hover:shadow-xs border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileIcon kind={folder.kind} colorTag={folder.colorTag} size={22} filled />
                    <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {folder.name}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleStar(folder.id)
                    }}
                    className={`rounded p-1 text-slate-400 hover:text-amber-500 ${
                      folder.starred ? 'text-amber-500' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star size={13} className={folder.starred ? 'fill-amber-400' : ''} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Files
        </h3>
        {files.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-800">
            No files in this folder.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => {
              const isSelected = selectedItemIds.includes(file.id)
              const tagObj = COLOR_TAGS.find((t) => t.id === file.colorTag)

              return (
                <div
                  key={file.id}
                  onClick={(e) => onToggleSelect(file.id, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => onOpenFile(file)}
                  className={`group flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                    isSelected
                      ? 'shadow-xs border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                      : 'hover:shadow-xs border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-slate-100 p-2.5 dark:bg-slate-900">
                      <FileIcon kind={file.kind} size={28} />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(file.id)
                      }}
                      className={`rounded p-1 text-slate-400 hover:text-amber-500 ${
                        file.starred ? 'text-amber-500' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Star size={14} className={file.starred ? 'fill-amber-400' : ''} />
                    </button>
                  </div>

                  {/* Card title & meta */}
                  <div className="mt-4">
                    <h4
                      className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100"
                      title={file.name}
                    >
                      {file.name}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {tagObj && tagObj.id !== 'none' && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: tagObj.color }}
                        />
                        <span className="text-[10px] text-slate-500">{tagObj.label}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
