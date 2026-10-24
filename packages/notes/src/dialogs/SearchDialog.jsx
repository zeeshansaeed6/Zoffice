import React, { useState, useMemo } from 'react'
import { Search, X, Book, FileText, ChevronRight } from 'lucide-react'
import { searchAllNotes } from '../core/search-engine.js'

/**
 * Search Dialog for searching across all notebooks, sections, and pages.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {Array<any>} props.notebooks
 * @param {(notebookId: string, sectionId: string, pageId: string) => void} props.onNavigate
 */
export function SearchDialog({ isOpen, onClose, notebooks, onNavigate }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchAllNotes(notebooks, query)
  }, [notebooks, query])

  if (!isOpen) return null

  const handleSelectResult = (res) => {
    onNavigate(res.notebookId, res.sectionId, res.pageId)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-violet-600 dark:text-violet-400" />
            <h2 id="search-dialog-title" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Search All Notes
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <div className="border-b border-neutral-200 p-3 dark:border-neutral-800">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a word, phrase, or tag..."
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-violet-500 focus:bg-white focus:ring-1 focus:ring-violet-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <p className="p-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
              Start typing to search titles, block content, and tags.
            </p>
          ) : results.length === 0 ? (
            <p className="p-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
              No matching pages found for "{query}".
            </p>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <button
                  key={`${res.notebookId}-${res.pageId}`}
                  type="button"
                  onClick={() => handleSelectResult(res)}
                  className="flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/40"
                >
                  <FileText size={16} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400" />
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      <span>{res.pageTitle}</span>
                      <ChevronRight size={10} className="text-neutral-400" />
                      <span className="text-[10px] text-neutral-400">
                        {res.notebookName} / {res.sectionName}
                      </span>
                    </div>
                    <div className="mt-1 space-y-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      {res.matches.slice(0, 2).map((m, idx) => (
                        <p key={idx} className="truncate">
                          {m}
                        </p>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
