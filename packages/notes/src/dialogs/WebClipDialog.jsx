import React, { useState } from 'react'
import { Paperclip, X, Check } from 'lucide-react'

/**
 * Web Clip Dialog to paste and convert web content / HTML into note blocks.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(html: string) => void} props.onClip
 */
export function WebClipDialog({ isOpen, onClose, onClip }) {
  const [content, setContent] = useState('')

  if (!isOpen) return null

  const handleClip = () => {
    if (!content.trim()) return
    onClip(content)
    setContent('')
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-clip-title"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-20 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Paperclip size={16} className="text-violet-600 dark:text-violet-400" />
            <h2
              id="web-clip-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Web Clipper — Paste HTML or Rich Text
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

        <div className="p-4">
          <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
            Paste HTML, tables, articles, or text copied from web pages. Dangerous scripts and
            styles will be stripped.
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Paste HTML or formatted text here..."
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-3 font-mono text-xs text-neutral-900 outline-none focus:border-violet-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleClip}
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            <Check size={14} />
            Clip into Notes
          </button>
        </div>
      </div>
    </div>
  )
}
