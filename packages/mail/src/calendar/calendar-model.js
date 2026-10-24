/**
 * ZCalendar Data Models — factory functions for events, recurrence, and attendees.
 * @module calendar-model
 */

import { RECURRENCE_FREQ } from '../core/constants.js'
import { generateId } from '../core/mail-model.js'

/**
 * @typedef {Object} Attendee
 * @property {string} email
 * @property {string} [name]
 * @property {'accepted' | 'tentative' | 'declined' | 'needs-action'} status
 */

/**
 * Create a calendar attendee.
 * @param {string} email
 * @param {string} [name]
 * @param {string} [status='needs-action']
 * @returns {Attendee}
 */
export function createAttendee(email, name = '', status = 'needs-action') {
  return { email, name: name || email, status }
}

/**
 * @typedef {Object} RecurrenceRule
 * @property {string} freq - One of RECURRENCE_FREQ
 * @property {number} [interval=1]
 * @property {number} [count]
 * @property {string} [until] - ISO date string
 */

/**
 * @typedef {Object} CalendarEvent
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [location]
 * @property {string} startDate - ISO date/time string
 * @property {string} endDate - ISO date/time string
 * @property {boolean} allDay
 * @property {RecurrenceRule} recurrence
 * @property {number} reminder - Minutes before event (0 for none)
 * @property {string} color
 * @property {Attendee[]} attendees
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a new calendar event.
 * @param {Partial<CalendarEvent>} [overrides={}]
 * @returns {CalendarEvent}
 */
export function createEvent(overrides = {}) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0)

  return {
    id: overrides.id || generateId('evt'),
    title: overrides.title || 'New Event',
    description: overrides.description || '',
    location: overrides.location || '',
    startDate: overrides.startDate || start.toISOString(),
    endDate: overrides.endDate || end.toISOString(),
    allDay: overrides.allDay ?? false,
    recurrence: overrides.recurrence || { freq: RECURRENCE_FREQ.NONE, interval: 1 },
    reminder: overrides.reminder ?? 15,
    color: overrides.color || '#3b82f6',
    attendees: overrides.attendees || [],
    createdAt: overrides.createdAt || Date.now(),
    updatedAt: overrides.updatedAt || Date.now(),
  }
}
