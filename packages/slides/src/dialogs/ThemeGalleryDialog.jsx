import React from 'react'
import { Dialog } from '@zoffice/ui'
import { SLIDE_THEMES } from '../core/theme-definitions.js'

/**
 * ThemeGalleryDialog presents 12 curated themes with color previews and font pairings.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.currentThemeId
 * @param {() => void} props.onClose
 * @param {(themeId: string) => void} props.onSelectTheme
 */
export function ThemeGalleryDialog({ isOpen, currentThemeId, onClose, onSelectTheme }) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onClose={onClose} title="Theme Gallery">
      <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3 md:grid-cols-4">
        {SLIDE_THEMES.map((theme) => {
          const isSelected = theme.id === currentThemeId
          return (
            <button
              key={theme.id}
              type="button"
              data-testid={`theme-card-${theme.id}`}
              className={`flex flex-col gap-2 rounded-lg border p-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/30 dark:border-blue-500 dark:bg-blue-950/20'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800'
              }`}
              onClick={() => {
                onSelectTheme(theme.id)
                onClose()
              }}
            >
              {/* Visual mini slide card */}
              <div
                className="shadow-xs relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded border border-black/10 p-2"
                style={{ backgroundColor: theme.background }}
              >
                <div>
                  <div
                    className="truncate text-[10px] font-bold"
                    style={{ color: theme.textPrimary, fontFamily: theme.fontHeading }}
                  >
                    {theme.name}
                  </div>
                  <div
                    className="truncate text-[8px]"
                    style={{ color: theme.textSecondary, fontFamily: theme.fontBody }}
                  >
                    Aa Bb Cc
                  </div>
                </div>

                {/* Color swatches bar */}
                <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded">
                  <div className="flex-1" style={{ backgroundColor: theme.primary }} />
                  <div className="flex-1" style={{ backgroundColor: theme.secondary }} />
                  <div className="flex-1" style={{ backgroundColor: theme.accent }} />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {theme.name}
                </div>
                <div className="truncate text-[10px] text-neutral-500">
                  {theme.fontHeading.split(',')[0]}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </Dialog>
  )
}
