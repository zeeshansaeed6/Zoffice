import React, { useState, useEffect } from 'react'
import { Dialog } from '@zoffice/ui'

/**
 * Hyperlink Dialog for inserting and editing web links.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {import('@tiptap/react').Editor} props.editor
 * @param {(url: string, text?: string) => void} props.onSave
 * @param {() => void} [props.onRemove]
 */
export function HyperlinkDialog({ isOpen, onClose, editor, onSave, onRemove }) {
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [hasSelection, setHasSelection] = useState(false)
  const [isExistingLink, setIsExistingLink] = useState(false)

  useEffect(() => {
    if (!editor || !isOpen) return
    const selection = editor.state.selection
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to)
    const existingHref = editor.getAttributes('link').href || ''

    setUrl(existingHref)
    setText(selectedText)
    setHasSelection(!selection.empty)
    setIsExistingLink(Boolean(existingHref))
  }, [editor, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url) return
    let finalUrl = url.trim()
    if (!/^https?:\/\/|^mailto:|^#/.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`
    }
    onSave(finalUrl, hasSelection ? undefined : text.trim() || finalUrl)
    onClose()
  }

  const handleRemove = () => {
    onRemove?.()
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isExistingLink ? 'Edit Hyperlink' : 'Insert Hyperlink'}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-between">
          {isExistingLink ? (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              Remove Link
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!url.trim()}
              onClick={handleSubmit}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!hasSelection && (
          <div>
            <label
              htmlFor="link-text-input"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Text to display
            </label>
            <input
              id="link-text-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Visit Website"
              className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="link-url-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Web address (URL) or bookmark anchor (#name)
          </label>
          <input
            id="link-url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </form>
    </Dialog>
  )
}
