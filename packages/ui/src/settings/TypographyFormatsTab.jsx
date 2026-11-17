import React from 'react'
import { Type, FileText } from 'lucide-react'

const FONTS = [
  { id: 'Inter', name: 'Inter (Sans-Serif Modern)', sample: 'The quick brown fox jumps' },
  { id: 'Carlito', name: 'Carlito (Clean & Contemporary)', sample: 'The quick brown fox jumps' },
  {
    id: 'Liberation Sans',
    name: 'Liberation Sans (Universal)',
    sample: 'The quick brown fox jumps',
  },
]

const FONT_SIZES = [10, 11, 12, 14, 16]

const FORMAT_OPTIONS = {
  writer: [
    { ext: 'docx', label: 'Word Open XML Document (.docx)' },
    { ext: 'odt', label: 'OpenDocument Text (.odt)' },
    { ext: 'md', label: 'Markdown (.md)' },
    { ext: 'txt', label: 'Plain Text (.txt)' },
  ],
  sheets: [
    { ext: 'xlsx', label: 'Excel Open XML Spreadsheet (.xlsx)' },
    { ext: 'csv', label: 'Comma-Separated Values (.csv)' },
  ],
  slides: [
    { ext: 'pptx', label: 'PowerPoint Open XML Presentation (.pptx)' },
    { ext: 'odp', label: 'OpenDocument Presentation (.odp)' },
  ],
}

/**
 * Typography & File Format defaults tab.
 * @param {Object} props
 * @param {Object} props.settings
 * @param {(key: string, val: any) => void} props.onChange
 */
export function TypographyFormatsTab({ settings, onChange }) {
  return (
    <div className="space-y-6">
      {/* Default Font */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <Type className="h-4 w-4 text-neutral-500" />
          Default Document Font
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Applied automatically to newly created blank documents and notes.
        </p>

        <div className="space-y-2">
          {FONTS.map((font) => (
            <label
              key={font.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition ${
                (settings.default_font || 'Inter') === font.id
                  ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/40'
                  : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="default_font"
                  checked={(settings.default_font || 'Inter') === font.id}
                  onChange={() => onChange('default_font', font.id)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  {font.name}
                </span>
              </div>
              <span
                className="text-xs text-neutral-500 dark:text-neutral-400"
                style={{ fontFamily: font.id }}
              >
                {font.sample}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Default Font Size */}
      <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Default Font Size (Points)
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Standard paragraph size for document creation.
        </p>

        <div className="flex gap-2">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onChange('default_font_size', size)}
              className={`rounded border px-4 py-1.5 text-xs font-medium transition ${
                (settings.default_font_size || 11) === size
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'
              }`}
            >
              {size} pt
            </button>
          ))}
        </div>
      </div>

      {/* Default File Formats */}
      <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <FileText className="h-4 w-4 text-neutral-500" />
          Default File Formats
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Primary format selected by default when saving files.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              ZWriter (Documents)
            </span>
            <select
              value={settings.default_format_writer || 'docx'}
              onChange={(e) => onChange('default_format_writer', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {FORMAT_OPTIONS.writer.map((opt) => (
                <option key={opt.ext} value={opt.ext}>
                  .{opt.ext} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              ZSheets (Spreadsheets)
            </span>
            <select
              value={settings.default_format_sheets || 'xlsx'}
              onChange={(e) => onChange('default_format_sheets', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {FORMAT_OPTIONS.sheets.map((opt) => (
                <option key={opt.ext} value={opt.ext}>
                  .{opt.ext} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              ZSlides (Presentations)
            </span>
            <select
              value={settings.default_format_slides || 'pptx'}
              onChange={(e) => onChange('default_format_slides', e.target.value)}
              className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {FORMAT_OPTIONS.slides.map((opt) => (
                <option key={opt.ext} value={opt.ext}>
                  .{opt.ext} — {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
