import React from 'react'
import { useTabStore } from '../stores/tab-store.js'
import { StartScreen } from '../pages/StartScreen.jsx'
import { ZWriter } from '@zoffice/writer'
import { ZSheets } from '@zoffice/sheets'
import { ZSlides } from '@zoffice/slides'
import { saveFile, saveFileAs } from '@zoffice/core'

/**
 * Loads the active application component or the Start Screen.
 */
export function AppLoader() {
  const { tabs, activeTabId, updateContent, markClean } = useTabStore()

  if (!activeTabId) {
    return <StartScreen />
  }

  const activeTab = tabs.find((t) => t.id === activeTabId)
  if (!activeTab) {
    return <StartScreen />
  }

  const handleSave = async (overrideContent) => {
    const contentToSave = typeof overrideContent === 'string' ? overrideContent : activeTab.content
    if (activeTab.filePath) {
      await saveFile(activeTab.filePath, contentToSave)
      markClean(activeTab.id, activeTab.filePath)
    } else {
      const ext =
        activeTab.appId === 'sheets' ? 'xlsx' : activeTab.appId === 'slides' ? 'pptx' : 'docx'
      const res = await saveFileAs(activeTab.title, contentToSave, ext)
      if (!res.cancelled && res.filePath) {
        markClean(activeTab.id, res.filePath)
      }
    }
  }

  const handleContentChange = (content) => {
    updateContent(activeTab.id, content)
  }

  switch (activeTab.appId) {
    case 'sheets':
      return (
        <ZSheets key={activeTab.id} id={activeTab.id} title={activeTab.title} onSave={handleSave} />
      )
    case 'slides':
      return (
        <ZSlides key={activeTab.id} id={activeTab.id} title={activeTab.title} onSave={handleSave} />
      )
    case 'writer':
    default:
      return (
        <ZWriter
          key={activeTab.id}
          id={activeTab.id}
          title={activeTab.title}
          initialContent={activeTab.content}
          onChange={handleContentChange}
          onSave={handleSave}
        />
      )
  }
}
