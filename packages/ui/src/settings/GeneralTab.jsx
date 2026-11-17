import React from 'react'
import { useTheme } from '../theme/ThemeProvider.jsx'
import { SUPPORTED_LOCALES, getLocale, setLocale } from '@zoffice/core'
import { Sun, Moon, Eye, Monitor, Globe, ZoomIn } from 'lucide-react'

/**
 * General & Appearance Settings Tab.
 * @param {Object} props
 * @param {string} props.locale
 * @param {(loc: string) => void} props.onLocaleChange
 */
export function GeneralTab({ locale, onLocaleChange }) {
  const { theme, setTheme, uiScale, setUiScale } = useTheme()

  const THEMES = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'high-contrast', label: 'High Contrast', icon: Eye },
    { id: 'system', label: 'System', icon: Monitor },
  ]

  const SCALES = [
    { value: 1.0, label: '100% (Default)' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
    { value: 1.75, label: '175%' },
    { value: 2.0, label: '200%' },
  ]

  return (
    <div className="space-y-6">
      {/* Theme selection */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Interface Theme
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Select your visual appearance. High-contrast meets WCAG 2.1 AA accessibility guidelines.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEMES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition ${
                theme === id
                  ? 'border-blue-600 bg-blue-50/60 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* UI Scaling */}
      <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <ZoomIn className="h-4 w-4 text-neutral-500" />
          Display Scaling (Accessibility)
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Adjust the scale factor across the ribbon, tabs, menus, and controls (100% to 200%).
        </p>

        <div className="flex flex-wrap gap-2">
          {SCALES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setUiScale(value)}
              className={`rounded border px-3 py-1.5 text-xs font-medium transition ${
                uiScale === value
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          <Globe className="h-4 w-4 text-neutral-500" />
          Application Language & Layout
        </label>
        <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400">
          Change interface language. Urdu automatically switches editors and windows to
          Right-to-Left (RTL).
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUPPORTED_LOCALES.map((loc) => {
            const isSelected = (locale || getLocale()) === loc.code
            return (
              <button
                key={loc.code}
                type="button"
                onClick={() => {
                  setLocale(loc.code)
                  onLocaleChange(loc.code)
                }}
                className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
                }`}
              >
                <span className="text-xs font-semibold">{loc.nativeName}</span>
                <span className="text-[11px] text-neutral-400">{loc.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
