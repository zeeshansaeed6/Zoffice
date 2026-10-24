/**
 * ZNotes search engine — full-text search across all notebooks, sections, and pages.
 * @module search-engine
 */

/**
 * Search across all notebooks for pages matching a query.
 * Matches against page titles, block content, and tags.
 * @param {import('./notebook-model.js').Notebook[]} notebooks
 * @param {string} query - Search term (case-insensitive)
 * @returns {Array<{ notebook: Object, section: Object, page: Object, matches: string[] }>}
 */
export function searchAllNotes(notebooks, query) {
  if (!query || query.trim().length === 0) return []

  const term = query.toLowerCase().trim()
  const results = []

  for (const notebook of notebooks) {
    for (const section of notebook.sections) {
      for (const page of section.pages) {
        const matches = findMatchesInPage(page, term)
        if (matches.length > 0) {
          results.push({
            notebookId: notebook.id,
            notebookName: notebook.name,
            sectionId: section.id,
            sectionName: section.name,
            pageId: page.id,
            pageTitle: page.title,
            matches,
          })
        }
      }
    }
  }

  return results
}

/**
 * Find matches within a single page.
 * @param {import('./notebook-model.js').Page} page
 * @param {string} term - Lowercase search term
 * @returns {string[]} Array of match descriptions
 */
function findMatchesInPage(page, term) {
  const matches = []

  // Check page title
  if (page.title.toLowerCase().includes(term)) {
    matches.push(`Title: ${page.title}`)
  }

  // Check tags
  for (const tag of page.tags) {
    if (tag.toLowerCase().includes(term)) {
      matches.push(`Tag: ${tag}`)
    }
  }

  // Check block content
  for (const block of page.blocks) {
    const content = extractTextFromBlock(block)
    if (content.toLowerCase().includes(term)) {
      const snippet = getSnippet(content, term, 60)
      matches.push(`Content: ${snippet}`)
    }
  }

  return matches
}

/**
 * Extract plain text from a block's content.
 * @param {import('./notebook-model.js').Block} block
 * @returns {string}
 */
export function extractTextFromBlock(block) {
  if (block.type === 'text') {
    return block.content || ''
  }
  try {
    const data = JSON.parse(block.content)
    if (block.type === 'checklist' && Array.isArray(data.items)) {
      return data.items.map((i) => i.text || '').join(' ')
    }
    if (block.type === 'table' && Array.isArray(data.rows)) {
      return data.rows.flat().join(' ')
    }
    if (block.type === 'image') {
      return data.alt || ''
    }
    return ''
  } catch {
    return String(block.content || '')
  }
}

/**
 * Get a snippet of text around the first match.
 * @param {string} text
 * @param {string} term
 * @param {number} [contextLen=60]
 * @returns {string}
 */
function getSnippet(text, term, contextLen = 60) {
  const idx = text.toLowerCase().indexOf(term)
  if (idx === -1) return text.slice(0, contextLen)

  const start = Math.max(0, idx - Math.floor(contextLen / 2))
  const end = Math.min(text.length, start + contextLen)
  let snippet = text.slice(start, end)

  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  return snippet
}
