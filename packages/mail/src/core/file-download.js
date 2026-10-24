/**
 * Helper to trigger browser download of a text/blob payload.
 * @module file-download
 */

/**
 * Download a string payload as a local file.
 * @param {string} text - Payload string
 * @param {string} filename - Target file name
 * @param {string} mimeType - MIME type header
 */
export function downloadTextFile(text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
