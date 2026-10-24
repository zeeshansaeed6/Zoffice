/**
 * ZBase Calendar View Component — monthly calendar view mapped to record date fields.
 * @module CalendarView
 */

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react'
import { FIELD_TYPES } from '../core/constants.js'

/**
 * @param {Object} props
 * @param {import('../core/base-model.js').BaseTable} props.table
 * @param {string} props.searchQuery
 * @param {(field?: any) => void} props.onOpenFieldModal
 * @param {(record: any) => void} props.onOpenRecordModal
 */
export function CalendarView({
  table,
  searchQuery,
  onOpenFieldModal,
  onOpenRecordModal,
}) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Find primary date field
  const dateField = useMemo(() => {
    return table.fields.find((f) => f.type === FIELD_TYPES.DATE)
  }, [table.fields])

  // Primary title field
  const titleField = useMemo(() => {
    return table.fields.find((f) => f.type === FIELD_TYPES.TEXT) || table.fields[0]
  }, [table.fields])

  // Calendar calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  // Map records by YYYY-MM-DD
  const recordsByDate = useMemo(() => {
    const map = new Map()
    if (!dateField) return map

    table.records.forEach((rec) => {
      const d = rec.fields[dateField.id]
      if (d) {
        const key = String(d).slice(0, 10)
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(rec)
      }
    })
    return map
  }, [table.records, dateField])

  if (!dateField) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center bg-white dark:bg-slate-900">
        <CalendarIcon size={36} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No Date Field Found
        </h3>
        <p className="max-w-md text-xs text-slate-500">
          To use Calendar view, add a Date field to this table so records can be scheduled.
        </p>
        <button
          onClick={() => onOpenFieldModal({ type: FIELD_TYPES.DATE, name: 'Date' })}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} /> Add Date Field
        </button>
      </div>
    )
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const today = () => setCurrentDate(new Date())

  // Generate calendar grid cells (padding blanks + days of month)
  const cells = []
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day)
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-slate-900">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{monthName}</h3>
          <button
            onClick={today}
            className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        {dayNames.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid flex-1 grid-cols-7 auto-rows-fr overflow-y-auto">
        {cells.map((day, idx) => {
          if (!day) {
            return (
              <div
                key={`empty-${idx}`}
                className="border-b border-r border-slate-100 bg-slate-50/40 p-2 dark:border-slate-800/40 dark:bg-slate-950/20"
              />
            )
          }

          const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayRecords = (recordsByDate.get(dayStr) || []).filter((r) => {
            if (!searchQuery) return true
            return Object.values(r.fields).some((v) =>
              String(v).toLowerCase().includes(searchQuery.toLowerCase()),
            )
          })

          const isToday =
            new Date().toDateString() === new Date(year, month, day).toDateString()

          return (
            <div
              key={`day-${day}`}
              className="flex min-h-[90px] flex-col border-b border-r border-slate-200 p-1.5 transition hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/20"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </span>
              </div>

              {/* Record chips */}
              <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                {dayRecords.map((rec) => {
                  const title = rec.fields[titleField?.id] || 'Untitled'
                  return (
                    <div
                      key={rec.id}
                      onClick={() => onOpenRecordModal(rec)}
                      className="cursor-pointer truncate rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/80"
                      title={title}
                    >
                      {title}
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
