/**
 * Get a setting value by key.
 * @template T
 * @param {string} key
 * @param {T} [defaultValue]
 * @returns {Promise<T>}
 */
export async function getSetting(key, defaultValue) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.settings?.get) {
    try {
      const val = await window.zofficeAPI.settings.get(key)
      return val !== undefined ? val : defaultValue
    } catch (err) {
      console.error(`[Settings] Failed to get ${key}:`, err)
      return defaultValue
    }
  }
  return defaultValue
}

/**
 * Set a setting value by key.
 * @param {string} key
 * @param {unknown} value
 * @returns {Promise<boolean>}
 */
export async function setSetting(key, value) {
  if (typeof window !== 'undefined' && window.zofficeAPI?.settings?.set) {
    try {
      await window.zofficeAPI.settings.set(key, value)
      return true
    } catch (err) {
      console.error(`[Settings] Failed to set ${key}:`, err)
      return false
    }
  }
  return false
}
