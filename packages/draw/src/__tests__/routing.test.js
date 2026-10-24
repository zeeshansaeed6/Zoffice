import { describe, it, expect } from 'vitest'
import {
  routeConnectorPath,
  calculateOrthogonalPath,
  getConnectorLabelPosition,
} from '../core/connector-router.js'
import { ROUTING_MODES, ANCHORS } from '../core/constants.js'

describe('Connector Router', () => {
  const p1 = { x: 100, y: 100 }
  const p2 = { x: 300, y: 200 }

  it('routes straight connector path', () => {
    const path = routeConnectorPath(p1, ANCHORS.RIGHT, p2, ANCHORS.LEFT, ROUTING_MODES.STRAIGHT)
    expect(path).toBe('M 100 100 L 300 200')
  })

  it('routes curved connector path with Bezier curve', () => {
    const path = routeConnectorPath(p1, ANCHORS.RIGHT, p2, ANCHORS.LEFT, ROUTING_MODES.CURVED)
    expect(path).toContain('M 100 100 C')
    expect(path).toContain('300 200')
  })

  it('routes orthogonal path with right-angles', () => {
    const path = calculateOrthogonalPath(p1, ANCHORS.RIGHT, p2, ANCHORS.LEFT)
    expect(path).toContain('M 100 100 L 200 100 L 200 200 L 300 200')
  })

  it('computes connector label position at midpoint', () => {
    const pos = getConnectorLabelPosition(p1, p2)
    expect(pos.x).toBe(200)
    expect(pos.y).toBe(142) // 150 - 8
  })

  it('routes through custom waypoints when provided', () => {
    const waypoints = [
      { x: 150, y: 120 },
      { x: 220, y: 180 },
    ]
    const path = routeConnectorPath(
      p1,
      ANCHORS.RIGHT,
      p2,
      ANCHORS.LEFT,
      ROUTING_MODES.ORTHOGONAL,
      waypoints,
    )
    expect(path).toBe('M 100 100 L 150 120 L 220 180 L 300 200')
  })
})
