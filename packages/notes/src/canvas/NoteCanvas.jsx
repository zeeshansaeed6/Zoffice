/**
 * ZNotes free-form canvas — positions blocks anywhere on an infinite surface.
 */

import React, { useRef, useState, useCallback } from 'react'
import { useNoteStore } from '../core/note-store.js'
import { BlockRenderer } from './BlockRenderer.jsx'
import { CANVAS, BLOCK_TYPES } from '../core/constants.js'
import { Plus } from 'lucide-react'

/**
 * Free-form note canvas where blocks can be placed anywhere.
 */
export function NoteCanvas() {
  const { getActivePage, activeBlockId, selectBlock, addBlock, updateBlock, deleteBlock } =
    useNoteStore()
  const canvasRef = useRef(null)
  const [dragState, setDragState] = useState(null)

  const page = getActivePage()

  const handleCanvasClick = useCallback(
    (e) => {
      if (e.target === canvasRef.current || e.target.dataset?.canvas) {
        selectBlock(null)
      }
    },
    [selectBlock],
  )

  const handleBlockMouseDown = useCallback(
    (e, blockId) => {
      e.stopPropagation()
      selectBlock(blockId)

      const page = useNoteStore.getState().getActivePage()
      const block = page?.blocks.find((b) => b.id === blockId)
      if (!block) return

      const startX = e.clientX
      const startY = e.clientY
      const origX = block.x
      const origY = block.y

      setDragState({ blockId, startX, startY, origX, origY })
    },
    [selectBlock],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState) return
      const dx = e.clientX - dragState.startX
      const dy = e.clientY - dragState.startY
      updateBlock(dragState.blockId, {
        x: Math.max(0, dragState.origX + dx),
        y: Math.max(0, dragState.origY + dy),
      })
    },
    [dragState, updateBlock],
  )

  const handleMouseUp = useCallback(() => {
    setDragState(null)
  }, [])

  const handleAddBlock = useCallback(
    (type) => {
      const page = useNoteStore.getState().getActivePage()
      const blocks = page?.blocks || []
      const maxY = blocks.reduce((max, b) => Math.max(max, b.y + b.height), 0)
      addBlock(type, { x: 40, y: maxY + 20 })
    },
    [addBlock],
  )

  if (!page) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center text-neutral-400 dark:text-neutral-600">
          <p className="text-sm font-medium">No page selected</p>
          <p className="mt-1 text-xs">Select or create a page from the sidebar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Page header */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <h1 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {page.title}
        </h1>
        <span className="text-[10px] text-neutral-400">
          {new Date(page.updatedAt).toLocaleString()}
        </span>
      </div>

      {/* Block insertion toolbar */}
      <div className="flex items-center gap-1 border-b border-neutral-200 px-4 py-1 dark:border-neutral-800">
        {[
          { type: BLOCK_TYPES.TEXT, label: 'Text' },
          { type: BLOCK_TYPES.CHECKLIST, label: 'Checklist' },
          { type: BLOCK_TYPES.TABLE, label: 'Table' },
          { type: BLOCK_TYPES.IMAGE, label: 'Image' },
          { type: BLOCK_TYPES.INK, label: 'Drawing' },
        ].map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => handleAddBlock(item.type)}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-neutral-500 transition-colors hover:bg-violet-50 hover:text-violet-700 dark:text-neutral-400 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
          >
            <Plus size={10} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        data-canvas="true"
        className="relative flex-1 cursor-default overflow-auto"
        style={{ minWidth: CANVAS.WIDTH, minHeight: CANVAS.HEIGHT }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {page.blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            isActive={activeBlockId === block.id}
            isDragging={dragState?.blockId === block.id}
            onMouseDown={(e) => handleBlockMouseDown(e, block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}
      </div>
    </div>
  )
}
