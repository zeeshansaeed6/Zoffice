import React from 'react'

/**
 * Visual grouping of ribbon controls with a bottom label and vertical divider.
 *
 * @param {Object} props
 * @param {string} props.label - Group caption (e.g. "Font", "Paragraph")
 * @param {React.ReactNode} props.children - Controls inside this group
 * @param {() => void} [props.onDialogLaunch] - Optional corner launcher button
 */
export function RibbonGroup({ label, children, onDialogLaunch }) {
  return (
    <div className="flex flex-col justify-between border-r border-neutral-200 px-2 py-1 dark:border-neutral-800">
      <div className="flex min-h-[60px] items-center gap-1">{children}</div>
      <div className="flex items-center justify-center pt-0.5">
        <span className="text-[10px] tracking-tight text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        {onDialogLaunch && (
          <button
            type="button"
            aria-label={`${label} options`}
            onClick={onDialogLaunch}
            className="ml-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            ↗
          </button>
        )}
      </div>
    </div>
  )
}
