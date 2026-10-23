import { Node, mergeAttributes } from '@tiptap/react'

/**
 * TipTap Node Extension for manual Page Breaks.
 */
export const PageBreak = Node.create({
  name: 'pageBreak',

  group: 'block',

  selectable: true,

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-page-break]',
      },
      {
        tag: 'hr.page-break',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-page-break': 'true',
        class: 'page-break my-6 flex items-center justify-center border-b-2 border-dashed border-neutral-300 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 select-none dark:border-neutral-700',
      }),
      ['span', { class: 'bg-white px-2 dark:bg-neutral-900' }, 'Page Break'],
    ]
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name }).run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setPageBreak(),
    }
  },
})
