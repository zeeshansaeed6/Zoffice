import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
  PageBreak as DocxPageBreak,
} from 'docx'

/**
 * Maps alignment strings to docx AlignmentType.
 * @param {string} [align]
 * @returns {any}
 */
function getAlignment(align) {
  switch (align) {
    case 'center':
      return AlignmentType.CENTER
    case 'right':
      return AlignmentType.RIGHT
    case 'justify':
      return AlignmentType.JUSTIFIED
    default:
      return AlignmentType.LEFT
  }
}

/**
 * Maps heading level to docx HeadingLevel.
 * @param {number} level
 * @returns {any}
 */
function getHeadingLevel(level) {
  switch (level) {
    case 1:
      return HeadingLevel.HEADING_1
    case 2:
      return HeadingLevel.HEADING_2
    case 3:
      return HeadingLevel.HEADING_3
    case 4:
      return HeadingLevel.HEADING_4
    case 5:
      return HeadingLevel.HEADING_5
    case 6:
      return HeadingLevel.HEADING_6
    default:
      return HeadingLevel.HEADING_1
  }
}

/**
 * Converts a TipTap text node and its marks to a docx TextRun.
 * @param {Object} node
 * @returns {TextRun}
 */
function convertTextNode(node) {
  const marks = node.marks || []
  let bold = false
  let italics = false
  let underline = false
  let strike = false
  let subScript = false
  let superScript = false
  let color = undefined
  let font = undefined
  let size = undefined

  marks.forEach((mark) => {
    switch (mark.type) {
      case 'bold':
        bold = true
        break
      case 'italic':
        italics = true
        break
      case 'underline':
        underline = {}
        break
      case 'strike':
        strike = true
        break
      case 'subscript':
        subScript = true
        break
      case 'superscript':
        superScript = true
        break
      case 'textStyle':
        if (mark.attrs?.color) {
          color = mark.attrs.color.replace('#', '')
        }
        if (mark.attrs?.fontFamily) {
          font = mark.attrs.fontFamily
        }
        if (mark.attrs?.fontSize) {
          const px = parseInt(mark.attrs.fontSize, 10) || 16
          size = Math.round(px * 1.5) // half-points
        }
        break
      default:
        break
    }
  })

  return new TextRun({
    text: node.text || '',
    bold,
    italics,
    underline,
    strike,
    subScript,
    superScript,
    color,
    font,
    size,
  })
}

/**
 * Converts inline nodes to an array of TextRuns.
 * @param {Array<any>} [content=[]]
 * @returns {TextRun[]}
 */
function convertInlineContent(content = []) {
  return content.map((child) => {
    if (child.type === 'text') {
      return convertTextNode(child)
    }
    return new TextRun({ text: '' })
  })
}

/**
 * Converts a ProseMirror table node to a docx Table.
 * @param {Object} tableNode
 * @returns {Table}
 */
function convertTableNode(tableNode) {
  const rows = (tableNode.content || []).map((rowNode) => {
    const cells = (rowNode.content || []).map((cellNode) => {
      const paragraphs = (cellNode.content || []).map((pNode) => {
        return new Paragraph({
          children: convertInlineContent(pNode.content),
        })
      })
      return new TableCell({
        children: paragraphs.length > 0 ? paragraphs : [new Paragraph({})],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
      })
    })
    return new TableRow({ children: cells })
  })

  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  })
}

/**
 * Converts a TipTap document JSON tree to docx children elements.
 * @param {Object} docJson - TipTap / ProseMirror document JSON
 * @returns {Array<any>} docx elements
 */
export function convertJsonToDocxElements(docJson) {
  const content = docJson?.content || []
  const elements = []

  content.forEach((node) => {
    switch (node.type) {
      case 'heading': {
        const level = node.attrs?.level || 1
        elements.push(
          new Paragraph({
            heading: getHeadingLevel(level),
            alignment: getAlignment(node.attrs?.textAlign),
            children: convertInlineContent(node.content),
          }),
        )
        break
      }
      case 'paragraph': {
        elements.push(
          new Paragraph({
            alignment: getAlignment(node.attrs?.textAlign),
            children: convertInlineContent(node.content),
          }),
        )
        break
      }
      case 'bulletList': {
        ;(node.content || []).forEach((item) => {
          ;(item.content || []).forEach((p) => {
            elements.push(
              new Paragraph({
                bullet: { level: 0 },
                children: convertInlineContent(p.content),
              }),
            )
          })
        })
        break
      }
      case 'orderedList': {
        ;(node.content || []).forEach((item) => {
          ;(item.content || []).forEach((p) => {
            elements.push(
              new Paragraph({
                numbering: { reference: 'default-numbering', level: 0 },
                children: convertInlineContent(p.content),
              }),
            )
          })
        })
        break
      }
      case 'table': {
        elements.push(convertTableNode(node))
        break
      }
      case 'pageBreak': {
        elements.push(
          new Paragraph({
            children: [new DocxPageBreak()],
          }),
        )
        break
      }
      default: {
        if (node.content) {
          elements.push(
            new Paragraph({
              children: convertInlineContent(node.content),
            }),
          )
        }
        break
      }
    }
  })

  return elements.length > 0 ? elements : [new Paragraph({ children: [new TextRun('')] })]
}

/**
 * Serializes a TipTap document JSON tree into a .docx base64 string.
 * @param {Object} docJson - TipTap / ProseMirror document JSON
 * @returns {Promise<string>} Base64-encoded .docx binary data
 */
export async function serializeDocxToBase64(docJson) {
  const children = convertJsonToDocxElements(docJson)
  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return await Packer.toBase64String(doc)
}
