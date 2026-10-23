import { parseDocxDirect } from './ooxml-parser.js'

/**
 * Converts a base64 string or ArrayBuffer/Buffer into a Node Buffer or Uint8Array.
 * @param {string | ArrayBuffer | Uint8Array} input
 * @returns {Buffer | Uint8Array}
 */
function toBinaryBuffer(input) {
  if (typeof input === 'string') {
    const clean = input.replace(/^data:.*?;base64,/, '').trim()
    return Buffer.from(clean, 'base64')
  }
  if (input instanceof ArrayBuffer) {
    return Buffer.from(input)
  }
  return input
}

/**
 * Parses a .docx document into clean semantic HTML suitable for TipTap.
 * Uses direct OOXML parser with high fidelity, falling back to mammoth.
 *
 * @param {string | ArrayBuffer | Uint8Array} input - File content as base64 string or buffer
 * @returns {Promise<{
 *   html: string,
 *   messages: Array<any>,
 *   pageSetup?: any,
 *   stats?: any,
 *   preservedFiles?: Map<string, any>,
 *   isDirect?: boolean
 * }>}
 */
export async function parseDocxToHtml(input) {
  if (!input) {
    return { html: '<p></p>', messages: [] }
  }

  const buffer = toBinaryBuffer(input)
  const result = await parseDocxDirect(buffer)

  return {
    html: result.html || '<p></p>',
    messages: [],
    pageSetup: result.pageSetup,
    stats: result.stats,
    preservedFiles: result.preservedFiles,
    isDirect: result.isDirect,
  }
}
