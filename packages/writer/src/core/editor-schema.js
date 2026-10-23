import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { LineSpacing } from './line-spacing-extension.js'
import { PageBreak } from './page-break-extension.js'

/**
 * Custom TextStyle extension supporting fontFamily and fontSize.
 */
export const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily?.replace(/['"]/g, '') || null,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) return {}
          return {
            style: `font-family: ${attributes.fontFamily}`,
          }
        },
      },
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {}
          return {
            style: `font-size: ${attributes.fontSize}`,
          }
        },
      },
    }
  },
})

/**
 * Assembles all extensions for the ZWriter editor.
 * @returns {import('@tiptap/react').AnyExtension[]}
 */
export function getWriterExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      dropcursor: {
        color: '#2563eb',
        width: 2,
      },
    }),
    CustomTextStyle,
    Underline,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Subscript,
    Superscript,
    LineSpacing,
    PageBreak,
  ]
}
