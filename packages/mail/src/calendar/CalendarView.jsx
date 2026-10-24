import React from 'react'
import { MonthView } from './MonthView.jsx'
import { WeekView } from './WeekView.jsx'
import { DayView } from './DayView.jsx'
import { EventModal } from './EventModal.jsx'
import { useCalendarStore } from './calendar-store.js'
import { CALENDAR_VIEWS } from '../core/constants.js'

/**
 * Calendar View for ZCalendar.
 */
export function CalendarView() {
  const { viewMode } = useCalendarStore()

  return (
    <div className="flex flex-1 flex-col overflow-hidden" data-testid="zcalendar-view">
      {viewMode === CALENDAR_VIEWS.DAY && <DayView />}
      {viewMode === CALENDAR_VIEWS.WORK_WEEK && <WeekView isWorkWeek={true} />}
      {viewMode === CALENDAR_VIEWS.WEEK && <WeekView isWorkWeek={false} />}
      {viewMode === CALENDAR_VIEWS.MONTH && <MonthView />}

      <EventModal />
    </div>
  )
}
