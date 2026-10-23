/**
 * @typedef {Object} Shortcut
 * @property {string} id - Unique shortcut identifier
 * @property {string} keys - Key combo string, e.g. 'Ctrl+S', 'Ctrl+Shift+Z'
 * @property {string} description - Human-readable description
 * @property {function} handler - Callback to execute
 * @property {boolean} [global] - If true, active regardless of context
 */

/**
 * Creates a keyboard shortcut registry that listens for key combos
 * and dispatches registered handlers.
 *
 * @returns {{
 *   register: (shortcut: Shortcut) => void,
 *   unregister: (id: string) => void,
 *   getAll: () => Shortcut[],
 *   handleKeyDown: (event: KeyboardEvent) => void,
 *   destroy: () => void
 * }}
 */
export function createShortcutRegistry() {
  /** @type {Map<string, Shortcut>} */
  const shortcuts = new Map()

  /**
   * Normalise a key combo to a canonical form for matching.
   * @param {KeyboardEvent} event
   * @returns {string}
   */
  function eventToCombo(event) {
    const parts = []
    if (event.ctrlKey || event.metaKey) parts.push('Ctrl')
    if (event.shiftKey) parts.push('Shift')
    if (event.altKey) parts.push('Alt')
    const key = event.key.length === 1 ? event.key.toUpperCase() : event.key
    parts.push(key)
    return parts.join('+')
  }

  /**
   * Normalise a string combo ('ctrl+s' → 'Ctrl+S').
   * @param {string} combo
   * @returns {string}
   */
  function normaliseCombo(combo) {
    return combo
      .split('+')
      .map((p) => {
        const lower = p.trim().toLowerCase()
        if (lower === 'ctrl' || lower === 'cmd' || lower === 'meta') return 'Ctrl'
        if (lower === 'shift') return 'Shift'
        if (lower === 'alt') return 'Alt'
        return p.trim().length === 1 ? p.trim().toUpperCase() : p.trim()
      })
      .join('+')
  }

  /** @param {Shortcut} shortcut */
  function register(shortcut) {
    const normalised = { ...shortcut, keys: normaliseCombo(shortcut.keys) }
    shortcuts.set(normalised.id, normalised)
  }

  /** @param {string} id */
  function unregister(id) {
    shortcuts.delete(id)
  }

  /** @returns {Shortcut[]} */
  function getAll() {
    return Array.from(shortcuts.values())
  }

  /** @param {KeyboardEvent} event */
  function handleKeyDown(event) {
    const combo = eventToCombo(event)
    for (const shortcut of shortcuts.values()) {
      if (shortcut.keys === combo) {
        event.preventDefault()
        event.stopPropagation()
        shortcut.handler()
        return
      }
    }
  }

  function destroy() {
    shortcuts.clear()
  }

  return { register, unregister, getAll, handleKeyDown, destroy }
}
