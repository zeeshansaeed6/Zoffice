import React, { useRef, useState, useCallback, useEffect } from 'react'
import { SlideElement } from './SlideElement.jsx'
import { TransformHandle } from './TransformHandle.jsx'
import { AlignmentGuides } from './AlignmentGuides.jsx'
import { computeSnapGuides, computeResize } from '../core/geometry-utils.js'

/**
 * SlideCanvas component rendering the paper-like presentation slide with transforms,
 * selection, dragging, resizing, rotation, and alignment snapping.
 *
 * @param {Object} props
 * @param {Object} props.slide - Active slide model
 * @param {Object} props.dimensions - { width, height }
 * @param {number} props.zoom - Percentage (e.g. 100)
 * @param {Array<string>} props.selectedElementIds
 * @param {(ids: Array<string>) => void} props.onSelectionChange
 * @param {(updatedElement: Object) => void} props.onElementChange
 * @param {(elementIds: Array<string>) => void} props.onDeleteElements
 */
export function SlideCanvas({
  slide,
  dimensions = { width: 960, height: 540 },
  zoom = 100,
  selectedElementIds = [],
  onSelectionChange,
  onElementChange,
  onDeleteElements,
}) {
  const containerRef = useRef(null)
  const [guides, setGuides] = useState([])
  const [dragState, setDragState] = useState(null)

  const scale = zoom / 100
  const activeElement = slide.elements.find((el) => selectedElementIds.includes(el.id))

  // Keyboard navigation & deletion (Delete, Backspace, Arrow keys for nudging)
  const handleKeyDown = useCallback(
    (e) => {
      if (selectedElementIds.length === 0) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        onDeleteElements(selectedElementIds)
        e.preventDefault()
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const step = e.shiftKey ? 10 : 1
        const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0
        const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0

        slide.elements
          .filter((el) => selectedElementIds.includes(el.id))
          .forEach((el) => {
            onElementChange({
              ...el,
              x: el.x + dx,
              y: el.y + dy,
            })
          })
        e.preventDefault()
      }
    },
    [selectedElementIds, slide.elements, onDeleteElements, onElementChange],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Mouse move handler for element dragging, resizing, and rotation
  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState) return

      const dx = (e.clientX - dragState.startX) / scale
      const dy = (e.clientY - dragState.startY) / scale

      if (dragState.type === 'move') {
        const otherElems = slide.elements.filter((el) => el.id !== dragState.element.id)
        const newCoords = computeSnapGuides(
          {
            ...dragState.element,
            x: dragState.initialX + dx,
            y: dragState.initialY + dy,
          },
          otherElems,
          dimensions,
        )

        setGuides(newCoords.guides)
        onElementChange({
          ...dragState.element,
          x: Math.round(newCoords.x),
          y: Math.round(newCoords.y),
        })
      } else if (dragState.type === 'resize') {
        const resized = computeResize(dragState.initialRect, dragState.handle, dx, dy, e.shiftKey)
        onElementChange({
          ...dragState.element,
          x: Math.round(resized.x),
          y: Math.round(resized.y),
          width: Math.round(resized.width),
          height: Math.round(resized.height),
        })
      } else if (dragState.type === 'rotate') {
        const cx = dragState.initialRect.x + dragState.initialRect.width / 2
        const cy = dragState.initialRect.y + dragState.initialRect.height / 2
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = (e.clientX - rect.left) / scale
        const mouseY = (e.clientY - rect.top) / scale
        const angleRad = Math.atan2(mouseY - cy, mouseX - cx)
        let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90
        if (e.shiftKey) angleDeg = Math.round(angleDeg / 15) * 15 // Snap 15 deg
        onElementChange({
          ...dragState.element,
          rotation: angleDeg,
        })
      }
    },
    [dragState, scale, slide.elements, dimensions, onElementChange],
  )

  const handleMouseUp = useCallback(() => {
    setDragState(null)
    setGuides([])
  }, [])

  return (
    <div
      data-testid="slides-canvas-container"
      className="relative flex flex-1 select-none items-center justify-center overflow-auto bg-neutral-200 p-8 dark:bg-neutral-900"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget || e.target.getAttribute('data-canvas-bg')) {
          onSelectionChange([])
        }
      }}
    >
      {/* Visual Slide Surface */}
      <div
        ref={containerRef}
        data-canvas-bg="true"
        data-testid="slide-canvas-surface"
        className="relative bg-white shadow-2xl transition-transform duration-75"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          background: slide.background?.color || '#ffffff',
        }}
      >
        {/* Render slide elements */}
        {slide.elements.map((el) => {
          const isSelected = selectedElementIds.includes(el.id)
          return (
            <React.Fragment key={el.id}>
              <SlideElement
                element={el}
                isSelected={isSelected}
                onTextChange={(newText) => {
                  onElementChange({
                    ...el,
                    properties: { ...el.properties, text: newText },
                  })
                }}
                onTableChange={(newData) => {
                  onElementChange({
                    ...el,
                    properties: { ...el.properties, data: newData },
                  })
                }}
                onSelect={(e) => {
                  e.stopPropagation()
                  const isMulti = e.shiftKey || e.ctrlKey || e.metaKey
                  if (isMulti) {
                    onSelectionChange(
                      isSelected
                        ? selectedElementIds.filter((id) => id !== el.id)
                        : [...selectedElementIds, el.id],
                    )
                  } else {
                    onSelectionChange([el.id])
                  }

                  // Start move drag
                  setDragState({
                    type: 'move',
                    element: el,
                    startX: e.clientX,
                    startY: e.clientY,
                    initialX: el.x,
                    initialY: el.y,
                  })
                }}
              />
            </React.Fragment>
          )
        })}

        {/* Selected element transform handle overlay */}
        {activeElement && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${activeElement.x}px`,
              top: `${activeElement.y}px`,
              width: `${activeElement.width}px`,
              height: `${activeElement.height}px`,
            }}
          >
            <TransformHandle
              element={activeElement}
              onResizeStart={(handle, e) => {
                e.stopPropagation()
                setDragState({
                  type: 'resize',
                  handle,
                  element: activeElement,
                  startX: e.clientX,
                  startY: e.clientY,
                  initialRect: {
                    x: activeElement.x,
                    y: activeElement.y,
                    width: activeElement.width,
                    height: activeElement.height,
                  },
                })
              }}
              onRotateStart={(e) => {
                e.stopPropagation()
                setDragState({
                  type: 'rotate',
                  element: activeElement,
                  initialRect: {
                    x: activeElement.x,
                    y: activeElement.y,
                    width: activeElement.width,
                    height: activeElement.height,
                  },
                })
              }}
            />
          </div>
        )}

        {/* Alignment Smart Guides */}
        <AlignmentGuides guides={guides} slideBounds={dimensions} />
      </div>
    </div>
  )
}
