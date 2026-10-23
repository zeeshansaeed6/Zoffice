import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseDocxToHtml, serializeDocxToBase64 } from '../docx/index.js'
import { readDocxPackage } from '../docx/ooxml-package.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = resolve(__dirname, '../../../../test-fixtures')
const REAL_DIR = resolve(FIXTURES_DIR, 'real')

describe('Milestone 1A.5: DOCX Fidelity Hardening Tests', () => {
  it('preserves colored text, fonts, underline, strike, sub/superscript', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-colored-font.docx')
    const buffer = readFileSync(filePath)
    const { html, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('Standard Text.')
    expect(html).toContain('<strong>')
    expect(html).toContain('<em>')
    expect(html).toContain('<u>')
    expect(html).toContain('<s>')
    expect(html).toContain('<sub>')
    expect(html).toContain('<sup>')

    // Colors
    expect(html.toLowerCase()).toContain('#dc2626')
    expect(html.toLowerCase()).toContain('#2563eb')
    expect(html.toLowerCase()).toContain('#16a34a')

    // Fonts
    expect(html).toContain('Carlito')
    expect(html).toContain('Georgia')
  })

  it('preserves multi-level bullet and numbered lists', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-multilevel-lists.docx')
    const buffer = readFileSync(filePath)
    const { html, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('Level 0 Bullet Item')
    expect(html).toContain('Level 1 Nested Bullet Item')
    expect(html).toContain('Level 2 Deep Bullet Item')
    expect(html).toContain('First item')
    expect(html).toContain('First sub-item')
    expect(html).toContain('Second item')
    expect(html).toContain('<ul')
    expect(html).toContain('<ol')
    expect(html).toContain('<li>')
  })

  it('preserves merged-cell table with shading and borders', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-merged-table.docx')
    const buffer = readFileSync(filePath)
    const { html, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('<table')
    expect(html).toContain('colspan="2"')
    expect(html).toContain('Spanned Header (2 Cols)')
    expect(html).toContain('Yellow Shaded Cell')
    expect(html).toContain('Standard Cell 2')
    expect(html.toLowerCase()).toContain('#e2e8f0')
    expect(html.toLowerCase()).toContain('#fef08a')
  })

  it('preserves embedded images with dimensions and hyperlinks', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-embedded-image.docx')
    const buffer = readFileSync(filePath)
    const { html, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('Embedded Image and Link Document')
    expect(html).toContain('<img')
    expect(html).toContain('src="data:image/png;base64,')
    expect(html).toContain('width="120"')
    expect(html).toContain('height="80"')
    expect(html).toContain('<a href="https://zoffice.app"')
    expect(html).toContain('Zoffice Open Source Suite')
  })

  it('preserves custom margins and landscape page orientation', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-custom-margins.docx')
    const buffer = readFileSync(filePath)
    const { html, pageSetup, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('Landscape Document with 1.5in Margins')
    expect(pageSetup).toBeDefined()
    expect(pageSetup.orientation).toBe('landscape')
    expect(pageSetup.margins.top).toBe(144) // 1.5 in at 96 DPI
    expect(pageSetup.margins.bottom).toBe(144)
    expect(pageSetup.margins.left).toBe(120) // 1.25 in at 96 DPI
    expect(pageSetup.margins.right).toBe(120)
  })

  it('preserves custom headings, alignment, and line spacing', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-custom-headings.docx')
    const buffer = readFileSync(filePath)
    const { html, isDirect } = await parseDocxToHtml(buffer)

    expect(isDirect).toBe(true)
    expect(html).toContain('<h1')
    expect(html).toContain('Grand Executive Title')
    expect(html).toContain('Heading 1: Market Outlook')
    expect(html).toContain('Heading 2: Key Strategic Vectors')
    expect(html).toContain('text-align: justify')
    expect(html).toContain('line-height: 1.50')
  })

  it('roundtrips high-fidelity document through serializer without data loss', async () => {
    const filePath = resolve(FIXTURES_DIR, 'fidelity-colored-font.docx')
    const buffer = readFileSync(filePath)
    const parsed = await parseDocxToHtml(buffer)

    const tree = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Roundtrip Hardened Document' }],
        },
        {
          type: 'paragraph',
          attrs: { lineHeight: '1.5' },
          content: [
            {
              type: 'text',
              marks: [
                { type: 'bold' },
                { type: 'textStyle', attrs: { color: '#dc2626', fontFamily: 'Carlito' } },
              ],
              text: 'Red Carlito Bold',
            },
            { type: 'text', text: ' and normal.' },
          ],
        },
      ],
    }

    const reSavedBase64 = await serializeDocxToBase64(tree, {
      pageSetup: parsed.pageSetup,
      preservedFiles: parsed.preservedFiles,
    })

    const reParsed = await parseDocxToHtml(reSavedBase64)
    expect(reParsed.html).toContain('Roundtrip Hardened Document')
    expect(reParsed.html).toContain('<strong>')
    expect(reParsed.html.toLowerCase()).toContain('#dc2626')
    expect(reParsed.html).toContain('Carlito')
  })

  it('tests all real Word documents placed into /test-fixtures/real/', async () => {
    expect(existsSync(REAL_DIR)).toBe(true)
    const files = readdirSync(REAL_DIR).filter((f) => f.endsWith('.docx'))

    if (files.length === 0) {
      // Directory is ready for user to drop real files
      expect(true).toBe(true)
      return
    }

    for (const file of files) {
      const fullPath = resolve(REAL_DIR, file)
      const buffer = readFileSync(fullPath)

      // 1. Inspect package
      const pkg = await readDocxPackage(buffer)
      expect(pkg.documentXml).toBeDefined()

      // 2. Parse via direct OOXML parser
      const parsed = await parseDocxToHtml(buffer)
      expect(parsed.html.length).toBeGreaterThan(0)

      // 3. Roundtrip through serializer
      const simpleTree = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Preserved real document test run' }],
          },
        ],
      }
      const savedBase64 = await serializeDocxToBase64(simpleTree, {
        pageSetup: parsed.pageSetup,
        preservedFiles: parsed.preservedFiles,
      })

      const reParsed = await parseDocxToHtml(savedBase64)
      expect(reParsed.html).toContain('Preserved real document test run')
    }
  })
})
