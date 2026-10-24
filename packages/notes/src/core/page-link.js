/**
 * ZNotes page linking — create and resolve internal page links.
 * @module page-link
 */

/**
 * Create a page link string.
 * @param {string} pageId
 * @param {string} pageTitle
 * @returns {string}
 */
export function createPageLink(pageId, pageTitle) {
  return `[[${pageTitle}|${pageId}]]`
}

/**
 * Parse page links from text content.
 * @param {string} text
 * @returns {Array<{ full: string, title: string, pageId: string }>}
 */
export function parsePageLinks(text) {
  const regex = /\[\[([^|]+)\|([^\]]+)\]\]/g
  const links = []
  let match

  while ((match = regex.exec(text)) !== null) {
    links.push({
      full: match[0],
      title: match[1],
      pageId: match[2],
    })
  }

  return links
}

/**
 * Resolve a page link to the actual page.
 * @param {string} pageId
 * @param {import('./notebook-model.js').Notebook[]} notebooks
 * @returns {{ notebook: Object, section: Object, page: Object } | null}
 */
export function resolvePageLink(pageId, notebooks) {
  for (const notebook of notebooks) {
    for (const section of notebook.sections) {
      const page = section.pages.find((p) => p.id === pageId)
      if (page) {
        return { notebook, section, page }
      }
    }
  }
  return null
}

/**
 * Find all pages that can be linked to.
 * @param {import('./notebook-model.js').Notebook[]} notebooks
 * @returns {Array<{ id: string, title: string, notebookName: string, sectionName: string }>}
 */
export function getAllLinkablePages(notebooks) {
  const pages = []
  for (const notebook of notebooks) {
    for (const section of notebook.sections) {
      for (const page of section.pages) {
        pages.push({
          id: page.id,
          title: page.title,
          notebookName: notebook.name,
          sectionName: section.name,
        })
      }
    }
  }
  return pages
}

/**
 * Replace page link markup with display text for rendering.
 * @param {string} text
 * @returns {string}
 */
export function renderPageLinks(text) {
  return text.replace(/\[\[([^|]+)\|[^\]]+\]\]/g, '🔗 $1')
}
