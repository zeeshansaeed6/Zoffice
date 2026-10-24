/**
 * ZNotes block renderer — dispatches to the correct block component.
 */

import React from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import { BLOCK_TYPES } from '../core/constants.js'
import { TextBlock } from '../blocks/TextBlock.jsx'
import { ChecklistBlock } from '../blocks/ChecklistBlock.jsx'
import { TableBlock } from '../blocks/TableBlock.jsx'
import { ImageBlock } from '../blocks/ImageBlock.jsx'
import { InkBlock } from '../blocks/InkBlock.jsx'
import { AudioBlock } from '../blocks/AudioBlock.jsx'

/**
 * Renders a single block at its canvas position.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {boolean} props.isDragging
 * @param {(e: MouseEvent) => void} props.onMouseDown
 * @param {(updates: Object) => void} props.onUpdate
 * @param {() => void} props.onDelete
 */
export function BlockRenderer({ block, isActive, isDragging, onMouseDown, onUpdate, onDelete }) {
  const BlockComponent = getBlockComponent(block.type)

  return (
    <div
      className={`group absolute transition-shadow ${
        isActive
          ? 'z-10 shadow-lg ring-2 ring-violet-400/60'
          : 'hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-600'
      } ${isDragging ? 'cursor-grabbing opacity-80' : ''}`}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        minHeight: block.height,
      }}
    >
      {/* Drag handle */}
      <div
        className="absolute -left-5 top-0 hidden h-full w-5 cursor-grab items-center justify-center group-hover:flex"
        onMouseDown={onMouseDown}
      >
        <GripVertical size={12} className="text-neutral-400" />
      </div>

      {/* Delete button */}
      {isActive && (
        <button
          type="button"
          onClick={onDelete}
          className="absolute -right-2 -top-2 z-20 rounded-full bg-red-500 p-0.5 text-white shadow-sm hover:bg-red-600"
        >
          <Trash2 size={10} />
        </button>
      )}

      {/* Block content */}
      <div className="dark:bg-neutral-850 rounded-md bg-white shadow-sm dark:bg-neutral-800">
        <BlockComponent block={block} isActive={isActive} onUpdate={onUpdate} />
      </div>
    </div>
  )
}

/**
 * Get the correct block component for a type.
 * @param {string} type
 * @returns {React.ComponentType}
 */
function getBlockComponent(type) {
  switch (type) {
    case BLOCK_TYPES.TEXT:
      return TextBlock
    case BLOCK_TYPES.CHECKLIST:
      return ChecklistBlock
    case BLOCK_TYPES.TABLE:
      return TableBlock
    case BLOCK_TYPES.IMAGE:
      return ImageBlock
    case BLOCK_TYPES.INK:
      return InkBlock
    case BLOCK_TYPES.AUDIO:
      return AudioBlock
    default:
      return TextBlock
  }
}
