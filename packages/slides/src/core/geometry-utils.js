/**
 * Snapping tolerance in slide coordinate space (pixels).
 */
export const SNAP_TOLERANCE = 6

/**
 * Calculates snapped coordinates for dragging an element relative to other elements and slide center.
 *
 * @param {Object} movingElem - { x, y, width, height }
 * @param {Array<Object>} otherElems - Array of other elements on the slide
 * @param {Object} slideBounds - { width, height }
 * @returns {{ x: number, y: number, guides: Array<{ orientation: 'horizontal'|'vertical', position: number }> }}
 */
export function computeSnapGuides(movingElem, otherElems, slideBounds) {
  let snapX = movingElem.x
  let snapY = movingElem.y
  const guides = []

  const movingLeft = movingElem.x
  const movingRight = movingElem.x + movingElem.width
  const movingCenterX = movingElem.x + movingElem.width / 2

  const movingTop = movingElem.y
  const movingBottom = movingElem.y + movingElem.height
  const movingCenterY = movingElem.y + movingElem.height / 2

  // Target X lines to snap to (edges and centers)
  const targetXLines = [
    { pos: 0, guide: 0 },
    { pos: slideBounds.width / 2, guide: slideBounds.width / 2 },
    { pos: slideBounds.width, guide: slideBounds.width },
  ]

  // Target Y lines to snap to (edges and centers)
  const targetYLines = [
    { pos: 0, guide: 0 },
    { pos: slideBounds.height / 2, guide: slideBounds.height / 2 },
    { pos: slideBounds.height, guide: slideBounds.height },
  ]

  for (const elem of otherElems) {
    targetXLines.push({ pos: elem.x, guide: elem.x })
    targetXLines.push({ pos: elem.x + elem.width / 2, guide: elem.x + elem.width / 2 })
    targetXLines.push({ pos: elem.x + elem.width, guide: elem.x + elem.width })

    targetYLines.push({ pos: elem.y, guide: elem.y })
    targetYLines.push({ pos: elem.y + elem.height / 2, guide: elem.y + elem.height / 2 })
    targetYLines.push({ pos: elem.y + elem.height, guide: elem.y + elem.height })
  }

  // Snap X axis
  for (const target of targetXLines) {
    if (Math.abs(movingLeft - target.pos) <= SNAP_TOLERANCE) {
      snapX = target.pos
      guides.push({ orientation: 'vertical', position: target.pos })
      break
    }
    if (Math.abs(movingCenterX - target.pos) <= SNAP_TOLERANCE) {
      snapX = target.pos - movingElem.width / 2
      guides.push({ orientation: 'vertical', position: target.pos })
      break
    }
    if (Math.abs(movingRight - target.pos) <= SNAP_TOLERANCE) {
      snapX = target.pos - movingElem.width
      guides.push({ orientation: 'vertical', position: target.pos })
      break
    }
  }

  // Snap Y axis
  for (const target of targetYLines) {
    if (Math.abs(movingTop - target.pos) <= SNAP_TOLERANCE) {
      snapY = target.pos
      guides.push({ orientation: 'horizontal', position: target.pos })
      break
    }
    if (Math.abs(movingCenterY - target.pos) <= SNAP_TOLERANCE) {
      snapY = target.pos - movingElem.height / 2
      guides.push({ orientation: 'horizontal', position: target.pos })
      break
    }
    if (Math.abs(movingBottom - target.pos) <= SNAP_TOLERANCE) {
      snapY = target.pos - movingElem.height
      guides.push({ orientation: 'horizontal', position: target.pos })
      break
    }
  }

  return { x: snapX, y: snapY, guides }
}

/**
 * Calculates resized bounding box given drag delta and handle direction.
 *
 * @param {Object} original - { x, y, width, height }
 * @param {string} handle - 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
 * @param {number} dx
 * @param {number} dy
 * @param {boolean} [lockAspect=false]
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function computeResize(original, handle, dx, dy, lockAspect = false) {
  let { x, y, width, height } = original
  const minSize = 20
  const aspect = original.width / original.height

  if (handle.includes('e')) {
    width = Math.max(minSize, original.width + dx)
    if (lockAspect) height = width / aspect
  }
  if (handle.includes('s')) {
    height = Math.max(minSize, original.height + dy)
    if (lockAspect) width = height * aspect
  }
  if (handle.includes('w')) {
    const newWidth = Math.max(minSize, original.width - dx)
    x = original.x + (original.width - newWidth)
    width = newWidth
    if (lockAspect) height = width / aspect
  }
  if (handle.includes('n')) {
    const newHeight = Math.max(minSize, original.height - dy)
    y = original.y + (original.height - newHeight)
    height = newHeight
    if (lockAspect) width = height * aspect
  }

  return { x, y, width, height }
}
