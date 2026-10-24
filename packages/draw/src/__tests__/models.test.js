import { describe, it, expect } from 'vitest'
import {
  createDiagram,
  createShape,
  createConnector,
  createLayer,
  getAnchorCoords,
} from '../core/draw-model.js'
import { ANCHORS, ROUTING_MODES } from '../core/constants.js'

describe('ZDraw Models', () => {
  it('creates starter diagram with shapes, layers, and connectors', () => {
    const diag = createDiagram({ title: 'Network Topology' })
    expect(diag.title).toBe('Network Topology')
    expect(diag.shapes.length).toBeGreaterThanOrEqual(2)
    expect(diag.connectors.length).toBeGreaterThanOrEqual(1)
    expect(diag.layers.length).toBe(1)
  })

  it('creates custom shape and connector with overrides', () => {
    const shape = createShape({
      type: 'diamond',
      x: 150,
      y: 250,
      width: 100,
      height: 80,
      text: 'Authorize',
    })

    expect(shape.type).toBe('diamond')
    expect(shape.x).toBe(150)
    expect(shape.y).toBe(250)
    expect(shape.text).toBe('Authorize')

    const conn = createConnector(shape.id, 'target-1', {
      routing: ROUTING_MODES.CURVED,
      sourceAnchor: ANCHORS.BOTTOM,
      targetAnchor: ANCHORS.TOP,
    })

    expect(conn.sourceId).toBe(shape.id)
    expect(conn.routing).toBe(ROUTING_MODES.CURVED)
    expect(conn.sourceAnchor).toBe(ANCHORS.BOTTOM)
  })

  it('calculates anchor coordinates accurately', () => {
    const shape = createShape({
      x: 100,
      y: 100,
      width: 100,
      height: 60,
    })

    const topPt = getAnchorCoords(shape, ANCHORS.TOP)
    expect(topPt).toEqual({ x: 150, y: 100 })

    const rightPt = getAnchorCoords(shape, ANCHORS.RIGHT)
    expect(rightPt).toEqual({ x: 200, y: 130 })

    const bottomPt = getAnchorCoords(shape, ANCHORS.BOTTOM)
    expect(bottomPt).toEqual({ x: 150, y: 160 })

    const leftPt = getAnchorCoords(shape, ANCHORS.LEFT)
    expect(leftPt).toEqual({ x: 100, y: 130 })

    const centerPt = getAnchorCoords(shape, ANCHORS.CENTER)
    expect(centerPt).toEqual({ x: 150, y: 130 })
  })

  it('creates layers with order and visibility', () => {
    const layer = createLayer('Annotations', { locked: true, order: 2 })
    expect(layer.name).toBe('Annotations')
    expect(layer.locked).toBe(true)
    expect(layer.order).toBe(2)
    expect(layer.visible).toBe(true)
  })
})
