import React from 'react'
import { X } from 'lucide-react'
import { collectComments } from '../core/comment-extension.js'

/**
 * Side panel listing review comments; click to jump, X to delete.
 *
 * @param {Object} props
 * @param {import('@tiptap/react').Editor | null} props.editor
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 */
export function CommentsPanel({ editor, isOpen, onClose }) {
  if (!isOpen || !editor?.isInitialized) return null
  const comments = collectComments(editor.state.doc)

  return (
    <aside
      data-testid="comments-panel"
      aria-label="Comments"
      className="flex w-72 shrink-0 flex-col gap-2 overflow-y-auto border-l border-neutral-300 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-center justify-between font-semibold">
        Comments ({comments.length})
        <button type="button" aria-label="Close comments" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      {comments.length === 0 && <p className="text-neutral-500">No comments yet.</p>}
      {comments.map((c) => (
        <div
          key={c.id}
          className="rounded border border-amber-300 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/30"
        >
          <button
            type="button"
            className="block w-full truncate text-left text-xs text-neutral-500"
            onClick={() =>
              editor.chain().focus().setTextSelection({ from: c.from, to: c.to }).run()
            }
          >
            “{c.quote}”
          </button>
          <p className="mt-1">{c.text}</p>
          <button
            type="button"
            className="mt-1 text-xs text-red-600"
            onClick={() => editor.commands.removeComment(c.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </aside>
  )
}
