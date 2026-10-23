import { describe, it, expect } from 'vitest'
import { ALLOWED_EXTENSIONS, isAllowedExtension } from '../file-manager.js'

describe('file-manager validation', () => {
  it('validates allowed office and text extensions', () => {
    ALLOWED_EXTENSIONS.forEach((ext) => {
      expect(isAllowedExtension(`test.${ext}`)).toBe(true)
      expect(isAllowedExtension(`/path/to/my-file.${ext.toUpperCase()}`)).toBe(true)
    })
  })

  it('rejects disallowed extensions and malformed paths', () => {
    expect(isAllowedExtension('dangerous.exe')).toBe(false)
    expect(isAllowedExtension('script.bat')).toBe(false)
    expect(isAllowedExtension('malicious.js')).toBe(false)
    expect(isAllowedExtension('')).toBe(false)
    expect(isAllowedExtension('no_extension')).toBe(false)
  })
})
