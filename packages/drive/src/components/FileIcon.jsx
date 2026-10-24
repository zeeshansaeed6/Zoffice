/**
 * ZDrive Document & Folder Icon Helper.
 * @module FileIcon
 */

import React from 'react'
import {
  Folder,
  FileText,
  Sheet,
  Presentation,
  Book,
  Mail,
  CheckSquare,
  Kanban,
  PenTool,
  Database,
  File,
} from 'lucide-react'
import { FILE_KINDS, COLOR_TAGS } from '../core/constants.js'

/**
 * Returns rendered icon for document kind.
 * @param {Object} props
 * @param {string} props.kind
 * @param {string} [props.colorTag]
 * @param {number} [props.size=24]
 * @param {boolean} [props.filled=false]
 */
export function FileIcon({ kind, colorTag = 'none', size = 24, filled = false }) {
  const tagColor = COLOR_TAGS.find((t) => t.id === colorTag)?.color

  if (kind === FILE_KINDS.FOLDER) {
    return (
      <Folder
        size={size}
        className={filled ? 'fill-amber-400 text-amber-500' : 'text-amber-500'}
        style={
          tagColor && tagColor !== 'transparent'
            ? { color: tagColor, fill: filled ? tagColor : 'none' }
            : {}
        }
      />
    )
  }

  switch (kind) {
    case FILE_KINDS.WRITER:
      return <FileText size={size} className="text-blue-600 dark:text-blue-400" />
    case FILE_KINDS.SHEETS:
      return <Sheet size={size} className="text-emerald-600 dark:text-emerald-400" />
    case FILE_KINDS.SLIDES:
      return <Presentation size={size} className="text-amber-600 dark:text-amber-400" />
    case FILE_KINDS.NOTES:
      return <Book size={size} className="text-violet-600 dark:text-violet-400" />
    case FILE_KINDS.MAIL:
      return <Mail size={size} className="text-indigo-600 dark:text-indigo-400" />
    case FILE_KINDS.FORMS:
      return <CheckSquare size={size} className="text-teal-600 dark:text-teal-400" />
    case FILE_KINDS.PLANNER:
      return <Kanban size={size} className="text-rose-600 dark:text-rose-400" />
    case FILE_KINDS.DRAW:
      return <PenTool size={size} className="text-cyan-600 dark:text-cyan-400" />
    case FILE_KINDS.BASE:
      return <Database size={size} className="text-purple-600 dark:text-purple-400" />
    default:
      return <File size={size} className="text-slate-400" />
  }
}
