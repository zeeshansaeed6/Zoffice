/**
 * CustomShapeModal — dialog to create custom diagram shapes from SVG paths.
 * @module CustomShapeModal
 */

import React, { useState } from 'react'
import { X, Code2, AlertCircle } from 'lucide-react'
import { useDrawStore } from '../core/draw-store.js'

export function CustomShapeModal() {
  const { isCustomShapeModalOpen, setIsCustomShapeModalOpen, addShape } = useDrawStore()
  const [name, setName] = useState('Custom Path')
  const [svgPath, setSvgPath] = useState('M 10 80 Q 52.5 10, 95 80 T 180 80')
  const [error, setError] = useState('')

  if (!isCustomShapeModalOpen) return null

  const handleCreate = (e) => {
    e.preventDefault()
    if (!svgPath.trim()) {
      setError('Please provide an SVG path d attribute.')
      return
    }

    addShape('custom', 250, 200, {
      text: name.trim() || 'Custom Shape',
      customSvgPath: svgPath.trim(),
      width: 140,
      height: 90,
      fill: '#f0fdf4',
      stroke: '#16a34a',
    })

    setIsCustomShapeModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Create Custom Shape
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCustomShapeModalOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="space-y-4 p-6 text-xs">
          <p className="leading-relaxed text-slate-500">
            Create a custom reusable shape by providing an SVG path definition.
          </p>

          <div>
            <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Shape Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-300 bg-slate-50 p-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="e.g. Wave Divider"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              SVG Path (d attribute)
            </label>
            <textarea
              rows={4}
              value={svgPath}
              onChange={(e) => {
                setSvgPath(e.target.value)
                setError('')
              }}
              className="focus:outline-hidden w-full rounded border border-slate-300 bg-slate-50 p-2 font-mono text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="M 0 0 L 100 0 L 50 100 Z"
            />
          </div>

          {/* Live Preview */}
          <div>
            <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Preview
            </label>
            <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/40">
              <svg className="h-20 w-32" viewBox="0 0 200 120">
                <path d={svgPath} fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-2 text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCustomShapeModalOpen(false)}
              className="rounded px-4 py-1.5 text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
            >
              Add to Diagram
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
