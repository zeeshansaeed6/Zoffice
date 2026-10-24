import { describe, it, expect, beforeEach } from 'vitest'
import { useNoteStore } from '../core/note-store.js'
import { BLOCK_TYPES } from '../core/constants.js'

describe('ZNotes Zustand Store', () => {
  beforeEach(() => {
    useNoteStore.setState({
      notebooks: [],
      activeNotebookId: null,
      activeSectionId: null,
      activePageId: null,
      activeBlockId: null,
    })
  })

  it('initializes default notebook tree when empty', () => {
    useNoteStore.getState().initDefault()
    const state = useNoteStore.getState()
    expect(state.notebooks.length).toBe(1)
    expect(state.notebooks[0].name).toBe('My Notebook')
    expect(state.notebooks[0].sections.length).toBe(1)
    expect(state.notebooks[0].sections[0].pages.length).toBe(1)
    expect(state.activeNotebookId).toBe(state.notebooks[0].id)
  })

  it('adds, renames, and deletes notebooks', () => {
    const { addNotebook, renameNotebook, deleteNotebook } = useNoteStore.getState()
    const nb = addNotebook('Work')
    expect(useNoteStore.getState().notebooks.length).toBe(1)

    renameNotebook(nb.id, 'Work 2026')
    expect(useNoteStore.getState().notebooks[0].name).toBe('Work 2026')

    deleteNotebook(nb.id)
    expect(useNoteStore.getState().notebooks.length).toBe(0)
  })

  it('adds and selects sections', () => {
    const { addNotebook, addSection, selectSection } = useNoteStore.getState()
    addNotebook('Study')
    const sec = addSection('Math')

    expect(sec).toBeDefined()
    expect(useNoteStore.getState().activeSectionId).toBe(sec.id)

    selectSection(sec.id)
    expect(useNoteStore.getState().activeSectionId).toBe(sec.id)
  })

  it('adds, renames, and deletes pages', () => {
    const { addNotebook, addPage, renamePage, deletePage } = useNoteStore.getState()
    addNotebook('Journal')
    const page = addPage('Entry 1')

    expect(page).toBeDefined()
    expect(useNoteStore.getState().activePageId).toBe(page.id)

    renamePage(page.id, 'Day 1 Entry')
    const activePage = useNoteStore.getState().getActivePage()
    expect(activePage?.title).toBe('Day 1 Entry')

    deletePage(page.id)
    expect(useNoteStore.getState().getActivePage()).toBeNull()
  })

  it('adds, updates, and deletes blocks on active page', () => {
    const { addNotebook, addBlock, updateBlock, deleteBlock } = useNoteStore.getState()
    addNotebook('Ideas')
    const block = addBlock(BLOCK_TYPES.TEXT, { content: 'Brainstorm' })

    expect(block).toBeDefined()
    let activePage = useNoteStore.getState().getActivePage()
    expect(activePage?.blocks.length).toBe(1)

    updateBlock(block.id, { content: 'Updated brainstorm', x: 100 })
    activePage = useNoteStore.getState().getActivePage()
    expect(activePage?.blocks[0].content).toBe('Updated brainstorm')
    expect(activePage?.blocks[0].x).toBe(100)

    deleteBlock(block.id)
    activePage = useNoteStore.getState().getActivePage()
    expect(activePage?.blocks.length).toBe(0)
  })

  it('toggles page tags on and off', () => {
    const { addNotebook, togglePageTag } = useNoteStore.getState()
    addNotebook('Tasks')
    const activePage = useNoteStore.getState().getActivePage()
    expect(activePage).toBeDefined()

    togglePageTag(activePage.id, 'todo')
    expect(useNoteStore.getState().getActivePage().tags).toContain('todo')

    togglePageTag(activePage.id, 'todo')
    expect(useNoteStore.getState().getActivePage().tags).not.toContain('todo')
  })
})
