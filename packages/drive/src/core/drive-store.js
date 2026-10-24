/**
 * ZDrive Zustand State Store.
 * @module drive-store
 */

import { create } from 'zustand'
import { createDriveItem, createFileVersion, createStarterDrive } from './drive-model.js'
import { DRIVE_SECTIONS, VIEW_MODES, SORT_FIELDS, FILE_KINDS } from './constants.js'
import { saveDriveItemsToStorage, loadDriveItemsFromStorage } from './drive-storage.js'

export const useDriveStore = create((set, get) => ({
  items: createStarterDrive(),
  activeSection: DRIVE_SECTIONS.MY_DRIVE,
  currentFolderId: null,
  viewMode: VIEW_MODES.GRID,
  searchQuery: '',
  sortField: SORT_FIELDS.UPDATED_AT,
  sortDirection: 'desc',
  selectedItemIds: [],
  isVersionModalOpen: false,
  versionTargetFile: null,
  isNewFolderModalOpen: false,

  setActiveSection: (section) =>
    set({
      activeSection: section,
      currentFolderId: null,
      selectedItemIds: [],
    }),

  setCurrentFolderId: (folderId) =>
    set({
      currentFolderId: folderId,
      selectedItemIds: [],
    }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSort: (field, direction) => set({ sortField: field, sortDirection: direction }),

  toggleSelect: (id, multi = false) => {
    set((state) => {
      if (!multi) {
        return { selectedItemIds: state.selectedItemIds.includes(id) ? [] : [id] }
      }
      return {
        selectedItemIds: state.selectedItemIds.includes(id)
          ? state.selectedItemIds.filter((itemId) => itemId !== id)
          : [...state.selectedItemIds, id],
      }
    })
  },

  clearSelection: () => set({ selectedItemIds: [] }),

  openVersionModal: (file) => set({ isVersionModalOpen: true, versionTargetFile: file }),
  closeVersionModal: () => set({ isVersionModalOpen: false, versionTargetFile: null }),
  openNewFolderModal: () => set({ isNewFolderModalOpen: true }),
  closeNewFolderModal: () => set({ isNewFolderModalOpen: false }),

  createFolder: (name = 'New Folder') => {
    const { currentFolderId } = get()
    const folder = createDriveItem(name, FILE_KINDS.FOLDER, currentFolderId)
    set((state) => {
      const nextItems = [...state.items, folder]
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems, isNewFolderModalOpen: false }
    })
    return folder
  },

  createFile: (name, kind = FILE_KINDS.WRITER, size = 4096) => {
    const { currentFolderId } = get()
    const file = createDriveItem(name, kind, currentFolderId, { size })
    set((state) => {
      const nextItems = [...state.items, file]
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems }
    })
    return file
  },

  toggleStarred: (id) => {
    set((state) => {
      const nextItems = state.items.map((it) =>
        it.id === id ? { ...it, starred: !it.starred, updatedAt: Date.now() } : it,
      )
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems }
    })
  },

  setColorTag: (id, colorTag) => {
    set((state) => {
      const nextItems = state.items.map((it) =>
        it.id === id ? { ...it, colorTag, updatedAt: Date.now() } : it,
      )
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems }
    })
  },

  moveToTrash: (id) => {
    set((state) => {
      const nextItems = state.items.map((it) =>
        it.id === id ? { ...it, trashed: true, updatedAt: Date.now() } : it,
      )
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems, selectedItemIds: [] }
    })
  },

  restoreFromTrash: (id) => {
    set((state) => {
      const nextItems = state.items.map((it) =>
        it.id === id ? { ...it, trashed: false, updatedAt: Date.now() } : it,
      )
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems }
    })
  },

  deletePermanently: (id) => {
    set((state) => {
      const nextItems = state.items.filter((it) => it.id !== id)
      saveDriveItemsToStorage(nextItems)
      return { items: nextItems, selectedItemIds: [] }
    })
  },

  addVersion: (fileId, content = '', comment = 'Updated version') => {
    set((state) => {
      const nextItems = state.items.map((it) => {
        if (it.id !== fileId) return it
        const nextVersionNum = (it.versions?.length || 0) + 1
        const newVer = createFileVersion(fileId, {
          versionNumber: nextVersionNum,
          size: content ? content.length : it.size,
          comment,
          content,
        })
        return {
          ...it,
          size: newVer.size,
          versions: [newVer, ...(it.versions || [])],
          updatedAt: Date.now(),
        }
      })
      saveDriveItemsToStorage(nextItems)
      const target = nextItems.find((it) => it.id === fileId)
      return { items: nextItems, versionTargetFile: target || null }
    })
  },

  loadDrive: async () => {
    const loaded = await loadDriveItemsFromStorage()
    if (loaded && loaded.length > 0) {
      set({ items: loaded })
    }
  },
}))
