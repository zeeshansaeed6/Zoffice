import { describe, it, expect } from 'vitest'
import { createEvent, createAttendee } from '../calendar/calendar-model.js'
import { expandEventsInRange } from '../calendar/rrule.js'
import { exportToIcs, parseIcs, formatIcsDate, parseIcsDate } from '../calendar/ics.js'
import { RECURRENCE_FREQ } from '../core/constants.js'

describe('ZCalendar Models & Engine', () => {
  it('creates calendar events with defaults', () => {
    const ev = createEvent({
      title: 'Design Sprint',
      location: 'Room 402',
    })
    expect(ev.id).toMatch(/^evt-/)
    expect(ev.title).toBe('Design Sprint')
    expect(ev.location).toBe('Room 402')
    expect(ev.allDay).toBe(false)
    expect(ev.recurrence.freq).toBe(RECURRENCE_FREQ.NONE)
  })

  it('creates attendees with statuses', () => {
    const att = createAttendee('colleague@example.com', 'Alex Rivera', 'accepted')
    expect(att.email).toBe('colleague@example.com')
    expect(att.name).toBe('Alex Rivera')
    expect(att.status).toBe('accepted')
  })

  it('expands recurring events across date windows', () => {
    const start = new Date(2026, 9, 1, 10, 0)
    const end = new Date(2026, 9, 1, 11, 0)

    const dailyEvent = createEvent({
      title: 'Daily Standup',
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      recurrence: { freq: RECURRENCE_FREQ.DAILY, interval: 1 },
    })

    const rangeStart = new Date(2026, 9, 1, 0, 0, 0)
    const rangeEnd = new Date(2026, 9, 7, 23, 59, 59) // 7 full days

    const occurrences = expandEventsInRange([dailyEvent], rangeStart, rangeEnd)
    expect(occurrences.length).toBe(7)
  })

  it('formats and parses iCalendar dates', () => {
    const d = new Date('2026-10-24T14:30:00.000Z')
    const icsDate = formatIcsDate(d)
    expect(icsDate).toBe('20261024T143000Z')

    const parsed = parseIcsDate('20261024T143000Z')
    expect(new Date(parsed).getUTCFullYear()).toBe(2026)
    expect(new Date(parsed).getUTCMonth()).toBe(9) // 0-indexed month
    expect(new Date(parsed).getUTCDate()).toBe(24)
  })

  it('exports to RFC 5545 iCalendar and imports roundtrip', () => {
    const ev = createEvent({
      title: 'Sprint Retrospective',
      description: 'Review what went well and areas to improve.',
      location: 'Virtual',
      startDate: '2026-10-24T15:00:00.000Z',
      endDate: '2026-10-24T16:00:00.000Z',
      attendees: [createAttendee('dev@zoffice.org', 'Dev User')],
    })

    const icsText = exportToIcs([ev])
    expect(icsText).toContain('BEGIN:VCALENDAR')
    expect(icsText).toContain('BEGIN:VEVENT')
    expect(icsText).toContain('SUMMARY:Sprint Retrospective')
    expect(icsText).toContain('END:VEVENT')

    const imported = parseIcs(icsText)
    expect(imported.length).toBe(1)
    expect(imported[0].title).toBe('Sprint Retrospective')
    expect(imported[0].description).toContain('Review what went well')
    expect(imported[0].location).toBe('Virtual')
    expect(imported[0].attendees.length).toBe(1)
    expect(imported[0].attendees[0].email).toBe('dev@zoffice.org')
  })
})
