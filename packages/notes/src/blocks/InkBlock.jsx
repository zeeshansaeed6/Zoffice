/**
 * ZNotes ink block — canvas-based drawing/sketching.
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { Eraser, Undo2 } from 'lucide-react'

/** Pen colors available */
const PEN_COLORS = ['#000000', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

/**
 * Ink/drawing block using HTML5 Canvas.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function InkBlock({ block, isActive, onUpdate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState('#000000')
  const [penSize, setPenSize] = useState(2)

  const paths = useMemo(() => {
    try {
      const data = JSON.parse(block.content)
      return Array.isArray(data.paths) ? data.paths : []
    } catch {
      return []
    }
  }, [block.content])

  const currentPath = useRef([])

  // Redraw all paths when they change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const path of paths) {
      if (path.points.length < 2) continue
      ctx.beginPath()
      ctx.strokeStyle = path.color || '#000'
      ctx.lineWidth = path.size || 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.moveTo(path.points[0].x, path.points[0].y)
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y)
      }
      ctx.stroke()
    }
  }, [paths])

  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseDown = useCallback((e) => {
    if (!isActive) return
    setIsDrawing(true)
    currentPath.current = [getCanvasPoint(e)]
  }, [isActive, getCanvasPoint])

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !isActive) return
    const point = getCanvasPoint(e)
    currentPath.current.push(point)

    // Draw live
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pts = currentPath.current
    if (pts.length < 2) return
    ctx.beginPath()
    ctx.strokeStyle = penColor
    ctx.lineWidth = penSize
    ctx.lineCap = 'round'
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }, [isDrawing, isActive, penColor, penSize, getCanvasPoint])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentPath.current.length >= 2) {
      const newPath = { points: currentPath.current, color: penColor, size: penSize }
      const newPaths = [...paths, newPath]
      onUpdate({ content: JSON.stringify({ paths: newPaths }) })
    }
    currentPath.current = []
  }, [isDrawing, paths, penColor, penSize, onUpdate])

  const handleUndo = useCallback(() => {
    if (paths.length === 0) return
    onUpdate({ content: JSON.stringify({ paths: paths.slice(0, -1) }) })
  }, [paths, onUpdate])

  const handleClear = useCallback(() => {
    onUpdate({ content: JSON.stringify({ paths: [] }) })
  }, [onUpdate])

  return (
    <div className="p-1" data-testid="ink-block">
      {isActive && (
        <div className="mb-1 flex items-center gap-2">
          {PEN_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setPenColor(color)}
              className={`h-4 w-4 rounded-full border-2 ${
                penColor === color ? 'border-violet-500 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <select
            value={penSize}
            onChange={(e) => setPenSize(Number(e.target.value))}
            className="rounded border border-neutral-300 bg-transparent px-1 text-[10px] dark:border-neutral-600"
          >
            <option value={1}>Fine</option>
            <option value={2}>Medium</option>
            <option value={4}>Thick</option>
          </select>
          <button type="button" onClick={handleUndo} title="Undo" className="text-neutral-400 hover:text-neutral-600">
            <Undo2 size={12} />
          </button>
          <button type="button" onClick={handleClear} title="Clear" className="text-neutral-400 hover:text-red-500">
            <Eraser size={12} />
          </button>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={block.width - 8}
        height={Math.max(150, block.height - 30)}
        className={`rounded border border-neutral-200 dark:border-neutral-700 ${
          isActive ? 'cursor-crosshair' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
