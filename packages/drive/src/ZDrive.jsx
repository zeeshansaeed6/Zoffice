/**
 * ZDrive Main Application Component.
 * Offline file manager, storage analytics, and version history.
 * @module ZDrive
 */

import React, { useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { HardDrive, Folder, FileText } from 'lucide-react'
import { getDriveRibbonConfig } from './ribbon-config.jsx'
import { useDriveStore } from './core/drive-store.js'
import { DRIVE_SECTIONS, VIEW_MODES, FILE_KINDS } from './core/constants.js'
import { DriveSidebar } from './components/DriveSidebar.jsx'
import { DriveToolbar } from './components/DriveToolbar.jsx'
import { DriveGridView } from './views/DriveGridView.jsx'
import { DriveListView } from './views/DriveListView.jsx'
import { StorageAnalyticsView } from './views/StorageAnalyticsView.jsx'
import { VersionHistoryModal } from './dialogs/VersionHistoryModal.jsx'
import { NewFolderModal } from './dialogs/NewFolderModal.jsx'

/**
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} [props.title='ZDrive']
 * @param {string} [props.initialContent='']
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZDrive({
  id: _id,
  title: _title = 'ZDrive',
  initialContent: _initialContent = '',
  onChange: _onChange,
  onSave: _onSave,
}) {
  const {
    items,
    activeSection,
    currentFolderId,
    viewMode,
    searchQuery,
    sortField,
    sortDirection,
    selectedItemIds,
    isVersionModalOpen,
    versionTargetFile,
    isNewFolderModalOpen,
    setActiveSection,
    setCurrentFolderId,
    setViewMode,
    setSearchQuery,
    setSort,
    toggleSelect,
    createFolder,
    createFile,
    toggleStarred,
    setColorTag,
    moveToTrash,
    deletePermanently,
    addVersion,
    openVersionModal,
    closeVersionModal,
    openNewFolderModal,
    closeNewFolderModal,
  } = useDriveStore()

  // Filter items according to section, folder, and search query
  const displayedItems = useMemo(() => {
    let list = items

    // Section filtering
    if (activeSection === DRIVE_SECTIONS.RECENT) {
      list = list.filter((i) => !i.trashed && i.kind !== FILE_KINDS.FOLDER)
    } else if (activeSection === DRIVE_SECTIONS.STARRED) {
      list = list.filter((i) => !i.trashed && i.starred)
    } else if (activeSection === DRIVE_SECTIONS.TRASH) {
      list = list.filter((i) => i.trashed)
    } else if (activeSection === DRIVE_SECTIONS.MY_DRIVE) {
      list = list.filter((i) => !i.trashed && i.parentId === currentFolderId)
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((i) => i.name.toLowerCase().includes(q))
    }

    // Sorting
    return [...list].sort((a, b) => {
      // Keep folders on top in My Drive
      if (activeSection === DRIVE_SECTIONS.MY_DRIVE) {
        if (a.kind === FILE_KINDS.FOLDER && b.kind !== FILE_KINDS.FOLDER) return -1
        if (a.kind !== FILE_KINDS.FOLDER && b.kind === FILE_KINDS.FOLDER) return 1
      }

      let comparison = 0
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === 'size') {
        comparison = (a.size || 0) - (b.size || 0)
      } else {
        comparison = (a.updatedAt || 0) - (b.updatedAt || 0)
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [items, activeSection, currentFolderId, searchQuery, sortField, sortDirection])

  // Bulk actions
  const handleDeleteSelected = useCallback(() => {
    selectedItemIds.forEach((id) => {
      if (activeSection === DRIVE_SECTIONS.TRASH) {
        deletePermanently(id)
      } else {
        moveToTrash(id)
      }
    })
  }, [selectedItemIds, activeSection, deletePermanently, moveToTrash])

  const handleStarSelected = useCallback(() => {
    selectedItemIds.forEach((id) => toggleStarred(id))
  }, [selectedItemIds, toggleStarred])

  const handleTagSelected = useCallback(
    (color) => {
      selectedItemIds.forEach((id) => setColorTag(id, color))
    },
    [selectedItemIds, setColorTag],
  )

  const handleOpenFile = useCallback(
    (file) => {
      openVersionModal(file)
    },
    [openVersionModal],
  )

  const ribbonActions = useMemo(() => {
    return {
      onNewFolder: openNewFolderModal,
      onNewFile: () =>
        createFile(`Untitled Document ${Date.now().toString().slice(-4)}.docx`, FILE_KINDS.WRITER),
      onSetViewMode: setViewMode,
      onStarItem: handleStarSelected,
      onTrashItem: handleDeleteSelected,
      onOpenStorage: () => setActiveSection(DRIVE_SECTIONS.STORAGE),
      onOpenMyDrive: () => setActiveSection(DRIVE_SECTIONS.MY_DRIVE),
      onOpenVersions: () => {
        const file = items.find((i) => i.id === selectedItemIds[0])
        if (file) openVersionModal(file)
      },
      onSave: () => {},
    }
  }, [
    openNewFolderModal,
    createFile,
    setViewMode,
    handleStarSelected,
    handleDeleteSelected,
    setActiveSection,
    items,
    selectedItemIds,
    openVersionModal,
  ])

  const ribbonConfig = useMemo(() => {
    return getDriveRibbonConfig(ribbonActions, viewMode)
  }, [ribbonActions, viewMode])

  return (
    <div
      data-testid="zdrive-app"
      className="flex h-full w-full flex-col bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100"
    >
      <Ribbon {...ribbonConfig} />

      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar
          activeSection={activeSection}
          items={items}
          onSelectSection={setActiveSection}
          onOpenNewFolder={openNewFolderModal}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <DriveToolbar
            searchQuery={searchQuery}
            viewMode={viewMode}
            sortField={sortField}
            sortDirection={sortDirection}
            currentFolderId={currentFolderId}
            items={items}
            selectedItemIds={selectedItemIds}
            onSearchChange={setSearchQuery}
            onViewModeChange={setViewMode}
            onSortChange={setSort}
            onNavigateFolder={setCurrentFolderId}
            onDeleteSelected={handleDeleteSelected}
            onStarSelected={handleStarSelected}
            onTagSelected={handleTagSelected}
            onOpenVersions={() => {
              const file = items.find((i) => i.id === selectedItemIds[0])
              if (file) openVersionModal(file)
            }}
          />

          <div className="flex-1 overflow-hidden">
            {activeSection === DRIVE_SECTIONS.STORAGE ? (
              <StorageAnalyticsView items={items} onOpenFile={handleOpenFile} />
            ) : viewMode === VIEW_MODES.LIST ? (
              <DriveListView
                items={displayedItems}
                selectedItemIds={selectedItemIds}
                onToggleSelect={toggleSelect}
                onNavigateFolder={setCurrentFolderId}
                onToggleStar={toggleStarred}
                onOpenFile={handleOpenFile}
                onDelete={(id) =>
                  activeSection === DRIVE_SECTIONS.TRASH ? deletePermanently(id) : moveToTrash(id)
                }
              />
            ) : (
              <DriveGridView
                items={displayedItems}
                selectedItemIds={selectedItemIds}
                onToggleSelect={toggleSelect}
                onNavigateFolder={setCurrentFolderId}
                onToggleStar={toggleStarred}
                onOpenFile={handleOpenFile}
              />
            )}
          </div>
        </div>
      </div>

      <StatusBar>
        <StatusBarSlot>
          <HardDrive size={12} className="mr-1 inline text-blue-500" />
          ZDrive &bull; {activeSection.replace('_', ' ').toUpperCase()}
        </StatusBarSlot>
        <StatusBarSlot>
          <Folder size={12} className="mr-1 inline text-amber-500" />
          {displayedItems.filter((i) => i.kind === FILE_KINDS.FOLDER).length} Folders
        </StatusBarSlot>
        <StatusBarSlot>
          <FileText size={12} className="mr-1 inline text-slate-400" />
          {displayedItems.filter((i) => i.kind !== FILE_KINDS.FOLDER).length} Files
        </StatusBarSlot>
        <StatusBarSlot>Offline Local Sync</StatusBarSlot>
      </StatusBar>

      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        file={versionTargetFile}
        onAddVersion={addVersion}
        onClose={closeVersionModal}
      />

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onCreateFolder={createFolder}
        onClose={closeNewFolderModal}
      />
    </div>
  )
}
