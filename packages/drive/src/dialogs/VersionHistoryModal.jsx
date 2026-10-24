/**
 * ZDrive Version History Modal Component.
 * @module VersionHistoryModal
 */

import React, { useState } from 'react'
import { X, History, Plus, RotateCcw, CheckCircle2 } from 'lucide-react'
import { formatFileSize } from '../core/drive-model.js'
import { FileIcon } from '../components/FileIcon.jsx'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../core/drive-model.js').DriveItem|null} props.file
 * @param {(fileId: string, content: string, comment: string) => void} props.onAddVersion
 * @param {() => void} props.onClose
 */
export function VersionHistoryModal({ isOpen, file, onAddVersion, onClose }) {
  const [comment, setComment] = useState('')
  const [restoredVersionId, setRestoredVersionId] = useState(null)

  if (!isOpen || !file) return null

  const handleCreateSnapshot = (e) => {
    e.preventDefault()
    onAddVersion(file.id, '', comment || `Snapshot ${new Date().toLocaleTimeString()}`)
    setComment('')
  }

  const handleRestore = (ver) => {
    setRestoredVersionId(ver.id)
    onAddVersion(file.id, ver.content || '', `Restored to version ${ver.versionNumber}`)
  }

  const versions = file.versions || []

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex h-[80vh] w-full max-w-xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileIcon kind={file.kind} size={20} />
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{file.name}</h3>
              <p className="text-[11px] text-slate-400">
                Version History &bull; {versions.length} revision(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Snapshot Creation Bar */}
        <form
          onSubmit={handleCreateSnapshot}
          className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950"
        >
          <input
            type="text"
            placeholder="Add note for new snapshot (e.g., Reviewed by team)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            type="submit"
            className="shadow-xs flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={13} />
            <span>Create Snapshot</span>
          </button>
        </form>

        {/* Versions Timeline List */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
          {versions.map((ver, idx) => {
            const isLatest = idx === 0
            const isRestored = restoredVersionId === ver.id

            return (
              <div
                key={ver.id}
                className={`flex items-start justify-between rounded-xl border p-3.5 transition ${
                  isLatest
                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-slate-100 p-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <History size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Version {ver.versionNumber}
                      </span>
                      {isLatest && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          Current
                        </span>
                      )}
                      {isRestored && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                          <CheckCircle2 size={11} /> Restored
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                      {ver.comment || 'Revision'}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{new Date(ver.createdAt).toLocaleString()}</span>
                      <span>&bull;</span>
                      <span>{formatFileSize(ver.size)}</span>
                      <span>&bull;</span>
                      <span>Offline local snapshot</span>
                    </div>
                  </div>
                </div>

                {!isLatest && (
                  <button
                    onClick={() => handleRestore(ver)}
                    className="flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <RotateCcw size={12} />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-md bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
