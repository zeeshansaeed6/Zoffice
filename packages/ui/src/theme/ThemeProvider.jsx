import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

/**
 * @typedef {'light' | 'dark' | 'high-contrast' | 'system'} ThemeMode
 * @typedef {{
 *   theme: ThemeMode,
 *   resolvedTheme: 'light' | 'dark' | 'high-contrast',
 *   setTheme: (mode: ThemeMode) => void,
 *   toggleTheme: () => void,
 *   uiScale: number,
 *   setUiScale: (scale: number) => void
 * }} ThemeContextValue
 */

/** @type {React.Context<ThemeContextValue | undefined>} */
const ThemeContext = createContext(undefined)

const THEME_STORAGE_KEY = 'zoffice-theme-mode'
const SCALE_STORAGE_KEY = 'zoffice-ui-scale'

/**
 * Provides theme state (light, dark, high-contrast, system), scalable UI, and syncs classes on root HTML element.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {ThemeMode} [props.defaultTheme='system']
 * @param {number} [props.defaultScale=1.0]
 */
export function ThemeProvider({ children, defaultTheme = 'system', defaultScale = 1.0 }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (
        stored === 'light' ||
        stored === 'dark' ||
        stored === 'high-contrast' ||
        stored === 'system'
      ) {
        return stored
      }
    }
    return defaultTheme
  })

  const [uiScale, setUiScaleState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = parseFloat(window.localStorage.getItem(SCALE_STORAGE_KEY) || '')
      if (!isNaN(stored) && stored >= 1.0 && stored <= 2.0) {
        return stored
      }
    }
    return defaultScale
  })

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setSystemIsDark(e.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemIsDark ? 'dark' : 'light'
    }
    return theme
  }, [theme, systemIsDark])

  // Sync theme classes on root element
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (resolvedTheme === 'high-contrast') {
      root.classList.add('high-contrast')
      root.classList.add('dark')
    } else if (resolvedTheme === 'dark') {
      root.classList.remove('high-contrast')
      root.classList.add('dark')
    } else {
      root.classList.remove('high-contrast')
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Sync scalable UI (100% to 200%) on root element
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.style.setProperty('--zoffice-ui-scale', `${Math.round(uiScale * 100)}%`)
    root.style.fontSize = `${Math.round(uiScale * 100)}%`
  }, [uiScale])

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
    if (typeof window !== 'undefined' && window.zofficeAPI?.theme?.set) {
      window.zofficeAPI.theme.set(newTheme).catch(() => {})
    }
  }, [])

  const setUiScale = useCallback((newScale) => {
    const clamped = Math.min(2.0, Math.max(1.0, Number(newScale) || 1.0))
    setUiScaleState(clamped)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SCALE_STORAGE_KEY, String(clamped))
    }
  }, [])

  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else if (resolvedTheme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [resolvedTheme, setTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      uiScale,
      setUiScale,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, uiScale, setUiScale],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to consume theme context.
 * @returns {ThemeContextValue}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
