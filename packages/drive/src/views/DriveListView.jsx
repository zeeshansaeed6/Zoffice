/**
 * ZDrive List View Component — detailed table layout for drive items.
 * @module DriveListView
 */

import React from 'react'
import { Star, History, Trash2 } from 'lucide-react'
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
 * @param {(id: string) => void} props.onDelete
 */
export function DriveListView({
  items,
  selectedItemIds,
  onToggleSelect,
  onNavigateFolder,
  onToggleStar,
  onOpenFile,
  onDelete,
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-white dark:bg-slate-900">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <tr>
            <th className="w-10 px-3 py-2 text-center">
              <span className="sr-only">Select</span>
            </th>
            <th className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Name</th>
            <th className="w-28 px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Type
            </th>
            <th className="w-32 px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Last Modified
            </th>
            <th className="w-24 px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Size
            </th>
            <th className="w-20 px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">Tag</th>
            <th className="w-20 px-3 py-2 text-center font-semibold text-slate-700 dark:text-slate-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id)
            const tagObj = COLOR_TAGS.find((t) => t.id === item.colorTag)

            return (
              <tr
                key={item.id}
                onClick={(e) => onToggleSelect(item.id, e.ctrlKey || e.metaKey)}
                onDoubleClick={() =>
                  item.kind === FILE_KINDS.FOLDER ? onNavigateFolder(item.id) : onOpenFile(item)
                }
                className={`group cursor-pointer border-b border-slate-100 transition dark:border-slate-800/60 ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item.id, true)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <FileIcon
                      kind={item.kind}
                      colorTag={item.colorTag}
                      size={18}
                      filled={item.kind === FILE_KINDS.FOLDER}
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-2 capitalize text-slate-500 dark:text-slate-400">
                  {item.kind}
                </td>

                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>

                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                  {item.kind === FILE_KINDS.FOLDER ? '—' : formatFileSize(item.size)}
                </td>

                <td className="px-3 py-2">
                  {tagObj && tagObj.id !== 'none' ? (
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tagObj.color }}
                      title={tagObj.label}
                    />
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleStar(item.id)
                      }}
                      className={`rounded p-1 ${
                        item.starred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                      }`}
                      title={item.starred ? 'Unstar' : 'Star'}
                    >
                      <Star size={13} className={item.starred ? 'fill-amber-400' : ''} />
                    </button>

                    {item.kind !== FILE_KINDS.FOLDER && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenFile(item)
                        }}
                        className="rounded p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Versions"
                      >
                        <History size={13} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item.id)
                      }}
                      className="rounded p-1 text-slate-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
