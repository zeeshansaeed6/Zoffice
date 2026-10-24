import React, { useState } from 'react'
import { X, Code, Copy, Check } from 'lucide-react'
import { generateEmbedCode } from '../core/embed-generator.js'
import { useFormStore } from '../core/form-store.js'

/**
 * Modal dialog to configure and generate HTML iframe embed code.
 */
export function EmbedModal() {
  const { form, isEmbedModalOpen, setEmbedModalOpen } = useFormStore()
  const [width, setWidth] = useState('100%')
  const [height, setHeight] = useState('700px')
  const [border, setBorder] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isEmbedModalOpen) return null

  const embedCode = generateEmbedCode({
    formId: form.id,
    title: form.title,
    width,
    height,
    border,
  })

  const handleCopy = () => {
    navigator.clipboard?.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="embed-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-indigo-600 dark:text-indigo-400" />
            <h2
              id="embed-modal-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-100"
            >
              Embed Form in Website
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setEmbedModalOpen(false)}
            className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          <p className="text-neutral-500 dark:text-neutral-400">
            Paste this HTML snippet into any website or portal to embed this form:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300">Width</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="font-medium text-neutral-700 dark:text-neutral-300">Height</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={border}
              onChange={(e) => setBorder(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Include container border & rounded corners
            </span>
          </label>

          <div className="relative">
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-2 flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setEmbedModalOpen(false)}
            className="rounded-lg bg-neutral-200 px-4 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
