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
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(`zoffice-setting-${key}`)
    if (raw !== null) {
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
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
  let ok = false
  if (typeof window !== 'undefined' && window.zofficeAPI?.settings?.set) {
    try {
      await window.zofficeAPI.settings.set(key, value)
      ok = true
    } catch (err) {
      console.error(`[Settings] Failed to set ${key}:`, err)
    }
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(`zoffice-setting-${key}`, JSON.stringify(value))
    ok = true
  }
  return ok
}
