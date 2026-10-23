import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

/**
 * Custom TableCell with cell background shading and border support.
 */
export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {}
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
      colspan: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('colspan') || '1', 10),
        renderHTML: (attributes) => {
          if (!attributes.colspan || attributes.colspan <= 1) return {}
          return { colspan: attributes.colspan }
        },
      },
      rowspan: {
        default: 1,
        parseHTML: (element) => parseInt(element.getAttribute('rowspan') || '1', 10),
        renderHTML: (attributes) => {
          if (!attributes.rowspan || attributes.rowspan <= 1) return {}
          return { rowspan: attributes.rowspan }
        },
      },
    }
  },
})

export const ConfiguredTable = Table.configure({
  resizable: true,
  HTMLAttributes: {
    class:
      'border-collapse border border-neutral-300 dark:border-neutral-700 w-full my-4 shadow-xs',
  },
})

export { TableRow, TableHeader }
