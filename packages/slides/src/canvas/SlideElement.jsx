import React from 'react'
import { ELEMENT_TYPES } from '../core/slide-constants.js'

/**
 * SlideElement renders individual elements (shapes, text boxes, images, etc.).
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {boolean} props.isSelected
 * @param {(e: React.MouseEvent) => void} props.onSelect
 */
export function SlideElement({ element, isSelected, onSelect }) {
  const { type, x, y, width, height, rotation, properties } = element

  const renderContent = () => {
    switch (type) {
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            className="h-full w-full outline-none"
            style={{
              fontSize: `${properties.fontSize || 20}px`,
              fontFamily: properties.fontFamily || 'Inter, sans-serif',
              fontWeight: properties.bold ? 'bold' : 'normal',
              fontStyle: properties.italic ? 'italic' : 'normal',
              textDecoration: properties.underline ? 'underline' : 'none',
              color: properties.color || '#000000',
              textAlign: properties.align || 'left',
              wordBreak: 'break-word',
              userSelect: isSelected ? 'text' : 'none',
            }}
          >
            {properties.text}
          </div>
        )

      case ELEMENT_TYPES.SHAPE:
      default:
        return (
          <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`}>
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={properties.fill || '#3b82f6'}
              stroke={properties.stroke || '#1d4ed8'}
              strokeWidth={properties.strokeWidth || 0}
              rx={properties.shapeType === 'rounded_rect' ? 8 : 0}
            />
          </svg>
        )
    }
  }

  return (
    <div
      data-testid={`slide-element-${element.id}`}
      className="absolute cursor-move select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${rotation || 0}deg)`,
        transformOrigin: 'center center',
      }}
      onMouseDown={onSelect}
    >
      {renderContent()}
    </div>
  )
}
