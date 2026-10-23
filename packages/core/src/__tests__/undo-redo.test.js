import { describe, it, expect } from 'vitest'
import { createUndoRedoStack } from '../undo-redo/undo-redo.js'

describe('createUndoRedoStack', () => {
  it('manages initial state and pushes', () => {
    const stack = createUndoRedoStack('initial')
    expect(stack.getCurrent()).toBe('initial')
    expect(stack.canUndo()).toBe(false)
    expect(stack.canRedo()).toBe(false)

    stack.push('first')
    expect(stack.getCurrent()).toBe('first')
    expect(stack.canUndo()).toBe(true)
    expect(stack.canRedo()).toBe(false)
  })

  it('performs undo and redo cycles', () => {
    const stack = createUndoRedoStack(1)
    stack.push(2)
    stack.push(3)

    expect(stack.undo()).toBe(2)
    expect(stack.getCurrent()).toBe(2)
    expect(stack.canRedo()).toBe(true)

    expect(stack.undo()).toBe(1)
    expect(stack.getCurrent()).toBe(1)
    expect(stack.canUndo()).toBe(false)

    expect(stack.redo()).toBe(2)
    expect(stack.getCurrent()).toBe(2)

    expect(stack.redo()).toBe(3)
    expect(stack.getCurrent()).toBe(3)
    expect(stack.canRedo()).toBe(false)
  })

  it('clears future stack when a new push occurs after undo', () => {
    const stack = createUndoRedoStack('A')
    stack.push('B')
    stack.push('C')

    stack.undo() // back to 'B'
    expect(stack.canRedo()).toBe(true)

    stack.push('D') // branched from 'B'
    expect(stack.getCurrent()).toBe('D')
    expect(stack.canRedo()).toBe(false)

    expect(stack.undo()).toBe('B')
  })

  it('respects maxHistory constraint', () => {
    const stack = createUndoRedoStack(0, 2)
    stack.push(1)
    stack.push(2)
    stack.push(3) // history only has 2 past items now: [2, 1] (0 is dropped)

    expect(stack.undo()).toBe(2)
    expect(stack.undo()).toBe(1)
    expect(stack.canUndo()).toBe(false)
  })
})
