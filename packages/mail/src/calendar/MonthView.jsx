import React, { useMemo } from 'react'
import { useCalendarStore } from './calendar-store.js'
import { expandEventsInRange } from './rrule.js'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Month grid view for ZCalendar.
 */
export function MonthView() {
  const { selectedDate, events, openCreateEvent, openEditEvent } = useCalendarStore()

  const current = useMemo(() => new Date(selectedDate), [selectedDate])
  const year = current.getFullYear()
  const month = current.getMonth()

  // Build 35 or 42 grid cells for the month
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    const prevMonthLastDate = new Date(year, month, 0).getDate()

    const cells = []

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthLastDate - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let d = 1; d <= lastDate; d++) {
      cells.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      })
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = 35 - cells.length > 0 ? 35 - cells.length : 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      })
    }

    return cells
  }, [year, month])

  // Expand events for the visible month window
  const visibleEvents = useMemo(() => {
    if (calendarCells.length === 0) return []
    const rangeStart = calendarCells[0].date
    const rangeEnd = new Date(calendarCells[calendarCells.length - 1].date)
    rangeEnd.setHours(23, 59, 59, 999)
    return expandEventsInRange(events, rangeStart, rangeEnd)
  }, [calendarCells, events])

  const getEventsForDay = (date) => {
    const dayStr = date.toDateString()
    return visibleEvents.filter((ev) => new Date(ev.startDate).toDateString() === dayStr)
  }

  const isToday = (date) => date.toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50 text-center text-xs font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid flex-1 grid-cols-7 grid-rows-5 divide-x divide-y divide-neutral-200 border-b border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
        {calendarCells.map((cell, idx) => {
          const dayEvents = getEventsForDay(cell.date)
          const today = isToday(cell.date)

          return (
            <div
              key={idx}
              onClick={() => openCreateEvent({ startDate: cell.date.toISOString() })}
              className={`group relative flex cursor-pointer flex-col overflow-hidden p-1.5 transition-colors ${
                cell.isCurrentMonth
                  ? 'bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800/40'
                  : 'bg-neutral-50/60 text-neutral-400 dark:bg-neutral-950/40 dark:text-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    today
                      ? 'bg-blue-600 font-bold text-white shadow-sm'
                      : cell.isCurrentMonth
                        ? 'text-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-400'
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-medium text-neutral-400">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="mt-1 flex-1 space-y-1 overflow-y-auto">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditEvent(ev.id)
                    }}
                    style={{ borderLeftColor: ev.color || '#2563eb' }}
                    className="shadow-xs truncate rounded border-l-2 bg-blue-50/80 px-1.5 py-0.5 text-[10px] font-medium text-blue-900 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-200"
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <p className="pl-1 text-[9px] font-semibold text-neutral-400">
                    +{dayEvents.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
