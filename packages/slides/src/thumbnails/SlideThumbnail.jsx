import React from 'react'
import { Copy, Trash2, Eye, EyeOff } from 'lucide-react'

/**
 * SlideThumbnail component rendering a single slide thumbnail card with action buttons.
 *
 * @param {Object} props
 * @param {Object} props.slide
 * @param {number} props.index
 * @param {boolean} props.isActive
 * @param {Object} props.dimensions
 * @param {() => void} props.onSelect
 * @param {() => void} props.onDuplicate
 * @param {() => void} props.onDelete
 * @param {() => void} props.onToggleHide
 * @param {(e: React.DragEvent) => void} props.onDragStart
 * @param {(e: React.DragEvent) => void} props.onDragOver
 * @param {(e: React.DragEvent) => void} props.onDrop
 */
export function SlideThumbnail({
  slide,
  index,
  isActive,
  dimensions = { width: 960, height: 540 },
  onSelect,
  onDuplicate,
  onDelete,
  onToggleHide,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const isHidden = !!slide.hidden
  const scale = 140 / dimensions.width
  const thumbHeight = dimensions.height * scale

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-testid={`slide-thumbnail-${slide.id}`}
      className={`group relative flex cursor-pointer flex-col gap-1 rounded-md border p-1.5 transition-all ${
        isActive
          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/20'
          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900'
      } ${isHidden ? 'opacity-40' : ''}`}
      onClick={onSelect}
    >
      {/* Header bar: Slide Index and Quick Actions */}
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-bold text-neutral-500">{index + 1}</span>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            title={isHidden ? 'Unhide slide' : 'Hide slide'}
            className="rounded p-0.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={(e) => {
              e.stopPropagation()
              onToggleHide()
            }}
          >
            {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
          <button
            type="button"
            title="Duplicate slide"
            className="rounded p-0.5 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
          >
            <Copy size={11} />
          </button>
          <button
            type="button"
            title="Delete slide"
            className="rounded p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Mini Slide Preview Canvas */}
      <div
        className="relative overflow-hidden rounded border border-neutral-100 bg-white shadow-inner dark:border-neutral-800 dark:bg-neutral-950"
        style={{ width: '140px', height: `${thumbHeight}px` }}
      >
        <div
          className="pointer-events-none absolute origin-top-left"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transform: `scale(${scale})`,
            background: slide.background?.color || '#ffffff',
          }}
        >
          {slide.elements.map((el) => {
            if (el.type === 'text') {
              return (
                <div
                  key={el.id}
                  className="absolute truncate"
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    fontSize: `${el.properties.fontSize || 20}px`,
                    color: el.properties.color || '#000000',
                    fontWeight: el.properties.bold ? 'bold' : 'normal',
                  }}
                >
                  {el.properties.text}
                </div>
              )
            }
            return (
              <div
                key={el.id}
                className="absolute rounded-sm"
                style={{
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  backgroundColor: el.properties.fill || '#3b82f6',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
