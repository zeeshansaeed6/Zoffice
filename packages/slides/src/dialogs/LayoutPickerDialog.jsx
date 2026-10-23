import React from 'react'
import { Dialog } from '@zoffice/ui'
import { LAYOUT_TYPES } from '../core/slide-layouts.js'

const LAYOUT_OPTIONS = [
  { id: LAYOUT_TYPES.TITLE, name: 'Title Slide', desc: 'Main title & subtitle' },
  {
    id: LAYOUT_TYPES.TITLE_AND_CONTENT,
    name: 'Title and Content',
    desc: 'Heading with bullet list',
  },
  { id: LAYOUT_TYPES.SECTION_HEADER, name: 'Section Header', desc: 'Section divider' },
  { id: LAYOUT_TYPES.TWO_CONTENT, name: 'Two Content', desc: 'Side-by-side columns' },
  { id: LAYOUT_TYPES.COMPARISON, name: 'Comparison', desc: 'Headers & comparison columns' },
  { id: LAYOUT_TYPES.TITLE_ONLY, name: 'Title Only', desc: 'Heading with open canvas' },
  { id: LAYOUT_TYPES.BLANK, name: 'Blank', desc: 'Empty canvas' },
]

/**
 * LayoutPickerDialog for choosing a slide layout.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(layoutType: string) => void} props.onSelectLayout
 */
export function LayoutPickerDialog({ isOpen, onClose, onSelectLayout }) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onClose={onClose} title="Choose Slide Layout">
      <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 p-3 text-center transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:shadow dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={() => {
              onSelectLayout(opt.id)
              onClose()
            }}
          >
            {/* Visual thumbnail mockup */}
            <div className="shadow-xs flex h-16 w-24 flex-col items-center justify-center rounded border border-neutral-300 bg-white p-1 dark:border-neutral-600 dark:bg-neutral-900">
              {opt.id === LAYOUT_TYPES.TITLE && (
                <div className="flex flex-col items-center gap-1">
                  <div className="h-2 w-16 rounded bg-neutral-400" />
                  <div className="h-1.5 w-10 rounded bg-neutral-300" />
                </div>
              )}
              {opt.id === LAYOUT_TYPES.TITLE_AND_CONTENT && (
                <div className="flex h-full w-full flex-col gap-1 p-0.5">
                  <div className="h-1.5 w-12 rounded bg-neutral-400" />
                  <div className="flex-1 rounded border border-dashed border-neutral-300" />
                </div>
              )}
              {opt.id === LAYOUT_TYPES.TWO_CONTENT && (
                <div className="flex h-full w-full flex-col gap-1 p-0.5">
                  <div className="h-1.5 w-12 rounded bg-neutral-400" />
                  <div className="flex flex-1 gap-1">
                    <div className="flex-1 rounded border border-dashed border-neutral-300" />
                    <div className="flex-1 rounded border border-dashed border-neutral-300" />
                  </div>
                </div>
              )}
              {opt.id === LAYOUT_TYPES.BLANK && (
                <div className="text-[10px] text-neutral-400">Blank</div>
              )}
              {opt.id !== LAYOUT_TYPES.TITLE &&
                opt.id !== LAYOUT_TYPES.TITLE_AND_CONTENT &&
                opt.id !== LAYOUT_TYPES.TWO_CONTENT &&
                opt.id !== LAYOUT_TYPES.BLANK && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-1.5 w-14 rounded bg-neutral-400" />
                    <div className="w-18 h-6 rounded border border-dashed border-neutral-300" />
                  </div>
                )}
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {opt.name}
              </div>
              <div className="text-[10px] text-neutral-500">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </Dialog>
  )
}
