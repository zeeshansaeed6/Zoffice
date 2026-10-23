/**
 * @template T
 * @typedef {Object} UndoRedoStack
 * @property {(state: T) => void} push - Push a new state onto the undo stack
 * @property {() => T | undefined} undo - Revert to previous state
 * @property {() => T | undefined} redo - Re-apply next state
 * @property {() => boolean} canUndo - Check if undo is available
 * @property {() => boolean} canRedo - Check if redo is available
 * @property {() => void} clear - Reset the history stacks
 * @property {() => T | undefined} getCurrent - Get current state snapshot
 */

/**
 * Creates an in-memory undo/redo manager with a configurable maximum history limit.
 *
 * @template T
 * @param {T} initialState - Starting state snapshot
 * @param {number} [maxHistory=100] - Maximum history depth
 * @returns {UndoRedoStack<T>}
 */
export function createUndoRedoStack(initialState, maxHistory = 100) {
  /** @type {T[]} */
  let past = []
  /** @type {T} */
  let present = initialState
  /** @type {T[]} */
  let future = []

  return {
    push(newState) {
      past = [...past, present]
      if (past.length > maxHistory) {
        past = past.slice(past.length - maxHistory)
      }
      present = newState
      future = []
    },

    undo() {
      if (past.length === 0) return undefined
      const previous = past[past.length - 1]
      past = past.slice(0, past.length - 1)
      future = [present, ...future]
      present = previous
      return present
    },

    redo() {
      if (future.length === 0) return undefined
      const next = future[0]
      future = future.slice(1)
      past = [...past, present]
      present = next
      return present
    },

    canUndo() {
      return past.length > 0
    },

    canRedo() {
      return future.length > 0
    },

    clear() {
      past = []
      future = []
    },

    getCurrent() {
      return present
    },
  }
}
