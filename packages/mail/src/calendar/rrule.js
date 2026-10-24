/**
 * ZCalendar Recurrence Engine — expands recurring events within a date range.
 * @module rrule
 */

import { RECURRENCE_FREQ } from '../core/constants.js'

/**
 * Expand a list of events (including recurring occurrences) within a given date window.
 * @param {import('./calendar-model.js').CalendarEvent[]} events
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @returns {Array<import('./calendar-model.js').CalendarEvent & { isOccurrence?: boolean }>}
 */
export function expandEventsInRange(events = [], rangeStart, rangeEnd) {
  const result = []
  const startMs = rangeStart.getTime()
  const endMs = rangeEnd.getTime()

  for (const event of events) {
    const evStart = new Date(event.startDate).getTime()
    const evEnd = new Date(event.endDate).getTime()
    const duration = evEnd - evStart

    const freq = event.recurrence?.freq || RECURRENCE_FREQ.NONE
    const interval = Math.max(1, event.recurrence?.interval || 1)
    const maxCount = event.recurrence?.count || Infinity
    const untilMs = event.recurrence?.until ? new Date(event.recurrence.until).getTime() : Infinity

    if (freq === RECURRENCE_FREQ.NONE) {
      if (evEnd >= startMs && evStart <= endMs) {
        result.push(event)
      }
      continue
    }

    // Expand recurrence
    const currentStart = new Date(event.startDate)
    let count = 0

    while (
      count < maxCount &&
      currentStart.getTime() <= untilMs &&
      currentStart.getTime() <= endMs
    ) {
      const occurrenceStartMs = currentStart.getTime()
      const occurrenceEndMs = occurrenceStartMs + duration

      if (occurrenceEndMs >= startMs && occurrenceStartMs <= endMs) {
        result.push({
          ...event,
          id: `${event.id}-occ-${count}`,
          startDate: currentStart.toISOString(),
          endDate: new Date(occurrenceEndMs).toISOString(),
          isOccurrence: count > 0,
        })
      }

      count++

      // Advance by frequency
      if (freq === RECURRENCE_FREQ.DAILY) {
        currentStart.setDate(currentStart.getDate() + interval)
      } else if (freq === RECURRENCE_FREQ.WEEKLY) {
        currentStart.setDate(currentStart.getDate() + interval * 7)
      } else if (freq === RECURRENCE_FREQ.MONTHLY) {
        currentStart.setMonth(currentStart.getMonth() + interval)
      } else if (freq === RECURRENCE_FREQ.YEARLY) {
        currentStart.setFullYear(currentStart.getFullYear() + interval)
      } else {
        break
      }
    }
  }

  return result
}
