import React from 'react'
import { Loader2 } from 'lucide-react'

const APP_META = {
  writer: { name: 'ZWriter', color: 'text-blue-600', desc: 'Loading document engine...' },
  sheets: { name: 'ZSheets', color: 'text-emerald-600', desc: 'Loading spreadsheet engine...' },
  slides: { name: 'ZSlides', color: 'text-amber-600', desc: 'Loading presentation engine...' },
  notes: { name: 'ZNotes', color: 'text-violet-600', desc: 'Loading notebook canvas...' },
  mail: {
    name: 'ZMail & ZCalendar',
    color: 'text-sky-600',
    desc: 'Loading mail & calendar client...',
  },
  forms: { name: 'ZForms', color: 'text-indigo-600', desc: 'Loading form builder...' },
  planner: { name: 'ZPlanner', color: 'text-teal-600', desc: 'Loading project board...' },
  draw: { name: 'ZDraw', color: 'text-rose-600', desc: 'Loading vector diagramming...' },
  base: { name: 'ZBase', color: 'text-purple-600', desc: 'Loading relational database...' },
  drive: { name: 'ZDrive', color: 'text-cyan-600', desc: 'Loading local cloud drive...' },
}

/**
 * Accessible loading fallback displayed while an application package is dynamically loaded.
 *
 * @param {Object} props
 * @param {string} props.appId
 * @param {string} [props.title]
 */
export function AppLoadingFallback({ appId, title }) {
  const meta = APP_META[appId] || {
    name: 'Zoffice App',
    color: 'text-blue-600',
    desc: 'Loading workspace...',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full w-full select-none flex-col items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Loader2 className={`h-8 w-8 animate-spin ${meta.color}`} />
        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {meta.name}
            {title ? ` — ${title}` : ''}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{meta.desc}</p>
        </div>
      </div>
    </div>
  )
}
