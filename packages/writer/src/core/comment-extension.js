import { Mark, mergeAttributes } from '@tiptap/react'

/**
 * Review comment anchored to a text range.
 */
export const Comment = Mark.create({
  name: 'comment',
  inclusive: false,

  addAttributes() {
    return {
      id: { default: null, parseHTML: (el) => el.getAttribute('data-comment-id') },
      text: { default: '', parseHTML: (el) => el.getAttribute('data-comment') || '' },
      author: { default: 'You', parseHTML: (el) => el.getAttribute('data-author') || 'You' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-comment-id]' }]
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-comment-id': mark.attrs.id,
        'data-comment': mark.attrs.text,
        'data-author': mark.attrs.author,
        title: `${mark.attrs.author}: ${mark.attrs.text}`,
        class: 'bg-amber-100 dark:bg-amber-900/40',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      addComment:
        (text) =>
        ({ commands }) =>
          commands.setMark(this.name, {
            id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            text,
          }),
      removeComment:
        (id) =>
        ({ state, tr, dispatch }) => {
          const type = state.schema.marks.comment
          state.doc.descendants((node, pos) => {
            if (node.marks.some((m) => m.type === type && m.attrs.id === id)) {
              tr.removeMark(pos, pos + node.nodeSize, type)
            }
          })
          if (dispatch) dispatch(tr)
          return true
        },
    }
  },
})

/**
 * Collects comments (one entry per id) with their anchored range.
 * @param {import('@tiptap/pm/model').Node} doc
 * @returns {Array<{ id: string, text: string, author: string, from: number, to: number, quote: string }>}
 */
export function collectComments(doc) {
  const byId = new Map()
  doc.descendants((node, pos) => {
    node.marks
      .filter((m) => m.type.name === 'comment')
      .forEach((m) => {
        const end = pos + node.nodeSize
        const prev = byId.get(m.attrs.id)
        byId.set(m.attrs.id, {
          id: m.attrs.id,
          text: m.attrs.text,
          author: m.attrs.author,
          from: prev ? prev.from : pos,
          to: end,
          quote: (prev ? prev.quote : '') + (node.text || ''),
        })
      })
  })
  return [...byId.values()]
}
