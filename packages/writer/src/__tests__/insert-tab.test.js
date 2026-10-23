import { describe, it, expect, vi } from 'vitest'
import { getWriterRibbonConfig } from '../ribbon/ribbon-config.jsx'
import * as insertActions from '../ribbon/insert-actions.js'
import { getWriterExtensions } from '../core/editor-schema.js'
import { serializeDocxToBase64 } from '../docx/docx-serializer.js'

describe('ZWriter Insert Tab', () => {
  it('includes Insert tab and all required tool groups in ribbon config', () => {
    const config = getWriterRibbonConfig()
    const insertTab = config.tabs.find((t) => t.id === 'insert')
    expect(insertTab).toBeDefined()
    expect(insertTab?.label).toBe('Insert')

    const groupIds = insertTab?.groups.map((g) => g.id)
    expect(groupIds).toContain('pages')
    expect(groupIds).toContain('tables')
    expect(groupIds).toContain('illustrations')
    expect(groupIds).toContain('links')
    expect(groupIds).toContain('text-tools')
    expect(groupIds).toContain('symbols')
  })

  it('registers table, image, link, bookmark, and math extensions in editor schema', () => {
    const extensions = getWriterExtensions()
    const names = extensions.map((e) => e.name)

    expect(names).toContain('table')
    expect(names).toContain('tableRow')
    expect(names).toContain('tableHeader')
    expect(names).toContain('tableCell')
    expect(names).toContain('image')
    expect(names).toContain('link')
    expect(names).toContain('bookmark')
    expect(names).toContain('mathEquation')
  })

  it('dispatches table insertion commands correctly', () => {
    const mockRun = vi.fn()
    const mockInsertTable = vi.fn().mockReturnValue({ run: mockRun })
    const mockChain = {
      focus: vi.fn().mockReturnThis(),
      insertTable: mockInsertTable,
      addRowBefore: vi.fn().mockReturnValue({ run: mockRun }),
      addRowAfter: vi.fn().mockReturnValue({ run: mockRun }),
      deleteRow: vi.fn().mockReturnValue({ run: mockRun }),
      addColumnBefore: vi.fn().mockReturnValue({ run: mockRun }),
      addColumnAfter: vi.fn().mockReturnValue({ run: mockRun }),
      deleteColumn: vi.fn().mockReturnValue({ run: mockRun }),
      deleteTable: vi.fn().mockReturnValue({ run: mockRun }),
      mergeCells: vi.fn().mockReturnValue({ run: mockRun }),
      splitCell: vi.fn().mockReturnValue({ run: mockRun }),
      setCellAttribute: vi.fn().mockReturnValue({ run: mockRun }),
    }
    const mockEditor = {
      chain: vi.fn().mockReturnValue(mockChain),
    }

    insertActions.insertTable(mockEditor, 4, 5, true)
    expect(mockInsertTable).toHaveBeenCalledWith({ rows: 4, cols: 5, withHeaderRow: true })

    insertActions.addRowAbove(mockEditor)
    expect(mockChain.addRowBefore).toHaveBeenCalled()

    insertActions.addRowBelow(mockEditor)
    expect(mockChain.addRowAfter).toHaveBeenCalled()

    insertActions.deleteRow(mockEditor)
    expect(mockChain.deleteRow).toHaveBeenCalled()

    insertActions.addColumnLeft(mockEditor)
    expect(mockChain.addColumnBefore).toHaveBeenCalled()

    insertActions.addColumnRight(mockEditor)
    expect(mockChain.addColumnAfter).toHaveBeenCalled()

    insertActions.deleteColumn(mockEditor)
    expect(mockChain.deleteColumn).toHaveBeenCalled()

    insertActions.deleteTable(mockEditor)
    expect(mockChain.deleteTable).toHaveBeenCalled()

    insertActions.mergeCells(mockEditor)
    expect(mockChain.mergeCells).toHaveBeenCalled()

    insertActions.splitCell(mockEditor)
    expect(mockChain.splitCell).toHaveBeenCalled()

    insertActions.setTableCellBackground(mockEditor, '#fef08a')
    expect(mockChain.setCellAttribute).toHaveBeenCalledWith('backgroundColor', '#fef08a')
  })

  it('dispatches image, link, bookmark, equation, and break commands', () => {
    const mockRun = vi.fn()
    const mockChain = {
      focus: vi.fn().mockReturnThis(),
      setImage: vi.fn().mockReturnValue({ run: mockRun }),
      extendMarkRange: vi.fn().mockReturnThis(),
      setLink: vi.fn().mockReturnValue({ run: mockRun }),
      unsetLink: vi.fn().mockReturnValue({ run: mockRun }),
      insertBookmark: vi.fn().mockReturnValue({ run: mockRun }),
      insertEquation: vi.fn().mockReturnValue({ run: mockRun }),
      setHorizontalRule: vi.fn().mockReturnValue({ run: mockRun }),
      setPageBreak: vi.fn().mockReturnValue({ run: mockRun }),
      insertContent: vi.fn().mockReturnValue({ run: mockRun }),
    }
    const mockEditor = {
      chain: vi.fn().mockReturnValue(mockChain),
      state: { selection: { empty: false } },
    }

    insertActions.insertImage(mockEditor, {
      src: 'data:image/png;base64,abc',
      width: '300px',
      alignment: 'center',
    })
    expect(mockChain.setImage).toHaveBeenCalledWith({
      src: 'data:image/png;base64,abc',
      alt: '',
      width: '300px',
      height: null,
      alignment: 'center',
    })

    insertActions.setHyperlink(mockEditor, 'https://example.com')
    expect(mockChain.setLink).toHaveBeenCalledWith({ href: 'https://example.com' })

    insertActions.removeHyperlink(mockEditor)
    expect(mockChain.unsetLink).toHaveBeenCalled()

    insertActions.insertBookmark(mockEditor, 'conclusion_section')
    expect(mockChain.insertBookmark).toHaveBeenCalledWith('conclusion_section')

    insertActions.insertMathEquation(mockEditor, '\\sum_{i=1}^{n} x_i')
    expect(mockChain.insertEquation).toHaveBeenCalledWith('\\sum_{i=1}^{n} x_i')

    insertActions.insertHorizontalRule(mockEditor)
    expect(mockChain.setHorizontalRule).toHaveBeenCalled()

    insertActions.insertPageBreak(mockEditor)
    expect(mockChain.setPageBreak).toHaveBeenCalled()

    insertActions.insertSymbol(mockEditor, '©')
    expect(mockChain.insertContent).toHaveBeenCalledWith('©')

    insertActions.insertDateTime(mockEditor, 'date')
    expect(mockChain.insertContent).toHaveBeenCalled()
  })

  it('serializes documents with tables, links, math equations, and horizontal rules to DOCX', async () => {
    const docJson = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Zoffice Link',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'mathEquation',
              attrs: { latex: 'E=mc^2' },
            },
          ],
        },
        {
          type: 'horizontalRule',
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column A' }] }],
                },
                {
                  type: 'tableHeader',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Column B' }] }],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: { backgroundColor: '#f0f0f0' },
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Val 1' }] }],
                },
                {
                  type: 'tableCell',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Val 2' }] }],
                },
              ],
            },
          ],
        },
      ],
    }

    const base64 = await serializeDocxToBase64(docJson)
    expect(base64).toBeDefined()
    expect(typeof base64).toBe('string')
    expect(base64.length).toBeGreaterThan(500)
  })
})
