import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { getWriterExtensions } from '../core/editor-schema.js'
import { getWriterRibbonConfig } from '../ribbon/ribbon-config.jsx'
import { getPageMetrics, resolveMargins } from '../page-layout/page-utils.js'
import * as review from '../ribbon/review-actions.js'
import { serializeDocxToBase64 } from '../docx/docx-serializer.js'

let editor
const make = (content) => {
  editor = new Editor({ extensions: getWriterExtensions(), content })
  return editor
}
afterEach(() => editor?.destroy())

describe('ZWriter Layout / References / Review / View', () => {
  it('exposes the four new ribbon tabs', () => {
    const ids = getWriterRibbonConfig().tabs.map((t) => t.id)
    expect(ids).toEqual(['home', 'insert', 'layout', 'references', 'review', 'view'])
  })

  it('swaps paper dimensions for landscape and resolves margins', () => {
    const portrait = getPageMetrics({ pageSize: 'a4' })
    const landscape = getPageMetrics({ pageSize: 'a4', orientation: 'landscape' })
    expect(landscape.widthPx).toBe(portrait.heightPx)
    expect(landscape.heightPx).toBe(portrait.widthPx)
    expect(resolveMargins('narrow').left).toBe(48)
    expect(resolveMargins({ top: 10 }).left).toBe(96)
  })

  it('indents and outdents paragraphs within bounds', () => {
    make('<p>Hello</p>')
    editor.commands.selectAll()
    review.increaseIndent(editor)
    review.increaseIndent(editor)
    expect(editor.getHTML()).toContain('margin-left: 96px')
    review.decreaseIndent(editor)
    review.decreaseIndent(editor)
    review.decreaseIndent(editor)
    expect(editor.getHTML()).not.toContain('margin-left')
  })

  it('changes the case of the selection and keeps marks', () => {
    make('<p><strong>hello world</strong>. next one</p>')
    editor.commands.selectAll()
    review.changeCase(editor, 'upper')
    expect(editor.getHTML()).toContain('<strong>HELLO WORLD</strong>')
    review.changeCase(editor, 'title')
    expect(editor.getText()).toBe('Hello World. Next One')
  })

  it('builds a table of contents from headings', () => {
    make('<h1>Intro</h1><p>x</p><h2>Details</h2>')
    editor.commands.focus('end')
    expect(review.insertTableOfContents(editor)).toBe(2)
    expect(editor.getText()).toContain('Table of Contents')
    expect(editor.getHTML()).toContain('margin-left: 48px')
  })

  it('computes document statistics', () => {
    make('<p>one two</p><p>three</p>')
    expect(review.getDocumentStats(editor)).toMatchObject({
      words: 3,
      paragraphs: 2,
      charactersNoSpaces: 11,
    })
  })

  it('serializes landscape, columns and custom margins into a docx', async () => {
    make('<p>Hi</p>')
    const base64 = await serializeDocxToBase64(editor.getJSON(), {
      pageSetup: {
        pageSize: 'letter',
        orientation: 'landscape',
        columns: 2,
        margins: { top: 48, bottom: 48, left: 48, right: 48 },
      },
    })
    const JSZip = (await import('jszip')).default
    const xml = await (
      await JSZip.loadAsync(base64, { base64: true })
    )
      .file('word/document.xml')
      .async('string')
    expect(xml).toContain('w:orient="landscape"')
    expect(xml).toMatch(/<w:cols[^>]*w:num="2"/)
  })
})
