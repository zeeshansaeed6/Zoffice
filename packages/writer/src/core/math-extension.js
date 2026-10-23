import { Node, mergeAttributes } from '@tiptap/core'
import katex from 'katex'
import 'katex/dist/katex.min.css'


/**
 * TipTap extension for inline LaTeX math equations via KaTeX.
 */
export const MathEquation = Node.create({
  name: 'mathEquation',
  group: 'inline',
  inline: true,
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: 'E = mc^2',
        parseHTML: (element) => element.getAttribute('data-latex') || 'E = mc^2',
        renderHTML: (attributes) => ({
          'data-latex': attributes.latex,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-latex]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    let rendered = node.attrs.latex || ''
    try {
      rendered = katex.renderToString(node.attrs.latex, {
        throwOnError: false,
        displayMode: false,
      })
    } catch {
      rendered = node.attrs.latex
    }

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class:
          'math-node inline-block px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 cursor-pointer select-none',
        'data-equation': 'true',
      }),
      ['span', { class: 'math-content' }, rendered],
    ]
  },

  addCommands() {
    return {
      insertEquation:
        (latex) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { latex: latex || 'E = mc^2' },
          })
        },
    }
  },
})
