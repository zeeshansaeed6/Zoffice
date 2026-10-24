import React, { useState } from 'react'
import { Link, X, FileText } from 'lucide-react'
import { getAllLinkablePages, createPageLink } from '../core/page-link.js'

/**
 * Page Link Dialog to create links between notebook pages.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {Array<any>} props.notebooks
 * @param {(linkText: string) => void} props.onInsertLink
 */
export function PageLinkDialog({ isOpen, onClose, notebooks, onInsertLink }) {
  const [filter, setFilter] = useState('')
  const pages = getAllLinkablePages(notebooks)

  if (!isOpen) return null

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.notebookName.toLowerCase().includes(filter.toLowerCase()),
  )

  const handleSelectPage = (page) => {
    const linkText = createPageLink(page.id, page.title)
    onInsertLink(linkText)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="page-link-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Link size={16} className="text-violet-600 dark:text-violet-400" />
            <h2
              id="page-link-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Insert Link to Page
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="border-b border-neutral-200 p-3 dark:border-neutral-800">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search pages to link..."
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-violet-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filteredPages.length === 0 ? (
            <p className="p-4 text-center text-xs text-neutral-400">No pages found.</p>
          ) : (
            <div className="space-y-1">
              {filteredPages.map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => handleSelectPage(pg)}
                  className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/40"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} className="text-violet-600" />
                    <span className="truncate text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {pg.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] text-neutral-400">
                    {pg.notebookName} / {pg.sectionName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
