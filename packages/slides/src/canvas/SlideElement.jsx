import React from 'react'
import { ELEMENT_TYPES } from '../core/slide-constants.js'
import { ShapeElement } from '../elements/ShapeElement.jsx'
import { TextElement } from '../elements/TextElement.jsx'
import { ImageElement } from '../elements/ImageElement.jsx'
import { TableElement } from '../elements/TableElement.jsx'
import { ChartElement } from '../elements/ChartElement.jsx'

/**
 * SlideElement renders individual elements (shapes, text boxes, images, tables, charts).
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {boolean} props.isSelected
 * @param {(e: React.MouseEvent) => void} props.onSelect
 * @param {(newText: string) => void} [props.onTextChange]
 * @param {(newTableData: Array<Array<string>>) => void} [props.onTableChange]
 */
export function SlideElement({ element, isSelected, onSelect, onTextChange, onTableChange }) {
  const { type, x, y, width, height, rotation } = element

  const renderContent = () => {
    switch (type) {
      case ELEMENT_TYPES.TEXT:
        return <TextElement element={element} isSelected={isSelected} onTextChange={onTextChange} />

      case ELEMENT_TYPES.IMAGE:
        return <ImageElement element={element} />

      case ELEMENT_TYPES.TABLE:
        return (
          <TableElement element={element} isSelected={isSelected} onTableChange={onTableChange} />
        )

      case ELEMENT_TYPES.CHART:
        return <ChartElement element={element} />

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
