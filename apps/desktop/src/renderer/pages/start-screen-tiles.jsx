import React from 'react'
import {
  FileText,
  Sheet,
  Presentation,
  Book,
  Mail,
  CheckSquare,
  Kanban,
  PenTool,
  Database,
  HardDrive,
} from 'lucide-react'

/**
 * App tiles configuration for Zoffice Start Screen launcher.
 */
export const APP_TILES = [
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
  {
    id: 'mail',
    name: 'ZMail',
    tagline: 'Email, calendar and contacts',
    color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    accent: 'border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20',
    icon: <Mail size={32} className="text-indigo-600 dark:text-indigo-400" />,
  },
  {
    id: 'forms',
    name: 'ZForms',
    tagline: 'Forms, surveys and responses',
    color: 'bg-teal-600 hover:bg-teal-700 text-white',
    accent: 'border-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20',
    icon: <CheckSquare size={32} className="text-teal-600 dark:text-teal-400" />,
  },
  {
    id: 'planner',
    name: 'ZPlanner',
    tagline: 'Kanban, Gantt and project tasks',
    color: 'bg-rose-600 hover:bg-rose-700 text-white',
    accent: 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20',
    icon: <Kanban size={32} className="text-rose-600 dark:text-rose-400" />,
  },
  {
    id: 'draw',
    name: 'ZDraw',
    tagline: 'Flowcharts, diagrams and schemas',
    color: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    accent: 'border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/20',
    icon: <PenTool size={32} className="text-cyan-600 dark:text-cyan-400" />,
  },
  {
    id: 'base',
    name: 'ZBase',
    tagline: 'Relational database & SQL console',
    color: 'bg-purple-600 hover:bg-purple-700 text-white',
    accent: 'border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20',
    icon: <Database size={32} className="text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 'drive',
    name: 'ZDrive',
    tagline: 'Offline files, storage & versions',
    color: 'bg-sky-600 hover:bg-sky-700 text-white',
    accent: 'border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20',
    icon: <HardDrive size={32} className="text-sky-600 dark:text-sky-400" />,
  },
]

/**
 * Returns icon for recent document item by appId.
 * @param {string} appId
 * @returns {React.ReactNode}
 */
export function getRecentAppIcon(appId) {
  switch (appId) {
    case 'sheets':
      return <Sheet size={18} className="text-emerald-600" />
    case 'slides':
      return <Presentation size={18} className="text-amber-600" />
    case 'notes':
      return <Book size={18} className="text-violet-600" />
    case 'mail':
      return <Mail size={18} className="text-indigo-600" />
    case 'forms':
      return <CheckSquare size={18} className="text-teal-600" />
    case 'planner':
      return <Kanban size={18} className="text-rose-600" />
    case 'draw':
      return <PenTool size={18} className="text-cyan-600" />
    case 'base':
      return <Database size={18} className="text-purple-600" />
    case 'drive':
      return <HardDrive size={18} className="text-sky-600" />
    default:
      return <FileText size={18} className="text-blue-600" />
  }
}
