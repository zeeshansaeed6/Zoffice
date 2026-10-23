import { Table, TableRow, TableCell, Paragraph, WidthType } from 'docx'

/**
 * Converts a table node to a docx Table.
 * @param {Object} tableNode
 * @param {(content: Array<any>) => Array<any>} convertInlineContent
 * @returns {Table}
 */
export function convertTableNode(tableNode, convertInlineContent) {
  const rows = (tableNode.content || []).map((rowNode) => {
    const cells = (rowNode.content || []).map((cellNode) => {
      const paragraphs = (cellNode.content || []).map((pNode) => {
        return new Paragraph({
          children: convertInlineContent(pNode.content),
        })
      })

      const cellOpts = {
        width: { size: 100, type: WidthType.AUTO },
        children: paragraphs.length > 0 ? paragraphs : [new Paragraph('')],
      }

      if (cellNode.attrs?.colspan && cellNode.attrs.colspan > 1) {
        cellOpts.columnSpan = cellNode.attrs.colspan
      }
      if (cellNode.attrs?.background) {
        cellOpts.shading = { fill: cellNode.attrs.background.replace('#', '') }
      }

      return new TableCell(cellOpts)
    })

    return new TableRow({ children: cells })
  })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.length > 0 ? rows : [new TableRow({ children: [new TableCell({ children: [] })] })],
  })
}
