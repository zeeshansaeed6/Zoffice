import React from 'react'
import { SHAPE_TYPES } from '../core/slide-constants.js'
import { getShapePath } from './shape-paths.js'

/**
 * ShapeElement renders geometric SVG shapes.
 *
 * @param {Object} props
 * @param {Object} props.element - { width, height, properties: { shapeType, fill, stroke, strokeWidth, opacity } }
 */
export function ShapeElement({ element }) {
  const { width, height, properties = {} } = element
  const {
    shapeType = SHAPE_TYPES.RECTANGLE,
    fill = '#3b82f6',
    stroke = '#1d4ed8',
    strokeWidth = 0,
    opacity = 1,
  } = properties

  const w = Math.max(1, width)
  const h = Math.max(1, height)

  if (shapeType === SHAPE_TYPES.ELLIPSE) {
    return (
      <svg className="h-full w-full" viewBox={`0 0 ${w} ${h}`} style={{ opacity }}>
        <ellipse
          cx={w / 2}
          cy={h / 2}
          rx={w / 2 - strokeWidth}
          ry={h / 2 - strokeWidth}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  if (shapeType === SHAPE_TYPES.ROUNDED_RECTANGLE) {
    return (
      <svg className="h-full w-full" viewBox={`0 0 ${w} ${h}`} style={{ opacity }}>
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={w - strokeWidth}
          height={h - strokeWidth}
          rx={12}
          ry={12}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  if (shapeType === SHAPE_TYPES.RECTANGLE) {
    return (
      <svg className="h-full w-full" viewBox={`0 0 ${w} ${h}`} style={{ opacity }}>
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={w - strokeWidth}
          height={h - strokeWidth}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  const pathData = getShapePath(shapeType, w, h)

  return (
    <svg className="h-full w-full" viewBox={`0 0 ${w} ${h}`} style={{ opacity }}>
      <path
        d={pathData}
        fill={shapeType === SHAPE_TYPES.LINE ? 'none' : fill}
        stroke={stroke}
        strokeWidth={shapeType === SHAPE_TYPES.LINE ? Math.max(2, strokeWidth) : strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  )
}
