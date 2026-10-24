import React from 'react'
import { X, Trash2, Check, Calendar as CalendarIcon } from 'lucide-react'
import { useCalendarStore } from './calendar-store.js'
import { RECURRENCE_FREQ } from '../core/constants.js'

const COLOR_PRESETS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

/**
 * Event creation and editing modal for ZCalendar.
 */
export function EventModal() {
  const {
    isEventModalOpen,
    eventDraft,
    activeEventId,
    closeEventModal,
    saveEventDraft,
    deleteEvent,
  } = useCalendarStore()

  if (!isEventModalOpen || !eventDraft) return null

  const setField = (field, value) => {
    useCalendarStore.setState((s) => ({
      eventDraft: s.eventDraft ? { ...s.eventDraft, [field]: value } : null,
    }))
  }

  const handleDelete = () => {
    if (activeEventId) {
      deleteEvent(activeEventId)
      closeEventModal()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-blue-600 dark:text-blue-400" />
            <h2
              id="event-modal-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              {activeEventId ? 'Edit Event' : 'New Calendar Event'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeEventModal}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5 text-xs">
          {/* Title */}
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Event Title
            </label>
            <input
              type="text"
              value={eventDraft.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Meeting, Appointment, or Task"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              autoFocus
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Starts
              </label>
              <input
                type="datetime-local"
                value={eventDraft.startDate?.slice(0, 16) || ''}
                onChange={(e) => setField('startDate', new Date(e.target.value).toISOString())}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Ends
              </label>
              <input
                type="datetime-local"
                value={eventDraft.endDate?.slice(0, 16) || ''}
                onChange={(e) => setField('endDate', new Date(e.target.value).toISOString())}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Location & Recurrence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Location
              </label>
              <input
                type="text"
                value={eventDraft.location || ''}
                onChange={(e) => setField('location', e.target.value)}
                placeholder="Office or URL"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Repeat
              </label>
              <select
                value={eventDraft.recurrence?.freq || RECURRENCE_FREQ.NONE}
                onChange={(e) => setField('recurrence', { freq: e.target.value, interval: 1 })}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value={RECURRENCE_FREQ.NONE}>Does not repeat</option>
                <option value={RECURRENCE_FREQ.DAILY}>Daily</option>
                <option value={RECURRENCE_FREQ.WEEKLY}>Weekly</option>
                <option value={RECURRENCE_FREQ.MONTHLY}>Monthly</option>
                <option value={RECURRENCE_FREQ.YEARLY}>Yearly</option>
              </select>
            </div>
          </div>

          {/* Color Tag */}
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Color Tag
            </label>
            <div className="flex gap-2">
              {COLOR_PRESETS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setField('color', col)}
                  style={{ backgroundColor: col }}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    eventDraft.color === col ? 'scale-110 ring-2 ring-blue-600 ring-offset-2' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={eventDraft.description || ''}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Additional notes..."
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          {activeEventId ? (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 size={14} /> Delete
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeEventModal}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEventDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Check size={14} /> Save Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
