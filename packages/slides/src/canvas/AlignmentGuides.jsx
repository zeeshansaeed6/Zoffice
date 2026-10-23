import React from 'react'

/**
 * Renders smart alignment guides (horizontal and vertical dotted/colored lines).
 *
 * @param {Object} props
 * @param {Array<{ orientation: 'horizontal'|'vertical', position: number }>} props.guides
 * @param {Object} props.slideBounds - { width, height }
 */
export function AlignmentGuides({ guides, slideBounds }) {
  if (!guides || guides.length === 0) return null

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30"
      width={slideBounds.width}
      height={slideBounds.height}
      viewBox={`0 0 ${slideBounds.width} ${slideBounds.height}`}
    >
      {guides.map((g, idx) => {
        if (g.orientation === 'vertical') {
          return (
            <line
              key={`guide-v-${idx}-${g.position}`}
              x1={g.position}
              y1={0}
              x2={g.position}
              y2={slideBounds.height}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          )
        }
        return (
          <line
            key={`guide-h-${idx}-${g.position}`}
            x1={0}
            y1={g.position}
            x2={slideBounds.width}
            y2={g.position}
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )
      })}
    </svg>
  )
}
