/**
 * ZCalendar iCalendar (RFC 5545) — import and export .ics files.
 * @module ics
 */

import { createEvent, createAttendee } from './calendar-model.js'
import { RECURRENCE_FREQ } from '../core/constants.js'

/**
 * Format a Date or ISO string into an iCalendar date string: YYYYMMDDTHHMMSSZ
 * @param {string|Date} date
 * @returns {string}
 */
export function formatIcsDate(date) {
  const d = new Date(date)
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Parse an iCalendar date string (YYYYMMDDTHHMMSSZ or YYYYMMDD) into an ISO string.
 * @param {string} icsDate
 * @returns {string}
 */
export function parseIcsDate(icsDate = '') {
  const cleaned = icsDate.trim().replace(/^VALUE=DATE:/, '')
  if (cleaned.length === 8) {
    const y = cleaned.slice(0, 4)
    const m = cleaned.slice(4, 6)
    const d = cleaned.slice(6, 8)
    return new Date(`${y}-${m}-${d}T00:00:00Z`).toISOString()
  }
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/)
  if (match) {
    const [, y, m, d, hh, mm, ss] = match
    return new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}Z`).toISOString()
  }
  return new Date().toISOString()
}

/**
 * Export calendar events to an RFC 5545 .ics string.
 * @param {import('./calendar-model.js').CalendarEvent[]} events
 * @returns {string}
 */
export function exportToIcs(events = []) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Zoffice//ZCalendar 1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const ev of events) {
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${ev.id}@zoffice.local`)
    lines.push(`DTSTAMP:${formatIcsDate(ev.createdAt || Date.now())}`)
    lines.push(`DTSTART:${formatIcsDate(ev.startDate)}`)
    lines.push(`DTEND:${formatIcsDate(ev.endDate)}`)
    lines.push(`SUMMARY:${escapeIcs(ev.title)}`)
    if (ev.description) lines.push(`DESCRIPTION:${escapeIcs(ev.description)}`)
    if (ev.location) lines.push(`LOCATION:${escapeIcs(ev.location)}`)

    if (ev.recurrence?.freq && ev.recurrence.freq !== RECURRENCE_FREQ.NONE) {
      let rrule = `RRULE:FREQ=${ev.recurrence.freq.toUpperCase()}`
      if (ev.recurrence.interval && ev.recurrence.interval > 1) {
        rrule += `;INTERVAL=${ev.recurrence.interval}`
      }
      if (ev.recurrence.count) {
        rrule += `;COUNT=${ev.recurrence.count}`
      }
      if (ev.recurrence.until) {
        rrule += `;UNTIL=${formatIcsDate(ev.recurrence.until)}`
      }
      lines.push(rrule)
    }

    if (Array.isArray(ev.attendees)) {
      for (const att of ev.attendees) {
        lines.push(`ATTENDEE;CN=${escapeIcs(att.name || att.email)}:mailto:${att.email}`)
      }
    }

    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/**
 * Parse an .ics calendar file content into calendar event objects.
 * @param {string} icsContent
 * @returns {import('./calendar-model.js').CalendarEvent[]}
 */
export function parseIcs(icsContent = '') {
  if (!icsContent.includes('BEGIN:VCALENDAR')) return []

  const events = []
  const eventBlocks = icsContent.split('BEGIN:VEVENT').slice(1)

  for (const block of eventBlocks) {
    const lines = block.split(/\r?\n/)
    let title = 'Imported Event'
    let description = ''
    let location = ''
    let startDate = new Date().toISOString()
    let endDate = new Date(Date.now() + 3600000).toISOString()
    const attendees = []

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (line.startsWith('SUMMARY:')) {
        title = unescapeIcs(line.slice(8))
      } else if (line.startsWith('DESCRIPTION:')) {
        description = unescapeIcs(line.slice(12))
      } else if (line.startsWith('LOCATION:')) {
        location = unescapeIcs(line.slice(9))
      } else if (line.startsWith('DTSTART:')) {
        startDate = parseIcsDate(line.slice(8))
      } else if (line.startsWith('DTEND:')) {
        endDate = parseIcsDate(line.slice(6))
      } else if (line.startsWith('ATTENDEE')) {
        const mailMatch = line.match(/mailto:([^\s]+)/i)
        if (mailMatch) {
          const cnMatch = line.match(/CN=([^;:]+)/i)
          attendees.push(createAttendee(mailMatch[1], cnMatch ? cnMatch[1] : ''))
        }
      }
    }

    events.push(
      createEvent({
        title,
        description,
        location,
        startDate,
        endDate,
        attendees,
      }),
    )
  }

  return events
}

function escapeIcs(str = '') {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function unescapeIcs(str = '') {
  return str.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\')
}
