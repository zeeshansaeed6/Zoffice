/**
 * ZPlanner Gantt Engine — computes task timelines, column tick marks, and dependency paths.
 * @module gantt-engine
 */

import { GANTT_ZOOM } from './constants.js'

const MS_PER_DAY = 86400000

/**
 * Determine timeline date bounds for a set of tasks.
 * @param {import('./planner-model.js').Task[]} tasks
 * @returns {{ minDate: Date, maxDate: Date }}
 */
export function getTimelineBounds(tasks = []) {
  const now = new Date()
  let minMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  let maxMs = new Date(now.getFullYear(), now.getMonth() + 2, 0).getTime()

  for (const t of tasks) {
    if (t.startDate) {
      const s = new Date(t.startDate).getTime()
      if (!isNaN(s) && s < minMs) minMs = s
    }
    if (t.dueDate) {
      const d = new Date(t.dueDate).getTime()
      if (!isNaN(d) && d > maxMs) maxMs = d
    }
  }

  // Add 3-day padding on both ends
  const minDate = new Date(minMs - MS_PER_DAY * 3)
  const maxDate = new Date(maxMs + MS_PER_DAY * 7)

  minDate.setHours(0, 0, 0, 0)
  maxDate.setHours(23, 59, 59, 999)

  return { minDate, maxDate }
}

/**
 * Generate columns for the Gantt timeline header and grid.
 *
 * @param {Date} minDate
 * @param {Date} maxDate
 * @param {string} [zoom=GANTT_ZOOM.DAY]
 * @returns {Array<{ label: string, date: Date, width: number }>}
 */
export function generateTimelineGrid(minDate, maxDate, zoom = GANTT_ZOOM.DAY) {
  const columns = []
  const current = new Date(minDate)

  if (zoom === GANTT_ZOOM.MONTH) {
    current.setDate(1)
    while (current <= maxDate) {
      const label = current.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      columns.push({
        label,
        date: new Date(current),
        width: 140,
      })
      current.setMonth(current.getMonth() + 1)
    }
    return columns
  }

  if (zoom === GANTT_ZOOM.WEEK) {
    while (current <= maxDate) {
      const label = `W${getWeekNumber(current)} (${current.getMonth() + 1}/${current.getDate()})`
      columns.push({
        label,
        date: new Date(current),
        width: 100,
      })
      current.setDate(current.getDate() + 7)
    }
    return columns
  }

  // Default: Day Zoom
  while (current <= maxDate) {
    const label = `${current.getDate()} ${current.toLocaleDateString(undefined, { weekday: 'narrow' })}`
    columns.push({
      label,
      date: new Date(current),
      width: 44,
    })
    current.setDate(current.getDate() + 1)
  }

  return columns
}

/**
 * Helper to get week number of the year.
 * @param {Date} date
 * @returns {number}
 */
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * Compute the horizontal coordinate and width for a task's bar.
 *
 * @param {import('./planner-model.js').Task} task
 * @param {Date} minDate
 * @param {string} [zoom=GANTT_ZOOM.DAY]
 * @returns {{ left: number, width: number }}
 */
export function calculateTaskCoordinates(task, minDate, zoom = GANTT_ZOOM.DAY) {
  const dayWidth = zoom === GANTT_ZOOM.MONTH ? 140 / 30 : zoom === GANTT_ZOOM.WEEK ? 100 / 7 : 44

  const startMs = new Date(task.startDate || task.dueDate).getTime()
  const dueMs = new Date(task.dueDate || task.startDate).getTime()
  const minMs = minDate.getTime()

  const startDayOffset = Math.max(0, (startMs - minMs) / MS_PER_DAY)
  const durationDays = Math.max(1, (dueMs - startMs) / MS_PER_DAY)

  const left = Math.round(startDayOffset * dayWidth)
  const width = task.isMilestone ? 24 : Math.max(28, Math.round(durationDays * dayWidth))

  return { left, width }
}

/**
 * Generate an SVG path for a finish-to-start dependency link.
 *
 * @param {{ x: number, y: number }} start - Right edge of predecessor bar
 * @param {{ x: number, y: number }} end - Left edge of successor bar
 * @returns {string} SVG path d attribute
 */
export function calculateDependencyPath(start, end) {
  const { x: x1, y: y1 } = start
  const { x: x2, y: y2 } = end

  // Straight line or rounded elbow
  const midX = x1 + Math.max(12, (x2 - x1) / 2)

  if (x2 >= x1 + 24) {
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`
  }

  // Loop back if successor starts before predecessor finishes
  const loopX = x1 + 12
  const loopY = y1 + (y2 > y1 ? 16 : -16)
  return `M ${x1} ${y1} L ${loopX} ${y1} L ${loopX} ${loopY} L ${x2 - 12} ${loopY} L ${x2 - 12} ${y2} L ${x2} ${y2}`
}
