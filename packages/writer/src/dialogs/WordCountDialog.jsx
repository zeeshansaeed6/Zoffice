import React from 'react'
import { Dialog } from '@zoffice/ui'
import { getDocumentStats } from '../ribbon/review-actions.js'

const ROWS = [
  ['Words', 'words'],
  ['Characters (with spaces)', 'characters'],
  ['Characters (no spaces)', 'charactersNoSpaces'],
  ['Paragraphs', 'paragraphs'],
  ['Lines', 'lines'],
]

/**
 * Shows document statistics.
 * @param {{isOpen: boolean, onClose: () => void, editor: any}} props
 */
export function WordCountDialog({ isOpen, onClose, editor }) {
  if (!isOpen) return null
  const stats = getDocumentStats(editor)
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Word Count">
      <table className="w-full text-sm" data-testid="word-count-table">
        <tbody>
          {ROWS.map(([label, key]) => (
            <tr key={key} className="border-b border-neutral-200 dark:border-neutral-800">
              <th scope="row" className="py-2 text-left font-normal">
                {label}
              </th>
              <td className="py-2 text-right font-semibold">{stats[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Dialog>
  )
}
