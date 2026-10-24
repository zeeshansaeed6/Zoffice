/**
 * ZForms CSV / ZSheets Export Engine — exports form responses to CSV.
 * Complies with RFC 4180 CSV specifications.
 * @module export-csv
 */

/**
 * Escape a cell value for standard CSV formatting.
 * @param {any} value
 * @returns {string}
 */
export function escapeCsvCell(value) {
  if (value === undefined || value === null) return '""'

  let str = ''
  if (Array.isArray(value)) {
    str = value.join('; ')
  } else if (typeof value === 'object' && value.filename) {
    str = value.filename
  } else {
    str = String(value)
  }

  // If cell contains commas, quotes, or newlines, quote and escape quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

/**
 * Export form submissions into a CSV string compatible with ZSheets and spreadsheets.
 *
 * @param {import('./form-model.js').FormSchema} form
 * @param {import('./response-model.js').FormResponse[]} responses
 * @returns {string}
 */
export function exportResponsesToCsv(form, responses = []) {
  if (!form || !Array.isArray(form.questions)) return ''

  // Build header row: Timestamp + sorted questions
  const questions = [...form.questions].sort((a, b) => a.order - b.order)
  const headerCols = [
    'Submission Timestamp',
    ...questions.map((q) => q.title || 'Untitled Question'),
  ]
  const lines = [headerCols.map(escapeCsvCell).join(',')]

  // Build each response row
  for (const resp of responses) {
    const dateStr = new Date(resp.submittedAt).toISOString()
    const rowCols = [
      escapeCsvCell(dateStr),
      ...questions.map((q) => {
        const answer = resp.answers ? resp.answers[q.id] : ''
        return escapeCsvCell(answer)
      }),
    ]
    lines.push(rowCols.join(','))
  }

  return lines.join('\r\n')
}
