/**
 * ZNotes web clip — sanitize pasted HTML into blocks.
 * @module web-clip
 */

import { BLOCK_TYPES } from './constants.js'
import { createBlock } from './notebook-model.js'

/** Tags allowed in sanitized HTML */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
  'span', 'div', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'img',
])

/** Attributes allowed per tag */
const ALLOWED_ATTRS = {
  a: ['href'],
  img: ['src', 'alt', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
}

/**
 * Sanitize HTML by stripping dangerous tags and attributes.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
  if (!html) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const clean = sanitizeNode(doc.body)
  return clean.innerHTML
}

/**
 * Recursively sanitize a DOM node.
 * @param {Node} node
 * @returns {DocumentFragment}
 */
function sanitizeNode(node) {
  const fragment = document.createDocumentFragment()

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      fragment.appendChild(document.createTextNode(child.textContent))
      continue
    }

    if (child.nodeType !== Node.ELEMENT_NODE) continue

    const tag = child.tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      // Keep children but drop the tag
      fragment.appendChild(sanitizeNode(child))
      continue
    }

    const elem = document.createElement(tag)
    const allowed = ALLOWED_ATTRS[tag] || []
    for (const attr of allowed) {
      if (child.hasAttribute(attr)) {
        const val = child.getAttribute(attr)
        // Block javascript: URLs
        if (attr === 'href' && val.trim().toLowerCase().startsWith('javascript')) {
          continue
        }
        elem.setAttribute(attr, val)
      }
    }

    elem.appendChild(sanitizeNode(child))
    fragment.appendChild(elem)
  }

  return fragment
}

/**
 * Convert pasted HTML content into note blocks.
 * @param {string} html
 * @param {string} pageId
 * @param {number} [startY=40]
 * @returns {import('./notebook-model.js').Block[]}
 */
export function htmlToBlocks(html, pageId, startY = 40) {
  const sanitized = sanitizeHtml(html)
  if (!sanitized.trim()) return []

  // Extract tables separately
  const blocks = []
  let y = startY
  const parser = new DOMParser()
  const doc = parser.parseFromString(sanitized, 'text/html')

  for (const child of Array.from(doc.body.children)) {
    if (child.tagName.toLowerCase() === 'table') {
      const tableData = extractTable(child)
      blocks.push(
        createBlock(pageId, BLOCK_TYPES.TABLE, {
          content: JSON.stringify({ rows: tableData }),
          x: 40, y, width: 500, height: Math.max(60, tableData.length * 30),
        }),
      )
      y += Math.max(80, tableData.length * 30) + 20
    } else if (child.tagName.toLowerCase() === 'img') {
      blocks.push(
        createBlock(pageId, BLOCK_TYPES.IMAGE, {
          content: JSON.stringify({
            src: child.getAttribute('src') || '',
            alt: child.getAttribute('alt') || '',
          }),
          x: 40, y, width: 400, height: 300,
        }),
      )
      y += 320
    } else {
      const text = child.textContent?.trim() || ''
      if (text) {
        blocks.push(
          createBlock(pageId, BLOCK_TYPES.TEXT, {
            content: text,
            x: 40, y, width: 500, height: Math.max(30, Math.ceil(text.length / 60) * 22),
          }),
        )
        y += Math.max(50, Math.ceil(text.length / 60) * 22) + 10
      }
    }
  }

  return blocks
}

/**
 * Extract table data from a table element.
 * @param {Element} table
 * @returns {string[][]}
 */
function extractTable(table) {
  const rows = []
  for (const tr of table.querySelectorAll('tr')) {
    const cells = []
    for (const cell of tr.querySelectorAll('td, th')) {
      cells.push(cell.textContent?.trim() || '')
    }
    if (cells.length > 0) rows.push(cells)
  }
  return rows.length > 0 ? rows : [['', ''], ['', '']]
}
