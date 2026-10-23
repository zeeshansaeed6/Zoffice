import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

/**
 * @typedef {'light' | 'dark' | 'system'} ThemeMode
 * @typedef {{
 *   theme: ThemeMode,
 *   resolvedTheme: 'light' | 'dark',
 *   setTheme: (mode: ThemeMode) => void,
 *   toggleTheme: () => void
 * }} ThemeContextValue
 */

/** @type {React.Context<ThemeContextValue | undefined>} */
const ThemeContext = createContext(undefined)

const THEME_STORAGE_KEY = 'zoffice-theme-mode'

/**
 * Provides theme state (light, dark, system) and syncs `dark` class on root HTML element.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {ThemeMode} [props.defaultTheme='system']
 */
export function ThemeProvider({ children, defaultTheme = 'system' }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored
      }
    }
    return defaultTheme
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

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
    if (typeof window !== 'undefined' && window.zofficeAPI?.theme?.set) {
      window.zofficeAPI.theme.set(newTheme).catch(() => {})
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
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
