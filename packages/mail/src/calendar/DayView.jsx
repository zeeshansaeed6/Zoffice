import React, { useMemo } from 'react'
import { useCalendarStore } from './calendar-store.js'
import { expandEventsInRange } from './rrule.js'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

/**
 * Day view for ZCalendar.
 */
export function DayView() {
  const { selectedDate, events, openCreateEvent, openEditEvent } = useCalendarStore()

  const current = useMemo(() => new Date(selectedDate), [selectedDate])

  const rangeStart = useMemo(() => {
    const s = new Date(current)
    s.setHours(0, 0, 0, 0)
    return s
  }, [current])

  const rangeEnd = useMemo(() => {
    const e = new Date(current)
    e.setHours(23, 59, 59, 999)
    return e
  }, [current])

  const visibleEvents = useMemo(() => {
    return expandEventsInRange(events, rangeStart, rangeEnd)
  }, [events, rangeStart, rangeEnd])

  const getEventsForHour = (hour) => {
    return visibleEvents.filter((ev) => new Date(ev.startDate).getHours() === hour)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
      {/* Day Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-800/50">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {current.toLocaleDateString([], {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h2>
      </div>

      {/* Hourly Grid */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour)
          return (
            <div
              key={hour}
              onClick={() => {
                const d = new Date(current)
                d.setHours(hour, 0, 0, 0)
                openCreateEvent({ startDate: d.toISOString() })
              }}
              className="flex min-h-[58px] cursor-pointer border-b border-neutral-100 hover:bg-neutral-50/60 dark:border-neutral-800/60 dark:hover:bg-neutral-800/30"
            >
              <div className="w-16 shrink-0 pr-3 pt-1.5 text-right text-xs font-medium text-neutral-400">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
              </div>
              <div className="flex-1 space-y-1 p-1">
                {hourEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditEvent(ev.id)
                    }}
                    style={{ backgroundColor: ev.color || '#2563eb' }}
                    className="flex items-center justify-between rounded-lg p-2 text-xs font-medium text-white shadow-sm"
                  >
                    <span>{ev.title}</span>
                    <span className="text-[10px] opacity-80">{ev.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
