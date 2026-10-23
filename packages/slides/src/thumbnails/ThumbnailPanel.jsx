import React, { useState } from 'react'
import { SlideThumbnail } from './SlideThumbnail.jsx'

/**
 * ThumbnailPanel rendering slide list with drag-to-reorder, duplicate, delete, and hide.
 *
 * @param {Object} props
 * @param {Array<Object>} props.slides
 * @param {string} props.activeSlideId
 * @param {Object} props.dimensions
 * @param {(slideId: string) => void} props.onSelectSlide
 * @param {(slideId: string) => void} props.onDuplicateSlide
 * @param {(slideId: string) => void} props.onDeleteSlide
 * @param {(slideId: string) => void} props.onToggleHideSlide
 * @param {(fromIndex: number, toIndex: number) => void} props.onReorderSlides
 */
export function ThumbnailPanel({
  slides,
  activeSlideId,
  dimensions,
  onSelectSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onToggleHideSlide,
  onReorderSlides,
}) {
  const [draggedIdx, setDraggedIdx] = useState(null)

  return (
    <div
      data-testid="slides-thumbnail-panel"
      className="flex w-48 select-none flex-col gap-2.5 overflow-y-auto border-r border-neutral-200 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {slides.map((s, idx) => (
        <SlideThumbnail
          key={s.id}
          slide={s}
          index={idx}
          isActive={s.id === activeSlideId}
          dimensions={dimensions}
          onSelect={() => onSelectSlide(s.id)}
          onDuplicate={() => onDuplicateSlide(s.id)}
          onDelete={() => onDeleteSlide(s.id)}
          onToggleHide={() => onToggleHideSlide(s.id)}
          onDragStart={(e) => {
            setDraggedIdx(idx)
            e.dataTransfer.effectAllowed = 'move'
          }}
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
          }}
          onDrop={(e) => {
            e.preventDefault()
            if (draggedIdx !== null && draggedIdx !== idx) {
              onReorderSlides(draggedIdx, idx)
            }
            setDraggedIdx(null)
          }}
        />
      ))}
    </div>
  )
}
