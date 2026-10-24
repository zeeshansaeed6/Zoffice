import React, { useState } from 'react'
import { X, FileText, Sheet, Presentation, Book, Mail, CheckSquare, Kanban } from 'lucide-react'

/**
 * @param {Object} props
 * @param {import('../stores/tab-store.js').DocumentTab} props.tab
 * @param {boolean} props.isActive
 * @param {number} props.index
 * @param {() => void} props.onSelect
 * @param {() => void} props.onClose
 * @param {(fromIndex: number, toIndex: number) => void} props.onMove
 */
export function Tab({ tab, isActive, index, onSelect, onClose, onMove }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.setData('text/plain', String(index))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const fromIndex = Number(e.dataTransfer.getData('text/plain'))
    if (!isNaN(fromIndex) && fromIndex !== index) {
      onMove(fromIndex, index)
    }
  }

  const getIcon = () => {
    switch (tab.appId) {
      case 'sheets':
        return <Sheet size={14} className="text-emerald-600 dark:text-emerald-400" />
      case 'slides':
        return <Presentation size={14} className="text-amber-600 dark:text-amber-400" />
      case 'notes':
        return <Book size={14} className="text-violet-600 dark:text-violet-400" />
      case 'mail':
        return <Mail size={14} className="text-indigo-600 dark:text-indigo-400" />
      case 'forms':
        return <CheckSquare size={14} className="text-teal-600 dark:text-teal-400" />
      case 'planner':
        return <Kanban size={14} className="text-rose-600 dark:text-rose-400" />
      default:
        return <FileText size={14} className="text-blue-600 dark:text-blue-400" />
    }
  }

  return (
    <div
      role="tab"
      draggable
      aria-selected={isActive}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={onSelect}
      className={`group relative flex h-9 min-w-[120px] max-w-[200px] cursor-pointer select-none items-center gap-2 border-r border-neutral-200 px-3 text-xs font-medium transition-colors dark:border-neutral-800 ${
        isDragging ? 'opacity-40' : ''
      } ${
        isActive
          ? 'border-t-2 border-t-blue-600 bg-white text-neutral-900 shadow-sm dark:border-t-blue-400 dark:bg-neutral-900 dark:text-neutral-100'
          : 'bg-neutral-200/50 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900'
      }`}
    >
      <span className="flex-shrink-0">{getIcon()}</span>
      <span className="flex-1 truncate">{tab.title}</span>

      {/* Unsaved changes indicator */}
      {tab.dirty && (
        <span
          title="Unsaved changes"
          className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
        />
      )}

      {/* Close button */}
      <button
        type="button"
        aria-label={`Close ${tab.title}`}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="rounded p-0.5 opacity-60 transition-opacity hover:bg-neutral-200 hover:opacity-100 dark:hover:bg-neutral-800"
      >
        <X size={12} />
      </button>
    </div>
  )
}
