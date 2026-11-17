import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

const FIELD =
  'rounded border border-neutral-300 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900'

/**
 * Edits the page header, footer and page-number setting.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {{header?: string, footer?: string, pageNumbers?: boolean}} props.value
 * @param {(next: {header: string, footer: string, pageNumbers: boolean}) => void} props.onApply
 */
export function HeaderFooterDialog({ isOpen, onClose, value, onApply }) {
  const [header, setHeader] = useState(value.header || '')
  const [footer, setFooter] = useState(value.footer || '')
  const [pageNumbers, setPageNumbers] = useState(Boolean(value.pageNumbers))

  const handleSubmit = (e) => {
    e.preventDefault()
    onApply({ header, footer, pageNumbers })
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Header & Footer">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Header text
          <input value={header} onChange={(e) => setHeader(e.target.value)} className={FIELD} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Footer text
          <input value={footer} onChange={(e) => setFooter(e.target.value)} className={FIELD} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={pageNumbers}
            onChange={(e) => setPageNumbers(e.target.checked)}
          />
          Show page numbers
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-3 py-1 text-sm">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
          >
            Apply
          </button>
        </div>
      </form>
    </Dialog>
  )
}
