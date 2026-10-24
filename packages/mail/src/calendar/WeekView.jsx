import React, { useMemo } from 'react'
import { useCalendarStore } from './calendar-store.js'
import { expandEventsInRange } from './rrule.js'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

/**
 * Week and Work-Week view for ZCalendar.
 * @param {Object} props
 * @param {boolean} [props.isWorkWeek=false]
 */
export function WeekView({ isWorkWeek = false }) {
  const { selectedDate, events, openCreateEvent, openEditEvent } = useCalendarStore()

  const current = useMemo(() => new Date(selectedDate), [selectedDate])

  const days = useMemo(() => {
    const list = []
    const startOfWeek = new Date(current)
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek) // start at Sunday

    const totalDays = isWorkWeek ? 5 : 7
    const offset = isWorkWeek ? 1 : 0 // Monday for work week

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startOfWeek)
      d.setDate(d.getDate() + offset + i)
      list.push(d)
    }
    return list
  }, [current, isWorkWeek])

  const rangeStart = days[0]
  const rangeEnd = useMemo(() => {
    const end = new Date(days[days.length - 1])
    end.setHours(23, 59, 59, 999)
    return end
  }, [days])

  const visibleEvents = useMemo(() => {
    return expandEventsInRange(events, rangeStart, rangeEnd)
  }, [events, rangeStart, rangeEnd])

  const getEventsForDayAndHour = (date, hour) => {
    const dayStr = date.toDateString()
    return visibleEvents.filter((ev) => {
      const evDate = new Date(ev.startDate)
      return evDate.toDateString() === dayStr && evDate.getHours() === hour
    })
  }

  const isToday = (date) => date.toDateString() === new Date().toDateString()

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
      {/* Day Headers */}
      <div className="flex border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
        <div className="w-14 shrink-0 border-r border-neutral-200 dark:border-neutral-800" />
        <div
          className={`grid flex-1 grid-cols-${days.length} divide-x divide-neutral-200 text-center dark:divide-neutral-800`}
        >
          {days.map((day) => (
            <div key={day.toISOString()} className="py-2 text-xs">
              <p className="text-[10px] font-semibold uppercase text-neutral-500">
                {day.toLocaleDateString([], { weekday: 'short' })}
              </p>
              <p
                className={`mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  isToday(day) ? 'bg-blue-600 text-white' : 'text-neutral-800 dark:text-neutral-200'
                }`}
              >
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Schedule */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="flex min-h-[52px] border-b border-neutral-100 dark:border-neutral-800/60"
          >
            <div className="w-14 shrink-0 pr-2 pt-1 text-right text-[10px] font-medium text-neutral-400">
              {hour === 0
                ? '12 AM'
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? '12 PM'
                    : `${hour - 12} PM`}
            </div>
            <div
              className={`grid flex-1 grid-cols-${days.length} divide-x divide-neutral-100 dark:divide-neutral-800/60`}
            >
              {days.map((day) => {
                const slotEvents = getEventsForDayAndHour(day, hour)
                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => {
                      const d = new Date(day)
                      d.setHours(hour, 0, 0, 0)
                      openCreateEvent({ startDate: d.toISOString() })
                    }}
                    className="relative cursor-pointer p-0.5 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/30"
                  >
                    {slotEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditEvent(ev.id)
                        }}
                        style={{ backgroundColor: ev.color || '#2563eb' }}
                        className="shadow-xs truncate rounded p-1 text-[10px] font-medium text-white"
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
