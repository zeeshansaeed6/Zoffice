import React, { useState, useMemo } from 'react'
import { Dialog } from '@zoffice/ui'
import katex from 'katex'

const QUICK_SNIPPETS = [
  { label: 'Fraction', latex: '\\frac{a}{b}' },
  { label: 'Square Root', latex: '\\sqrt{x}' },
  { label: 'Superscript', latex: 'x^{2}' },
  { label: 'Subscript', latex: 'x_{i}' },
  { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
  { label: 'Integral', latex: '\\int_{a}^{b} f(x) dx' },
  { label: 'Greek π', latex: '\\pi' },
  { label: 'Greek α', latex: '\\alpha' },
  { label: 'Greek θ', latex: '\\theta' },
  { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
]

/**
 * Dialog for typing LaTeX equations with real-time KaTeX rendering.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(latex: string) => void} props.onInsert
 */
export function EquationDialog({ isOpen, onClose, onInsert }) {
  const [latex, setLatex] = useState('E = mc^2')

  const previewHtml = useMemo(() => {
    try {
      return katex.renderToString(latex || '...', {
        throwOnError: false,
        displayMode: true,
      })
    } catch (err) {
      return `<span class="text-red-500 font-mono text-xs">${err.message}</span>`
    }
  }, [latex])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!latex.trim()) return
    onInsert(latex.trim())
    onClose()
  }

  const handleSnippetClick = (snippetLatex) => {
    setLatex((prev) => (prev ? `${prev} ${snippetLatex}` : snippetLatex))
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert LaTeX Equation"
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
            disabled={!latex.trim()}
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Insert Equation
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick math symbol templates */}
        <div>
          <span className="mb-1.5 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Quick Templates:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SNIPPETS.map((snip) => (
              <button
                key={snip.label}
                type="button"
                onClick={() => handleSnippetClick(snip.latex)}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>

        {/* LaTeX formula input */}
        <div>
          <label
            htmlFor="equation-latex-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            LaTeX Formula
          </label>
          <textarea
            id="equation-latex-input"
            rows={3}
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="e.g. \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
            autoFocus
            className="w-full rounded border border-neutral-300 p-2 font-mono text-xs outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        {/* Live KaTeX Math Preview */}
        <div>
          <span className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Live Preview
          </span>
          <div
            className="flex min-h-16 items-center justify-center overflow-x-auto rounded-md border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </form>
    </Dialog>
  )
}
