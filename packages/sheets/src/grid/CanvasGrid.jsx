import React, { useRef, useEffect, useState, useCallback } from 'react'
import { renderGrid } from './grid-renderer.js'
import { getCellRect } from './grid-viewport.js'
import { handleMouseDown, handleMouseMove, handleMouseUp } from './grid-mouse.js'
import { handleKeyDown } from './grid-keyboard.js'

/**
 * High-performance virtualized canvas grid component for ZSheets.
 *
 * @param {Object} props
 * @param {Object} props.sheet - Active sheet model
 * @param {{ row: number, col: number }} props.activeCell
 * @param {{ startRow: number, startCol: number, endRow: number, endCol: number }} props.selectedRange
 * @param {string} props.themeMode - 'light' | 'dark'
 * @param {(cell: { row: number, col: number }, range: any) => void} props.onSelectionChange
 * @param {(col: number, width: number) => void} props.onColResize
 * @param {(row: number, height: number) => void} props.onRowResize
 * @param {boolean} props.isEditing
 * @param {string} props.editValue
 * @param {(value: string) => void} props.onEditValueChange
 * @param {() => void} props.onStartEdit
 * @param {() => void} props.onCommitEdit
 * @param {() => void} props.onCancelEdit
 * @param {() => void} props.onClearRange
 */
export function CanvasGrid({
  sheet,
  activeCell,
  selectedRange,
  themeMode = 'light',
  onSelectionChange,
  onColResize,
  onRowResize,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onClearRange,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const editorInputRef = useRef(null)

  const [size, setSize] = useState({ width: 800, height: 600 })
  const [scroll, setScroll] = useState({ x: 0, y: 0 })
  const [dragAction, setDragAction] = useState(null)
  const [cursor, setCursor] = useState('cell')
  const [resizeIndicator, setResizeIndicator] = useState(null)

  // Track container dimensions with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setSize({ width: Math.floor(width), height: Math.floor(height) })
        }
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Draw grid onto canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(size.width * dpr)
    canvas.height = Math.floor(size.height * dpr)
    ctx.scale(dpr, dpr)

    renderGrid(ctx, {
      width: size.width,
      height: size.height,
      scrollX: scroll.x,
      scrollY: scroll.y,
      sheet,
      activeCell,
      selectedRange,
      themeMode,
      resizeIndicator,
    })
  }, [size, scroll, sheet, activeCell, selectedRange, themeMode, resizeIndicator])

  useEffect(() => {
    draw()
  }, [draw])

  // Mouse wheel scrolling
  const handleWheel = (e) => {
    e.preventDefault()
    setScroll((prev) => ({
      x: Math.max(0, prev.x + (e.shiftKey ? e.deltaY : e.deltaX)),
      y: Math.max(0, prev.y + (e.shiftKey ? 0 : e.deltaY)),
    }))
  }

  // Pointer event dispatchers
  const onMouseDown = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isEditing) {
      onCommitEdit()
    }

    const action = handleMouseDown(e, {
      x,
      y,
      sheet,
      scrollX: scroll.x,
      scrollY: scroll.y,
      activeCell,
      selectedRange,
    })

    if (action) {
      setDragAction(action)
      if (action.activeCell) {
        onSelectionChange(action.activeCell, action.range)
      }
    }
  }

  const onMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const res = handleMouseMove(e, {
      x,
      y,
      sheet,
      scrollX: scroll.x,
      scrollY: scroll.y,
      dragAction,
      selectedRange,
    })

    if (res.cursor !== cursor) setCursor(res.cursor)
    if (res.nextState?.resizeIndicator !== undefined) {
      setResizeIndicator(res.nextState.resizeIndicator)
    }
    if (res.nextState?.selectedRange) {
      onSelectionChange(activeCell, res.nextState.selectedRange)
    }
  }

  const onMouseUp = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const res = handleMouseUp({
      dragAction,
      x,
      y,
      sheet,
      scrollX: scroll.x,
      scrollY: scroll.y,
    })

    if (res.type === 'resize_col') {
      onColResize(res.col, res.width)
    } else if (res.type === 'resize_row') {
      onRowResize(res.row, res.height)
    } else if (res.type === 'commit_selection') {
      onSelectionChange(activeCell, res.range)
    }

    setDragAction(null)
    setResizeIndicator(null)
  }

  const onDoubleClick = () => {
    onStartEdit()
  }

  // Keyboard navigation dispatch
  const onKeyDown = (e) => {
    const res = handleKeyDown(e, { activeCell, selectedRange, isEditing })
    if (!res) return

    if (res.type === 'navigate' || res.type === 'navigate_select') {
      onSelectionChange(res.activeCell, res.range)
      ensureCellVisible(res.activeCell.row, res.activeCell.col)
    } else if (res.type === 'start_edit') {
      onStartEdit()
    } else if (res.type === 'start_edit_with_char') {
      onStartEdit()
      onEditValueChange(res.char)
    } else if (res.type === 'commit_edit') {
      onCommitEdit()
      if (res.moveNext === 'down') {
        const nextCell = { row: activeCell.row + 1, col: activeCell.col }
        onSelectionChange(nextCell, {
          startRow: nextCell.row,
          startCol: nextCell.col,
          endRow: nextCell.row,
          endCol: nextCell.col,
        })
      } else if (res.moveNext === 'right') {
        const nextCell = { row: activeCell.row, col: activeCell.col + 1 }
        onSelectionChange(nextCell, {
          startRow: nextCell.row,
          startCol: nextCell.col,
          endRow: nextCell.row,
          endCol: nextCell.col,
        })
      }
    } else if (res.type === 'cancel_edit') {
      onCancelEdit()
    } else if (res.type === 'clear_range') {
      onClearRange()
    }
  }

  const ensureCellVisible = (row, col) => {
    const cellRect = getCellRect({ row, col, scrollX: scroll.x, scrollY: scroll.y, sheet })
    let newX = scroll.x
    let newY = scroll.y

    if (cellRect.x < 50) {
      newX = Math.max(0, scroll.x - (50 - cellRect.x))
    } else if (cellRect.x + cellRect.width > size.width) {
      newX += cellRect.x + cellRect.width - size.width
    }

    if (cellRect.y < 26) {
      newY = Math.max(0, scroll.y - (26 - cellRect.y))
    } else if (cellRect.y + cellRect.height > size.height) {
      newY += cellRect.y + cellRect.height - size.height
    }

    if (newX !== scroll.x || newY !== scroll.y) {
      setScroll({ x: newX, y: newY })
    }
  }

  // Active cell pixel coordinates for in-place editor positioning
  const editorRect =
    isEditing && activeCell
      ? getCellRect({
          row: activeCell.row,
          col: activeCell.col,
          scrollX: scroll.x,
          scrollY: scroll.y,
          sheet,
        })
      : null

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      data-testid="canvas-grid-container"
      onKeyDown={onKeyDown}
      onWheel={handleWheel}
      className="relative flex-1 select-none overflow-hidden outline-none"
    >
      <canvas
        ref={canvasRef}
        data-testid="sheets-canvas"
        style={{ width: `${size.width}px`, height: `${size.height}px`, cursor }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      />

      {/* In-place Cell Editor */}
      {isEditing && editorRect && (
        <input
          ref={editorInputRef}
          type="text"
          data-testid="cell-editor-input"
          autoFocus
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onCommitEdit()
            } else if (e.key === 'Escape') {
              e.preventDefault()
              onCancelEdit()
            }
          }}
          style={{
            position: 'absolute',
            left: `${editorRect.x}px`,
            top: `${editorRect.y}px`,
            width: `${editorRect.width}px`,
            height: `${editorRect.height}px`,
          }}
          className="z-20 border-2 border-blue-600 bg-white px-1.5 font-sans text-xs text-neutral-900 shadow-md outline-none dark:bg-neutral-950 dark:text-neutral-100"
        />
      )}
    </div>
  )
}
