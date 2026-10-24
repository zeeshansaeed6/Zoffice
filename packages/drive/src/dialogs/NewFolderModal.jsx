/**
 * ZDrive New Folder Creation Modal Component.
 * @module NewFolderModal
 */

import React, { useState } from 'react'
import { X, FolderPlus } from 'lucide-react'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {(name: string) => void} props.onCreateFolder
 * @param {() => void} props.onClose
 */
export function NewFolderModal({ isOpen, onCreateFolder, onClose }) {
  const [name, setName] = useState('New Folder')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateFolder(name.trim())
      setName('New Folder')
      onClose()
    }
  }

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderPlus size={16} className="text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">New Folder</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            autoFocus
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />

          <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
