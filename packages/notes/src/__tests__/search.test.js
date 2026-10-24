import { describe, it, expect } from 'vitest'
import { searchAllNotes, extractTextFromBlock } from '../core/search-engine.js'
import { createNotebook, createSection, createPage, createBlock } from '../core/notebook-model.js'
import { BLOCK_TYPES } from '../core/constants.js'

describe('ZNotes Search Engine', () => {
  const setupNotebooks = () => {
    const nb = createNotebook({ name: 'Personal' })
    const sec = createSection(nb.id, { name: 'Health' })
    const pg1 = createPage(sec.id, { title: 'Fitness Routine', tags: ['todo'] })
    const pg2 = createPage(sec.id, { title: 'Diet Plan' })

    const block1 = createBlock(pg1.id, BLOCK_TYPES.TEXT, {
      content: 'Run 5 kilometers every morning',
    })
    const block2 = createBlock(pg1.id, BLOCK_TYPES.CHECKLIST, {
      content: JSON.stringify({ items: [{ text: 'Drink protein shake', checked: false }] }),
    })
    const block3 = createBlock(pg2.id, BLOCK_TYPES.TABLE, {
      content: JSON.stringify({
        rows: [
          ['Meal', 'Calories'],
          ['Breakfast Oatmeal', '350'],
        ],
      }),
    })

    pg1.blocks = [block1, block2]
    pg2.blocks = [block3]
    sec.pages = [pg1, pg2]
    nb.sections = [sec]
    return [nb]
  }

  it('returns empty array when query is empty', () => {
    const notebooks = setupNotebooks()
    expect(searchAllNotes(notebooks, '')).toEqual([])
    expect(searchAllNotes(notebooks, '   ')).toEqual([])
  })

  it('matches against page titles', () => {
    const notebooks = setupNotebooks()
    const results = searchAllNotes(notebooks, 'fitness')
    expect(results.length).toBe(1)
    expect(results[0].pageTitle).toBe('Fitness Routine')
    expect(results[0].matches.some((m) => m.includes('Fitness Routine'))).toBe(true)
  })

  it('matches against tags', () => {
    const notebooks = setupNotebooks()
    const results = searchAllNotes(notebooks, 'todo')
    expect(results.length).toBe(1)
    expect(results[0].matches.some((m) => m.includes('Tag: todo'))).toBe(true)
  })

  it('matches within text blocks', () => {
    const notebooks = setupNotebooks()
    const results = searchAllNotes(notebooks, 'kilometers')
    expect(results.length).toBe(1)
    expect(results[0].matches.some((m) => m.includes('5 kilometers'))).toBe(true)
  })

  it('matches within checklist items', () => {
    const notebooks = setupNotebooks()
    const results = searchAllNotes(notebooks, 'protein')
    expect(results.length).toBe(1)
    expect(results[0].pageTitle).toBe('Fitness Routine')
  })

  it('matches within tables', () => {
    const notebooks = setupNotebooks()
    const results = searchAllNotes(notebooks, 'oatmeal')
    expect(results.length).toBe(1)
    expect(results[0].pageTitle).toBe('Diet Plan')
  })

  it('extracts plain text correctly from different block types', () => {
    const textBlock = { type: 'text', content: 'Sample text' }
    expect(extractTextFromBlock(textBlock)).toBe('Sample text')

    const chkBlock = {
      type: 'checklist',
      content: JSON.stringify({ items: [{ text: 'Item 1' }, { text: 'Item 2' }] }),
    }
    expect(extractTextFromBlock(chkBlock)).toBe('Item 1 Item 2')

    const tblBlock = {
      type: 'table',
      content: JSON.stringify({
        rows: [
          ['A', 'B'],
          ['C', 'D'],
        ],
      }),
    }
    expect(extractTextFromBlock(tblBlock)).toBe('A B C D')
  })
})
