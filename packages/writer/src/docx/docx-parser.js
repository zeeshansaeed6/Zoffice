import mammoth from 'mammoth'

/**
 * Converts a base64 string or ArrayBuffer/Buffer into a Node Buffer or Uint8Array.
 * @param {string | ArrayBuffer | Uint8Array} input
 * @returns {Buffer | Uint8Array}
 */
function toBinaryBuffer(input) {
  if (typeof input === 'string') {
    // Check if it's base64 or raw data
    return Buffer.from(input, 'base64')
  }
  if (input instanceof ArrayBuffer) {
    return Buffer.from(input)
  }
  return input
}

/**
 * Parses a .docx document into clean semantic HTML suitable for TipTap.
 *
 * @param {string | ArrayBuffer | Uint8Array} input - File content as base64 string or buffer
 * @returns {Promise<{ html: string, messages: Array<any> }>}
 */
export async function parseDocxToHtml(input) {
  if (!input) {
    return { html: '<p></p>', messages: [] }
  }

  const buffer = toBinaryBuffer(input)

  const options = {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Heading 4'] => h4:fresh",
      "p[style-name='Heading 5'] => h5:fresh",
      "p[style-name='Heading 6'] => h6:fresh",
      "p[style-name='Title'] => h1:fresh",
      "p[style-name='Subtitle'] => h2:fresh",
      "p[style-name='Quote'] => blockquote:fresh",
      "r[style-name='Strong'] => strong",
      "r[style-name='Emphasis'] => em",
    ],
  }

  const result = await mammoth.convertToHtml({ buffer }, options)
  return {
    html: result.value || '<p></p>',
    messages: result.messages || [],
  }
}
