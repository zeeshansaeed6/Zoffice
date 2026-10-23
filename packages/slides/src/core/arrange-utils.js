/**
 * Reorders elements by bringing forward or sending backward.
 *
 * @param {Array<Object>} elements
 * @param {string} elementId
 * @param {'front'|'back'|'forward'|'backward'} action
 * @returns {Array<Object>}
 */
export function reorderElement(elements, elementId, action) {
  const index = elements.findIndex((el) => el.id === elementId)
  if (index === -1) return elements

  const copy = [...elements]
  const [target] = copy.splice(index, 1)

  switch (action) {
    case 'front':
      copy.push(target)
      break
    case 'back':
      copy.unshift(target)
      break
    case 'forward':
      copy.splice(Math.min(elements.length - 1, index + 1), 0, target)
      break
    case 'backward':
      copy.splice(Math.max(0, index - 1), 0, target)
      break
    default:
      copy.splice(index, 0, target)
  }

  return copy
}

/**
 * Aligns selected elements relative to their combined bounding box.
 *
 * @param {Array<Object>} elements - All slide elements
 * @param {Array<string>} selectedIds - Target element IDs to align
 * @param {'left'|'center'|'right'|'top'|'middle'|'bottom'} alignment
 * @returns {Array<Object>}
 */
export function alignElements(elements, selectedIds, alignment) {
  const targets = elements.filter((el) => selectedIds.includes(el.id))
  if (targets.length === 0) return elements

  const minX = Math.min(...targets.map((t) => t.x))
  const maxX = Math.max(...targets.map((t) => t.x + t.width))
  const minY = Math.min(...targets.map((t) => t.y))
  const maxY = Math.max(...targets.map((t) => t.y + t.height))
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2

  return elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el

    let newX = el.x
    let newY = el.y

    switch (alignment) {
      case 'left':
        newX = minX
        break
      case 'center':
        newX = centerX - el.width / 2
        break
      case 'right':
        newX = maxX - el.width
        break
      case 'top':
        newY = minY
        break
      case 'middle':
        newY = centerY - el.height / 2
        break
      case 'bottom':
        newY = maxY - el.height
        break
    }

    return { ...el, x: Math.round(newX), y: Math.round(newY) }
  })
}

/**
 * Distributes selected elements evenly horizontally or vertically.
 *
 * @param {Array<Object>} elements
 * @param {Array<string>} selectedIds
 * @param {'horizontal'|'vertical'} direction
 * @returns {Array<Object>}
 */
export function distributeElements(elements, selectedIds, direction) {
  const targets = elements.filter((el) => selectedIds.includes(el.id))
  if (targets.length < 3) return elements

  if (direction === 'horizontal') {
    const sorted = [...targets].sort((a, b) => a.x - b.x)
    const firstX = sorted[0].x
    const lastX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width
    const totalElemWidth = sorted.reduce((sum, el) => sum + el.width, 0)
    const totalGap = lastX - firstX - totalElemWidth
    const gap = totalGap / (sorted.length - 1)

    let currentX = firstX
    const posMap = new Map()
    for (const el of sorted) {
      posMap.set(el.id, currentX)
      currentX += el.width + gap
    }

    return elements.map((el) =>
      posMap.has(el.id) ? { ...el, x: Math.round(posMap.get(el.id)) } : el,
    )
  }

  // Vertical
  const sorted = [...targets].sort((a, b) => a.y - b.y)
  const firstY = sorted[0].y
  const lastY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height
  const totalElemHeight = sorted.reduce((sum, el) => sum + el.height, 0)
  const totalGap = lastY - firstY - totalElemHeight
  const gap = totalGap / (sorted.length - 1)

  let currentY = firstY
  const posMap = new Map()
  for (const el of sorted) {
    posMap.set(el.id, currentY)
    currentY += el.height + gap
  }

  return elements.map((el) =>
    posMap.has(el.id) ? { ...el, y: Math.round(posMap.get(el.id)) } : el,
  )
}
