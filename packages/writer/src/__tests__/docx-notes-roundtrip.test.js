import { describe, it, expect, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { getWriterExtensions } from '../core/editor-schema.js'
import { serializeDocxToBase64 } from '../docx/docx-serializer.js'
import { parseDocxToHtml } from '../docx/docx-parser.js'
import { collectFootnotes } from '../core/footnote-extension.js'
import { collectComments } from '../core/comment-extension.js'

let editor
afterEach(() => editor?.destroy())

describe('docx round trip: header/footer, footnotes, comments, indent', () => {
  it('reads back everything the serializer wrote', async () => {
    editor = new Editor({
      extensions: getWriterExtensions(),
      content: '<p style="margin-left: 96px">Commented words here</p><p>Tail</p>',
    })
    editor.commands.setTextSelection({ from: 1, to: 10 })
    editor.commands.addComment('Tighten this')
    editor.commands.focus('end')
    editor.commands.insertFootnote('A cited source')

    const base64 = await serializeDocxToBase64(editor.getJSON(), {
      pageSetup: { header: 'Weekly Report', footer: 'Confidential', pageNumbers: true },
    })
    const parsed = await parseDocxToHtml(base64)

    expect(parsed.pageSetup).toMatchObject({
      header: 'Weekly Report',
      footer: 'Confidential',
      pageNumbers: true,
    })

    const reopened = new Editor({ extensions: getWriterExtensions(), content: parsed.html })
    try {
      expect(collectFootnotes(reopened.state.doc)).toEqual([{ number: 1, text: 'A cited source' }])
      const [comment] = collectComments(reopened.state.doc)
      expect(comment).toMatchObject({ text: 'Tighten this', quote: 'Commented' })
      expect(reopened.getHTML()).toContain('margin-left: 96px')
    } finally {
      reopened.destroy()
    }
  })

  it('reports no header or footer for a plain document', async () => {
    editor = new Editor({ extensions: getWriterExtensions(), content: '<p>Plain</p>' })
    const parsed = await parseDocxToHtml(await serializeDocxToBase64(editor.getJSON(), {}))
    expect(parsed.pageSetup).toMatchObject({ header: '', footer: '', pageNumbers: false })
  })
})
