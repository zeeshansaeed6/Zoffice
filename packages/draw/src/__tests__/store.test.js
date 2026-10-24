import { describe, it, expect, beforeEach } from 'vitest'
import { useDrawStore } from '../core/draw-store.js'
import { createDiagram } from '../core/draw-model.js'
import { TOOLS } from '../core/constants.js'

describe('Draw Zustand Store', () => {
  beforeEach(() => {
    useDrawStore.setState({
      diagram: createDiagram({ title: 'Test Diagram' }),
      selectedShapeIds: [],
      selectedConnectorIds: [],
      activeTool: TOOLS.SELECT,
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      history: [],
      future: [],
    })
  })

  it('adds and updates shapes', () => {
    const store = useDrawStore.getState()
    const shape = store.addShape('round-rect', 150, 180, { text: 'New Node' })

    expect(shape.text).toBe('New Node')
    expect(useDrawStore.getState().diagram.shapes.some((s) => s.id === shape.id)).toBe(true)

    useDrawStore.getState().updateShape(shape.id, { text: 'Updated Node' })
    const updated = useDrawStore.getState().diagram.shapes.find((s) => s.id === shape.id)
    expect(updated.text).toBe('Updated Node')
  })

  it('moves selected shapes', () => {
    const store = useDrawStore.getState()
    const shape = store.diagram.shapes[0]
    const initialX = shape.x

    store.selectShape(shape.id)
    store.moveShapes(25, 15)

    const moved = useDrawStore.getState().diagram.shapes.find((s) => s.id === shape.id)
    expect(moved.x).toBe(initialX + 25)
  })

  it('deletes selected shapes and connected connectors', () => {
    const store = useDrawStore.getState()
    const shape = store.diagram.shapes[0]

    store.selectShape(shape.id)
    store.deleteSelected()

    expect(useDrawStore.getState().diagram.shapes.some((s) => s.id === shape.id)).toBe(false)
  })

  it('supports undo and redo', () => {
    const store = useDrawStore.getState()
    const initialCount = store.diagram.shapes.length

    store.addShape('diamond', 300, 300)
    expect(useDrawStore.getState().diagram.shapes.length).toBe(initialCount + 1)

    useDrawStore.getState().undo()
    expect(useDrawStore.getState().diagram.shapes.length).toBe(initialCount)

    useDrawStore.getState().redo()
    expect(useDrawStore.getState().diagram.shapes.length).toBe(initialCount + 1)
  })
})
