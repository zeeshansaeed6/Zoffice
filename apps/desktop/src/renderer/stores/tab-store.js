import { create } from 'zustand'

/**
 * @typedef {Object} DocumentTab
 * @property {string} id - Unique tab identifier
 * @property {string} title - Display title
 * @property {'writer' | 'sheets' | 'slides'} appId
 * @property {string|null} filePath - Associated file path if saved
 * @property {string} content - Current document content
 * @property {boolean} dirty - Whether unsaved changes exist
 */

/**
 * @typedef {Object} TabStore
 * @property {DocumentTab[]} tabs
 * @property {string|null} activeTabId - null means Start Screen is visible
 * @property {(appId: 'writer' | 'sheets' | 'slides', title?: string, filePath?: string|null, content?: string) => string} openTab
 * @property {(id: string) => void} closeTab
 * @property {(id: string | null) => void} setActiveTab
 * @property {(id: string, content: string) => void} updateContent
 * @property {(id: string, title: string) => void} updateTitle
 * @property {(id: string, filePath: string) => void} markClean
 * @property {(fromIndex: number, toIndex: number) => void} reorderTabs
 * @property {(id: string) => DocumentTab | undefined} getTab
 */

export const useTabStore = create(
  /** @type {import('zustand').StateCreator<TabStore>} */ (
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (appId, title, filePath = null, content = '') => {
        const defaultTitles = {
          writer: 'Document',
          sheets: 'Workbook',
          slides: 'Presentation',
        }
        const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const count = get().tabs.filter((t) => t.appId === appId).length + 1
        const docTitle = title || `${defaultTitles[appId] || 'Document'} ${count}`

        const newTab = {
          id,
          title: docTitle,
          appId,
          filePath,
          content,
          dirty: false,
        }

        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: id,
        }))

        return id
      },

      closeTab: (id) => {
        set((state) => {
          const nextTabs = state.tabs.filter((t) => t.id !== id)
          let nextActive = state.activeTabId

          if (state.activeTabId === id) {
            if (nextTabs.length > 0) {
              const closedIndex = state.tabs.findIndex((t) => t.id === id)
              const fallbackIndex = Math.max(0, closedIndex - 1)
              nextActive = nextTabs[fallbackIndex]?.id || null
            } else {
              nextActive = null
            }
          }

          return { tabs: nextTabs, activeTabId: nextActive }
        })
      },

      setActiveTab: (id) => {
        set({ activeTabId: id })
      },

      updateContent: (id, content) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, content, dirty: true } : tab)),
        }))
      },

      updateTitle: (id, title) => {
        set((state) => ({
          tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, title } : tab)),
        }))
      },

      markClean: (id, filePath) => {
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id
              ? {
                  ...tab,
                  dirty: false,
                  filePath: filePath || tab.filePath,
                  title: filePath ? filePath.split(/[/\\]/).pop() || tab.title : tab.title,
                }
              : tab,
          ),
        }))
      },

      reorderTabs: (fromIndex, toIndex) => {
        set((state) => {
          const updated = [...state.tabs]
          const [moved] = updated.splice(fromIndex, 1)
          updated.splice(toIndex, 0, moved)
          return { tabs: updated }
        })
      },

      getTab: (id) => {
        return get().tabs.find((t) => t.id === id)
      },
    })
  ),
)
