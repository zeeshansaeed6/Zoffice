/**
 * ConnectorRenderer — Renders routed SVG connectors with arrowheads and text labels.
 * @module ConnectorRenderer
 */

import React from 'react'
import { getAnchorCoords } from '../core/draw-model.js'
import { routeConnectorPath, getConnectorLabelPosition } from '../core/connector-router.js'

/**
 * @param {{
 *   connector: import('../core/draw-model.js').DrawConnector,
 *   sourceShape?: import('../core/draw-model.js').DrawShape,
 *   targetShape?: import('../core/draw-model.js').DrawShape,
 *   isSelected: boolean,
 *   onSelect: (e: React.MouseEvent) => void,
 * }} props
 */
export function ConnectorRenderer({ connector, sourceShape, targetShape, isSelected, onSelect }) {
  if (!sourceShape || !targetShape) return null

  const p1 = getAnchorCoords(sourceShape, connector.sourceAnchor)
  const p2 = getAnchorCoords(targetShape, connector.targetAnchor)

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
      ? '6,4'
      : connector.strokeDash === 'dotted'
        ? '2,3'
        : undefined

  const labelPos = getConnectorLabelPosition(p1, p2)

  return (
    <g onClick={onSelect} className="group cursor-pointer">
      {/* Invisible wider path for easier clicking */}
      <path d={d} fill="none" stroke="transparent" strokeWidth="12" />

      {/* Main Visible Path */}
      <path
        d={d}
        fill="none"
        stroke={isSelected ? '#3b82f6' : connector.stroke}
        strokeWidth={isSelected ? connector.strokeWidth + 1 : connector.strokeWidth}
        strokeDasharray={dashAttr}
        markerEnd="url(#arrow)"
        className="transition-colors group-hover:stroke-blue-500"
      />

      {/* Midpoint Label Text */}
      {connector.text && (
        <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
          <rect
            x={-(connector.text.length * 3.5 + 6)}
            y="-10"
            width={connector.text.length * 7 + 12}
            height="18"
            rx="3"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <text
            x="0"
            y="2"
            fill="#334155"
            fontSize="10"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            className="select-none"
          >
            {connector.text}
          </text>
        </g>
      )}
    </g>
  )
}
