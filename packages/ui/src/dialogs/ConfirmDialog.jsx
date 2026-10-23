import React from 'react'
import { Dialog } from './Dialog.jsx'

/**
 * Unsaved changes confirmation dialog (Save, Don't Save, Cancel).
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.documentTitle
 * @param {() => void} props.onSave - Save changes and close
 * @param {() => void} props.onDiscard - Discard changes and close
 * @param {() => void} props.onCancel - Cancel close action
 */
export function ConfirmDialog({ isOpen, documentTitle, onSave, onDiscard, onCancel }) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      title="Save Changes"
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            Don't Save
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Save
          </button>
        </>
      }
    >
      <p>
        Do you want to save the changes you made to{' '}
        <span className="font-semibold">{documentTitle || 'Untitled'}</span>?
      </p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Your changes will be lost if you don't save them.
      </p>
    </Dialog>
  )
}
