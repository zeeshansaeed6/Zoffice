/**
 * TaskCalendarView — monthly calendar grid displaying tasks on their due dates.
 * @module TaskCalendarView
 */

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { usePlannerStore } from '../core/planner-store.js'
import { PRIORITY_CONFIG } from '../core/constants.js'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function TaskCalendarView() {
  const { board, setActiveTaskId, searchQuery, filterPriority } = usePlannerStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const handleToday = () => setCurrentDate(new Date())

  // Generate days in month grid (with padding from previous/next months)
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days = []

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      })
    }

    // Next month padding to round up to complete weeks (multiple of 7)
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let n = 1; n <= remaining; n++) {
        days.push({
          date: new Date(year, month + 1, n),
          isCurrentMonth: false,
        })
      }
    }

    return days
  }, [year, month])

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

  // Map tasks by date string YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    /** @type {Map<string, import('../core/planner-model.js').Task[]>} */
    const map = new Map()
    for (const t of filteredTasks) {
      const d = t.dueDate || t.startDate
      if (!d) continue
      const dateKey = new Date(d).toISOString().slice(0, 10)
      if (!map.has(dateKey)) map.set(dateKey, [])
      map.get(dateKey).push(t)
    }
    return map
  }, [filteredTasks])

  const todayIso = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-950">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {currentDate.toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </h2>
          <button
            type="button"
            onClick={handleToday}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg border border-slate-300 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg border border-slate-300 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 py-2 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid flex-1 auto-rows-fr grid-cols-7 overflow-y-auto">
        {calendarDays.map((cell, idx) => {
          const dateKey = cell.date.toISOString().slice(0, 10)
          const cellTasks = tasksByDate.get(dateKey) || []
          const isToday = dateKey === todayIso

          return (
            <div
              key={idx}
              className={`flex min-h-[90px] flex-col border-b border-r border-slate-100 p-1.5 transition-colors dark:border-slate-800 ${
                !cell.isCurrentMonth
                  ? 'bg-slate-50/40 text-slate-400 dark:bg-slate-950/40'
                  : 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {/* Day Number */}
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-blue-600 font-bold text-white'
                      : cell.isCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400'
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                {cellTasks.length > 0 && (
                  <span className="text-[10px] text-slate-400">{cellTasks.length}</span>
                )}
              </div>

              {/* Tasks for this day */}
              <div className="flex-1 space-y-1 overflow-y-auto">
                {cellTasks.map((t) => {
                  const pConfig = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium
                  return (
                    <div
                      key={t.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveTaskId(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setActiveTaskId(t.id)
                        }
                      }}
                      className="flex cursor-pointer items-center gap-1 truncate rounded border px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: pConfig.bg,
                        color: pConfig.color,
                        borderColor: pConfig.border,
                      }}
                      title={t.title}
                    >
                      {t.isMilestone && <Flag className="h-2.5 w-2.5 shrink-0 text-amber-500" />}
                      <span className="truncate">{t.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
