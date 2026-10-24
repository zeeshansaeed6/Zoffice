import { describe, it, expect } from 'vitest'
import {
  getTimelineBounds,
  generateTimelineGrid,
  calculateTaskCoordinates,
  calculateDependencyPath,
} from '../core/gantt-engine.js'
import { GANTT_ZOOM } from '../core/constants.js'
import { createTask } from '../core/planner-model.js'

describe('Gantt Engine', () => {
  it('calculates timeline bounds with padding', () => {
    const t1 = createTask('col1', 'b1', {
      startDate: new Date('2026-06-01T00:00:00Z').toISOString(),
      dueDate: new Date('2026-06-15T00:00:00Z').toISOString(),
    })
    const bounds = getTimelineBounds([t1])
    expect(bounds.minDate.getTime()).toBeLessThan(new Date('2026-06-01').getTime())
    expect(bounds.maxDate.getTime()).toBeGreaterThan(new Date('2026-06-15').getTime())
  })

  it('generates grid columns for day, week, and month zoom', () => {
    const minDate = new Date(2026, 0, 1)
    const maxDate = new Date(2026, 0, 20)

    const dayGrid = generateTimelineGrid(minDate, maxDate, GANTT_ZOOM.DAY)
    expect(dayGrid.length).toBe(20)
    expect(dayGrid[0].width).toBe(44)

    const weekGrid = generateTimelineGrid(minDate, maxDate, GANTT_ZOOM.WEEK)
    expect(weekGrid.length).toBeGreaterThanOrEqual(2)
    expect(weekGrid[0].width).toBe(100)

    const monthGrid = generateTimelineGrid(minDate, maxDate, GANTT_ZOOM.MONTH)
    expect(monthGrid.length).toBe(1)
    expect(monthGrid[0].width).toBe(140)
  })

  it('computes task coordinates based on zoom', () => {
    const minDate = new Date('2026-06-01T00:00:00.000Z')
    const task = createTask('c1', 'b1', {
      startDate: '2026-06-03T00:00:00.000Z',
      dueDate: '2026-06-06T00:00:00.000Z',
      isMilestone: false,
    })

    const coords = calculateTaskCoordinates(task, minDate, GANTT_ZOOM.DAY)
    expect(coords.left).toBeGreaterThan(0)
    expect(coords.width).toBeGreaterThanOrEqual(28)
  })

  it('generates SVG dependency paths', () => {
    const straightPath = calculateDependencyPath({ x: 50, y: 30 }, { x: 120, y: 70 })
    expect(straightPath).toContain('M 50 30')
    expect(straightPath).toContain('70')

    const loopPath = calculateDependencyPath({ x: 100, y: 30 }, { x: 80, y: 70 })
    expect(loopPath).toContain('M 100 30')
  })
})
