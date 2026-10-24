import React, { useEffect, useState } from 'react'
import { FolderOpen, Plus, Clock, LayoutTemplate, Trash2, File } from 'lucide-react'
import { useTabStore } from '../stores/tab-store.js'
import { getRecentFiles, clearRecentFiles, openFile, t } from '@zoffice/core'
import { APP_TILES, getRecentAppIcon } from './start-screen-tiles.jsx'

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
              {t('start.welcome')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenFile}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <FolderOpen size={16} />
              {t('start.openExisting')}
            </button>
          </div>
        </div>

        {/* New Document Section */}
        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('start.newDocument')}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {APP_TILES.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openTab(app.id)}
                className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-all hover:scale-[1.02] hover:shadow-md dark:border-neutral-800 ${app.accent}`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-neutral-900">
                      {app.icon}
                    </span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Plus size={18} className="text-neutral-400" />
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {app.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {app.tagline}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  <Plus size={14} />
                  <span>Create new</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent & Templates Split Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Recent Files (2 cols) */}
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
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <Trash2 size={12} />
                  {t('start.clearRecent')}
                </button>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {loading ? (
                <div className="p-8 text-center text-sm text-neutral-400">Loading...</div>
              ) : recent.length === 0 ? (
                <div className="p-8 text-center">
                  <File size={32} className="mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {t('start.noRecent')}
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
                        <span className="text-neutral-400">{getRecentAppIcon(item.appId)}</span>
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
