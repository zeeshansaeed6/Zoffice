import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'

const SYMBOL_CATEGORIES = {
  Typography: ['©', '®', '™', '§', '¶', '•', '…', '–', '—', '“', '”', '‘', '’', '«', '»', '†', '‡'],
  Math: [
    '±',
    '×',
    '÷',
    '≠',
    '≈',
    '≤',
    '≥',
    '∞',
    '√',
    '∑',
    '∫',
    '∆',
    '∏',
    '∂',
    '∅',
    '∈',
    '∉',
    '∠',
    '°',
  ],
  Currency: ['$', '€', '£', '¥', '₹', '₽', '₩', '¢', '₿'],
  Arrows: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇔'],
  Greek: ['α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'τ', 'φ', 'ω', 'Ω', 'Δ', 'Σ'],
}

/**
 * Dialog for selecting and inserting special character symbols.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(symbol: string) => void} props.onInsert
 */
export function SymbolDialog({ isOpen, onClose, onInsert }) {
  const [activeCategory, setActiveCategory] = useState('Typography')

  const handleSelectSymbol = (sym) => {
    onInsert(sym)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Symbol"
      size="sm"
      footer={
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-neutral-200 pb-2 dark:border-neutral-700">
          {Object.keys(SYMBOL_CATEGORIES).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Symbols Grid */}
        <div className="grid grid-cols-6 gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900">
          {SYMBOL_CATEGORIES[activeCategory].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => handleSelectSymbol(sym)}
              className="flex h-10 items-center justify-center rounded border border-neutral-200 bg-white text-base font-semibold transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              title={`Insert ${sym}`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
