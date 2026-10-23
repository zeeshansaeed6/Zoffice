import { Node, mergeAttributes } from '@tiptap/core'

/**
 * Bookmark extension for in-document anchor navigation targets.
 */
export const Bookmark = Node.create({
  name: 'bookmark',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: '',
        parseHTML: (element) =>
          element.getAttribute('data-bookmark') || element.getAttribute('name') || '',
        renderHTML: (attributes) => ({
          'data-bookmark': attributes.name,
          id: `bm-${attributes.name}`,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-bookmark]' }, { tag: 'a[name]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class:
          'bookmark-tag inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 select-none',
      }),
      `🔖 ${node.attrs.name}`,
    ]
  },

  addCommands() {
    return {
      insertBookmark:
        (name) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { name: name || `bookmark_${Date.now()}` },
          })
        },
    }
  },
})
