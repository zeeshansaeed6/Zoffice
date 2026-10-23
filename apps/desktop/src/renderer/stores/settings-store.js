import { create } from 'zustand'
import { getSetting, setSetting } from '@zoffice/core'

/**
 * @typedef {Object} SettingsState
 * @property {boolean} loaded
 * @property {string} language
 * @property {boolean} autoSaveEnabled
 * @property {number} autoSaveInterval
 * @property {() => Promise<void>} loadSettings
 * @property {(key: string, value: any) => Promise<void>} updateSetting
 */

export const useSettingsStore = create(
  /** @type {import('zustand').StateCreator<SettingsState>} */ (
    (set) => ({
      loaded: false,
      language: 'en',
      autoSaveEnabled: true,
      autoSaveInterval: 30,

      loadSettings: async () => {
        const language = await getSetting('language', 'en')
        const autoSaveEnabled = await getSetting('auto_save_enabled', true)
        const autoSaveInterval = await getSetting('auto_save_interval', 30)

        set({
          loaded: true,
          language,
          autoSaveEnabled,
          autoSaveInterval,
        })
      },

      updateSetting: async (key, value) => {
        await setSetting(key, value)
        set((state) => ({ ...state, [key]: value }))
      },
    })
  ),
)
