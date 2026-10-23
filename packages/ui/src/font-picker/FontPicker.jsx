import React from 'react'

/**
 * Open-source font families bundled and allowed in Zoffice.
 * Strictly open fonts (Inter, Carlito, Liberation Sans, etc.) — NO Microsoft fonts.
 */
export const ALLOWED_FONTS = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'carlito', name: 'Carlito', family: 'Carlito, sans-serif' },
  { id: 'liberation', name: 'Liberation Sans', family: '"Liberation Sans", sans-serif' },
  { id: 'monospace', name: 'Monospace', family: 'monospace' },
]

export const FONT_SIZES = [
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '28',
  '32',
  '36',
  '48',
  '72',
]

/**
 * Font picker dropdown for family and size.
 *
 * @param {Object} props
 * @param {string} props.fontFamily
 * @param {string} props.fontSize
 * @param {(font: string) => void} props.onFontChange
 * @param {(size: string) => void} props.onSizeChange
 */
export function FontPicker({
  fontFamily = 'Inter, sans-serif',
  fontSize = '11',
  onFontChange,
  onSizeChange,
}) {
  return (
    <div className="flex items-center gap-1">
      <select
        value={fontFamily}
        onChange={(e) => onFontChange(e.target.value)}
        aria-label="Font family"
        className="h-6 w-28 rounded border border-neutral-300 bg-white px-1 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
      >
        {ALLOWED_FONTS.map((font) => (
          <option key={font.id} value={font.family} style={{ fontFamily: font.family }}>
            {font.name}
          </option>
        ))}
      </select>

      <select
        value={fontSize}
        onChange={(e) => onSizeChange(e.target.value)}
        aria-label="Font size"
        className="h-6 w-12 rounded border border-neutral-300 bg-white px-1 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}
