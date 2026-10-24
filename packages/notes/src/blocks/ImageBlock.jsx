/**
 * ZNotes image block — display and upload images.
 */

import React, { useMemo, useCallback, useRef } from 'react'
import { ImagePlus } from 'lucide-react'

/**
 * Image block with upload and display.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function ImageBlock({ block, isActive, onUpdate }) {
  const fileRef = useRef(null)

  const data = useMemo(() => {
    try {
      return JSON.parse(block.content)
    } catch {
      return { src: '', alt: '' }
    }
  }, [block.content])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      onUpdate({
        content: JSON.stringify({
          src: ev.target.result,
          alt: file.name,
        }),
      })
    }
    reader.readAsDataURL(file)
  }, [onUpdate])

  const handleAltChange = useCallback((e) => {
    onUpdate({
      content: JSON.stringify({ ...data, alt: e.target.value }),
    })
  }, [data, onUpdate])

  if (!data.src) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 p-6 dark:border-neutral-700"
        data-testid="image-block"
      >
        <ImagePlus size={24} className="mb-2 text-neutral-400" />
        <p className="mb-2 text-xs text-neutral-500">Click to add an image</p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700"
        >
          Choose File
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="p-1" data-testid="image-block">
      <img
        src={data.src}
        alt={data.alt}
        className="max-w-full rounded"
        draggable={false}
      />
      {isActive && (
        <input
          type="text"
          value={data.alt}
          onChange={handleAltChange}
          placeholder="Alt text..."
          className="mt-1 w-full rounded border border-neutral-200 bg-transparent px-2 py-0.5 text-[10px] text-neutral-500 outline-none dark:border-neutral-700"
        />
      )}
    </div>
  )
}
