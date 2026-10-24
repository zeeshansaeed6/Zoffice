/**
 * ZForms Embed Code Generator — creates responsive iframe embed snippets.
 * @module embed-generator
 */

/**
 * @typedef {Object} EmbedOptions
 * @property {string} formId
 * @property {string} [title='Form']
 * @property {string} [width='100%']
 * @property {string} [height='700px']
 * @property {boolean} [border=false]
 * @property {string} [baseUrl='']
 */

/**
 * Generate an HTML iframe embed snippet for a form.
 * @param {EmbedOptions} options
 * @returns {string}
 */
export function generateEmbedCode(options) {
  const {
    formId,
    title = 'Form',
    width = '100%',
    height = '700px',
    border = false,
    baseUrl = 'http://localhost:5173/forms',
  } = options

  const safeTitle = title.replace(/"/g, '&quot;')
  const srcUrl = `${baseUrl.replace(/\/+$/, '')}/${formId}`
  const borderStyle = border ? 'border: 1px solid #e2e8f0; border-radius: 8px;' : 'border: none;'

  return `<iframe src="${srcUrl}" width="${width}" height="${height}" title="${safeTitle}" style="${borderStyle} overflow: hidden;" allow="camera; microphone; fullscreen">Loading form…</iframe>`
}
