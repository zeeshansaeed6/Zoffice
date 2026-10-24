import React from 'react'
import { CalendarPlus, Calendar, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react'

/**
 * Returns tabs configuration for Calendar view.
 * @param {Object} actions
 * @returns {any[]}
 */
export function getCalendarTabs(actions = {}) {
  return [
    {
      id: 'calendar-home',
      label: 'Home',
      groups: [
        {
          id: 'cal-new',
          label: 'New',
          controls: [
            {
              id: 'btn-new-event',
              type: 'button',
              label: 'New Event',
              size: 'large',
              icon: <CalendarPlus size={18} />,
              onClick: actions.onNewEvent,
            },
          ],
        },
        {
          id: 'cal-nav',
          label: 'Navigate',
          controls: [
            {
              id: 'btn-today',
              type: 'button',
              label: 'Today',
              size: 'large',
              icon: <Calendar size={18} />,
              onClick: actions.onToday,
            },
            {
              id: 'btn-prev',
              type: 'button',
              label: 'Previous',
              icon: <ChevronLeft size={14} />,
              onClick: actions.onPrevDate,
            },
            {
              id: 'btn-next',
              type: 'button',
              label: 'Next',
              icon: <ChevronRight size={14} />,
              onClick: actions.onNextDate,
            },
          ],
        },
        {
          id: 'cal-views',
          label: 'Arrange',
          controls: [
            {
              id: 'btn-view-day',
              type: 'button',
              label: 'Day',
              onClick: () => actions.onSetCalendarView('day'),
            },
            {
              id: 'btn-view-week',
              type: 'button',
              label: 'Week',
              onClick: () => actions.onSetCalendarView('week'),
            },
            {
              id: 'btn-view-month',
              type: 'button',
              label: 'Month',
              onClick: () => actions.onSetCalendarView('month'),
            },
          ],
        },
        {
          id: 'cal-io',
          label: 'iCalendar Import / Export',
          controls: [
            {
              id: 'btn-export-ics',
              type: 'button',
              label: 'Export .ICS',
              icon: <Download size={14} />,
              onClick: actions.onExportIcs,
            },
            {
              id: 'btn-import-ics',
              type: 'button',
              label: 'Import .ICS',
              icon: <Upload size={14} />,
              onClick: actions.onImportIcs,
            },
          ],
        },
      ],
    },
  ]
}
