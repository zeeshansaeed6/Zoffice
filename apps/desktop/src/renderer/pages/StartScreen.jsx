import React, { useEffect, useState } from 'react'
import {
  FileText,
  Sheet,
  Presentation,
  FolderOpen,
  Plus,
  Clock,
  LayoutTemplate,
  Trash2,
  File,
  Book,
} from 'lucide-react'
import { useTabStore } from '../stores/tab-store.js'
import { getRecentFiles, clearRecentFiles, openFile, t } from '@zoffice/core'

/**
 * Zoffice Start Screen / Launcher home window.
 */
export function StartScreen() {
  const openTab = useTabStore((s) => s.openTab)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRecent = async () => {
    setLoading(true)
    const list = await getRecentFiles(15)
    setRecent(list)
    setLoading(false)
  }

  useEffect(() => {
    loadRecent()
  }, [])

  const handleOpenFile = async () => {
    const result = await openFile()
    if (!result.cancelled && result.filePath) {
      openTab(result.appId || 'writer', result.title, result.filePath, result.content || '')
      loadRecent()
    }
  }

  const handleOpenRecent = async (item) => {
    openTab(item.appId, item.title, item.filePath, '')
  }

  const handleClearRecent = async () => {
    await clearRecentFiles()
    setRecent([])
  }

  const appTiles = [
    {
      id: 'writer',
      name: 'ZWriter',
      tagline: 'Word processing documents',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      accent: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20',
      icon: <FileText size={32} className="text-blue-600 dark:text-blue-400" />,
    },
    {
      id: 'sheets',
      name: 'ZSheets',
      tagline: 'Spreadsheets and workbooks',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accent: 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20',
      icon: <Sheet size={32} className="text-emerald-600 dark:text-emerald-400" />,
    },
    {
      id: 'slides',
      name: 'ZSlides',
      tagline: 'Slide decks and presentations',
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      accent: 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20',
      icon: <Presentation size={32} className="text-amber-600 dark:text-amber-400" />,
    },
    {
      id: 'notes',
      name: 'ZNotes',
      tagline: 'Notebooks, notes and sketches',
      color: 'bg-violet-600 hover:bg-violet-700 text-white',
      accent: 'border-violet-500/20 bg-violet-50/50 dark:bg-violet-950/20',
      icon: <Book size={32} className="text-violet-600 dark:text-violet-400" />,
    },
  ]

  return (
    <div
      data-testid="start-screen"
      className="flex h-full w-full flex-col overflow-y-auto bg-neutral-100 p-8 dark:bg-neutral-950"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-black text-white shadow">
                Z
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Zoffice
              </h1>
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {t('app.tagline')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenFile}
            className="dark:hover:bg-neutral-750 inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <FolderOpen size={18} />
            {t('start.openFile')}
          </button>
        </div>

        {/* App Launch Tiles */}
        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('start.newDocument')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {appTiles.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openTab(app.id)}
                className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${app.accent} dark:border-neutral-800`}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-neutral-900">
                    {app.icon}
                  </div>
                  <span className="rounded-full bg-neutral-200/50 p-1 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-neutral-800 dark:text-neutral-300">
                    <Plus size={16} />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {app.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {app.tagline}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Recent Files & Templates */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Recent Files List (2 cols) */}
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Clock size={14} />
                {t('start.recentFiles')}
              </h2>
              {recent.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRecent}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 size={12} />
                  {t('start.clearRecent')}
                </button>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {loading ? (
                <div className="p-8 text-center text-xs text-neutral-400">Loading...</div>
              ) : recent.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <File size={32} className="mb-2 text-neutral-300 dark:text-neutral-600" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t('start.noRecentFiles')}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {recent.map((item) => (
                    <button
                      key={item.id || item.filePath}
                      type="button"
                      onClick={() => handleOpenRecent(item)}
                      className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-neutral-400">
                          {item.appId === 'sheets' ? (
                            <Sheet size={18} className="text-emerald-600" />
                          ) : item.appId === 'slides' ? (
                            <Presentation size={18} className="text-amber-600" />
                          ) : item.appId === 'notes' ? (
                            <Book size={18} className="text-violet-600" />
                          ) : (
                            <FileText size={18} className="text-blue-600" />
                          )}
                        </span>
                        <div className="truncate">
                          <p className="truncate text-xs font-medium text-neutral-800 dark:text-neutral-200">
                            {item.title}
                          </p>
                          <p className="truncate text-[10px] text-neutral-400">{item.filePath}</p>
                        </div>
                      </div>
                      <span className="ml-4 whitespace-nowrap text-[10px] text-neutral-400">
                        {new Date(item.lastOpened).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Templates Placeholder (1 col) */}
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <LayoutTemplate size={14} />
              {t('start.templates')}
            </h2>
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white/50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
              <LayoutTemplate
                size={36}
                className="mx-auto mb-2 text-neutral-300 dark:text-neutral-600"
              />
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {t('start.templatesComing')}
              </p>
              <p className="mt-1 text-[11px] text-neutral-400">
                Standard templates for documents, budgets, and pitch decks in Phase 1.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
