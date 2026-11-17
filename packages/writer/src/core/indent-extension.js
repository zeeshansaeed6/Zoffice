import { Extension } from '@tiptap/react'

export const INDENT_STEP_PX = 48
export const MAX_INDENT_LEVEL = 8

/**
 * TipTap Extension adding a paragraph/heading indent level with indent/outdent commands.
 */
export const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return { types: ['paragraph', 'heading'] }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (el) =>
              Math.round((parseInt(el.style.marginLeft, 10) || 0) / INDENT_STEP_PX),
            renderHTML: (attrs) =>
              attrs.indent ? { style: `margin-left: ${attrs.indent * INDENT_STEP_PX}px` } : {},
          },
        },
      },
    ]
  },

  addCommands() {
    const shift = (delta) => () => (props) => {
      const { tr, state, dispatch } = props
      const { from, to } = state.selection
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (!this.options.types.includes(node.type.name)) return
        const level = Math.min(MAX_INDENT_LEVEL, Math.max(0, (node.attrs.indent || 0) + delta))
        if (level !== node.attrs.indent)
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: level })
      })
      if (dispatch) dispatch(tr)
      return true
    }
    return { increaseIndent: shift(1), decreaseIndent: shift(-1) }
  },
})
