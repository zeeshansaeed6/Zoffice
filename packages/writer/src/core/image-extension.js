import Image from '@tiptap/extension-image'

/**
 * Enhanced Image extension supporting width, height, alignment, and inline/block display.
 */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width') || element.style.width || null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height') || element.style.height || null,
        renderHTML: (attributes) => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
      alignment: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-align') || 'left',
        renderHTML: (attributes) => ({
          'data-align': attributes.alignment || 'left',
        }),
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const align = HTMLAttributes['data-align'] || 'left'
    let marginClass = 'mr-auto'
    if (align === 'center') marginClass = 'mx-auto block'
    if (align === 'right') marginClass = 'ml-auto block'

    return [
      'img',
      {
        ...HTMLAttributes,
        class: `rounded border border-neutral-300 dark:border-neutral-700 shadow-sm max-w-full my-2 ${marginClass}`,
      },
    ]
  },
})
