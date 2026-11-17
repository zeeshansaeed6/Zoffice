import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import JSZip from 'jszip'
import { getWriterExtensions } from '../core/editor-schema.js'
import { collectFootnotes } from '../core/footnote-extension.js'
import { collectComments } from '../core/comment-extension.js'
import { serializeDocxToBase64 } from '../docx/docx-serializer.js'

let editor
const make = (content) => {
  editor = new Editor({ extensions: getWriterExtensions(), content })
  return editor
}
afterEach(() => editor?.destroy())

const readXml = async (base64, part) =>
  (await JSZip.loadAsync(base64, { base64: true })).file(part)?.async('string')

describe('ZWriter footnotes, comments, header/footer', () => {
  it('inserts footnotes and collects them in document order', () => {
    make('<p>Alpha beta</p>')
    editor.commands.focus('start')
    editor.commands.insertFootnote('First note')
    editor.commands.focus('end')
    editor.commands.insertFootnote('Second note')
    expect(collectFootnotes(editor.state.doc)).toEqual([
      { number: 1, text: 'First note' },
      { number: 2, text: 'Second note' },
    ])
    expect(editor.getHTML()).toContain('data-footnote="First note"')
  })

  it('adds, lists and removes comments on the selection', () => {
    make('<p>Review this sentence</p>')
    editor.commands.setTextSelection({ from: 1, to: 7 })
    editor.commands.addComment('Please reword')
    const [comment] = collectComments(editor.state.doc)
    expect(comment).toMatchObject({ text: 'Please reword', quote: 'Review' })
    editor.commands.removeComment(comment.id)
    expect(collectComments(editor.state.doc)).toHaveLength(0)
    expect(editor.getText()).toBe('Review this sentence')
  })

  it('writes footnotes into the docx package', async () => {
    make('<p>Body</p>')
    editor.commands.focus('end')
    editor.commands.insertFootnote('Cited source')
    const base64 = await serializeDocxToBase64(editor.getJSON(), {})
    expect(await readXml(base64, 'word/footnotes.xml')).toContain('Cited source')
    expect(await readXml(base64, 'word/document.xml')).toContain('w:footnoteReference')
  })

  it('writes header, footer and page number fields into the docx package', async () => {
    make('<p>Body</p>')
    const base64 = await serializeDocxToBase64(editor.getJSON(), {
      pageSetup: { header: 'Quarterly Report', footer: 'Confidential', pageNumbers: true },
    })
    expect(await readXml(base64, 'word/header1.xml')).toContain('Quarterly Report')
    const footer = await readXml(base64, 'word/footer1.xml')
    expect(footer).toContain('Confidential')
    expect(footer).toContain('PAGE')
  })

  it('omits header and footer parts when none are set', async () => {
    make('<p>Body</p>')
    const base64 = await serializeDocxToBase64(editor.getJSON(), { pageSetup: {} })
    expect(await readXml(base64, 'word/header1.xml')).toBeUndefined()
  })
})
