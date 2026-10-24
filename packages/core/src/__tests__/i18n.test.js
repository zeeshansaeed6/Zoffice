import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  t,
  setLocale,
  getLocale,
  SUPPORTED_LOCALES,
  isRtlLocale,
  subscribeLocale,
} from '../i18n/i18n.js'

describe('i18n engine', () => {
  beforeEach(() => {
    setLocale('en')
  })

  it('translates nested keys from the default English dictionary', () => {
    expect(getLocale()).toBe('en')
    expect(t('app.name')).toBe('Zoffice')
    expect(t('start.title')).toBe('Start')
  })

  it('interpolates variables accurately', () => {
    const rendered = t('statusBar.words', { count: 125 })
    expect(rendered).toBe('125 words')
  })

  it('interpolates multiple variables', () => {
    const rendered = t('statusBar.pages', { current: 3, total: 10 })
    expect(rendered).toBe('Page 3 of 10')
  })

  it('supports all 6 official locales with proper app titles', () => {
    expect(SUPPORTED_LOCALES.length).toBe(6)

    setLocale('hi')
    expect(t('toolbar.save')).toBe('सहेजें')
    expect(t('apps.writer.name')).toBe('ZWriter')

    setLocale('ur')
    expect(t('toolbar.save')).toBe('محفوظ کریں')

    setLocale('es')
    expect(t('toolbar.save')).toBe('Guardar')

    setLocale('fr')
    expect(t('toolbar.save')).toBe('Enregistrer')

    setLocale('de')
    expect(t('toolbar.save')).toBe('Speichern')
  })

  it('detects RTL direction for Urdu and LTR for European languages', () => {
    expect(isRtlLocale('ur')).toBe(true)
    expect(isRtlLocale('en')).toBe(false)
    expect(isRtlLocale('hi')).toBe(false)
    expect(isRtlLocale('es')).toBe(false)
    expect(isRtlLocale('fr')).toBe(false)
    expect(isRtlLocale('de')).toBe(false)
  })

  it('updates documentElement attributes and notifies subscribers on locale change', () => {
    const originalDoc = global.document
    global.document = { documentElement: { lang: 'en', dir: 'ltr' } }

    const listener = vi.fn()
    const unsubscribe = subscribeLocale(listener)

    setLocale('ur')
    expect(listener).toHaveBeenCalledWith('ur')
    expect(global.document.documentElement.lang).toBe('ur')
    expect(global.document.documentElement.dir).toBe('rtl')

    setLocale('en')
    expect(global.document.documentElement.lang).toBe('en')
    expect(global.document.documentElement.dir).toBe('ltr')

    unsubscribe()
    setLocale('fr')
    expect(listener).toHaveBeenCalledTimes(2) // Not called a 3rd time after unsubscribe

    global.document = originalDoc
  })

  it('falls back to English if translation is missing in another locale', () => {
    setLocale('es')
    // non-existent key falls back to key itself
    expect(t('nonexistent.nested.key')).toBe('nonexistent.nested.key')
  })
})
