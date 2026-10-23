import { describe, it, expect, beforeAll } from 'vitest'
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
} from 'docx'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { parseDocxToHtml, serializeDocxToBase64 } from '../docx/index.js'

const FIXTURES_DIR = resolve(__dirname, '../../../../test-fixtures')
const BASIC_FIXTURE_PATH = resolve(FIXTURES_DIR, 'sample-basic.docx')
const FORMATTED_FIXTURE_PATH = resolve(FIXTURES_DIR, 'sample-formatted.docx')

describe('DOCX Parser, Serializer, and Roundtrip Fidelity', () => {
  beforeAll(async () => {
    // 1. Generate sample-basic.docx
    const basicDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Zoffice Basic Document',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun('This is a basic paragraph with '),
                new TextRun({ text: 'bold formatting', bold: true }),
                new TextRun(' and '),
                new TextRun({ text: 'italic emphasis', italics: true }),
                new TextRun('.'),
              ],
            }),
          ],
        },
      ],
    })
    const basicBuffer = await Packer.toBuffer(basicDoc)
    writeFileSync(BASIC_FIXTURE_PATH, basicBuffer)

    // 2. Generate sample-formatted.docx with headings, lists, and tables
    const formattedDoc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'ZWriter Rich Document Test',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: 'Secondary Section Heading',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Underlined text content', underline: {} }),
                new TextRun(' inside an annotated paragraph.'),
              ],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun('First bullet item')],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun('Second bullet item')],
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ text: 'Cell A1' })],
                    }),
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ text: 'Cell B1' })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    })
    const formattedBuffer = await Packer.toBuffer(formattedDoc)
    writeFileSync(FORMATTED_FIXTURE_PATH, formattedBuffer)
  })

  it('fixtures are written to /test-fixtures', () => {
    expect(existsSync(BASIC_FIXTURE_PATH)).toBe(true)
    expect(existsSync(FORMATTED_FIXTURE_PATH)).toBe(true)
  })

  it('parses sample-basic.docx into semantic HTML preserving headings and marks', async () => {
    const fileBuffer = readFileSync(BASIC_FIXTURE_PATH)
    const { html } = await parseDocxToHtml(fileBuffer)

    expect(html).toContain('<h1')
    expect(html).toContain('Zoffice Basic Document')
    expect(html).toContain('<strong>bold formatting</strong>')
    expect(html).toContain('<em>italic emphasis</em>')
  })

  it('parses sample-formatted.docx preserving headings, lists, and tables', async () => {
    const fileBuffer = readFileSync(FORMATTED_FIXTURE_PATH)
    const { html } = await parseDocxToHtml(fileBuffer)

    expect(html).toContain('<h1')
    expect(html).toContain('ZWriter Rich Document Test')
    expect(html).toContain('<h2')
    expect(html).toContain('Secondary Section Heading')
    expect(html).toContain('First bullet item')
    expect(html).toContain('Cell A1')
    expect(html).toContain('Cell B1')
    expect(html).toContain('<table')
  })

  it('serializes TipTap JSON document tree to .docx and roundtrips without loss', async () => {
    const originalTree = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1, textAlign: 'left' },
          content: [{ type: 'text', text: 'Roundtrip Verification Title' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', text: 'This text has ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'bold' },
            { type: 'text', text: ' and ' },
            { type: 'text', marks: [{ type: 'italic' }], text: 'italic' },
            { type: 'text', text: ' styles.' },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'List item alpha' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'List item beta' }],
                },
              ],
            },
          ],
        },
      ],
    }

    // 1. Serialize to Base64 DOCX
    const base64Docx = await serializeDocxToBase64(originalTree)
    expect(typeof base64Docx).toBe('string')
    expect(base64Docx.length).toBeGreaterThan(100)

    // 2. Parse Base64 DOCX back into HTML
    const { html } = await parseDocxToHtml(base64Docx)

    // 3. Assert fidelity
    expect(html).toContain('<h1')
    expect(html).toContain('Roundtrip Verification Title')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
    expect(html).toContain('List item alpha')
    expect(html).toContain('List item beta')
  })
})
