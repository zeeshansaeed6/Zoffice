/**
 * ZPlanner Desktop Application Component.
 * Full-featured project planning suite with Kanban, Gantt timeline, and Calendar views.
 * @module ZPlanner
 */

import React, { useEffect, useMemo } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { Kanban, BarChart2, Calendar, Search, Filter } from 'lucide-react'
import { getPlannerRibbonConfig } from './ribbon-config.jsx'
import { VIEW_MODES, PRIORITY, PRIORITY_CONFIG } from './core/constants.js'
import { usePlannerStore } from './core/planner-store.js'
import { KanbanBoard } from './kanban/KanbanBoard.jsx'
import { TaskDetailModal } from './kanban/TaskDetailModal.jsx'
import { GanttView } from './gantt/GanttView.jsx'
import { TaskCalendarView } from './calendar/TaskCalendarView.jsx'
import { TrelloImportModal } from './dialogs/TrelloImportModal.jsx'
import { exportBoardToJson } from './core/trello-importer.js'

/**
 * @param {Object} props
 * @param {string} props.id - Tab document ID
 * @param {string} [props.title='ZPlanner'] - Tab title
 * @param {string} [props.initialContent=''] - Stored state JSON
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZPlanner({
  id: _id,
  title: _title = 'ZPlanner',
  initialContent: _initialContent = '',
  onChange,
  onSave,
}) {
  const {
    board,
    activeView,
    ganttZoom,
    searchQuery,
    filterPriority,
    setActiveView,
    setGanttZoom,
    setSearchQuery,
    setFilterPriority,
    updateBoardInfo,
    addTask,
    addColumn,
    setIsImportModalOpen,
    setActiveTaskId,
  } = usePlannerStore()

  // Sync state changes with parent document tab
  useEffect(() => {
    if (onChange && board.tasks.length > 0) {
      onChange(JSON.stringify(board))
    }
  }, [board, onChange])

  const ribbonActions = useMemo(() => {
    const handleSave = () => {
      if (onSave) {
        onSave(JSON.stringify(board, null, 2))
      }
    }

    const handleExportJson = () => {
      const json = exportBoardToJson(board)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${board.title.replace(/\s+/g, '_')}_board.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const handleAddTask = () => {
      const firstColId = board.columns[0]?.id || ''
      const newTask = addTask(firstColId, { title: 'New Task' })
      if (newTask?.id) {
        setActiveTaskId(newTask.id)
      }
    }

    return {
      onSave: handleSave,
      canSave: true,
      onAddTask: handleAddTask,
      onAddColumn: () => addColumn('New Column'),
      onSetView: (v) => setActiveView(v),
      onSetGanttZoom: (z) => setGanttZoom(z),
      onExportJson: handleExportJson,
      onOpenImport: () => setIsImportModalOpen(true),
    }
  }, [
    onSave,
    board,
    addTask,
    addColumn,
    setActiveView,
    setGanttZoom,
    setIsImportModalOpen,
    setActiveTaskId,
  ])

  const ribbonConfig = useMemo(
    () => getPlannerRibbonConfig(ribbonActions, activeView, ganttZoom),
    [ribbonActions, activeView, ganttZoom],
  )

  const completedCount = board.tasks.filter(
    (t) => t.progress === 100 || t.columnId === board.columns[board.columns.length - 1]?.id,
  ).length

  return (
    <div
      data-testid="zplanner-app"
      className="flex h-full w-full flex-col bg-slate-100 dark:bg-slate-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Top Filter and View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        {/* Left: Board Title & View Tabs */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={board.title}
            onChange={(e) => updateBoardInfo({ title: e.target.value })}
            className="focus:outline-hidden border-b border-transparent bg-transparent text-sm font-bold text-slate-800 hover:border-slate-300 focus:border-blue-500 dark:text-slate-100"
            placeholder="Board Title"
          />

          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <button
              type="button"
              data-testid="tab-kanban"
              onClick={() => setActiveView(VIEW_MODES.KANBAN)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeView === VIEW_MODES.KANBAN
                  ? 'shadow-xs bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Kanban size={14} />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              data-testid="tab-gantt"
              onClick={() => setActiveView(VIEW_MODES.GANTT)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeView === VIEW_MODES.GANTT
                  ? 'shadow-xs bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <BarChart2 size={14} />
              <span>Gantt</span>
            </button>

            <button
              type="button"
              data-testid="tab-calendar"
              onClick={() => setActiveView(VIEW_MODES.CALENDAR)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeView === VIEW_MODES.CALENDAR
                  ? 'shadow-xs bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Calendar size={14} />
              <span>Calendar</span>
            </button>
          </div>
        </div>

        {/* Right: Search & Priority Filter */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:outline-hidden w-40 rounded-lg border border-slate-300 bg-slate-50 py-1 pl-8 pr-3 text-xs text-slate-800 focus:border-blue-500 sm:w-52 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded border border-slate-300 bg-slate-50 px-1.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All Priorities</option>
              {Object.values(PRIORITY).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIG[p]?.label || p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {activeView === VIEW_MODES.KANBAN && <KanbanBoard />}
        {activeView === VIEW_MODES.GANTT && <GanttView />}
        {activeView === VIEW_MODES.CALENDAR && <TaskCalendarView />}
      </div>

      {/* Modals */}
      <TaskDetailModal />
      <TrelloImportModal />

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{board.tasks.length} tasks</StatusBarSlot>
            <StatusBarSlot>{completedCount} completed</StatusBarSlot>
            <StatusBarSlot>{board.columns.length} columns</StatusBarSlot>
            <StatusBarSlot>Offline SQLite Connected</StatusBarSlot>
          </>
        }
        centerContent="Ready"
      />
    </div>
  )
}
