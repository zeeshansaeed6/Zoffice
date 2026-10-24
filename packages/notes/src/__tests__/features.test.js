import { describe, it, expect } from 'vitest'
import { PAGE_TEMPLATES, getTemplate } from '../core/templates.js'
import {
  createPageLink,
  parsePageLinks,
  resolvePageLink,
  getAllLinkablePages,
  renderPageLinks,
} from '../core/page-link.js'
import { sanitizeHtml, htmlToBlocks } from '../core/web-clip.js'
import { sanitizeFilename, pageToMarkdown, exportNotebookToZip } from '../core/zip-export.js'
import { createNotebook, createSection, createPage, createBlock } from '../core/notebook-model.js'
import { BLOCK_TYPES } from '../core/constants.js'

describe('ZNotes Templates', () => {
  it('provides predefined page templates', () => {
    expect(PAGE_TEMPLATES.length).toBeGreaterThanOrEqual(4)
    const meeting = getTemplate('meeting-notes')
    expect(meeting).toBeDefined()
    expect(meeting?.name).toBe('Meeting Notes')

    const page = meeting?.create('sec-test')
    expect(page?.title).toBe('Meeting Notes')
    expect(page?.blocks.length).toBeGreaterThan(0)
  })
})

describe('ZNotes Page Linking', () => {
  it('creates and parses internal wiki-style page links', () => {
    const linkStr = createPageLink('p-123', 'My Goals')
    expect(linkStr).toBe('[[My Goals|p-123]]')

    const parsed = parsePageLinks('Check out [[My Goals|p-123]] and [[Sprint 4|p-456]]')
    expect(parsed.length).toBe(2)
    expect(parsed[0].title).toBe('My Goals')
    expect(parsed[0].pageId).toBe('p-123')
    expect(parsed[1].pageId).toBe('p-456')
  })

  it('resolves page links to notebook, section, and page', () => {
    const nb = createNotebook({ name: 'Work' })
    const sec = createSection(nb.id, { name: 'Tasks' })
    const pg = createPage(sec.id, { title: 'Q3 Deliverables' })
    sec.pages = [pg]
    nb.sections = [sec]

    const resolved = resolvePageLink(pg.id, [nb])
    expect(resolved).not.toBeNull()
    expect(resolved?.page.title).toBe('Q3 Deliverables')
    expect(resolved?.notebook.name).toBe('Work')

    const missing = resolvePageLink('p-999', [nb])
    expect(missing).toBeNull()
  })

  it('renders page links with human-readable indicator', () => {
    const rendered = renderPageLinks('Refer to [[Documentation|p-doc]]')
    expect(rendered).toBe('Refer to 🔗 Documentation')
  })

  it('lists all linkable pages across notebooks', () => {
    const nb = createNotebook({ name: 'Wiki' })
    const sec = createSection(nb.id, { name: 'Guides' })
    const pg = createPage(sec.id, { title: 'Setup' })
    sec.pages = [pg]
    nb.sections = [sec]

    const all = getAllLinkablePages([nb])
    expect(all.length).toBe(1)
    expect(all[0].title).toBe('Setup')
  })
})

describe('ZNotes Web Clipper', () => {
  it('sanitizes HTML stripping scripts and unsafe protocols', () => {
    const dirty =
      '<div><h3>Article</h3><script>alert("hack")</script><a href="javascript:steal()">Link</a></div>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<script>')
    expect(clean).not.toContain('javascript:')
    expect(clean).toContain('<h3>Article</h3>')
  })

  it('converts sanitized HTML to note blocks', () => {
    const html = '<h2>Title</h2><p>Paragraph text</p><table><tr><td>Row1</td></tr></table>'
    const blocks = htmlToBlocks(html, 'p-1')
    expect(blocks.length).toBe(3)
    expect(blocks.some((b) => b.type === BLOCK_TYPES.TEXT)).toBe(true)
    expect(blocks.some((b) => b.type === BLOCK_TYPES.TABLE)).toBe(true)
  })
})

describe('ZNotes Zip Export', () => {
  it('sanitizes filenames', () => {
    expect(sanitizeFilename('Project: "Alpha" / 2026?')).toBe('Project_ _Alpha_ _ 2026_')
  })

  it('converts page and its blocks to Markdown format', () => {
    const pg = createPage('sec-1', { title: 'Summary', tags: ['important'] })
    pg.blocks = [
      createBlock(pg.id, BLOCK_TYPES.TEXT, { content: 'This is the summary' }),
      createBlock(pg.id, BLOCK_TYPES.CHECKLIST, {
        content: JSON.stringify({ items: [{ text: 'Review draft', checked: true }] }),
      }),
      createBlock(pg.id, BLOCK_TYPES.TABLE, {
        content: JSON.stringify({
          rows: [
            ['A', 'B'],
            ['1', '2'],
          ],
        }),
      }),
    ]

    const { markdown } = pageToMarkdown(pg)
    expect(markdown).toContain('# Summary')
    expect(markdown).toContain('**Tags:**')
    expect(markdown).toContain('This is the summary')
    expect(markdown).toContain('- [x] Review draft')
    expect(markdown).toContain('| A | B |')
  })

  it('exports an entire notebook as a ZIP blob', async () => {
    const nb = createNotebook({ name: 'Export Test' })
    const sec = createSection(nb.id, { name: 'Main' })
    const pg = createPage(sec.id, { title: 'Page 1' })
    pg.blocks = [createBlock(pg.id, BLOCK_TYPES.TEXT, { content: 'Content 1' })]
    sec.pages = [pg]
    nb.sections = [sec]

    const blob = await exportNotebookToZip(nb)
    expect(blob).toBeDefined()
    expect(blob.size).toBeGreaterThan(0)
  })
})
