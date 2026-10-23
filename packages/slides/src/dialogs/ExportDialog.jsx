import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'
import { Printer, FileDown, Layers, FileText } from 'lucide-react'
import { printHandouts, exportSlideAsSvgString, downloadBlob } from '../core/export-utils.js'

const HANDOUT_LAYOUTS = [
  { id: '1', label: '1 Slide / Page', desc: 'Full page presentation slides' },
  { id: '2', label: '2 Slides / Page', desc: 'Stacked slides with margins' },
  { id: '3', label: '3 Slides / Page', desc: 'Slides on left, ruled note lines on right' },
  { id: '4', label: '4 Slides / Page', desc: '2x2 grid handout' },
  { id: '6', label: '6 Slides / Page', desc: '2x3 grid handout' },
  { id: 'notes', label: 'Notes Pages', desc: 'Slide preview with speaker notes' },
]

/**
 * Export and Print Handouts modal dialog for ZSlides.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {Array<Object>} props.slides
 * @param {Object} [props.deck]
 * @param {() => void} [props.onExportPptx]
 */
export function ExportDialog({ isOpen, onClose, slides = [], onExportPptx }) {
  const [activeTab, setActiveTab] = useState('handouts') // 'handouts' | 'export'
  const [selectedLayout, setSelectedLayout] = useState('3')
  const [includeSlideNumbers, setIncludeSlideNumbers] = useState(true)

  if (!isOpen) return null

  const handlePrint = () => {
    printHandouts({
      slides,
      slidesPerPage: selectedLayout,
      includeSlideNumbers,
      title: 'Zoffice Presentation Handouts',
    })
    onClose()
  }

  const handleExportSvg = () => {
    const activeSlide = slides[0] || {}
    const svgStr = exportSlideAsSvgString(activeSlide)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    downloadBlob(blob, 'slide-1.svg')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} title="Export & Print Handouts">
      <div className="flex w-[520px] max-w-full flex-col gap-4 p-2 text-neutral-800 dark:text-neutral-200">
        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'handouts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
            onClick={() => setActiveTab('handouts')}
          >
            <Printer size={16} />
            Print Handouts
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
            onClick={() => setActiveTab('export')}
          >
            <FileDown size={16} />
            Export Deck
          </button>
        </div>

        {/* Handouts Tab Content */}
        {activeTab === 'handouts' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Select Handout Layout
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HANDOUT_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`flex flex-col rounded-lg border p-2.5 text-left transition-all ${
                    selectedLayout === layout.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm dark:border-blue-400 dark:bg-neutral-800'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800/50'
                  }`}
                >
                  <span className="text-sm font-semibold">{layout.label}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {layout.desc}
                  </span>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 pt-1 text-sm">
              <input
                type="checkbox"
                checked={includeSlideNumbers}
                onChange={(e) => setIncludeSlideNumbers(e.target.checked)}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Include slide numbers</span>
            </label>

            <div className="mt-3 flex justify-end gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
              >
                <Printer size={15} />
                Open Print View
              </button>
            </div>
          </div>
        )}

        {/* Export Tab Content */}
        {activeTab === 'export' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">PowerPoint Presentation (.pptx)</h4>
                    <p className="text-xs text-neutral-500">
                      Standard editable presentation file with formatting, charts & shapes.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onExportPptx?.()
                    onClose()
                  }}
                  className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Download .pptx
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Slide Image (.svg)</h4>
                    <p className="text-xs text-neutral-500">
                      High fidelity vector image of the active slide.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportSvg}
                  className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Download SVG
                </button>
              </div>
            </div>

            <div className="mt-3 flex justify-end border-t border-neutral-200 pt-3 dark:border-neutral-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
