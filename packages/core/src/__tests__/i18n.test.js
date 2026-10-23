import { describe, it, expect, beforeEach } from 'vitest'
import { t, setLocale, getLocale, registerLocale } from '../i18n/i18n.js'

describe('i18n engine', () => {
  beforeEach(() => {
    setLocale('en')
  })

  it('translates nested keys from the default English dictionary', () => {
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

  it('falls back to key if translation is missing', () => {
    expect(t('nonexistent.nested.key')).toBe('nonexistent.nested.key')
  })

  it('allows registering and switching locales at runtime', () => {
    registerLocale('es', {
      greeting: 'Hola, {name}!',
    })
    setLocale('es')
    expect(getLocale()).toBe('es')
    expect(t('greeting', { name: 'Mundo' })).toBe('Hola, Mundo!')
  })
})
