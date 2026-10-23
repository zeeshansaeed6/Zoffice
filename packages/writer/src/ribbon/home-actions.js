import {
  copyFormatting,
  applyFormatting,
  isFormatPainterActive,
  cancelFormatPainter,
} from './format-painter.js'

/**
 * Dispatches formatting and editing commands to a TipTap editor instance.
 */

export function toggleBold(editor) {
  editor?.chain().focus().toggleBold().run()
}

export function toggleItalic(editor) {
  editor?.chain().focus().toggleItalic().run()
}

export function toggleUnderline(editor) {
  editor?.chain().focus().toggleUnderline().run()
}

export function toggleStrike(editor) {
  editor?.chain().focus().toggleStrike().run()
}

export function toggleSubscript(editor) {
  editor?.chain().focus().toggleSubscript().run()
}

export function toggleSuperscript(editor) {
  editor?.chain().focus().toggleSuperscript().run()
}

export function setFontFamily(editor, fontFamily) {
  if (!editor) return
  editor.chain().focus().setMark('textStyle', { fontFamily }).run()
}

export function setFontSize(editor, size) {
  if (!editor) return
  const formattedSize = typeof size === 'number' ? `${size}px` : size
  editor.chain().focus().setMark('textStyle', { fontSize: formattedSize }).run()
}

export function growFontSize(editor) {
  if (!editor) return
  const current = editor.getAttributes('textStyle').fontSize || '16px'
  const numeric = parseInt(current, 10) || 16
  setFontSize(editor, `${Math.min(72, numeric + 2)}px`)
}

export function shrinkFontSize(editor) {
  if (!editor) return
  const current = editor.getAttributes('textStyle').fontSize || '16px'
  const numeric = parseInt(current, 10) || 16
  setFontSize(editor, `${Math.max(8, numeric - 2)}px`)
}

export function setTextColor(editor, color) {
  if (!editor) return
  if (!color) {
    editor.chain().focus().unsetColor().run()
  } else {
    editor.chain().focus().setColor(color).run()
  }
}

export function setHighlightColor(editor, color) {
  if (!editor) return
  if (!color) {
    editor.chain().focus().unsetHighlight().run()
  } else {
    editor.chain().focus().setHighlight({ color }).run()
  }
}

export function clearFormatting(editor) {
  if (!editor) return
  editor.chain().focus().clearNodes().unsetAllMarks().run()
}

export function setTextAlign(editor, align) {
  if (!editor) return
  editor.chain().focus().setTextAlign(align).run()
}

export function toggleBulletList(editor) {
  editor?.chain().focus().toggleBulletList().run()
}

export function toggleOrderedList(editor) {
  editor?.chain().focus().toggleOrderedList().run()
}

export function setLineSpacing(editor, lineHeight) {
  if (!editor) return
  editor.chain().focus().setLineSpacing(lineHeight).run()
}

export function setDocumentStyle(editor, styleName) {
  if (!editor) return
  const chain = editor.chain().focus()
  switch (styleName) {
    case 'h1':
      chain.toggleHeading({ level: 1 }).run()
      break
    case 'h2':
      chain.toggleHeading({ level: 2 }).run()
      break
    case 'h3':
      chain.toggleHeading({ level: 3 }).run()
      break
    case 'quote':
      chain.toggleBlockquote().run()
      break
    case 'code':
      chain.toggleCodeBlock().run()
      break
    case 'normal':
    default:
      chain.setParagraph().run()
      break
  }
}

export function selectAll(editor) {
  editor?.chain().focus().selectAll().run()
}

export { copyFormatting, applyFormatting, isFormatPainterActive, cancelFormatPainter }
