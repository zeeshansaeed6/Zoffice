/**
 * ZDraw SVG Exporter — exports canvas diagrams to standalone SVG, PNG, and PDF.
 * @module svg-exporter
 */

import { getAnchorCoords } from './draw-model.js'
import { routeConnectorPath, getConnectorLabelPosition } from './connector-router.js'

/**
 * Render shape SVG element string.
 * @param {import('./draw-model.js').DrawShape} shape
 * @returns {string}
 */
function renderShapeSvg(shape) {
  const {
    x,
    y,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    strokeDash,
    opacity,
    text,
    textColor,
    fontSize,
  } = shape
  const dashAttr =
    strokeDash === 'dashed'
      ? 'stroke-dasharray="6,4"'
      : strokeDash === 'dotted'
        ? 'stroke-dasharray="2,3"'
        : ''
  const cx = x + width / 2
  const cy = y + height / 2

  let geometry = ''
  if (shape.type === 'ellipse') {
    geometry = `<ellipse cx="${cx}" cy="${cy}" rx="${width / 2}" ry="${height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} opacity="${opacity}" />`
  } else if (shape.type === 'diamond' || shape.type === 'fc-decision') {
    geometry = `<polygon points="${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} opacity="${opacity}" />`
  } else if (shape.type === 'round-rect' || shape.type === 'fc-terminator') {
    geometry = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" ry="20" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} opacity="${opacity}" />`
  } else if (shape.customSvgPath) {
    geometry = `<g transform="translate(${x},${y})"><path d="${shape.customSvgPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} opacity="${opacity}" /></g>`
  } else {
    // Default: Rectangle
    geometry = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" ry="4" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dashAttr} opacity="${opacity}" />`
  }

  const textNode = text
    ? `<text x="${cx}" y="${cy + 4}" fill="${textColor}" font-size="${fontSize}" font-family="Inter, system-ui, sans-serif" font-weight="500" text-anchor="middle" dominant-baseline="middle">${escapeXml(text)}</text>`
    : ''

  return `<g id="${shape.id}">${geometry}${textNode}</g>`
}

/**
 * Render connector SVG element string.
 * @param {import('./draw-model.js').DrawConnector} connector
 * @param {Map<string, import('./draw-model.js').DrawShape>} shapeMap
 * @returns {string}
 */
function renderConnectorSvg(connector, shapeMap) {
  const source = shapeMap.get(connector.sourceId)
  const target = shapeMap.get(connector.targetId)
  if (!source || !target) return ''

  const p1 = getAnchorCoords(source, connector.sourceAnchor)
  const p2 = getAnchorCoords(target, connector.targetAnchor)
  const d = routeConnectorPath(
    p1,
    connector.sourceAnchor,
    p2,
    connector.targetAnchor,
    connector.routing,
    connector.waypoints,
  )
  const dashAttr =
    connector.strokeDash === 'dashed'
      ? 'stroke-dasharray="6,4"'
      : connector.strokeDash === 'dotted'
        ? 'stroke-dasharray="2,3"'
        : ''

  const path = `<path d="${d}" fill="none" stroke="${connector.stroke}" stroke-width="${connector.strokeWidth}" ${dashAttr} marker-end="url(#arrow)" />`

  let labelNode = ''
  if (connector.text) {
    const pos = getConnectorLabelPosition(p1, p2)
    labelNode = `<text x="${pos.x}" y="${pos.y}" fill="#334155" font-size="11" font-family="Inter, sans-serif" text-anchor="middle" background="white">${escapeXml(connector.text)}</text>`
  }

  return `<g id="${connector.id}">${path}${labelNode}</g>`
}

function escapeXml(unsafe = '') {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}

/**
 * Export diagram object to standalone SVG markup string.
 *
 * @param {import('./draw-model.js').Diagram} diagram
 * @returns {string}
 */
export function exportDiagramToSvg(diagram) {
  const shapes = diagram.shapes || []
  const connectors = diagram.connectors || []

  // Compute bounding box
  let minX = 0
  let minY = 0
  let maxX = diagram.canvas?.width || 1200
  let maxY = diagram.canvas?.height || 800

  if (shapes.length > 0) {
    minX = Math.max(0, Math.min(...shapes.map((s) => s.x)) - 40)
    minY = Math.max(0, Math.min(...shapes.map((s) => s.y)) - 40)
    maxX = Math.max(...shapes.map((s) => s.x + s.width)) + 40
    maxY = Math.max(...shapes.map((s) => s.y + s.height)) + 40
  }

  const width = Math.max(800, maxX - minX)
  const height = Math.max(600, maxY - minY)

  const shapeMap = new Map()
  shapes.forEach((s) => shapeMap.set(s.id, s))

  const shapesSvg = shapes.map((s) => renderShapeSvg(s)).join('\n  ')
  const connectorsSvg = connectors.map((c) => renderConnectorSvg(c, shapeMap)).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
    </marker>
  </defs>
  <rect x="${minX}" y="${minY}" width="${width}" height="${height}" fill="#ffffff" />
  ${connectorsSvg}
  ${shapesSvg}
</svg>`
}
