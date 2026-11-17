import { Paragraph, TextRun, CommentRangeStart, CommentRangeEnd, CommentReference } from 'docx'

const commentMark = (node) => node.marks?.find((m) => m.type === 'comment')

/**
 * Creates the per-document comment collector passed to convertWithComments.
 * @returns {{ items: Array<Object> }}
 */
export const createCommentRegistry = () => ({ items: [] })

/**
 * Converts inline nodes and brackets text carrying a comment mark with
 * comment range start/end markers plus a reference run. Ranges are per paragraph.
 *
 * @param {Array<Object>} content - Inline TipTap nodes of one paragraph
 * @param {(node: Object) => any} convertChild
 * @param {{ items: Array<Object> }} registry
 */
export function convertWithComments(content, convertChild, registry) {
  const lastIndex = new Map()
  content.forEach((node, i) => {
    const mark = commentMark(node)
    if (mark) lastIndex.set(mark.attrs.id, i)
  })

  const numbers = new Map()
  return content.flatMap((node, i) => {
    const run = convertChild(node)
    const mark = commentMark(node)
    if (!mark) return [run]

    const out = []
    let num = numbers.get(mark.attrs.id)
    if (num === undefined) {
      num = registry.items.length
      numbers.set(mark.attrs.id, num)
      registry.items.push({
        id: num,
        author: mark.attrs.author || 'You',
        date: new Date(),
        children: [new Paragraph({ children: [new TextRun(mark.attrs.text || '')] })],
      })
      out.push(new CommentRangeStart(num))
    }
    out.push(run)
    if (lastIndex.get(mark.attrs.id) === i) {
      out.push(new CommentRangeEnd(num), new TextRun({ children: [new CommentReference(num)] }))
    }
    return out
  })
}
