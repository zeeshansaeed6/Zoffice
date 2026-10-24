/**
 * TrelloImportModal — dialog for importing Trello JSON boards into ZPlanner.
 * @module TrelloImportModal
 */

import React, { useState } from 'react'
import { X, Upload, FileCode, CheckCircle, AlertCircle } from 'lucide-react'
import { usePlannerStore } from '../core/planner-store.js'
import { importTrelloBoard } from '../core/trello-importer.js'

export function TrelloImportModal() {
  const { isImportModalOpen, setIsImportModalOpen, setBoard } = usePlannerStore()
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isImportModalOpen) return null

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setJsonText(String(event.target?.result || ''))
      setError('')
      setSuccess('')
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file)
  }

  const handleImport = () => {
    setError('')
    setSuccess('')
    if (!jsonText.trim()) {
      setError('Please provide Trello JSON content or upload a JSON file.')
      return
    }

    try {
      const imported = importTrelloBoard(jsonText)
      setBoard(imported)
      setSuccess(`Imported board "${imported.title}" with ${imported.tasks.length} tasks!`)
      setTimeout(() => {
        setIsImportModalOpen(false)
      }, 1200)
    } catch (err) {
      setError(`Import failed: ${err.message}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Import Trello Board
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6 text-xs">
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            Import a board exported from Trello (.json). Lists will become columns, cards will
            become tasks with due dates, checklists, and priorities.
          </p>

          {/* File Picker */}
          <div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 transition-colors hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800/50">
              <Upload className="mb-1 h-6 w-6 text-slate-400" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Choose a Trello JSON file
              </span>
              <span className="text-[11px] text-slate-400">or paste JSON below</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Raw JSON textarea */}
          <div>
            <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              JSON Content
            </label>
            <textarea
              rows={6}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setError('')
              }}
              placeholder='{"name": "My Project", "lists": [...], "cards": [...]}'
              className="focus:outline-hidden w-full rounded border border-slate-300 bg-white p-2.5 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-2.5 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(false)}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 dark:text-slate-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Import Board
          </button>
        </div>
      </div>
    </div>
  )
}
