import React from 'react'

/**
 * TableElement renders an editable grid table for slides.
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {boolean} props.isSelected
 * @param {(newTableData: Array<Array<string>>) => void} [props.onTableChange]
 */
export function TableElement({ element, isSelected, onTableChange }) {
  const { properties = {} } = element
  const {
    rows = 3,
    cols = 3,
    data = [
      ['Header 1', 'Header 2', 'Header 3'],
      ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
      ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
    ],
    headerBg = '#2563eb',
    headerColor = '#ffffff',
    borderColor = '#cbd5e1',
  } = properties

  const handleCellBlur = (rIdx, cIdx, text) => {
    if (!onTableChange) return
    const nextData = data.map((row, r) =>
      row.map((cell, c) => (r === rIdx && c === cIdx ? text : cell)),
    )
    onTableChange(nextData)
  }

  return (
    <div className="shadow-xs h-full w-full overflow-hidden rounded border border-neutral-300 dark:border-neutral-700">
      <table className="h-full w-full border-collapse text-xs">
        <tbody>
          {Array.from({ length: rows }).map((_, rIdx) => {
            const isHeader = rIdx === 0
            return (
              <tr
                key={`row-${rIdx}`}
                style={{
                  backgroundColor: isHeader ? headerBg : rIdx % 2 === 1 ? '#ffffff' : '#f8fafc',
                }}
              >
                {Array.from({ length: cols }).map((_, cIdx) => {
                  const cellText = data[rIdx]?.[cIdx] || ''
                  return (
                    <td
                      key={`cell-${rIdx}-${cIdx}`}
                      className="border p-1.5 outline-none"
                      style={{
                        borderColor,
                        color: isHeader ? headerColor : '#1e293b',
                        fontWeight: isHeader ? 'bold' : 'normal',
                      }}
                      contentEditable={isSelected}
                      suppressContentEditableWarning
                      onBlur={(e) => handleCellBlur(rIdx, cIdx, e.currentTarget.innerText)}
                    >
                      {cellText}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
