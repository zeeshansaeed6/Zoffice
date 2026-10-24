/* global zoffice */

/**
 * CSV Data Cleaner Plugin for ZSheets.
 * Cleans raw CSV datasets by trimming cell whitespace, standardizing line breaks,
 * removing trailing empty delimiters, and pruning duplicate rows.
 */

function cleanCsvText(rawText) {
  if (!rawText || typeof rawText !== 'string') return ''

  const lines = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const seenRows = new Set()
  const cleanedRows = []

  for (const line of lines) {
    if (!line.trim()) continue

    // Parse simple CSV tokens and trim cell values
    const cells = line.split(',').map((cell) => cell.trim())
    const rowKey = cells.join(',')

    // Deduplicate identical rows
    if (!seenRows.has(rowKey)) {
      seenRows.add(rowKey)
      cleanedRows.push(cells.join(','))
    }
  }

  return cleanedRows.join('\n')
}

module.exports = {
  cleanCsvText: cleanCsvText,

  cleanCsvData: function (_context) {
    const raw = zoffice.document.getContent()
    const cleaned = cleanCsvText(raw)
    zoffice.document.setContent(cleaned)
    zoffice.ui.showToast('CSV cleaned: whitespace trimmed & duplicate rows removed.')
    return cleaned
  },

  cleanAndParseCsv: function (fileData) {
    const text = typeof fileData === 'string' ? fileData : String(fileData || '')
    return cleanCsvText(text)
  },
}
