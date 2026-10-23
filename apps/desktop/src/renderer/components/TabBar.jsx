import React, { useState } from 'react'
import { Plus, Home } from 'lucide-react'
import { Tab } from './Tab.jsx'
import { useTabStore } from '../stores/tab-store.js'
import { ConfirmDialog } from '@zoffice/ui'
import { saveFile, saveFileAs } from '@zoffice/core'

/**
 * Multi-document tab bar with drag reorder and unsaved close confirmation.
 */
export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, reorderTabs, markClean } = useTabStore()
  const [closingTab, setClosingTab] = useState(/** @type {any} */ (null))

  const handleRequestClose = (tab) => {
    if (tab.dirty) {
      setClosingTab(tab)
    } else {
      closeTab(tab.id)
    }
  }

  const handleConfirmSave = async () => {
    if (!closingTab) return
    if (closingTab.filePath) {
      await saveFile(closingTab.filePath, closingTab.content)
      markClean(closingTab.id, closingTab.filePath)
    } else {
      const ext =
        closingTab.appId === 'sheets' ? 'xlsx' : closingTab.appId === 'slides' ? 'pptx' : 'docx'
      const res = await saveFileAs(closingTab.title, closingTab.content, ext)
      if (res.cancelled) return
      if (res.filePath) {
        markClean(closingTab.id, res.filePath)
      }
    }
    closeTab(closingTab.id)
    setClosingTab(null)
  }

  const handleConfirmDiscard = () => {
    if (closingTab) {
      closeTab(closingTab.id)
      setClosingTab(null)
    }
  }

  return (
    <>
      <div
        data-testid="tab-bar"
        className="flex h-9 w-full select-none items-center overflow-x-auto border-b border-neutral-300 bg-neutral-200/90 dark:border-neutral-800 dark:bg-neutral-950"
      >
        {/* Home / Start Screen Tab Button */}
        <button
          type="button"
          aria-label="Start Screen"
          onClick={() => setActiveTab(null)}
          className={`flex h-9 items-center gap-1.5 border-r border-neutral-300 px-3 text-xs font-semibold transition-colors dark:border-neutral-800 ${
            activeTabId === null
              ? 'border-t-2 border-t-blue-600 bg-white text-blue-600 dark:border-t-blue-400 dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
          }`}
        >
          <Home size={14} />
          <span>Start</span>
        </button>

        {/* Document Tabs */}
        <div className="flex h-full flex-1 items-center overflow-x-auto">
          {tabs.map((tab, idx) => (
            <Tab
              key={tab.id}
              tab={tab}
              index={idx}
              isActive={activeTabId === tab.id}
              onSelect={() => setActiveTab(tab.id)}
              onClose={() => handleRequestClose(tab)}
              onMove={reorderTabs}
            />
          ))}
        </div>

        {/* New Tab Button */}
        <button
          type="button"
          aria-label="New Document"
          onClick={() => setActiveTab(null)}
          className="flex h-9 w-9 items-center justify-center text-neutral-500 hover:bg-neutral-300/60 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      {closingTab && (
        <ConfirmDialog
          isOpen={Boolean(closingTab)}
          documentTitle={closingTab.title}
          onSave={handleConfirmSave}
          onDiscard={handleConfirmDiscard}
          onCancel={() => setClosingTab(null)}
        />
      )}
    </>
  )
}
