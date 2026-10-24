/**
 * ZDraw Alignment, Distribution, and Z-Order Operations.
 * @module align-distribute
 */

/**
 * Align selected shapes along a specified edge or center line.
 *
 * @param {import('./draw-model.js').DrawShape[]} shapes - Full shapes array
 * @param {string[]} selectedIds - Selected shape IDs
 * @param {'left'|'center'|'right'|'top'|'middle'|'bottom'} alignment
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function alignShapes(shapes, selectedIds, alignment) {
  if (selectedIds.length < 2) return shapes
  const selected = shapes.filter((s) => selectedIds.includes(s.id))
  if (selected.length < 2) return shapes

  let targetVal = 0

  switch (alignment) {
    case 'left':
      targetVal = Math.min(...selected.map((s) => s.x))
      return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, x: targetVal } : s))

    case 'right':
      targetVal = Math.max(...selected.map((s) => s.x + s.width))
      return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, x: targetVal - s.width } : s))

    case 'center': {
      const minX = Math.min(...selected.map((s) => s.x))
      const maxX = Math.max(...selected.map((s) => s.x + s.width))
      const midX = (minX + maxX) / 2
      return shapes.map((s) =>
        selectedIds.includes(s.id) ? { ...s, x: Math.round(midX - s.width / 2) } : s,
      )
    }

    case 'top':
      targetVal = Math.min(...selected.map((s) => s.y))
      return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, y: targetVal } : s))

    case 'bottom':
      targetVal = Math.max(...selected.map((s) => s.y + s.height))
      return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, y: targetVal - s.height } : s))

    case 'middle': {
      const minY = Math.min(...selected.map((s) => s.y))
      const maxY = Math.max(...selected.map((s) => s.y + s.height))
      const midY = (minY + maxY) / 2
      return shapes.map((s) =>
        selectedIds.includes(s.id) ? { ...s, y: Math.round(midY - s.height / 2) } : s,
      )
    }

    default:
      return shapes
  }
}

/**
 * Distribute selected shapes evenly across horizontal or vertical space.
 *
 * @param {import('./draw-model.js').DrawShape[]} shapes
 * @param {string[]} selectedIds
 * @param {'horizontal'|'vertical'} direction
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function distributeShapes(shapes, selectedIds, direction) {
  if (selectedIds.length < 3) return shapes
  const selected = shapes.filter((s) => selectedIds.includes(s.id))
  if (selected.length < 3) return shapes

  if (direction === 'horizontal') {
    const sorted = [...selected].sort((a, b) => a.x - b.x)
    const first = sorted[0]
    const last = sorted[sorted.length - 1]

    const totalWidths = sorted.slice(1, -1).reduce((sum, s) => sum + s.width, 0)
    const availableSpace = last.x - (first.x + first.width) - totalWidths
    const gap = Math.round(availableSpace / (sorted.length - 1))

    let curX = first.x + first.width + gap
    const posMap = new Map()
    posMap.set(first.id, first.x)

    for (let i = 1; i < sorted.length - 1; i++) {
      posMap.set(sorted[i].id, curX)
      curX += sorted[i].width + gap
    }
    posMap.set(last.id, last.x)

    return shapes.map((s) => (posMap.has(s.id) ? { ...s, x: posMap.get(s.id) } : s))
  }

  // Vertical distribution
  const sorted = [...selected].sort((a, b) => a.y - b.y)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]

  const totalHeights = sorted.slice(1, -1).reduce((sum, s) => sum + s.height, 0)
  const availableSpace = last.y - (first.y + first.height) - totalHeights
  const gap = Math.round(availableSpace / (sorted.length - 1))

  let curY = first.y + first.height + gap
  const posMap = new Map()
  posMap.set(first.id, first.y)

  for (let i = 1; i < sorted.length - 1; i++) {
    posMap.set(sorted[i].id, curY)
    curY += sorted[i].height + gap
  }
  posMap.set(last.id, last.y)

  return shapes.map((s) => (posMap.has(s.id) ? { ...s, y: posMap.get(s.id) } : s))
}

/**
 * Bring selected shapes to the front of the z-order.
 * @param {import('./draw-model.js').DrawShape[]} shapes
 * @param {string[]} selectedIds
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function bringToFront(shapes, selectedIds) {
  const unselected = shapes.filter((s) => !selectedIds.includes(s.id))
  const selected = shapes.filter((s) => selectedIds.includes(s.id))
  return [...unselected, ...selected]
}

/**
 * Send selected shapes to the back of the z-order.
 * @param {import('./draw-model.js').DrawShape[]} shapes
 * @param {string[]} selectedIds
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function sendToBack(shapes, selectedIds) {
  const unselected = shapes.filter((s) => !selectedIds.includes(s.id))
  const selected = shapes.filter((s) => selectedIds.includes(s.id))
  return [...selected, ...unselected]
}

/**
 * Group selected shapes together with a common groupId.
 * @param {import('./draw-model.js').DrawShape[]} shapes
 * @param {string[]} selectedIds
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function groupShapes(shapes, selectedIds) {
  if (selectedIds.length < 2) return shapes
  const groupId = `grp-${Date.now()}`
  return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, groupId } : s))
}

/**
 * Ungroup selected shapes by clearing their groupId.
 * @param {import('./draw-model.js').DrawShape[]} shapes
 * @param {string[]} selectedIds
 * @returns {import('./draw-model.js').DrawShape[]}
 */
export function ungroupShapes(shapes, selectedIds) {
  return shapes.map((s) => (selectedIds.includes(s.id) ? { ...s, groupId: null } : s))
}
