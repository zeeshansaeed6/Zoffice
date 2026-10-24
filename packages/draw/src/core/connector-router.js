/**
 * ZDraw Connector Router — calculates orthogonal, curved, and straight SVG connector paths.
 * @module connector-router
 */

import { ROUTING_MODES, ANCHORS } from './constants.js'

/**
 * Generate SVG path data for a connector between two anchor points.
 *
 * @param {{ x: number, y: number }} p1 - Start anchor point
 * @param {string} a1 - Start anchor type ('top', 'right', 'bottom', 'left')
 * @param {{ x: number, y: number }} p2 - End anchor point
 * @param {string} a2 - End anchor type ('top', 'right', 'bottom', 'left')
 * @param {string} [routing=ROUTING_MODES.ORTHOGONAL]
 * @param {Array<{ x: number, y: number }>} [waypoints=[]]
 * @returns {string} SVG path d attribute
 */
export function routeConnectorPath(
  p1,
  a1 = ANCHORS.RIGHT,
  p2,
  a2 = ANCHORS.LEFT,
  routing = ROUTING_MODES.ORTHOGONAL,
  waypoints = [],
) {
  if (waypoints.length > 0) {
    let d = `M ${p1.x} ${p1.y}`
    for (const wp of waypoints) {
      d += ` L ${wp.x} ${wp.y}`
    }
    d += ` L ${p2.x} ${p2.y}`
    return d
  }

  if (routing === ROUTING_MODES.STRAIGHT) {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`
  }

  if (routing === ROUTING_MODES.CURVED) {
    const dx = Math.abs(p2.x - p1.x) * 0.5
    const dy = Math.abs(p2.y - p1.y) * 0.5

    let c1x = p1.x
    let c1y = p1.y
    let c2x = p2.x
    let c2y = p2.y

    if (a1 === ANCHORS.RIGHT) c1x += dx
    else if (a1 === ANCHORS.LEFT) c1x -= dx
    else if (a1 === ANCHORS.BOTTOM) c1y += dy
    else if (a1 === ANCHORS.TOP) c1y -= dy

    if (a2 === ANCHORS.RIGHT) c2x += dx
    else if (a2 === ANCHORS.LEFT) c2x -= dx
    else if (a2 === ANCHORS.BOTTOM) c2y += dy
    else if (a2 === ANCHORS.TOP) c2y -= dy

    return `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }

  // Default: Orthogonal Routing
  return calculateOrthogonalPath(p1, a1, p2, a2)
}

/**
 * Compute an orthogonal step-based path between two points.
 *
 * @param {{ x: number, y: number }} p1
 * @param {string} a1
 * @param {{ x: number, y: number }} p2
 * @param {string} a2
 * @returns {string}
 */
export function calculateOrthogonalPath(p1, a1, p2, a2) {
  const pad = 24

  // Case 1: Simple Horizontal flow (Right -> Left)
  if (a1 === ANCHORS.RIGHT && a2 === ANCHORS.LEFT) {
    if (p2.x >= p1.x + pad * 2) {
      const midX = Math.round((p1.x + p2.x) / 2)
      return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
    }
    // Loop around
    const midY = Math.round((p1.y + p2.y) / 2)
    return `M ${p1.x} ${p1.y} L ${p1.x + pad} ${p1.y} L ${p1.x + pad} ${midY} L ${p2.x - pad} ${midY} L ${p2.x - pad} ${p2.y} L ${p2.x} ${p2.y}`
  }

  // Case 2: Simple Vertical flow (Bottom -> Top)
  if (a1 === ANCHORS.BOTTOM && a2 === ANCHORS.TOP) {
    if (p2.y >= p1.y + pad * 2) {
      const midY = Math.round((p1.y + p2.y) / 2)
      return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`
    }
    const midX = Math.round((p1.x + p2.x) / 2)
    return `M ${p1.x} ${p1.y} L ${p1.x} ${p1.y + pad} L ${midX} ${p1.y + pad} L ${midX} ${p2.y - pad} L ${p2.x} ${p2.y - pad} L ${p2.x} ${p2.y}`
  }

  // Case 3: Right -> Top
  if (a1 === ANCHORS.RIGHT && a2 === ANCHORS.TOP) {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`
  }

  // Case 4: Bottom -> Left
  if (a1 === ANCHORS.BOTTOM && a2 === ANCHORS.LEFT) {
    return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`
  }

  // Case 5: Left -> Right
  if (a1 === ANCHORS.LEFT && a2 === ANCHORS.RIGHT) {
    if (p1.x >= p2.x + pad * 2) {
      const midX = Math.round((p1.x + p2.x) / 2)
      return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
    }
    const midY = Math.round((p1.y + p2.y) / 2)
    return `M ${p1.x} ${p1.y} L ${p1.x - pad} ${p1.y} L ${p1.x - pad} ${midY} L ${p2.x + pad} ${midY} L ${p2.x + pad} ${p2.y} L ${p2.x} ${p2.y}`
  }

  // General fallback: Two elbows via midpoint
  const midX = Math.round((p1.x + p2.x) / 2)
  return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
}

/**
 * Calculate the midpoint of a routed path for placing connector text labels.
 *
 * @param {{ x: number, y: number }} p1
 * @param {{ x: number, y: number }} p2
 * @returns {{ x: number, y: number }}
 */
export function getConnectorLabelPosition(p1, p2) {
  return {
    x: Math.round((p1.x + p2.x) / 2),
    y: Math.round((p1.y + p2.y) / 2) - 8,
  }
}
