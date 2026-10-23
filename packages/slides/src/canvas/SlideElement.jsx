import React from 'react'
import { ELEMENT_TYPES } from '../core/slide-constants.js'
import { ShapeElement } from '../elements/ShapeElement.jsx'
import { TextElement } from '../elements/TextElement.jsx'

/**
 * SlideElement renders individual elements (shapes, text boxes, images, etc.).
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {boolean} props.isSelected
 * @param {(e: React.MouseEvent) => void} props.onSelect
 * @param {(newText: string) => void} [props.onTextChange]
 */
export function SlideElement({ element, isSelected, onSelect, onTextChange }) {
  const { type, x, y, width, height, rotation } = element

  const renderContent = () => {
    switch (type) {
      case ELEMENT_TYPES.TEXT:
        return <TextElement element={element} isSelected={isSelected} onTextChange={onTextChange} />

      case ELEMENT_TYPES.SHAPE:
      default:
        return <ShapeElement element={element} />
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
