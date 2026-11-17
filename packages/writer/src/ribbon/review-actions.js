/**
 * Actions for the Home (case/indent), References and Review tabs of ZWriter.
 */

const toTitleCase = (text) =>
  text.toLowerCase().replace(/(^|\s)(\S)/g, (_, space, ch) => space + ch.toUpperCase())

const CASE_TRANSFORMS = {
  upper: (t) => t.toUpperCase(),
  lower: (t) => t.toLowerCase(),
  title: toTitleCase,
  sentence: (t) =>
    t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\S)/g, (_, pre, ch) => pre + ch.toUpperCase()),
}

/**
 * Changes the case of the selected text, keeping its marks.
 * @param {import('@tiptap/react').Editor} editor
 * @param {'upper'|'lower'|'title'|'sentence'} mode
 */
export function changeCase(editor, mode) {
  const transform = CASE_TRANSFORMS[mode]
  if (!editor || !transform) return
  const { state, view } = editor
  const { from, to } = state.selection
  if (from === to) return
  const tr = state.tr
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return
    const start = Math.max(from, pos)
    const end = Math.min(to, pos + node.nodeSize)
    const next = transform(node.text.slice(start - pos, end - pos))
    tr.replaceWith(start, end, state.schema.text(next, node.marks))
  })
  view.dispatch(tr)
}

export const increaseIndent = (editor) => editor?.chain().focus().increaseIndent().run()
export const decreaseIndent = (editor) => editor?.chain().focus().decreaseIndent().run()

/**
 * Inserts a table of contents built from the document headings at the cursor.
 * Entries are static text without page numbers; insert again to refresh.
 * @param {import('@tiptap/react').Editor} editor
 * @returns {number} number of entries inserted
 */
export function insertTableOfContents(editor) {
  if (!editor) return 0
  const entries = []
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'heading' && node.textContent.trim()) {
      entries.push({ level: node.attrs.level, text: node.textContent.trim() })
    }
  })
  const body = entries.length
    ? entries.map((e) => ({
        type: 'paragraph',
        attrs: { indent: Math.min(e.level - 1, 3) },
        content: [{ type: 'text', text: e.text }],
      }))
    : [{ type: 'paragraph', content: [{ type: 'text', text: 'No headings found.' }] }]
  editor
    .chain()
    .focus()
    .insertContent([
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Table of Contents' }],
      },
      ...body,
    ])
    .run()
  return entries.length
}

/**
 * Computes document statistics for the Word Count dialog.
 * @param {import('@tiptap/react').Editor | null} editor
 */
export function getDocumentStats(editor) {
  const text = editor?.getText() || ''
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  let paragraphs = 0
  editor?.state.doc.descendants((node) => {
    if (node.type.name === 'paragraph' && node.textContent.trim()) paragraphs += 1
  })
  return {
    words,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    paragraphs,
    lines: text ? text.split(/\n/).length : 0,
  }
}
