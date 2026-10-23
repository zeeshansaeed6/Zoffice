import React from 'react'

/**
 * Renders selection handles (8 resize corners/edges + 1 rotation pin).
 *
 * @param {Object} props
 * @param {Object} props.element - { x, y, width, height, rotation }
 * @param {(handle: string, e: React.MouseEvent) => void} props.onResizeStart
 * @param {(e: React.MouseEvent) => void} props.onRotateStart
 */
export function TransformHandle({ element, onResizeStart, onRotateStart }) {
  const handles = [
    { dir: 'nw', cursor: 'nwse-resize', x: 0, y: 0 },
    { dir: 'n', cursor: 'ns-resize', x: element.width / 2, y: 0 },
    { dir: 'ne', cursor: 'nesw-resize', x: element.width, y: 0 },
    { dir: 'e', cursor: 'ew-resize', x: element.width, y: element.height / 2 },
    { dir: 'se', cursor: 'nwse-resize', x: element.width, y: element.height },
    { dir: 's', cursor: 'ns-resize', x: element.width / 2, y: element.height },
    { dir: 'sw', cursor: 'nesw-resize', x: 0, y: element.height },
    { dir: 'w', cursor: 'ew-resize', x: 0, y: element.height / 2 },
  ]

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 border border-blue-500"
      style={{
        transform: `rotate(${element.rotation || 0}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {/* 8 Resize Pins */}
      {handles.map((h) => (
        <div
          key={h.dir}
          data-handle={h.dir}
          className="pointer-events-auto absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border border-blue-600 bg-white shadow-sm hover:scale-125"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            cursor: h.cursor,
          }}
          onMouseDown={(e) => onResizeStart(h.dir, e)}
        />
      ))}

      {/* Rotation Pin */}
      <div
        className="pointer-events-auto absolute -top-6 left-1/2 flex h-5 w-5 -translate-x-1/2 cursor-grab items-center justify-center rounded-full border border-blue-600 bg-white shadow-sm hover:scale-110 active:cursor-grabbing"
        onMouseDown={onRotateStart}
        title="Rotate"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      </div>
      {/* Line connecting element top to rotation handle */}
      <div className="pointer-events-none absolute -top-3.5 left-1/2 h-3.5 w-px -translate-x-1/2 bg-blue-500" />
    </div>
  )
}
