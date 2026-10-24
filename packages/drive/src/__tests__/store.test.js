import { describe, it, expect, beforeEach } from 'vitest'
import { useDriveStore } from '../core/drive-store.js'
import { FILE_KINDS, DRIVE_SECTIONS, VIEW_MODES } from '../core/constants.js'

describe('ZDrive Zustand Store', () => {
  beforeEach(() => {
    useDriveStore.setState(useDriveStore.getInitialState())
  })

  it('initializes with starter drive items', () => {
    const state = useDriveStore.getState()
    expect(state.items.length).toBeGreaterThanOrEqual(8)
    expect(state.activeSection).toBe(DRIVE_SECTIONS.MY_DRIVE)
    expect(state.currentFolderId).toBeNull()
    expect(state.viewMode).toBe(VIEW_MODES.GRID)
  })

  it('creates new folders and files', () => {
    const { createFolder, createFile } = useDriveStore.getState()
    const folder = createFolder('Finance')
    expect(folder.kind).toBe(FILE_KINDS.FOLDER)
    expect(useDriveStore.getState().items.some((i) => i.id === folder.id)).toBe(true)

    const file = createFile('Budget.xlsx', FILE_KINDS.SHEETS, 5000)
    expect(file.kind).toBe(FILE_KINDS.SHEETS)
    expect(file.size).toBe(5000)
    expect(useDriveStore.getState().items.some((i) => i.id === file.id)).toBe(true)
  })

  it('toggles starred and updates color tag', () => {
    const { items, toggleStarred, setColorTag } = useDriveStore.getState()
    const item = items[0]
    const initialStarred = item.starred

    toggleStarred(item.id)
    expect(useDriveStore.getState().items.find((i) => i.id === item.id).starred).toBe(
      !initialStarred,
    )

    setColorTag(item.id, 'purple')
    expect(useDriveStore.getState().items.find((i) => i.id === item.id).colorTag).toBe('purple')
  })

  it('trashes, restores, and deletes permanently', () => {
    const { items, moveToTrash, restoreFromTrash, deletePermanently } = useDriveStore.getState()
    const target = items[0]

    moveToTrash(target.id)
    expect(useDriveStore.getState().items.find((i) => i.id === target.id).trashed).toBe(true)

    restoreFromTrash(target.id)
    expect(useDriveStore.getState().items.find((i) => i.id === target.id).trashed).toBe(false)

    deletePermanently(target.id)
    expect(useDriveStore.getState().items.find((i) => i.id === target.id)).toBeUndefined()
  })

  it('adds file version snapshots', () => {
    const { items, addVersion } = useDriveStore.getState()
    const file = items.find((i) => i.kind !== FILE_KINDS.FOLDER)

    const initialVersionCount = file.versions.length
    addVersion(file.id, 'New file content string', 'Milestone release')

    const updated = useDriveStore.getState().items.find((i) => i.id === file.id)
    expect(updated.versions.length).toBe(initialVersionCount + 1)
    expect(updated.versions[0].comment).toBe('Milestone release')
  })

  it('handles navigation, view mode and search query', () => {
    const { setActiveSection, setCurrentFolderId, setViewMode, setSearchQuery } =
      useDriveStore.getState()

    setActiveSection(DRIVE_SECTIONS.RECENT)
    expect(useDriveStore.getState().activeSection).toBe(DRIVE_SECTIONS.RECENT)

    setCurrentFolderId('custom-fld')
    expect(useDriveStore.getState().currentFolderId).toBe('custom-fld')

    setViewMode(VIEW_MODES.LIST)
    expect(useDriveStore.getState().viewMode).toBe(VIEW_MODES.LIST)

    setSearchQuery('search keyword')
    expect(useDriveStore.getState().searchQuery).toBe('search keyword')
  })
})
