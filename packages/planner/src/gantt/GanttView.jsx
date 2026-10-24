/**
 * GanttView — interactive Gantt chart timeline with zoom levels and SVG dependency links.
 * @module GanttView
 */

import React, { useMemo } from 'react'
import { Flag } from 'lucide-react'
import { usePlannerStore } from '../core/planner-store.js'
import {
  getTimelineBounds,
  generateTimelineGrid,
  calculateTaskCoordinates,
  calculateDependencyPath,
} from '../core/gantt-engine.js'
import { PRIORITY_CONFIG } from '../core/constants.js'

export function GanttView() {
  const { board, ganttZoom, setGanttZoom, setActiveTaskId, searchQuery, filterPriority } =
    usePlannerStore()

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return board.tasks.filter((task) => {
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  }, [board.tasks, searchQuery, filterPriority])

  const { minDate, maxDate } = useMemo(() => {
    return getTimelineBounds(filteredTasks)
  }, [filteredTasks])

  const gridColumns = useMemo(() => {
    return generateTimelineGrid(minDate, maxDate, ganttZoom)
  }, [minDate, maxDate, ganttZoom])

  const totalGridWidth = useMemo(() => {
    return gridColumns.reduce((sum, col) => sum + col.width, 0)
  }, [gridColumns])

  // Map task coordinates for rendering bars and dependency arrows
  const taskCoordsMap = useMemo(() => {
    /** @type {Map<string, { left: number, width: number, y: number }>} */
    const map = new Map()
    filteredTasks.forEach((task, idx) => {
      const coords = calculateTaskCoordinates(task, minDate, ganttZoom)
      map.set(task.id, {
        ...coords,
        y: idx * 44 + 22, // Middle of 44px row
      })
    })
    return map
  }, [filteredTasks, minDate, ganttZoom])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-950">
      {/* Zoom controls header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Timeline ({filteredTasks.length} tasks)
        </span>
        <div className="flex items-center gap-1 rounded-lg bg-slate-200 p-0.5 dark:bg-slate-800">
          {['day', 'week', 'month'].map((zoom) => (
            <button
              key={zoom}
              type="button"
              onClick={() => setGanttZoom(zoom)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                ganttZoom === zoom
                  ? 'shadow-xs bg-white text-blue-600 dark:bg-slate-700 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              {zoom}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Body: Left table, Right timeline */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Task List */}
        <div className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex h-10 items-center border-b border-slate-200 px-3 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Task Name
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTaskId(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveTaskId(task.id)
                  }
                }}
                className="flex h-11 cursor-pointer select-none items-center justify-between border-b border-slate-100 px-3 text-xs hover:bg-blue-50/50 dark:border-slate-800/60 dark:hover:bg-blue-950/20"
              >
                <div className="mr-2 flex items-center gap-2 truncate">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: PRIORITY_CONFIG[task.priority]?.color || '#94a3b8',
                    }}
                  />
                  <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {task.title}
                  </span>
                </div>
                {task.isMilestone ? (
                  <Flag className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                ) : (
                  <span className="shrink-0 text-[11px] text-slate-400">{task.progress}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Canvas */}
        <div className="relative flex-1 overflow-auto">
          <div
            style={{ width: `${Math.max(totalGridWidth, 800)}px` }}
            className="flex min-h-full flex-col"
          >
            {/* Timeline Header Row */}
            <div className="shadow-xs sticky top-0 z-10 flex h-10 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {gridColumns.map((col, idx) => (
                <div
                  key={idx}
                  style={{ width: `${col.width}px` }}
                  className="flex shrink-0 items-center justify-center truncate border-r border-slate-100 px-1 text-[11px] font-medium text-slate-500 dark:border-slate-800"
                >
                  {col.label}
                </div>
              ))}
            </div>

            {/* Timeline Rows Container */}
            <div
              className="relative flex-1"
              style={{ minHeight: `${filteredTasks.length * 44}px` }}
            >
              {/* Background vertical grid columns */}
              <div className="pointer-events-none absolute inset-0 flex">
                {gridColumns.map((col, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${col.width}px` }}
                    className="h-full shrink-0 border-r border-slate-100 dark:border-slate-800/60"
                  />
                ))}
              </div>

              {/* SVG Overlay for Dependency Arrows */}
              <svg
                className="pointer-events-none absolute inset-0"
                style={{
                  width: `${totalGridWidth}px`,
                  height: `${filteredTasks.length * 44}px`,
                }}
              >
                <defs>
                  <marker
                    id="dep-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                  </marker>
                </defs>
                {board.dependencies.map((dep) => {
                  const pred = taskCoordsMap.get(dep.predecessorId)
                  const succ = taskCoordsMap.get(dep.successorId)
                  if (!pred || !succ) return null

                  const start = { x: pred.left + pred.width, y: pred.y }
                  const end = { x: succ.left, y: succ.y }
                  const d = calculateDependencyPath(start, end)

                  return (
                    <path
                      key={dep.id}
                      d={d}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      markerEnd="url(#dep-arrow)"
                    />
                  )
                })}
              </svg>

              {/* Task Rows & Bars */}
              {filteredTasks.map((task, idx) => {
                const coords = taskCoordsMap.get(task.id) || {
                  left: 0,
                  width: 50,
                  y: 22,
                }
                const pColor = PRIORITY_CONFIG[task.priority]?.color || '#3b82f6'

                return (
                  <div
                    key={task.id}
                    style={{ top: `${idx * 44}px` }}
                    className="absolute flex h-11 w-full items-center border-b border-slate-100 dark:border-slate-800/40"
                  >
                    {task.isMilestone ? (
                      /* Milestone Diamond */
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveTaskId(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setActiveTaskId(task.id)
                          }
                        }}
                        style={{ left: `${coords.left}px` }}
                        className="z-5 absolute flex h-6 w-6 rotate-45 cursor-pointer items-center justify-center border-2 border-white bg-amber-500 shadow-sm transition-transform hover:scale-110"
                        title={`${task.title} (Milestone)`}
                      />
                    ) : (
                      /* Task Bar */
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setActiveTaskId(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setActiveTaskId(task.id)
                          }
                        }}
                        style={{
                          left: `${coords.left}px`,
                          width: `${coords.width}px`,
                        }}
                        className="shadow-xs z-5 group absolute flex h-7 cursor-pointer items-center overflow-hidden rounded-md border border-blue-400/80 bg-blue-100 px-2 transition-shadow hover:shadow-md dark:bg-blue-950/70"
                        title={`${task.title} (${task.progress}%)`}
                      >
                        {/* Progress Fill */}
                        <div
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor: pColor,
                          }}
                          className="absolute inset-y-0 left-0 opacity-40 transition-all"
                        />
                        <span className="relative truncate text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                          {task.title}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
