import React from 'react'

/**
 * ImageElement renders an image with opacity, border radius, and object-fit.
 *
 * @param {Object} props
 * @param {Object} props.element
 */
export function ImageElement({ element }) {
  const { properties = {} } = element
  const {
    src = '',
    alt = 'Slide Image',
    opacity = 1,
    borderRadius = 0,
    objectFit = 'contain',
  } = properties

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-neutral-300 bg-neutral-100 p-2 text-xs text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
        No image source
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className="h-full w-full select-none"
      style={{
        opacity,
        borderRadius: `${borderRadius}px`,
        objectFit,
      }}
    />
  )
}
