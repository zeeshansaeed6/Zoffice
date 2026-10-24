/**
 * ZNotes export — export notebooks as .zip with Markdown + assets.
 * @module zip-export
 */

import JSZip from 'jszip'
import { BLOCK_TYPES } from './constants.js'
import { TAG_META } from './constants.js'

/**
 * Export a notebook to a .zip file containing Markdown files and assets.
 * @param {import('./notebook-model.js').Notebook} notebook
 * @returns {Promise<Blob>}
 */
export async function exportNotebookToZip(notebook) {
  const zip = new JSZip()
  const assets = zip.folder('assets')
  let assetCount = 0

  // Create notebook root folder
  const nbFolder = zip.folder(sanitizeFilename(notebook.name))

  for (const section of notebook.sections) {
    const secFolder = nbFolder.folder(sanitizeFilename(section.name))

    for (const page of section.pages) {
      const { markdown, images } = pageToMarkdown(page)
      secFolder.file(`${sanitizeFilename(page.title)}.md`, markdown)

      // Store image assets
      for (const img of images) {
        const filename = `image_${assetCount++}${img.ext}`
        assets.file(filename, img.data, { base64: true })
      }
    }
  }

  // Add metadata
  zip.file('metadata.json', JSON.stringify({
    name: notebook.name,
    color: notebook.color,
    exportedAt: new Date().toISOString(),
    exportedFrom: 'ZNotes (Zoffice)',
    sections: notebook.sections.map((s) => ({
      name: s.name,
      pageCount: s.pages.length,
    })),
  }, null, 2))

  return zip.generateAsync({ type: 'blob' })
}

/**
 * Convert a page into Markdown text.
 * @param {import('./notebook-model.js').Page} page
 * @returns {{ markdown: string, images: Array<{ ext: string, data: string }> }}
 */
export function pageToMarkdown(page) {
  const lines = []
  const images = []

  lines.push(`# ${page.title}`)
  lines.push('')

  // Tags
  if (page.tags.length > 0) {
    const tagLabels = page.tags.map((t) => {
      const meta = TAG_META[t]
      return meta ? `\`${meta.label}\`` : `\`${t}\``
    })
    lines.push(`**Tags:** ${tagLabels.join(', ')}`)
    lines.push('')
  }

  // Sort blocks by position (top to bottom, left to right)
  const sorted = [...page.blocks].sort((a, b) => a.y - b.y || a.x - b.x)

  for (const block of sorted) {
    lines.push(blockToMarkdown(block, images))
    lines.push('')
  }

  return { markdown: lines.join('\n'), images }
}

/**
 * Convert a single block to Markdown.
 * @param {import('./notebook-model.js').Block} block
 * @param {Array} images - Accumulator for image assets
 * @returns {string}
 */
function blockToMarkdown(block, images) {
  switch (block.type) {
    case BLOCK_TYPES.TEXT:
      return block.content || ''

    case BLOCK_TYPES.CHECKLIST: {
      try {
        const data = JSON.parse(block.content)
        return (data.items || [])
          .map((item) => `- [${item.checked ? 'x' : ' '}] ${item.text}`)
          .join('\n')
      } catch {
        return block.content
      }
    }

    case BLOCK_TYPES.TABLE: {
      try {
        const data = JSON.parse(block.content)
        const rows = data.rows || []
        if (rows.length === 0) return ''
        const header = `| ${rows[0].join(' | ')} |`
        const sep = `| ${rows[0].map(() => '---').join(' | ')} |`
        const body = rows
          .slice(1)
          .map((r) => `| ${r.join(' | ')} |`)
          .join('\n')
        return [header, sep, body].join('\n')
      } catch {
        return block.content
      }
    }

    case BLOCK_TYPES.IMAGE: {
      try {
        const data = JSON.parse(block.content)
        if (data.src && data.src.startsWith('data:')) {
          const match = data.src.match(/^data:image\/(\w+);base64,(.+)/)
          if (match) {
            images.push({ ext: `.${match[1]}`, data: match[2] })
            return `![${data.alt || 'image'}](assets/image_${images.length - 1}.${match[1]})`
          }
        }
        return `![${data.alt || 'image'}](${data.src || ''})`
      } catch {
        return ''
      }
    }

    case BLOCK_TYPES.AUDIO: {
      try {
        const data = JSON.parse(block.content)
        return `🎙️ Audio recording (${Math.round(data.duration || 0)}s)`
      } catch {
        return '🎙️ Audio recording'
      }
    }

    case BLOCK_TYPES.INK:
      return '🖊️ [Ink drawing]'

    default:
      return block.content || ''
  }
}

/**
 * Sanitize a string for use as a filename.
 * @param {string} name
 * @returns {string}
 */
export function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100) || 'untitled'
}

/**
 * Trigger a download of a blob in the browser.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
