import en from './locales/en.json'

/** @type {Record<string, Record<string, unknown>>} */
const locales = { en }

/** @type {string} */
let currentLocale = 'en'

/**
 * Set the active locale.
 * @param {string} locale - Locale code (e.g. 'en', 'de')
 */
export function setLocale(locale) {
  if (!locales[locale]) {
    console.error(`[i18n] Unknown locale: ${locale}`)
    return
  }
  currentLocale = locale
}

/** @returns {string} The current locale code */
export function getLocale() {
  return currentLocale
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
 *
 * @example
 * t('statusBar.words', { count: 42 })  // "42 words"
 */
export function t(key, vars) {
  const parts = key.split('.')
  let value = locales[currentLocale]

  for (const part of parts) {
    if (value === undefined || value === null) break
    value = value[part]
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
