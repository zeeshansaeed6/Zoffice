import { describe, it, expect, vi } from 'vitest'
import { createShortcutRegistry } from '../shortcuts/shortcut-registry.js'

describe('createShortcutRegistry', () => {
  it('registers and retrieves shortcuts', () => {
    const registry = createShortcutRegistry()
    registry.register({
      id: 'save',
      keys: 'ctrl+s',
      description: 'Save document',
      handler: () => {},
    })

    const all = registry.getAll()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('save')
    expect(all[0].keys).toBe('Ctrl+S')
  })

  it('unregisters shortcuts by id', () => {
    const registry = createShortcutRegistry()
    registry.register({
      id: 'save',
      keys: 'Ctrl+S',
      description: 'Save',
      handler: () => {},
    })
    expect(registry.getAll()).toHaveLength(1)

    registry.unregister('save')
    expect(registry.getAll()).toHaveLength(0)
  })

  it('triggers handler on matching keydown event', () => {
    const registry = createShortcutRegistry()
    const handler = vi.fn()
    registry.register({
      id: 'undo',
      keys: 'Ctrl+Z',
      description: 'Undo',
      handler,
    })

    const event = {
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      key: 'z',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    registry.handleKeyDown(/** @type {any} */ (event))

    expect(handler).toHaveBeenCalledTimes(1)
    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.stopPropagation).toHaveBeenCalled()
  })

  it('ignores non-matching key combinations', () => {
    const registry = createShortcutRegistry()
    const handler = vi.fn()
    registry.register({
      id: 'save',
      keys: 'Ctrl+S',
      description: 'Save',
      handler,
    })

    const event = {
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
      key: 's',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }

    registry.handleKeyDown(/** @type {any} */ (event))
    expect(handler).not.toHaveBeenCalled()
  })
})
