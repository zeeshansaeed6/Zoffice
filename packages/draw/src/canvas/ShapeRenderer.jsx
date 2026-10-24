/**
 * ShapeRenderer — Renders 2D SVG shapes with text and connection points.
 * @module ShapeRenderer
 */

import React, { useState } from 'react'
import { ANCHORS } from '../core/constants.js'

/**
 * @param {{
 *   shape: import('../core/draw-model.js').DrawShape,
 *   isSelected: boolean,
 *   onSelect: (e: React.MouseEvent) => void,
 *   onStartConnect: (anchor: string) => void,
 *   onEndConnect: (anchor: string) => void,
 *   onUpdateText: (text: string) => void,
 * }} props
 */
export function ShapeRenderer({
  shape,
  isSelected,
  onSelect,
  onStartConnect,
  onEndConnect,
  onUpdateText,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(shape.text)
  const [isHovered, setIsHovered] = useState(false)

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
  const cx = x + width / 2
  const cy = y + height / 2

  const dashAttr = strokeDash === 'dashed' ? '6,4' : strokeDash === 'dotted' ? '2,3' : undefined

  const finishEditing = () => {
    setIsEditing(false)
    if (editText !== shape.text) {
      onUpdateText(editText)
    }
  }

  // Generate shape geometry
  const renderGeometry = () => {
    switch (shape.type) {
      case 'ellipse':
      case 'uml-interface':
      case 'erd-attribute':
        return (
          <ellipse
            cx={cx}
            cy={cy}
            rx={width / 2}
            ry={height / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )

      case 'diamond':
      case 'fc-decision':
      case 'erd-relationship':
        return (
          <polygon
            points={`${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )

      case 'round-rect':
      case 'fc-terminator':
      case 'uml-usecase':
        return (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={Math.min(width, height) / 3}
            ry={Math.min(width, height) / 3}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )

      case 'triangle':
        return (
          <polygon
            points={`${cx},${y} ${x + width},${y + height} ${x},${y + height}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )

      case 'fc-io':
        return (
          <polygon
            points={`${x + 20},${y} ${x + width},${y} ${x + width - 20},${y + height} ${x},${y + height}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )

      case 'custom':
        if (shape.customSvgPath) {
          return (
            <g transform={`translate(${x},${y})`}>
              <path
                d={shape.customSvgPath}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dashAttr}
                opacity={opacity}
              />
            </g>
          )
        }
        break

      case 'rect':
      default:
        return (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={4}
            ry={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={dashAttr}
            opacity={opacity}
          />
        )
    }
  }

  // Connection anchor points
  const anchorPoints = [
    { anchor: ANCHORS.TOP, ax: cx, ay: y },
    { anchor: ANCHORS.RIGHT, ax: x + width, ay: cy },
    { anchor: ANCHORS.BOTTOM, ax: cx, ay: y + height },
    { anchor: ANCHORS.LEFT, ax: x, ay: cy },
  ]

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className="cursor-pointer select-none"
    >
      {/* Geometry */}
      {renderGeometry()}

      {/* Selection outline */}
      {isSelected && (
        <rect
          x={x - 4}
          y={y - 4}
          width={width + 8}
          height={height + 8}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          rx="6"
          pointerEvents="none"
        />
      )}

      {/* Label Text */}
      {!isEditing && text && (
        <text
          x={cx}
          y={cy + 4}
          fill={textColor}
          fontSize={fontSize}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="500"
          textAnchor="middle"
          dominantBaseline="middle"
          onDoubleClick={(e) => {
            e.stopPropagation()
            setEditText(shape.text)
            setIsEditing(true)
          }}
          className="select-none"
        >
          {text}
        </text>
      )}

      {/* Inline Text Edit Input */}
      {isEditing && (
        <foreignObject x={x + 8} y={cy - 14} width={Math.max(60, width - 16)} height={32}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={(e) => e.key === 'Enter' && finishEditing()}
            className="shadow-xs focus:outline-hidden h-full w-full rounded border border-blue-500 bg-white text-center text-xs font-semibold"
            autoFocus
          />
        </foreignObject>
      )}

      {/* Connection Anchor Dots (visible when hovered or selected) */}
      {(isHovered || isSelected) &&
        anchorPoints.map(({ anchor, ax, ay }) => (
          <circle
            key={anchor}
            cx={ax}
            cy={ay}
            r={5}
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth="1.5"
            className="cursor-crosshair transition-transform hover:scale-125"
            onMouseDown={(e) => {
              e.stopPropagation()
              onStartConnect(anchor)
            }}
            onMouseUp={(e) => {
              e.stopPropagation()
              onEndConnect(anchor)
            }}
          />
        ))}
    </g>
  )
}
