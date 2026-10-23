import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

/**
 * Bookmark Dialog for inserting named in-document anchors.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(name: string) => void} props.onInsert
 */
export function BookmarkDialog({ isOpen, onClose, onInsert }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    // Clean to valid identifier
    const clean = name
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
    onInsert(clean)
    setName('')
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Bookmark"
      size="sm"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Add Bookmark
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bookmark-name-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Bookmark Name
          </label>
          <input
            id="bookmark-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. section_summary"
            autoFocus
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
          <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            Bookmarks allow you to create hyperlinks directly to this spot in your document using
            #name.
          </p>
        </div>
      </form>
    </Dialog>
  )
}
