import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

/**
 * Dialog for inserting images from local file or web URL.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(options: Object) => void} props.onInsert
 */
export function ImageInsertDialog({ isOpen, onClose, onInsert }) {
  const [sourceType, setSourceType] = useState('file') // 'file' | 'url'
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const [width, setWidth] = useState('')
  const [alignment, setAlignment] = useState('center')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setSrc(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!src) return
    onInsert({
      src,
      alt,
      width: width ? `${width}px` : null,
      alignment,
    })
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Picture"
      size="md"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!src}
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Insert Picture
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source tab selector */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => setSourceType('file')}
            className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
              sourceType === 'file'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            Upload from Computer
          </button>
          <button
            type="button"
            onClick={() => setSourceType('url')}
            className={`-mb-px border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
              sourceType === 'url'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            Image URL
          </button>
        </div>

        {sourceType === 'file' ? (
          <div>
            <label
              htmlFor="image-file-input"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Choose image file
            </label>
            <input
              id="image-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-neutral-600 file:mr-2 file:rounded file:border file:border-neutral-300 file:bg-neutral-50 file:px-2 file:py-1 file:text-xs dark:text-neutral-400 dark:file:border-neutral-700 dark:file:bg-neutral-800"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="image-url-input"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Image Web Address (URL)
            </label>
            <input
              id="image-url-input"
              type="url"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        )}

        {src && (
          <div className="flex max-h-40 justify-center overflow-hidden rounded bg-neutral-100 p-2 dark:bg-neutral-800">
            <img src={src} alt="Preview" className="max-h-36 rounded object-contain" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="image-alt-input"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Alt description
            </label>
            <input
              id="image-alt-input"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Optional description"
              className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
          <div>
            <label
              htmlFor="image-align-select"
              className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              Alignment
            </label>
            <select
              id="image-align-select"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full rounded border border-neutral-300 px-2 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="image-width-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Custom width (pixels, optional)
          </label>
          <input
            id="image-width-input"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g. 400"
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-xs outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </form>
    </Dialog>
  )
}
