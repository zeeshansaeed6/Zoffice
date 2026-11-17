import React, { useState } from 'react'
import { render, act } from '@testing-library/react'
import { it, expect } from 'vitest'
import { ThemeProvider } from '../../../ui/src/theme/ThemeProvider.jsx'
import { ZForms } from '../ZForms.jsx'

it('settles when the host echoes onChange content back as initialContent', async () => {
  let changes = 0
  function Host() {
    const [content, setContent] = useState('')
    const handleChange = (next) => {
      if (++changes > 20) throw new Error('onChange feedback loop')
      setContent(next)
    }
    return <ZForms initialContent={content} onChange={handleChange} />
  }
  render(
    <ThemeProvider>
      <Host />
    </ThemeProvider>,
  )
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
  })
  expect(changes).toBeLessThan(10)
})
