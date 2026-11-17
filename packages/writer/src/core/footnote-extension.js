import { Node, mergeAttributes } from '@tiptap/react'

/**
 * Inline footnote reference. Numbering is automatic (CSS counter in global.css);
 * the note text lives on the node and is listed beneath the page.
 */
export const Footnote = Node.create({
  name: 'footnote',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-footnote') || '',
        renderHTML: (attrs) => ({ 'data-footnote': attrs.text, title: attrs.text }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'sup[data-footnote]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['sup', mergeAttributes(HTMLAttributes, { class: 'footnote-ref' })]
  },

  addCommands() {
    return {
      insertFootnote:
        (text) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { text } }),
    }
  },
})

/**
 * Collects footnotes in document order.
 * @param {import('@tiptap/pm/model').Node} doc
 * @returns {Array<{ number: number, text: string }>}
 */
export function collectFootnotes(doc) {
  const notes = []
  doc.descendants((node) => {
    if (node.type.name === 'footnote')
      notes.push({ number: notes.length + 1, text: node.attrs.text })
  })
  return notes
}
