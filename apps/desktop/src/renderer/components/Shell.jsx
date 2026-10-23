import React, { useEffect, useState, useMemo } from 'react'
import { TabBar } from './TabBar.jsx'
import { AppLoader } from './AppLoader.jsx'
import { useTabStore } from '../stores/tab-store.js'
import {
  createShortcutRegistry,
  createAutosaveController,
  getRecoverableDocuments,
  clearRecoveryDocument,
  openFile,
  saveFile,
  saveFileAs,
  t,
} from '@zoffice/core'
import { Dialog } from '@zoffice/ui'
import { useTheme } from '@zoffice/ui'

/**
 * Shell container hosting TabBar, active AppLoader, shortcuts, and autosave.
 */
export function Shell() {
  const { tabs, activeTabId, openTab, closeTab, markClean } = useTabStore()
  const { toggleTheme } = useTheme()
  const [recoverableDocs, setRecoverableDocs] = useState([])
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)

  // Crash recovery check on mount
  useEffect(() => {
    async function checkRecovery() {
      const docs = await getRecoverableDocuments()
      if (docs && docs.length > 0) {
        setRecoverableDocs(docs)
        setShowRecoveryDialog(true)
      }
    }
    checkRecovery()
  }, [])

  const handleRecover = () => {
    recoverableDocs.forEach((doc) => {
      openTab(doc.appId, `${doc.title} (Recovered)`, doc.filePath, doc.content)
      clearRecoveryDocument(doc.id)
    })
    setShowRecoveryDialog(false)
    setRecoverableDocs([])
  }

  const handleDiscardRecovery = () => {
    recoverableDocs.forEach((doc) => {
      clearRecoveryDocument(doc.id)
    })
    setShowRecoveryDialog(false)
    setRecoverableDocs([])
  }

  // Keyboard shortcut registry
  const registry = useMemo(() => createShortcutRegistry(), [])

  useEffect(() => {
    const handleSave = async () => {
      const activeTab = tabs.find((t) => t.id === activeTabId)
      if (!activeTab) return
      if (activeTab.filePath) {
        await saveFile(activeTab.filePath, activeTab.content)
        markClean(activeTab.id, activeTab.filePath)
      } else {
        const ext =
          activeTab.appId === 'sheets' ? 'xlsx' : activeTab.appId === 'slides' ? 'pptx' : 'docx'
        const res = await saveFileAs(activeTab.title, activeTab.content, ext)
        if (!res.cancelled && res.filePath) {
          markClean(activeTab.id, res.filePath)
        }
      }
    }

    const handleOpen = async () => {
      const res = await openFile()
      if (!res.cancelled && res.filePath) {
        openTab(res.appId || 'writer', res.title, res.filePath, res.content || '')
      }
    }

    registry.register({
      id: 'save',
      keys: 'Ctrl+S',
      description: 'Save Document',
      handler: handleSave,
    })

    registry.register({
      id: 'open',
      keys: 'Ctrl+O',
      description: 'Open Document',
      handler: handleOpen,
    })

    registry.register({
      id: 'new',
      keys: 'Ctrl+N',
      description: 'New Document',
      handler: () => openTab('writer'),
    })

    registry.register({
      id: 'close',
      keys: 'Ctrl+W',
      description: 'Close Document',
      handler: () => {
        if (activeTabId) closeTab(activeTabId)
      },
    })

    const onKeyDown = (e) => registry.handleKeyDown(e)
    window.addEventListener('keydown', onKeyDown)

    // Electron menu action subscription
    let unsubscribeMenu = () => {}
    if (typeof window !== 'undefined' && window.zofficeAPI?.onMenuAction) {
      unsubscribeMenu = window.zofficeAPI.onMenuAction((action) => {
        switch (action) {
          case 'file:save':
            handleSave()
            break
          case 'file:open':
            handleOpen()
            break
          case 'file:new':
            openTab('writer')
            break
          case 'file:closeTab':
            if (activeTabId) closeTab(activeTabId)
            break
          case 'view:toggleTheme':
            toggleTheme()
            break
          default:
            break
        }
      })
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      registry.destroy()
      unsubscribeMenu()
    }
  }, [tabs, activeTabId, openTab, closeTab, markClean, registry, toggleTheme])

  // Periodic autosave for dirty tabs
  useEffect(() => {
    const autosave = createAutosaveController({
      intervalMs: 30000,
      getDirtyDocuments: () =>
        tabs
          .filter((t) => t.dirty)
          .map((t) => ({
            id: t.id,
            title: t.title,
            appId: t.appId,
            filePath: t.filePath,
            content: t.content,
            timestamp: Date.now(),
          })),
    })

    autosave.start()
    return () => autosave.stop()
  }, [tabs])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <TabBar />
      <main className="relative flex-1 overflow-hidden">
        <AppLoader />
      </main>

      {/* Crash Recovery Dialog */}
      {showRecoveryDialog && (
        <Dialog
          isOpen={showRecoveryDialog}
          title={t('recovery.title')}
          onClose={handleDiscardRecovery}
          footer={
            <>
              <button
                type="button"
                onClick={handleDiscardRecovery}
                className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {t('recovery.discard')}
              </button>
              <button
                type="button"
                onClick={handleRecover}
                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {t('recovery.recover')}
              </button>
            </>
          }
        >
          <p>{t('recovery.message')}</p>
          <ul className="mt-2 list-disc pl-5 text-xs text-neutral-600 dark:text-neutral-400">
            {recoverableDocs.map((doc) => (
              <li key={doc.id}>{doc.title || 'Untitled'}</li>
            ))}
          </ul>
        </Dialog>
      )}
    </div>
  )
}
