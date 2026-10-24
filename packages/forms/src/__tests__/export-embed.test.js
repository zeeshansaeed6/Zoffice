import { describe, it, expect } from 'vitest'
import { exportResponsesToCsv, escapeCsvCell } from '../core/export-csv.js'
import { generateEmbedCode } from '../core/embed-generator.js'
import { createForm, createQuestion } from '../core/form-model.js'
import { createResponse } from '../core/response-model.js'
import { QUESTION_TYPES } from '../core/constants.js'

describe('ZForms Export & Embed Engine', () => {
  it('escapes cells containing commas, quotes, and newlines', () => {
    expect(escapeCsvCell('Hello, World')).toBe('"Hello, World"')
    expect(escapeCsvCell('He said "Hi"')).toBe('"He said ""Hi"""')
    expect(escapeCsvCell('Line 1\nLine 2')).toBe('"Line 1\nLine 2"')
    expect(escapeCsvCell(['A', 'B'])).toBe('"A; B"')
    expect(escapeCsvCell({ filename: 'doc.pdf' })).toBe('"doc.pdf"')
    expect(escapeCsvCell(null)).toBe('""')
  })

  it('exports form and responses to RFC 4180 compliant CSV', () => {
    const q1 = createQuestion({ id: 'q-1', title: 'What is your name?', order: 0 })
    const q2 = createQuestion({
      id: 'q-2',
      title: 'Interests, Hobbies',
      type: QUESTION_TYPES.CHECKBOXES,
      order: 1,
    })
    const form = createForm({
      title: 'Member Survey',
      questions: [q1, q2],
    })

    const resp1 = createResponse(
      form.id,
      { 'q-1': 'Alice', 'q-2': ['Coding', 'Chess'] },
      { submittedAt: new Date('2026-10-24T12:00:00Z').getTime() },
    )

    const resp2 = createResponse(
      form.id,
      { 'q-1': 'Bob "The Builder", Jr.', 'q-2': ['Design'] },
      { submittedAt: new Date('2026-10-24T13:00:00Z').getTime() },
    )

    const csv = exportResponsesToCsv(form, [resp1, resp2])
    const lines = csv.split('\r\n')

    expect(lines.length).toBe(3)
    // Header
    expect(lines[0]).toBe('"Submission Timestamp","What is your name?","Interests, Hobbies"')
    // Row 1
    expect(lines[1]).toContain('"Alice"')
    expect(lines[1]).toContain('"Coding; Chess"')
    // Row 2 with escaped quotes
    expect(lines[2]).toContain('"Bob ""The Builder"", Jr."')
    expect(lines[2]).toContain('"Design"')
  })

  it('generates responsive HTML iframe embed code', () => {
    const snippet = generateEmbedCode({
      formId: 'form-xyz-123',
      title: 'Community Survey',
      width: '100%',
      height: '650px',
      border: true,
      baseUrl: 'https://zoffice.local/forms',
    })

    expect(snippet).toContain('<iframe')
    expect(snippet).toContain('src="https://zoffice.local/forms/form-xyz-123"')
    expect(snippet).toContain('width="100%"')
    expect(snippet).toContain('height="650px"')
    expect(snippet).toContain('title="Community Survey"')
    expect(snippet).toContain('border: 1px solid #e2e8f0')
    expect(snippet).toContain('</iframe>')
  })
})
