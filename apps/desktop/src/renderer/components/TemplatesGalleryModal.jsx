import React, { useState, useMemo } from 'react'
import {
  X,
  Search,
  FileText,
  DollarSign,
  Presentation,
  CheckSquare,
  BookOpen,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  TrendingUp,
  Tv,
  BarChart,
  Smile,
  UserCheck,
  Kanban,
  Megaphone,
  Network,
  GitFork,
  LayoutTemplate,
  Plus,
} from 'lucide-react'
import { Dialog } from '@zoffice/ui'
import {
  getTemplates,
  getCategoriesWithCounts,
} from '@zoffice/core'
import { useTabStore } from '../stores/tab-store.js'

const ICON_MAP = {
  FileText,
  DollarSign,
  Presentation,
  CheckSquare,
  BookOpen,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  TrendingUp,
  Tv,
  BarChart,
  Smile,
  UserCheck,
  Kanban,
  Megaphone,
  Network,
  GitFork,
  LayoutTemplate,
}

const APP_BADGES = {
  writer: { label: 'ZWriter', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  sheets: { label: 'ZSheets', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  slides: { label: 'ZSlides', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  notes: { label: 'ZNotes', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  forms: { label: 'ZForms', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  planner: { label: 'ZPlanner', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
  draw: { label: 'ZDraw', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
}

/**
 * In-App Templates Gallery Modal.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.initialAppId]
 */
export function TemplatesGalleryModal({ isOpen, onClose, initialAppId = null }) {
  const openTab = useTabStore((s) => s.openTab)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedApp, setSelectedApp] = useState(initialAppId || 'all')
  const [search, setSearch] = useState('')

  const categoriesWithCounts = useMemo(() => getCategoriesWithCounts(), [])

  const filteredTemplates = useMemo(() => {
    return getTemplates({
      appId: selectedApp === 'all' ? undefined : selectedApp,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      search: search || undefined,
    })
  }, [selectedApp, selectedCategory, search])

  const handleSelectTemplate = (template) => {
    openTab(template.appId, template.title, null, template.content)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Templates Gallery"
      size="4xl"
    >
      <div className="flex max-h-[75vh] flex-col">
        {/* Search & Filter Bar */}
        <div className="mb-4 flex flex-col gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 20+ original templates..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-1.5 pl-9 pr-8 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="app-filter-select" className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              App:
            </label>
            <select
              id="app-filter-select"
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-700 focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <option value="all">All Apps</option>
              <option value="writer">ZWriter</option>
              <option value="sheets">ZSheets</option>
              <option value="slides">ZSlides</option>
              <option value="notes">ZNotes</option>
              <option value="forms">ZForms</option>
              <option value="planner">ZPlanner</option>
              <option value="draw">ZDraw</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {categoriesWithCounts.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center">
              <LayoutTemplate size={40} className="mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                No templates found matching your criteria.
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Try searching for a different keyword or resetting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredTemplates.map((template) => {
                const IconComponent = ICON_MAP[template.icon] || FileText
                const badge = APP_BADGES[template.appId] || {
                  label: template.appId,
                  color: 'bg-neutral-100 text-neutral-600',
                }

                return (
                  <div
                    key={template.id}
                    className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500"
                  >
                    <div>
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                          <IconComponent size={18} />
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                        {template.title}
                      </h4>
                      <p className="mt-1.5 text-xs line-clamp-3 text-neutral-500 dark:text-neutral-400">
                        {template.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-100 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      <Plus size={14} />
                      Use Template
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
