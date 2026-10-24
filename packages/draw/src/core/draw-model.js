/**
 * ZDraw Data Models — factory functions for shapes, connectors, layers, and diagrams.
 * @module draw-model
 */

import { ROUTING_MODES, ANCHORS, ARROW_TYPES, DEFAULT_CANVAS_CONFIG } from './constants.js'

/**
 * Generate unique entity identifier.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {Object} DrawShape
 * @property {string} id
 * @property {string} type - Shape identifier (e.g. 'rect', 'diamond', 'custom')
 * @property {string} category - Shape category
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} rotation - In degrees
 * @property {string} fill
 * @property {string} stroke
 * @property {number} strokeWidth
 * @property {string} strokeDash - 'solid' | 'dashed' | 'dotted'
 * @property {boolean} shadow
 * @property {number} opacity - 0 to 1
 * @property {string} text - Label content
 * @property {string} textColor
 * @property {number} fontSize
 * @property {string} textAlign - 'center' | 'left' | 'right'
 * @property {number} zIndex
 * @property {string} layerId
 * @property {string|null} groupId
 * @property {string} [customSvgPath] - For custom imported shapes
 */

/**
 * Create a new diagram shape.
 * @param {Partial<DrawShape>} [overrides={}]
 * @returns {DrawShape}
 */
export function createShape(overrides = {}) {
  return {
    id: overrides.id || generateId('shp'),
    type: overrides.type || 'rect',
    category: overrides.category || 'basic',
    x: overrides.x ?? 100,
    y: overrides.y ?? 100,
    width: overrides.width ?? 120,
    height: overrides.height ?? 80,
    rotation: overrides.rotation ?? 0,
    fill: overrides.fill || '#eff6ff',
    stroke: overrides.stroke || '#2563eb',
    strokeWidth: overrides.strokeWidth ?? 2,
    strokeDash: overrides.strokeDash || 'solid',
    shadow: overrides.shadow ?? true,
    opacity: overrides.opacity ?? 1,
    text: overrides.text || '',
    textColor: overrides.textColor || '#1e3a8a',
    fontSize: overrides.fontSize ?? 13,
    textAlign: overrides.textAlign || 'center',
    zIndex: overrides.zIndex ?? 0,
    layerId: overrides.layerId || 'layer-default',
    groupId: overrides.groupId || null,
    customSvgPath: overrides.customSvgPath || '',
  }
}

/**
 * @typedef {Object} DrawConnector
 * @property {string} id
 * @property {string} sourceId - Shape ID
 * @property {string} sourceAnchor - Anchor position
 * @property {string} targetId - Shape ID
 * @property {string} targetAnchor - Anchor position
 * @property {string} routing - One of ROUTING_MODES
 * @property {string} stroke
 * @property {number} strokeWidth
 * @property {string} strokeDash - 'solid' | 'dashed' | 'dotted'
 * @property {string} startArrow - One of ARROW_TYPES
 * @property {string} endArrow - One of ARROW_TYPES
 * @property {string} text
 * @property {Array<{ x: number, y: number }>} waypoints
 * @property {string} layerId
 */

/**
 * Create a connector between two shapes.
 * @param {string} sourceId
 * @param {string} targetId
 * @param {Partial<DrawConnector>} [overrides={}]
 * @returns {DrawConnector}
 */
export function createConnector(sourceId = '', targetId = '', overrides = {}) {
  return {
    id: overrides.id || generateId('con'),
    sourceId: overrides.sourceId || sourceId,
    sourceAnchor: overrides.sourceAnchor || ANCHORS.RIGHT,
    targetId: overrides.targetId || targetId,
    targetAnchor: overrides.targetAnchor || ANCHORS.LEFT,
    routing: overrides.routing || ROUTING_MODES.ORTHOGONAL,
    stroke: overrides.stroke || '#475569',
    strokeWidth: overrides.strokeWidth ?? 2,
    strokeDash: overrides.strokeDash || 'solid',
    startArrow: overrides.startArrow || ARROW_TYPES.NONE,
    endArrow: overrides.endArrow || ARROW_TYPES.ARROW,
    text: overrides.text || '',
    waypoints: overrides.waypoints || [],
    layerId: overrides.layerId || 'layer-default',
  }
}

/**
 * @typedef {Object} DrawLayer
 * @property {string} id
 * @property {string} name
 * @property {boolean} visible
 * @property {boolean} locked
 * @property {number} order
 */

/**
 * Create a canvas layer.
 * @param {string} name
 * @param {Partial<DrawLayer>} [overrides={}]
 * @returns {DrawLayer}
 */
export function createLayer(name = 'Layer 1', overrides = {}) {
  return {
    id: overrides.id || generateId('lay'),
    name: overrides.name || name,
    visible: overrides.visible ?? true,
    locked: overrides.locked ?? false,
    order: overrides.order ?? 0,
  }
}

/**
 * Compute the absolute (x, y) coordinates of an anchor point on a shape.
 * @param {DrawShape} shape
 * @param {string} anchor
 * @returns {{ x: number, y: number }}
 */
export function getAnchorCoords(shape, anchor = ANCHORS.CENTER) {
  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2

  let px = cx
  let py = cy

  switch (anchor) {
    case ANCHORS.TOP:
      px = cx
      py = shape.y
      break
    case ANCHORS.BOTTOM:
      px = cx
      py = shape.y + shape.height
      break
    case ANCHORS.LEFT:
      px = shape.x
      py = cy
      break
    case ANCHORS.RIGHT:
      px = shape.x + shape.width
      py = cy
      break
    case ANCHORS.CENTER:
    default:
      px = cx
      py = cy
      break
  }

  // Handle rotation if present
  if (shape.rotation && shape.rotation % 360 !== 0) {
    const rad = (shape.rotation * Math.PI) / 180
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)
    const dx = px - cx
    const dy = py - cy
    px = cx + dx * cos - dy * sin
    py = cy + dx * sin + dy * cos
  }

  return { x: Math.round(px), y: Math.round(py) }
}

/**
 * @typedef {Object} Diagram
 * @property {string} id
 * @property {string} title
 * @property {typeof DEFAULT_CANVAS_CONFIG} canvas
 * @property {DrawLayer[]} layers
 * @property {DrawShape[]} shapes
 * @property {DrawConnector[]} connectors
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a starter diagram with sample connected flowchart shapes.
 * @param {Partial<Diagram>} [overrides={}]
 * @returns {Diagram}
 */
export function createDiagram(overrides = {}) {
  const diagId = overrides.id || generateId('diag')
  const defaultLayer = createLayer('Main Layer', { id: 'layer-default', order: 0 })

  const s1 = createShape({
    id: 's-start',
    type: 'fc-terminator',
    category: 'flowchart',
    x: 240,
    y: 140,
    width: 140,
    height: 60,
    text: 'Start Process',
    fill: '#ecfdf5',
    stroke: '#10b981',
    textColor: '#064e3b',
  })

  const s2 = createShape({
    id: 's-decision',
    type: 'fc-decision',
    category: 'flowchart',
    x: 240,
    y: 280,
    width: 140,
    height: 100,
    text: 'Valid Data?',
    fill: '#fffbeb',
    stroke: '#f59e0b',
    textColor: '#78350f',
  })

  const s3 = createShape({
    id: 's-action',
    type: 'fc-process',
    category: 'flowchart',
    x: 480,
    y: 295,
    width: 140,
    height: 70,
    text: 'Commit to SQLite',
    fill: '#eff6ff',
    stroke: '#3b82f6',
    textColor: '#1e3a8a',
  })

  const conn1 = createConnector(s1.id, s2.id, {
    sourceAnchor: ANCHORS.BOTTOM,
    targetAnchor: ANCHORS.TOP,
    routing: ROUTING_MODES.ORTHOGONAL,
  })

  const conn2 = createConnector(s2.id, s3.id, {
    sourceAnchor: ANCHORS.RIGHT,
    targetAnchor: ANCHORS.LEFT,
    routing: ROUTING_MODES.ORTHOGONAL,
    text: 'Yes',
  })

  const now = Date.now()

  return {
    id: diagId,
    title: overrides.title || 'Untitled Diagram',
    canvas: { ...DEFAULT_CANVAS_CONFIG, ...(overrides.canvas || {}) },
    layers: overrides.layers || [defaultLayer],
    shapes: overrides.shapes || [s1, s2, s3],
    connectors: overrides.connectors || [conn1, conn2],
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}
