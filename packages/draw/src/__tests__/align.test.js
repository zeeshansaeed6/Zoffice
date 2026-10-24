import { describe, it, expect } from 'vitest'
import {
  alignShapes,
  distributeShapes,
  bringToFront,
  sendToBack,
  groupShapes,
  ungroupShapes,
} from '../core/align-distribute.js'
import { createShape } from '../core/draw-model.js'

describe('Align and Distribute Operations', () => {
  const s1 = createShape({ id: 's1', x: 50, y: 100, width: 100, height: 60 })
  const s2 = createShape({ id: 's2', x: 200, y: 150, width: 80, height: 40 })
  const s3 = createShape({ id: 's3', x: 350, y: 120, width: 90, height: 50 })
  const shapes = [s1, s2, s3]
  const selectedIds = ['s1', 's2']

  it('aligns shapes left, right, top, and center', () => {
    const leftAligned = alignShapes(shapes, selectedIds, 'left')
    expect(leftAligned.find((s) => s.id === 's1').x).toBe(50)
    expect(leftAligned.find((s) => s.id === 's2').x).toBe(50)

    const topAligned = alignShapes(shapes, selectedIds, 'top')
    expect(topAligned.find((s) => s.id === 's1').y).toBe(100)
    expect(topAligned.find((s) => s.id === 's2').y).toBe(100)
  })

  it('distributes shapes evenly horizontally', () => {
    const distributed = distributeShapes(shapes, ['s1', 's2', 's3'], 'horizontal')
    const pos1 = distributed.find((s) => s.id === 's1').x
    const pos2 = distributed.find((s) => s.id === 's2').x
    const pos3 = distributed.find((s) => s.id === 's3').x

    expect(pos1).toBe(50)
    expect(pos3).toBe(350)
    expect(pos2).toBeGreaterThan(pos1)
    expect(pos2).toBeLessThan(pos3)
  })

  it('reorders z-index with bringToFront and sendToBack', () => {
    const front = bringToFront(shapes, ['s1'])
    expect(front[front.length - 1].id).toBe('s1')

    const back = sendToBack(shapes, ['s3'])
    expect(back[0].id).toBe('s3')
  })

  it('groups and ungroups shapes with common groupId', () => {
    const grouped = groupShapes(shapes, ['s1', 's2'])
    const gId = grouped.find((s) => s.id === 's1').groupId
    expect(gId).toBeDefined()
    expect(grouped.find((s) => s.id === 's2').groupId).toBe(gId)

    const ungrouped = ungroupShapes(grouped, ['s1', 's2'])
    expect(ungrouped.find((s) => s.id === 's1').groupId).toBeNull()
  })
})
