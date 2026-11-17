import { parseXml } from './xml-utils.js'

/**
 * Joins the text of every w:t under a node, one string per paragraph.
 * @param {Document|Element} root
 * @returns {string}
 */
function paragraphsText(root) {
  const paragraphs = Array.from(root.getElementsByTagName('w:p'))
  return paragraphs
    .map((p) =>
      Array.from(p.getElementsByTagName('w:t'))
        .map((t) => t.textContent || '')
        .join(''),
    )
    .filter(Boolean)
    .join(' ')
    .trim()
}

async function readText(zip, path) {
  const file = zip.file(path)
  return file ? file.async('text') : null
}

/**
 * Finds the default header/footer part referenced from document.xml.
 * @returns {string|null} part path inside the zip
 */
function findReferencedPart(documentXml, relationships, tag) {
  const match = documentXml.match(
    new RegExp(`<w:${tag}Reference[^>]*w:type="default"[^>]*r:id="([^"]+)"`),
  )
  const target = match && relationships.get(match[1])?.target
  return target ? `word/${target.replace(/^\/?(word\/)?/, '')}` : null
}

/**
 * Reads the default header and footer text and whether the footer has a page number field.
 */
async function readHeaderFooter(zip, documentXml, relationships) {
  const result = { header: '', footer: '', pageNumbers: false }

  const headerPath = findReferencedPart(documentXml, relationships, 'header')
  const headerXml = headerPath && (await readText(zip, headerPath))
  if (headerXml) result.header = paragraphsText(parseXml(headerXml))

  const footerPath = findReferencedPart(documentXml, relationships, 'footer')
  const footerXml = footerPath && (await readText(zip, footerPath))
  if (footerXml) {
    result.pageNumbers = /instrText[^>]*>\s*PAGE|w:instr="\s*PAGE/i.test(footerXml)
    const text = paragraphsText(parseXml(footerXml))
    result.footer = result.pageNumbers ? text.replace(/\s*Page\s*\d*\s*$/i, '').trim() : text
  }
  return result
}

async function readFootnotes(zip) {
  const notes = new Map()
  const xml = await readText(zip, 'word/footnotes.xml')
  if (!xml) return notes
  for (const el of parseXml(xml).getElementsByTagName('w:footnote')) {
    const type = el.getAttribute('w:type')
    const id = el.getAttribute('w:id')
    if (type === 'separator' || type === 'continuationSeparator' || Number(id) < 1) continue
    notes.set(id, paragraphsText(el))
  }
  return notes
}

async function readComments(zip) {
  const comments = new Map()
  const xml = await readText(zip, 'word/comments.xml')
  if (!xml) return comments
  for (const el of parseXml(xml).getElementsByTagName('w:comment')) {
    comments.set(el.getAttribute('w:id'), {
      text: paragraphsText(el),
      author: el.getAttribute('w:author') || 'Unknown',
    })
  }
  return comments
}

/**
 * Reads header/footer, footnotes and comments from a .docx package.
 *
 * @param {import('jszip')} zip
 * @param {string} documentXml
 * @param {Map<string, { target: string }>} relationships
 */
export async function readNotesAndHeaders(zip, documentXml, relationships) {
  const [headerFooter, footnotes, comments] = await Promise.all([
    readHeaderFooter(zip, documentXml, relationships),
    readFootnotes(zip),
    readComments(zip),
  ])
  return { ...headerFooter, footnotes, comments }
}

/** Escapes text for use inside a double-quoted HTML attribute. */
export function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
