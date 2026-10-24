/**
 * Zoffice Internationalization (i18n) Engine
 * Multi-language string interpolation and bidirectional layout support.
 * @module i18n
 */

import en from './locales/en.json'
import hi from './locales/hi.json'
import ur from './locales/ur.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

/** @type {Record<string, Record<string, unknown>>} */
const locales = { en, hi, ur, es, fr, de }

export const RTL_LOCALES = ['ur', 'ar', 'fa', 'he']

export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
]

/** @type {string} */
let currentLocale = 'en'
const listeners = new Set()

/**
 * Checks whether a locale code uses Right-to-Left script direction.
 * @param {string} [locale=currentLocale]
 * @returns {boolean}
 */
export function isRtlLocale(locale = currentLocale) {
  return RTL_LOCALES.includes(locale)
}

/**
 * Set the active locale and update DOM direction.
 * @param {string} locale - Locale code (e.g. 'en', 'ur', 'hi')
 */
export function setLocale(locale) {
  if (!locales[locale]) {
    console.error(`[i18n] Unknown locale: ${locale}`)
    return
  }
  currentLocale = locale

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = locale
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr'
  }

  listeners.forEach((fn) => {
    try {
      fn(locale)
    } catch {
      // Ignore listener error
    }
  })
}

/** @returns {string} The current locale code */
export function getLocale() {
  return currentLocale
}

/**
 * Subscribe to locale change events.
 * @param {(locale: string) => void} fn
 * @returns {() => void} Unsubscribe function
 */
export function subscribeLocale(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Register a new locale bundle at runtime.
 * @param {string} locale - Locale code
 * @param {Record<string, unknown>} messages - Flat or nested key-value messages
 */
export function registerLocale(locale, messages) {
  locales[locale] = messages
}

/**
 * Look up a translation by dot-separated key, with optional interpolation.
 *
 * @param {string} key - Dot-separated path, e.g. 'tabs.closeConfirm'
 * @param {Record<string, string | number>} [vars] - Interpolation variables
 * @returns {string} The resolved string, or the key itself if missing
 */
export function t(key, vars) {
  const parts = key.split('.')
  let value = locales[currentLocale]

  for (const part of parts) {
    if (value === undefined || value === null) break
    value = value[part]
  }

  // Fallback to English if missing in current locale
  if (typeof value !== 'string' && currentLocale !== 'en' && locales.en) {
    let enValue = locales.en
    for (const part of parts) {
      if (enValue === undefined || enValue === null) break
      enValue = enValue[part]
    }
    if (typeof enValue === 'string') {
      value = enValue
    }
  }

  if (typeof value !== 'string') {
    console.error(`[i18n] Missing key: ${key}`)
    return key
  }

  if (vars) {
    return value.replace(/\{(\w+)\}/g, (_, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : `{${name}}`,
    )
  }

  return value
}
