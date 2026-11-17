import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

/**
 * Small dialog asking for one piece of text (footnote body, comment text...).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {string} props.label
 * @param {(text: string) => void} props.onSubmit
 */
export function TextPromptDialog({ isOpen, onClose, title, label, onSubmit }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <textarea
            autoFocus
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="rounded border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-3 py-1 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
          >
            OK
          </button>
        </div>
      </form>
    </Dialog>
  )
}
