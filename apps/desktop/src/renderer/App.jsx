import React from 'react'
import { ThemeProvider } from '@zoffice/ui'
import { Shell } from './components/Shell.jsx'

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Shell />
    </ThemeProvider>
  )
}
