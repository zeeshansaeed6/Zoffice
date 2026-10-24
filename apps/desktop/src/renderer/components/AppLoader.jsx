import React, { Suspense, lazy } from 'react'
import { useTabStore } from '../stores/tab-store.js'
import { StartScreen } from '../pages/StartScreen.jsx'
import { AppLoadingFallback } from './AppLoadingFallback.jsx'
import { saveFile, saveFileAs } from '@zoffice/core'

const ZWriter = lazy(() => import('@zoffice/writer').then((m) => ({ default: m.ZWriter })))
const ZSheets = lazy(() => import('@zoffice/sheets').then((m) => ({ default: m.ZSheets })))
const ZSlides = lazy(() => import('@zoffice/slides').then((m) => ({ default: m.ZSlides })))
const ZNotes = lazy(() => import('@zoffice/notes').then((m) => ({ default: m.ZNotes })))
const ZMail = lazy(() => import('@zoffice/mail').then((m) => ({ default: m.ZMail })))
const ZForms = lazy(() => import('@zoffice/forms').then((m) => ({ default: m.ZForms })))
const ZPlanner = lazy(() => import('@zoffice/planner').then((m) => ({ default: m.ZPlanner })))
const ZDraw = lazy(() => import('@zoffice/draw').then((m) => ({ default: m.ZDraw })))
const ZBase = lazy(() => import('@zoffice/base').then((m) => ({ default: m.ZBase })))
const ZDrive = lazy(() => import('@zoffice/drive').then((m) => ({ default: m.ZDrive })))

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
        activeTab.appId === 'sheets'
          ? 'xlsx'
          : activeTab.appId === 'slides'
            ? 'pptx'
            : activeTab.appId === 'notes'
              ? 'json'
              : 'docx'
      const res = await saveFileAs(activeTab.title, contentToSave, ext)
      if (!res.cancelled && res.filePath) {
        markClean(activeTab.id, res.filePath)
      }
    }
  }

  const handleContentChange = (content) => {
    updateContent(activeTab.id, content)
  }

  const renderActiveApp = () => {
    switch (activeTab.appId) {
      case 'sheets':
        return (
          <ZSheets key={activeTab.id} id={activeTab.id} title={activeTab.title} onSave={handleSave} />
        )
      case 'slides':
        return (
          <ZSlides key={activeTab.id} id={activeTab.id} title={activeTab.title} onSave={handleSave} />
        )
      case 'notes':
        return (
          <ZNotes
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'mail':
        return (
          <ZMail
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'forms':
        return (
          <ZForms
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'planner':
        return (
          <ZPlanner
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'draw':
        return (
          <ZDraw
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'base':
        return (
          <ZBase
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
        )
      case 'drive':
        return (
          <ZDrive
            key={activeTab.id}
            id={activeTab.id}
            title={activeTab.title}
            initialContent={activeTab.content}
            onChange={handleContentChange}
            onSave={handleSave}
          />
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

  return (
    <Suspense fallback={<AppLoadingFallback appId={activeTab.appId} title={activeTab.title} />}>
      {renderActiveApp()}
    </Suspense>
  )
}
