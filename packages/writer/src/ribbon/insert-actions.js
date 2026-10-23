/**
 * Actions and command dispatchers for the ZWriter Insert tab.
 */

/**
 * Inserts a new table into the document.
 * @param {import('@tiptap/react').Editor} editor
 * @param {number} [rows=3]
 * @param {number} [cols=3]
 * @param {boolean} [withHeaderRow=true]
 */
export function insertTable(editor, rows = 3, cols = 3, withHeaderRow = true) {
  if (!editor) return
  editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
}

export function addRowAbove(editor) {
  editor?.chain().focus().addRowBefore().run()
}

export function addRowBelow(editor) {
  editor?.chain().focus().addRowAfter().run()
}

export function deleteRow(editor) {
  editor?.chain().focus().deleteRow().run()
}

export function addColumnLeft(editor) {
  editor?.chain().focus().addColumnBefore().run()
}

export function addColumnRight(editor) {
  editor?.chain().focus().addColumnAfter().run()
}

export function deleteColumn(editor) {
  editor?.chain().focus().deleteColumn().run()
}

export function deleteTable(editor) {
  editor?.chain().focus().deleteTable().run()
}

export function mergeCells(editor) {
  editor?.chain().focus().mergeCells().run()
}

export function splitCell(editor) {
  editor?.chain().focus().splitCell().run()
}

export function setTableCellBackground(editor, color) {
  if (!editor) return
  editor.chain().focus().setCellAttribute('backgroundColor', color).run()
}

/**
 * Inserts an image with optional size and alignment.
 * @param {import('@tiptap/react').Editor} editor
 * @param {Object} options
 * @param {string} options.src
 * @param {string} [options.alt]
 * @param {string} [options.width]
 * @param {string} [options.height]
 * @param {'left'|'center'|'right'} [options.alignment]
 */
export function insertImage(editor, { src, alt = '', width, height, alignment = 'left' }) {
  if (!editor || !src) return
  editor
    .chain()
    .focus()
    .setImage({
      src,
      alt,
      width: width || null,
      height: height || null,
      alignment,
    })
    .run()
}

/**
 * Inserts or updates a hyperlink on current selection.
 * @param {import('@tiptap/react').Editor} editor
 * @param {string} href
 * @param {string} [text]
 */
export function setHyperlink(editor, href, text) {
  if (!editor || !href) return
  if (text && editor.state.selection.empty) {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'text',
        text,
        marks: [{ type: 'link', attrs: { href } }],
      })
      .run()
  } else {
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }
}

export function removeHyperlink(editor) {
  editor?.chain().focus().unsetLink().run()
}

/**
 * Inserts a named bookmark anchor.
 * @param {import('@tiptap/react').Editor} editor
 * @param {string} name
 */
export function insertBookmark(editor, name) {
  if (!editor || !name) return
  editor.chain().focus().insertBookmark(name).run()
}

/**
 * Inserts a LaTeX math equation.
 * @param {import('@tiptap/react').Editor} editor
 * @param {string} latex
 */
export function insertMathEquation(editor, latex) {
  if (!editor || !latex) return
  editor.chain().focus().insertEquation(latex).run()
}

/**
 * Inserts a horizontal divider rule.
 * @param {import('@tiptap/react').Editor} editor
 */
export function insertHorizontalRule(editor) {
  editor?.chain().focus().setHorizontalRule().run()
}

/**
 * Inserts a page break.
 * @param {import('@tiptap/react').Editor} editor
 */
export function insertPageBreak(editor) {
  editor?.chain().focus().setPageBreak().run()
}

/**
 * Inserts formatted current date or time.
 * @param {import('@tiptap/react').Editor} editor
 * @param {'date'|'time'|'full'} [format='date']
 */
export function insertDateTime(editor, format = 'date') {
  if (!editor) return
  const now = new Date()
  let str = ''
  if (format === 'time') {
    str = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (format === 'full') {
    str = now.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })
  } else {
    str = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })
  }
  editor.chain().focus().insertContent(str).run()
}

/**
 * Inserts a special character symbol at the current position.
 * @param {import('@tiptap/react').Editor} editor
 * @param {string} symbol
 */
export function insertSymbol(editor, symbol) {
  if (!editor || !symbol) return
  editor.chain().focus().insertContent(symbol).run()
}
