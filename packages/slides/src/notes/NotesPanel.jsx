import React from 'react'

/**
 * Speaker notes editor for the active slide (shown in the presenter view).
 *
 * @param {Object} props
 * @param {string} props.slideId
 * @param {string} props.notes
 * @param {(slideId: string, notes: string) => void} props.onChange
 */
export function NotesPanel({ slideId, notes, onChange }) {
  return (
    <div
      data-testid="notes-panel"
      className="h-28 shrink-0 border-t border-neutral-300 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <textarea
        aria-label="Speaker notes"
        placeholder="Click to add speaker notes"
        value={notes}
        onChange={(e) => onChange(slideId, e.target.value)}
        className="h-full w-full resize-none rounded border border-neutral-300 bg-transparent p-2 text-sm dark:border-neutral-700"
      />
    </div>
  )
}
