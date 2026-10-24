/**
 * ZCalendar Zustand Store — manages calendar events, views, and scheduling.
 * @module calendar-store
 */

import { create } from 'zustand'
import { createEvent } from './calendar-model.js'
import { CALENDAR_VIEWS, RECURRENCE_FREQ } from '../core/constants.js'

export const useCalendarStore = create((set, get) => ({
  events: [],
  selectedDate: new Date().toISOString(),
  viewMode: CALENDAR_VIEWS.MONTH,
  activeEventId: null,

  isEventModalOpen: false,
  eventDraft: null,

  /** Initialize store with default sample events if empty */
  initDefault: () => {
    const state = get()
    if (state.events.length > 0) return

    const now = new Date()
    const today10am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0)
    const today11am = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0)

    const tomorrow2pm = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0)
    const tomorrow3pm = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0)

    const ev1 = createEvent({
      title: 'Project Kickoff & Review',
      description: 'Review architecture and roadmap priorities.',
      location: 'Conference Room Alpha',
      startDate: today10am.toISOString(),
      endDate: today11am.toISOString(),
      color: '#2563eb',
    })

    const ev2 = createEvent({
      title: 'Weekly Standup',
      description: 'Sprint progress check-in.',
      location: 'Virtual / Local',
      startDate: tomorrow2pm.toISOString(),
      endDate: tomorrow3pm.toISOString(),
      color: '#059669',
      recurrence: { freq: RECURRENCE_FREQ.WEEKLY, interval: 1 },
    })

    set({
      events: [ev1, ev2],
      activeEventId: ev1.id,
    })
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedDate: (date) =>
    set({ selectedDate: typeof date === 'string' ? date : date.toISOString() }),
  setActiveEventId: (id) => set({ activeEventId: id }),

  addEvent: (data) => {
    const newEvent = createEvent(data)
    set((s) => ({ events: [...s.events, newEvent], activeEventId: newEvent.id }))
    return newEvent
  },

  updateEvent: (id, updates) => {
    set((s) => ({
      events: s.events.map((ev) =>
        ev.id === id ? { ...ev, ...updates, updatedAt: Date.now() } : ev,
      ),
    }))
  },

  deleteEvent: (id) => {
    set((s) => ({
      events: s.events.filter((ev) => ev.id !== id),
      activeEventId: s.activeEventId === id ? null : s.activeEventId,
    }))
  },

  openCreateEvent: (defaults = {}) => {
    const now = new Date(get().selectedDate)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0)

    set({
      isEventModalOpen: true,
      eventDraft: {
        title: defaults.title || '',
        description: defaults.description || '',
        location: defaults.location || '',
        startDate: defaults.startDate || start.toISOString(),
        endDate: defaults.endDate || end.toISOString(),
        allDay: defaults.allDay || false,
        color: defaults.color || '#2563eb',
        recurrence: defaults.recurrence || { freq: RECURRENCE_FREQ.NONE, interval: 1 },
      },
    })
  },

  openEditEvent: (id) => {
    const ev = get().events.find((e) => e.id === id)
    if (!ev) return
    set({
      isEventModalOpen: true,
      activeEventId: id,
      eventDraft: { ...ev },
    })
  },

  closeEventModal: () => set({ isEventModalOpen: false, eventDraft: null }),

  saveEventDraft: () => {
    const { eventDraft, activeEventId } = get()
    if (!eventDraft || !eventDraft.title.trim()) return

    if (activeEventId && get().events.some((e) => e.id === activeEventId)) {
      get().updateEvent(activeEventId, eventDraft)
    } else {
      get().addEvent(eventDraft)
    }
    set({ isEventModalOpen: false, eventDraft: null })
  },
}))
