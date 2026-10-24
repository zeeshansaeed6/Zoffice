import React from 'react'
import { Save, CheckCheck } from 'lucide-react'

const INTERVALS = [
  { value: 30000, label: '30 seconds (Recommended)' },
  { value: 60000, label: '1 minute' },
  { value: 120000, label: '2 minutes' },
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
  { value: 0, label: 'Disabled (Manual save only)' },
]

const SPELLCHECK_LANGS = [
  { code: 'en-US', name: 'English (United States)' },
  { code: 'en-GB', name: 'English (United Kingdom)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
]

/**
 * Autosave & Spellcheck settings tab.
 * @param {Object} props
 * @param {Object} props.settings
 * @param {(key: string, val: any) => void} props.onChange
 */
export function AutosaveSpellcheckTab({ settings, onChange }) {
  const currentInterval = settings.autosave_interval !== undefined ? settings.autosave_interval : 30000
  const spellcheckEnabled = settings.spellcheck_enabled !== undefined ? settings.spellcheck_enabled : true
  const currentSpellLang = settings.spellcheck_lang || 'en-US'

  return (
    <div className="space-y-6">
      {/* Autosave Interval */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <Save className="h-4 w-4 text-neutral-500" />
          Background Autosave Interval
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Unsaved edits are continuously preserved to local SQLite storage to prevent data loss in
          the event of unexpected shutdown.
        </p>

        <div className="space-y-2">
          {INTERVALS.map((item) => (
            <label
              key={item.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                currentInterval === item.value
                  ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/40'
                  : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
              }`}
            >
              <input
                type="radio"
                name="autosave_interval"
                checked={currentInterval === item.value}
                onChange={() => onChange('autosave_interval', item.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Spellcheck Configuration */}
      <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <CheckCheck className="h-4 w-4 text-neutral-500" />
          Spellcheck & Writing Assistance
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Offline dictionary verification across word processing and note taking.
        </p>

        <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
          <div>
            <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
              Highlight misspelled words as you type
            </div>
            <div className="text-[11px] text-neutral-500">
              Underlines potential typos with red squiggly lines in active editors.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('spellcheck_enabled', !spellcheckEnabled)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              spellcheckEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                spellcheckEnabled ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Dictionary Language
          </span>
          <select
            disabled={!spellcheckEnabled}
            value={currentSpellLang}
            onChange={(e) => onChange('spellcheck_lang', e.target.value)}
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {SPELLCHECK_LANGS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
