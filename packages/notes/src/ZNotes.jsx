import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { NotebookSidebar } from './sidebar/NotebookSidebar.jsx'
import { NoteCanvas } from './canvas/NoteCanvas.jsx'
import { getNotesRibbonConfig } from './ribbon/ribbon-config.jsx'
import { useNoteStore } from './core/note-store.js'
import { SearchDialog } from './dialogs/SearchDialog.jsx'
import { PageLinkDialog } from './dialogs/PageLinkDialog.jsx'
import { WebClipDialog } from './dialogs/WebClipDialog.jsx'
import { getTemplate } from './core/templates.js'
import { htmlToBlocks } from './core/web-clip.js'
import { exportNotebookToZip, downloadBlob } from './core/zip-export.js'
import { renderPageLinks } from './core/page-link.js'

/**
 * ZNotes Desktop Notebook Application Component.
 *
 * @param {Object} props
 * @param {string} props.id - Tab ID
 * @param {string} [props.title='ZNotes Notebook'] - Display title
 * @param {string} [props.initialContent=''] - Serialized notebook JSON
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZNotes({
  id: _id,
  title: _title = 'ZNotes Notebook',
  initialContent = '',
  onChange,
  onSave,
}) {
  const [zoom, setZoom] = useState(100)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isPageLinkOpen, setIsPageLinkOpen] = useState(false)
  const [isWebClipOpen, setIsWebClipOpen] = useState(false)

  const {
    notebooks,
    activeNotebookId,
    activeSectionId,
    activePageId,
    initDefault,
    setNotebooks,
    addNotebook,
    addSection,
    addPage,
    addBlock,
    selectNotebook,
    selectSection,
    selectPage,
    togglePageTag,
    getActivePage,
  } = useNoteStore()

  // Initialize notebooks on mount
  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotebooks(parsed)
          return
        }
      } catch {
        // Fall back to default
      }
    }
    initDefault()
  }, [initDefault, initialContent, setNotebooks])

  // Notify parent of content changes
  useEffect(() => {
    if (onChange && notebooks.length > 0) {
      onChange(JSON.stringify(notebooks))
    }
  }, [notebooks, onChange])

  const activeNotebook = useMemo(
    () => notebooks.find((n) => n.id === activeNotebookId) || null,
    [notebooks, activeNotebookId],
  )
  const activeSection = useMemo(
    () => activeNotebook?.sections.find((s) => s.id === activeSectionId) || null,
    [activeNotebook, activeSectionId],
  )
  const activePage = getActivePage()

  // Apply template
  const handleApplyTemplate = useCallback(
    (templateId) => {
      const tmpl = getTemplate(templateId)
      if (!tmpl || !activeSectionId) return
      const newPage = tmpl.create(activeSectionId)
      useNoteStore.setState((s) => ({
        notebooks: s.notebooks.map((n) =>
          n.id === activeNotebookId
            ? {
                ...n,
                sections: n.sections.map((sec) =>
                  sec.id === activeSectionId
                    ? { ...sec, pages: [...sec.pages, newPage], updatedAt: Date.now() }
                    : sec,
                ),
                updatedAt: Date.now(),
              }
            : n,
        ),
        activePageId: newPage.id,
      }))
    },
    [activeNotebookId, activeSectionId],
  )

  // Handle Export ZIP
  const handleExportZip = useCallback(async () => {
    if (!activeNotebook) return
    const blob = await exportNotebookToZip(activeNotebook)
    downloadBlob(blob, `${activeNotebook.name || 'notebook'}.zip`)
  }, [activeNotebook])

  // Handle Web Clip paste
  const handleWebClip = useCallback(
    (html) => {
      if (!activePageId) return
      const blocks = htmlToBlocks(html, activePageId)
      if (blocks.length === 0) return
      useNoteStore.setState((s) => ({
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
                            ? { ...p, blocks: [...p.blocks, ...blocks], updatedAt: Date.now() }
                            : p,
                        ),
                      }
                    : sec,
                ),
              }
            : n,
        ),
      }))
    },
    [activeNotebookId, activeSectionId, activePageId],
  )

  // Handle Insert Page Link into current page
  const handleInsertPageLink = useCallback(
    (linkText) => {
      if (!activePageId) return
      addBlock('text', { content: renderPageLinks(linkText) })
    },
    [activePageId, addBlock],
  )

  // Handle Save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(JSON.stringify(notebooks, null, 2))
    }
  }, [notebooks, onSave])

  // Navigate from Search
  const handleSearchNavigate = useCallback(
    (nbId, secId, pgId) => {
      selectNotebook(nbId)
      selectSection(secId)
      selectPage(pgId)
    },
    [selectNotebook, selectSection, selectPage],
  )

  const ribbonConfig = useMemo(
    () =>
      getNotesRibbonConfig({
        onSave: handleSave,
        canSave: true,
        onNewPage: () => addPage('Untitled Page'),
        onNewSection: () => addSection('New Section'),
        onNewNotebook: () => addNotebook('New Notebook'),
        onToggleTag: (tag) => activePage && togglePageTag(activePage.id, tag),
        onOpenSearch: () => setIsSearchOpen(true),
        onAddBlock: (type) => addBlock(type),
        onApplyTemplate: handleApplyTemplate,
        onOpenPageLinkDialog: () => setIsPageLinkOpen(true),
        onExportZip: handleExportZip,
        onWebClip: () => setIsWebClipOpen(true),
        onZoomIn: () => setZoom((z) => Math.min(200, z + 10)),
        onZoomOut: () => setZoom((z) => Math.max(50, z - 10)),
        onZoomReset: () => setZoom(100),
      }),
    [
      handleSave,
      addPage,
      addSection,
      addNotebook,
      activePage,
      togglePageTag,
      addBlock,
      handleApplyTemplate,
      handleExportZip,
    ],
  )

  return (
    <div
      data-testid="znotes-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Main Workspace: Sidebar + Free-form Canvas */}
      <div className="flex flex-1 overflow-hidden" style={{ zoom: `${zoom}%` }}>
        <NotebookSidebar onSearchOpen={() => setIsSearchOpen(true)} />
        <NoteCanvas />
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{activeNotebook ? activeNotebook.name : 'No Notebook'}</StatusBarSlot>
            {activeSection && <StatusBarSlot>{activeSection.name}</StatusBarSlot>}
            {activePage && <StatusBarSlot>{activePage.title}</StatusBarSlot>}
            {activePage && <StatusBarSlot>{activePage.blocks.length} blocks</StatusBarSlot>}
          </>
        }
        centerContent={activePage?.tags?.length ? `Tags: ${activePage.tags.join(', ')}` : 'Ready'}
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notebooks={notebooks}
        onNavigate={handleSearchNavigate}
      />

      {/* Page Link Dialog */}
      <PageLinkDialog
        isOpen={isPageLinkOpen}
        onClose={() => setIsPageLinkOpen(false)}
        notebooks={notebooks}
        onInsertLink={handleInsertPageLink}
      />

      {/* Web Clip Dialog */}
      <WebClipDialog
        isOpen={isWebClipOpen}
        onClose={() => setIsWebClipOpen(false)}
        onClip={handleWebClip}
      />
    </div>
  )
}
