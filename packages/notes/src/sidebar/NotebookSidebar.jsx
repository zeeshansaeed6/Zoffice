/**
 * ZNotes notebook sidebar — hierarchical tree: notebooks > sections > pages.
 */

import React, { useState } from 'react'
import {
  Book, ChevronDown, ChevronRight, Plus, Trash2, Edit3, Search,
  FileText, MoreHorizontal,
} from 'lucide-react'
import { useNoteStore } from '../core/note-store.js'
import { TAG_META } from '../core/constants.js'

/**
 * Left sidebar showing the notebook hierarchy.
 * @param {Object} props
 * @param {() => void} props.onSearchOpen
 */
export function NotebookSidebar({ onSearchOpen }) {
  const {
    notebooks, activeNotebookId, activeSectionId, activePageId,
    selectNotebook, selectSection, selectPage,
    addNotebook, deleteNotebook, renameNotebook,
    addSection, deleteSection,
    addPage, deletePage, renamePage,
  } = useNoteStore()

  const [expandedNbs, setExpandedNbs] = useState(new Set(notebooks.map((n) => n.id)))
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const toggleExpand = (id) => {
    setExpandedNbs((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const startRename = (id, currentName) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const commitRename = (type) => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null)
      return
    }
    if (type === 'notebook') renameNotebook(editingId, editValue.trim())
    else if (type === 'page') renamePage(editingId, editValue.trim())
    setEditingId(null)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-3 dark:border-neutral-800">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Notebooks
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSearchOpen}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="Search notes"
          >
            <Search size={14} />
          </button>
          <button
            type="button"
            onClick={() => addNotebook('New Notebook')}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            title="New notebook"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Notebook tree */}
      <div className="flex-1 overflow-y-auto p-1">
        {notebooks.map((nb) => (
          <div key={nb.id} className="mb-1">
            {/* Notebook row */}
            <div
              className={`group flex items-center gap-1 rounded px-2 py-1.5 text-xs cursor-pointer ${
                activeNotebookId === nb.id
                  ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                  : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50'
              }`}
            >
              <button type="button" onClick={() => toggleExpand(nb.id)} className="shrink-0">
                {expandedNbs.has(nb.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: nb.color }} />
              {editingId === nb.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitRename('notebook')}
                  onKeyDown={(e) => e.key === 'Enter' && commitRename('notebook')}
                  className="flex-1 rounded border border-violet-300 bg-white px-1 text-xs dark:border-neutral-600 dark:bg-neutral-800"
                  autoFocus
                />
              ) : (
                <span className="flex-1 truncate" onClick={() => selectNotebook(nb.id)}>
                  {nb.name}
                </span>
              )}
              <div className="hidden gap-0.5 group-hover:flex">
                <button type="button" onClick={() => startRename(nb.id, nb.name)} title="Rename">
                  <Edit3 size={11} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
                </button>
                <button type="button" onClick={() => deleteNotebook(nb.id)} title="Delete">
                  <Trash2 size={11} className="text-neutral-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Sections */}
            {expandedNbs.has(nb.id) && (
              <div className="ml-4 border-l border-neutral-200 pl-1 dark:border-neutral-800">
                {nb.sections.map((sec) => (
                  <SectionItem
                    key={sec.id}
                    section={sec}
                    isActive={activeSectionId === sec.id}
                    activePageId={activePageId}
                    onSelectSection={() => { selectNotebook(nb.id); selectSection(sec.id) }}
                    onSelectPage={selectPage}
                    onAddPage={addPage}
                    onDeletePage={deletePage}
                    onDeleteSection={deleteSection}
                    editingId={editingId}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    onStartRename={startRename}
                    onCommitRename={() => commitRename('page')}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addSection('New Section')}
                  className="ml-2 mt-1 flex items-center gap-1 text-[10px] text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <Plus size={10} /> Section
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Individual section item with its pages */
function SectionItem({
  section, isActive, activePageId, onSelectSection, onSelectPage,
  onAddPage, onDeletePage, onDeleteSection,
  editingId, editValue, setEditValue, onStartRename, onCommitRename,
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="mb-0.5">
      <div
        className={`group flex items-center gap-1 rounded px-1.5 py-1 text-[11px] cursor-pointer ${
          isActive
            ? 'bg-violet-50/60 font-medium text-violet-600 dark:bg-violet-950/30 dark:text-violet-400'
            : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40'
        }`}
        onClick={onSelectSection}
      >
        <button type="button" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }} className="shrink-0">
          {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
        <Book size={11} style={{ color: section.color }} className="shrink-0" />
        <span className="flex-1 truncate">{section.name}</span>
        <div className="hidden gap-0.5 group-hover:flex">
          <button type="button" onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id) }} title="Delete section">
            <Trash2 size={10} className="text-neutral-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="ml-3">
          {section.pages.map((pg) => (
            <div
              key={pg.id}
              className={`group flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] cursor-pointer ${
                activePageId === pg.id
                  ? 'bg-violet-100/80 font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                  : 'text-neutral-500 hover:bg-neutral-50 dark:text-neutral-500 dark:hover:bg-neutral-800/30'
              }`}
              onClick={() => onSelectPage(pg.id)}
            >
              <FileText size={10} className="shrink-0 text-neutral-400" />
              {editingId === pg.id ? (
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={onCommitRename}
                  onKeyDown={(e) => e.key === 'Enter' && onCommitRename()}
                  className="flex-1 rounded border border-violet-300 bg-white px-1 text-[11px] dark:border-neutral-600 dark:bg-neutral-800"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 truncate">{pg.title}</span>
              )}
              {pg.tags.length > 0 && (
                <div className="flex gap-0.5">
                  {pg.tags.slice(0, 2).map((t) => (
                    <span key={t} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TAG_META[t]?.color || '#6b7280' }} />
                  ))}
                </div>
              )}
              <div className="hidden gap-0.5 group-hover:flex">
                <button type="button" onClick={(e) => { e.stopPropagation(); onStartRename(pg.id, pg.title) }}>
                  <Edit3 size={9} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); onDeletePage(pg.id) }}>
                  <Trash2 size={9} className="text-neutral-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddPage('Untitled Page')}
            className="ml-1 mt-0.5 flex items-center gap-1 text-[10px] text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <Plus size={9} /> Page
          </button>
        </div>
      )}
    </div>
  )
}
