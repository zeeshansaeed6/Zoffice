import {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  FootnoteReferenceRun,
  PageBreak as DocxPageBreak,
} from 'docx'
import { injectPreservedParts } from './docx-package-preserver.js'
import { createCommentRegistry, convertWithComments } from './docx-comments.js'
import { buildSectionPageProperties, buildHeaderFooter } from './docx-section.js'
import { convertTableNode } from './docx-serializer-table.js'

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

function getHeadingLevel(level) {
  const map = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  }
  return map[level] || HeadingLevel.HEADING_1
}

function convertTextNode(node) {
  const marks = node.marks || []
  let bold = false
  let italics = false
  let underline = false
  let strike = false
  let subScript = false
  let superScript = false
  let color
  let font
  let size

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
      case 'link':
        color = color || '0044CC'
        underline = {}
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

// Footnotes collected while converting; reset by serializeDocxToBase64
let footnotes = {}
let commentRegistry = createCommentRegistry()

function convertInlineContent(content = []) {
  return convertWithComments(content, convertInlineChild, commentRegistry)
}

function convertInlineChild(child) {
  if (child.type === 'footnote') {
    const id = Object.keys(footnotes).length + 1
    footnotes[id] = {
      children: [new Paragraph({ children: [new TextRun(child.attrs?.text || '')] })],
    }
    return new FootnoteReferenceRun(id)
  }
  if (child.type === 'text') {
    return convertTextNode(child)
  }
  if (child.type === 'mathEquation' && child.attrs?.latex) {
    return new TextRun({
      text: child.attrs.latex,
      italics: true,
      font: 'Cambria Math',
    })
  }
  if (child.type === 'image' && child.attrs?.src) {
    try {
      const clean = child.attrs.src.replace(/^data:.*?;base64,/, '').trim()
      return new ImageRun({
        data: Buffer.from(clean, 'base64'),
        transformation: {
          width: child.attrs.width || 200,
          height: child.attrs.height || 150,
        },
      })
    } catch {
      return new TextRun({ text: '' })
    }
  }
  return new TextRun({ text: '' })
}

export function convertJsonToDocxElements(docJson) {
  if (!docJson || !docJson.content) return []
  const elements = []

  docJson.content.forEach((node) => {
    switch (node.type) {
      case 'paragraph': {
        const lineSpacing = node.attrs?.lineHeight
          ? parseFloat(node.attrs.lineHeight) * 240
          : undefined
        elements.push(
          new Paragraph({
            alignment: getAlignment(node.attrs?.textAlign),
            spacing: lineSpacing ? { line: lineSpacing } : undefined,
            indent: node.attrs?.indent ? { left: node.attrs.indent * 720 } : undefined,
            children: convertInlineContent(node.content),
          }),
        )
        break
      }
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
        elements.push(convertTableNode(node, convertInlineContent))
        break
      }
      case 'pageBreak': {
        elements.push(new Paragraph({ children: [new DocxPageBreak()] }))
        break
      }
      case 'horizontalRule': {
        elements.push(
          new Paragraph({
            border: {
              bottom: { style: 'single', size: 6, space: 1, color: 'CCCCCC' },
            },
            children: [new TextRun('')],
          }),
        )
        break
      }

      default: {
        if (node.content) {
          elements.push(new Paragraph({ children: convertInlineContent(node.content) }))
        }
        break
      }
    }
  })

  return elements.length > 0 ? elements : [new Paragraph({ children: [new TextRun('')] })]
}

/**
 * Serializes a TipTap document JSON tree into a .docx base64 string.
 *
 * @param {Object} docJson - TipTap / ProseMirror document JSON
 * @param {Object} [options]
 * @param {Object} [options.pageSetup]
 * @param {Map<string, any>} [options.preservedFiles]
 * @returns {Promise<string>} Base64-encoded .docx binary data
 */
export async function serializeDocxToBase64(docJson, options = {}) {
  footnotes = {}
  commentRegistry = createCommentRegistry()
  const children = convertJsonToDocxElements(docJson)
  const properties = buildSectionPageProperties(options.pageSetup)

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT },
            { level: 1, format: 'decimal', text: '%1.%2.', alignment: AlignmentType.LEFT },
          ],
        },
      ],
    },
    footnotes,
    comments: { children: commentRegistry.items },
    sections: [{ properties, ...buildHeaderFooter(options.pageSetup), children }],
  })

  const generatedBuf = await Packer.toBuffer(doc)
  const finalBuf = await injectPreservedParts(generatedBuf, options.preservedFiles)
  return finalBuf.toString('base64')
}
