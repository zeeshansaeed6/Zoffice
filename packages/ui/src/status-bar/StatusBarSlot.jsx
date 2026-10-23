import React from 'react'

/**
 * Clickable or informational slot item within the status bar.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onClick]
 * @param {string} [props.title]
 * @param {string} [props.className]
 */
export function StatusBarSlot({ children, onClick, title, className = '' }) {
  const isInteractive = Boolean(onClick)

  if (isInteractive) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800 ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div
      title={title}
      className={`flex items-center gap-1 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400 ${className}`}
    >
      {children}
    </div>
  )
}
