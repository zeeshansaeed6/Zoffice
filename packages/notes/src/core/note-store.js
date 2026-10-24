/**
 * ZNotes Zustand store — manages notebook tree state in the renderer.
 * @module note-store
 */

import { create } from 'zustand'
import { createNotebook, createSection, createPage, createBlock } from './notebook-model.js'
import { BLOCK_TYPES } from './constants.js'

/**
 * @typedef {Object} NoteStoreState
 * @property {import('./notebook-model.js').Notebook[]} notebooks
 * @property {string|null} activeNotebookId
 * @property {string|null} activeSectionId
 * @property {string|null} activePageId
 * @property {string|null} activeBlockId
 */

export const useNoteStore = create((set, get) => ({
  notebooks: [],
  activeNotebookId: null,
  activeSectionId: null,
  activePageId: null,
  activeBlockId: null,
  searchQuery: '',
  searchResults: [],

  /** Initialize with a default notebook if empty */
  initDefault: () => {
    const state = get()
    if (state.notebooks.length > 0) return
    const nb = createNotebook({ name: 'My Notebook' })
    const sec = createSection(nb.id, { name: 'General' })
    const pg = createPage(sec.id, { title: 'Welcome' })
    const block = createBlock(pg.id, BLOCK_TYPES.TEXT, {
      content: 'Welcome to ZNotes! Start typing here...',
      x: 40,
      y: 40,
    })
    pg.blocks = [block]
    sec.pages = [pg]
    nb.sections = [sec]
    set({
      notebooks: [nb],
      activeNotebookId: nb.id,
      activeSectionId: sec.id,
      activePageId: pg.id,
    })
  },

  /** Load notebooks from external source */
  setNotebooks: (notebooks) => set({ notebooks }),

  /** Add a new notebook */
  addNotebook: (name) => {
    const nb = createNotebook({ name })
    const sec = createSection(nb.id, { name: 'General' })
    const pg = createPage(sec.id, { title: 'Untitled Page' })
    sec.pages = [pg]
    nb.sections = [sec]
    set((s) => ({
      notebooks: [...s.notebooks, nb],
      activeNotebookId: nb.id,
      activeSectionId: sec.id,
      activePageId: pg.id,
    }))
    return nb
  },

  /** Delete a notebook */
  deleteNotebook: (id) => {
    set((s) => {
      const filtered = s.notebooks.filter((n) => n.id !== id)
      const newActive = s.activeNotebookId === id ? filtered[0]?.id || null : s.activeNotebookId
      return {
        notebooks: filtered,
        activeNotebookId: newActive,
        activeSectionId: newActive
          ? filtered.find((n) => n.id === newActive)?.sections[0]?.id || null
          : null,
        activePageId: null,
      }
    })
  },

  /** Rename a notebook */
  renameNotebook: (id, name) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => (n.id === id ? { ...n, name, updatedAt: Date.now() } : n)),
    }))
  },

  /** Select a notebook */
  selectNotebook: (id) => {
    const nb = get().notebooks.find((n) => n.id === id)
    const sec = nb?.sections[0] || null
    const pg = sec?.pages[0] || null
    set({
      activeNotebookId: id,
      activeSectionId: sec?.id || null,
      activePageId: pg?.id || null,
      activeBlockId: null,
    })
  },

  /** Add a section to the active notebook */
  addSection: (name) => {
    const { activeNotebookId } = get()
    if (!activeNotebookId) return null
    const sec = createSection(activeNotebookId, { name })
    const pg = createPage(sec.id, { title: 'Untitled Page' })
    sec.pages = [pg]
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === activeNotebookId
          ? { ...n, sections: [...n.sections, sec], updatedAt: Date.now() }
          : n,
      ),
      activeSectionId: sec.id,
      activePageId: pg.id,
    }))
    return sec
  },

  /** Delete a section */
  deleteSection: (id) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.filter((sec) => sec.id !== id),
        updatedAt: Date.now(),
      })),
      activeSectionId: s.activeSectionId === id ? null : s.activeSectionId,
      activePageId: s.activeSectionId === id ? null : s.activePageId,
    }))
  },

  /** Select a section */
  selectSection: (id) => {
    const nb = get().notebooks.find((n) => n.id === get().activeNotebookId)
    const sec = nb?.sections.find((s) => s.id === id)
    set({
      activeSectionId: id,
      activePageId: sec?.pages[0]?.id || null,
      activeBlockId: null,
    })
  },

  /** Add a page to the active section */
  addPage: (title) => {
    const { activeNotebookId, activeSectionId } = get()
    if (!activeNotebookId || !activeSectionId) return null
    const pg = createPage(activeSectionId, { title })
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === activeNotebookId
          ? {
              ...n,
              sections: n.sections.map((sec) =>
                sec.id === activeSectionId
                  ? { ...sec, pages: [...sec.pages, pg], updatedAt: Date.now() }
                  : sec,
              ),
              updatedAt: Date.now(),
            }
          : n,
      ),
      activePageId: pg.id,
    }))
    return pg
  },

  /** Delete a page */
  deletePage: (id) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.map((sec) => ({
          ...sec,
          pages: sec.pages.filter((p) => p.id !== id),
        })),
      })),
      activePageId: s.activePageId === id ? null : s.activePageId,
    }))
  },

  /** Rename a page */
  renamePage: (id, title) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.map((sec) => ({
          ...sec,
          pages: sec.pages.map((p) => (p.id === id ? { ...p, title, updatedAt: Date.now() } : p)),
        })),
      })),
    }))
  },

  /** Select a page */
  selectPage: (id) => set({ activePageId: id, activeBlockId: null }),

  /** Get the currently active page object */
  getActivePage: () => {
    const { notebooks, activeNotebookId, activeSectionId, activePageId } = get()
    const nb = notebooks.find((n) => n.id === activeNotebookId)
    const sec = nb?.sections.find((s) => s.id === activeSectionId)
    return sec?.pages.find((p) => p.id === activePageId) || null
  },

  /** Add a block to the active page */
  addBlock: (type = BLOCK_TYPES.TEXT, overrides = {}) => {
    const { activeNotebookId, activeSectionId, activePageId } = get()
    if (!activePageId) return null
    const block = createBlock(activePageId, type, overrides)
    set((s) => ({
      notebooks: s.notebooks.map((n) =>
        n.id === activeNotebookId
          ? {
              ...n,
              sections: n.sections.map((sec) =>
                sec.id === activeSectionId
                  ? {
                      ...sec,
                      pages: sec.pages.map((p) =>
                        p.id === activePageId
                          ? { ...p, blocks: [...p.blocks, block], updatedAt: Date.now() }
                          : p,
                      ),
                    }
                  : sec,
              ),
            }
          : n,
      ),
      activeBlockId: block.id,
    }))
    return block
  },

  /** Update a block */
  updateBlock: (blockId, updates) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.map((sec) => ({
          ...sec,
          pages: sec.pages.map((p) => ({
            ...p,
            blocks: p.blocks.map((b) =>
              b.id === blockId ? { ...b, ...updates, updatedAt: Date.now() } : b,
            ),
          })),
        })),
      })),
    }))
  },

  /** Delete a block */
  deleteBlock: (blockId) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.map((sec) => ({
          ...sec,
          pages: sec.pages.map((p) => ({
            ...p,
            blocks: p.blocks.filter((b) => b.id !== blockId),
          })),
        })),
      })),
      activeBlockId: s.activeBlockId === blockId ? null : s.activeBlockId,
    }))
  },

  /** Select a block */
  selectBlock: (id) => set({ activeBlockId: id }),

  /** Toggle a tag on the active page */
  togglePageTag: (pageId, tag) => {
    set((s) => ({
      notebooks: s.notebooks.map((n) => ({
        ...n,
        sections: n.sections.map((sec) => ({
          ...sec,
          pages: sec.pages.map((p) => {
            if (p.id !== pageId) return p
            const tags = p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag]
            return { ...p, tags, updatedAt: Date.now() }
          }),
        })),
      })),
    }))
  },

  /** Set search query and results */
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
}))
