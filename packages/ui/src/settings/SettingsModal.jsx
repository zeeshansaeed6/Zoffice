import React, { useState, useEffect } from 'react'
import { Palette, Type, Save, Puzzle, ShieldCheck, X } from 'lucide-react'
import { getSetting, setSetting, getLocale } from '@zoffice/core'
import { GeneralTab } from './GeneralTab.jsx'
import { TypographyFormatsTab } from './TypographyFormatsTab.jsx'
import { AutosaveSpellcheckTab } from './AutosaveSpellcheckTab.jsx'
import { PluginsTab } from './PluginsTab.jsx'
import { PrivacyTab } from './PrivacyTab.jsx'

/**
 * Centralized Settings Center Modal for Zoffice.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.initialTab='general']
 */
export function SettingsModal({ isOpen, onClose, initialTab = 'general' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [locale, setLocale] = useState(getLocale())
  const [settings, setSettings] = useState({
    default_font: 'Inter',
    default_font_size: 11,
    default_format_writer: 'docx',
    default_format_sheets: 'xlsx',
    default_format_slides: 'pptx',
    autosave_interval: 30000,
    spellcheck_enabled: true,
    spellcheck_lang: 'en-US',
  })

  useEffect(() => {
    if (!isOpen) return
    async function load() {
      const keys = [
        'default_font',
        'default_font_size',
        'default_format_writer',
        'default_format_sheets',
        'default_format_slides',
        'autosave_interval',
        'spellcheck_enabled',
        'spellcheck_lang',
      ]
      const loaded = {}
      for (const k of keys) {
        const val = await getSetting(k)
        if (val !== undefined) loaded[k] = val
      }
      setSettings((prev) => ({ ...prev, ...loaded }))
    }
    load()
  }, [isOpen])

  const handleSettingChange = async (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
    await setSetting(key, val)
  }

  if (!isOpen) return null

  const TABS = [
    { id: 'general', label: 'General & Appearance', icon: Palette },
    { id: 'typography', label: 'Typography & Formats', icon: Type },
    { id: 'editing', label: 'Autosave & Spellcheck', icon: Save },
    { id: 'plugins', label: 'Plugin Manager', icon: Puzzle },
    { id: 'privacy', label: 'Privacy & Sovereignty', icon: ShieldCheck },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-center-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-[600px] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              Z
            </span>
            <h2
              id="settings-center-title"
              className="text-lg font-bold text-neutral-900 dark:text-neutral-100"
            >
              Settings Center
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <nav
            aria-label="Settings Categories"
            className="w-56 border-r border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/40"
          >
            <div className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                    activeTab === id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <GeneralTab locale={locale} onLocaleChange={(l) => setLocale(l)} />
            )}
            {activeTab === 'typography' && (
              <TypographyFormatsTab settings={settings} onChange={handleSettingChange} />
            )}
            {activeTab === 'editing' && (
              <AutosaveSpellcheckTab settings={settings} onChange={handleSettingChange} />
            )}
            {activeTab === 'plugins' && <PluginsTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <span className="text-[11px] text-neutral-400">
            Zoffice v1.0.0 • Settings auto-save immediately
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
