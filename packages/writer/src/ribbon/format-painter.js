/**
 * Format Painter utility for capturing and applying text formatting across selections.
 */

let copiedFormatting = null
let isFormatPaintingActive = false

/**
 * Copies the current selection's marks and attributes.
 * @param {import('@tiptap/react').Editor} editor
 */
export function copyFormatting(editor) {
  if (!editor) return null
  const textStyle = editor.getAttributes('textStyle') || {}
  const highlight = editor.getAttributes('highlight') || {}

  copiedFormatting = {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
    strike: editor.isActive('strike'),
    color: textStyle.color || null,
    fontFamily: textStyle.fontFamily || null,
    fontSize: textStyle.fontSize || null,
    highlight: highlight.color || null,
    align: editor.isActive({ textAlign: 'center' })
      ? 'center'
      : editor.isActive({ textAlign: 'right' })
        ? 'right'
        : editor.isActive({ textAlign: 'justify' })
          ? 'justify'
          : 'left',
  }

  isFormatPaintingActive = true
  return copiedFormatting
}

/**
 * Applies the copied formatting to the active editor selection.
 * @param {import('@tiptap/react').Editor} editor
 * @returns {boolean} True if formatting was applied
 */
export function applyFormatting(editor) {
  if (!editor || !copiedFormatting || !isFormatPaintingActive) {
    return false
  }

  const { bold, italic, underline, strike, color, fontFamily, fontSize, highlight, align } =
    copiedFormatting

  let chain = editor.chain().focus()

  // Apply or remove marks based on copied snapshot
  if (bold) chain = chain.setBold()
  else chain = chain.unsetBold()

  if (italic) chain = chain.setItalic()
  else chain = chain.unsetItalic()

  if (underline) chain = chain.setUnderline()
  else chain = chain.unsetUnderline()

  if (strike) chain = chain.setStrike()
  else chain = chain.unsetStrike()

  if (color) chain = chain.setColor(color)
  else chain = chain.unsetColor()

  if (highlight) chain = chain.setHighlight({ color: highlight })
  else chain = chain.unsetHighlight()

  if (fontFamily || fontSize) {
    chain = chain.setMark('textStyle', {
      ...(fontFamily ? { fontFamily } : {}),
      ...(fontSize ? { fontSize } : {}),
    })
  }

  if (align) {
    chain = chain.setTextAlign(align)
  }

  chain.run()

  // Reset after single application
  isFormatPaintingActive = false
  copiedFormatting = null
  return true
}

/**
 * Returns whether format painter is currently armed.
 * @returns {boolean}
 */
export function isFormatPainterActive() {
  return isFormatPaintingActive
}

/**
 * Clears active format painter state.
 */
export function cancelFormatPainter() {
  isFormatPaintingActive = false
  copiedFormatting = null
}
