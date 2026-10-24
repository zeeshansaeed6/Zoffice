/**
 * DiagramCanvas — Interactive SVG canvas with zoom, pan, grid, drag-and-drop, and connector linking.
 * @module DiagramCanvas
 */

import React, { useRef, useState, useMemo } from 'react'
import { useDrawStore } from '../core/draw-store.js'
import { ShapeRenderer } from './ShapeRenderer.jsx'
import { ConnectorRenderer } from './ConnectorRenderer.jsx'
import { TOOLS, ROUTING_MODES } from '../core/constants.js'

export function DiagramCanvas() {
  const {
    diagram,
    selectedShapeIds,
    selectedConnectorIds,
    activeTool,
    zoom,
    panOffset,
    connectionStart,
    selectShape,
    selectConnector,
    clearSelection,
    moveShapes,
    updateShape,
    addShape,
    addConnector,
    setConnectionStart,
    setPanOffset,
  } = useDrawStore()

  const canvasRef = useRef(null)
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [activeDragShape, setActiveDragShape] = useState(false)
  const [tempConnectionEnd, setTempConnectionEnd] = useState(null)

  const shapeMap = useMemo(() => {
    const map = new Map()
    diagram.shapes.forEach((s) => map.set(s.id, s))
    return map
  }, [diagram.shapes])

  // Mouse Down
  const handleMouseDown = (e) => {
    if (activeTool === TOOLS.PAN || e.button === 1 || e.spaceKey) {
      setIsPanning(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      return
    }

    if (
      e.target === canvasRef.current ||
      e.target.tagName === 'svg' ||
      e.target.id === 'canvas-bg'
    ) {
      clearSelection()
    }
  }

  // Mouse Move
  const handleMouseMove = (e) => {
    if (isPanning && dragStart) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
      return
    }

    if (activeDragShape && dragStart) {
      const dx = Math.round((e.clientX - dragStart.x) / zoom)
      const dy = Math.round((e.clientY - dragStart.y) / zoom)
      if (dx !== 0 || dy !== 0) {
        moveShapes(dx, dy)
        setDragStart({ x: e.clientX, y: e.clientY })
      }
      return
    }

    if (connectionStart) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setTempConnectionEnd({
          x: Math.round((e.clientX - rect.left - panOffset.x) / zoom),
          y: Math.round((e.clientY - rect.top - panOffset.y) / zoom),
        })
      }
    }
  }

  // Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false)
    setActiveDragShape(false)
    setDragStart(null)
    setConnectionStart(null)
    setTempConnectionEnd(null)
  }

  // Shape Drag Start
  const handleShapeSelect = (e, shapeId) => {
    e.stopPropagation()
    selectShape(shapeId, e.shiftKey)
    setActiveDragShape(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  // Connection Linking
  const handleStartConnect = (shapeId, anchor) => {
    setConnectionStart({ shapeId, anchor })
  }

  const handleEndConnect = (targetShapeId, targetAnchor) => {
    if (connectionStart && connectionStart.shapeId !== targetShapeId) {
      addConnector(
        connectionStart.shapeId,
        connectionStart.anchor,
        targetShapeId,
        targetAnchor,
        ROUTING_MODES.ORTHOGONAL,
      )
    }
    setConnectionStart(null)
    setTempConnectionEnd(null)
  }

  // Drop shape from sidebar
  const handleDrop = (e) => {
    e.preventDefault()
    const shapeType = e.dataTransfer.getData('application/zdraw-shape')
    if (shapeType) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const dropX = Math.round((e.clientX - rect.left - panOffset.x) / zoom) - 60
        const dropY = Math.round((e.clientY - rect.top - panOffset.y) / zoom) - 40
        addShape(shapeType, dropX, dropY)
      }
    }
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative h-full w-full flex-1 select-none overflow-hidden bg-slate-50 dark:bg-slate-950 ${
        activeTool === TOOLS.PAN || isPanning
          ? 'cursor-grab active:cursor-grabbing'
          : 'cursor-default'
      }`}
    >
      <svg
        id="canvas-bg"
        className="h-full w-full"
        style={{
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Dot Grid Pattern */}
          <pattern
            id="dot-grid"
            width={20 * zoom}
            height={20 * zoom}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}
          >
            <circle cx="1" cy="1" r="1" fill="#cbd5e1" className="dark:fill-slate-800" />
          </pattern>

          {/* Arrowhead marker */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
        </defs>

        {/* Background Grid Rect */}
        <rect width="100%" height="100%" fill="url(#dot-grid)" id="canvas-bg" />

        {/* Transformed Content Group */}
        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
          {/* Connectors */}
          {diagram.connectors.map((c) => (
            <ConnectorRenderer
              key={c.id}
              connector={c}
              sourceShape={shapeMap.get(c.sourceId)}
              targetShape={shapeMap.get(c.targetId)}
              isSelected={selectedConnectorIds.includes(c.id)}
              onSelect={(e) => {
                e.stopPropagation()
                selectConnector(c.id, e.shiftKey)
              }}
            />
          ))}

          {/* Active linking draft line */}
          {connectionStart && tempConnectionEnd && shapeMap.get(connectionStart.shapeId) && (
            <line
              x1={
                shapeMap.get(connectionStart.shapeId).x +
                shapeMap.get(connectionStart.shapeId).width / 2
              }
              y1={
                shapeMap.get(connectionStart.shapeId).y +
                shapeMap.get(connectionStart.shapeId).height / 2
              }
              x2={tempConnectionEnd.x}
              y2={tempConnectionEnd.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4,4"
              pointerEvents="none"
            />
          )}

          {/* Shapes */}
          {diagram.shapes.map((s) => (
            <ShapeRenderer
              key={s.id}
              shape={s}
              isSelected={selectedShapeIds.includes(s.id)}
              onSelect={(e) => handleShapeSelect(e, s.id)}
              onStartConnect={(anchor) => handleStartConnect(s.id, anchor)}
              onEndConnect={(anchor) => handleEndConnect(s.id, anchor)}
              onUpdateText={(text) => updateShape(s.id, { text })}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
