import { useState, useEffect, useCallback, useRef } from 'react'
import { createPresentationDeck } from './slide-model.js'
import { writePptx } from '../pptx/pptx-writer.js'
import { readPptx } from '../pptx/pptx-parser.js'

const MAX_HISTORY = 100
// Edits closer together than this (e.g. dragging an element) share one undo step
const COALESCE_MS = 500
const looksLikePptx = (text) => /^(data:.*?;base64,)?UEsDB/.test(text.trim())

function parseJsonDeck(content) {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content
    return parsed?.slides ? parsed : null
  } catch {
    return null
  }
}

/**
 * Owns the ZSlides deck: undo/redo history, change notifications to the host,
 * and loading of native .pptx content.
 *
 * @param {Object} params
 * @param {string} [params.initialContent] - Deck JSON or base64 .pptx
 * @param {(content: string) => void} [params.onChange] - receives deck JSON
 */
export function useDeck({ initialContent, onChange }) {
  const [state, setState] = useState(() => ({
    deck: (initialContent && parseJsonDeck(initialContent)) || createPresentationDeck(),
    past: [],
    future: [],
  }))
  const lastPush = useRef(0)
  const loaded = useRef(false)

  // Open a base64 .pptx once on mount
  useEffect(() => {
    if (loaded.current || !initialContent || parseJsonDeck(initialContent)) return
    if (!looksLikePptx(initialContent)) return
    loaded.current = true
    const base64 = initialContent.replace(/^data:.*?;base64,/, '').trim()
    readPptx(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)))
      .then((deck) => setState({ deck, past: [], future: [] }))
      .catch((err) => console.error('[ZSlides] Failed to open .pptx:', err))
  }, [initialContent])

  useEffect(() => {
    if (onChange) onChange(JSON.stringify(state.deck))
  }, [state.deck, onChange])

  /** Applies a pure deck transform; slide navigation alone never creates an undo step. */
  const setDeck = useCallback((updater) => {
    const now = Date.now()
    const coalesce = now - lastPush.current < COALESCE_MS
    setState((s) => {
      const next = typeof updater === 'function' ? updater(s.deck) : updater
      if (next === s.deck) return s
      if (next.slides === s.deck.slides && next.themeId === s.deck.themeId) {
        return { ...s, deck: next }
      }
      lastPush.current = now
      const past =
        coalesce && s.past.length ? s.past : [...s.past.slice(-(MAX_HISTORY - 1)), s.deck]
      return { deck: next, past, future: [] }
    })
  }, [])

  const undo = useCallback(() => {
    setState((s) =>
      s.past.length
        ? { deck: s.past.at(-1), past: s.past.slice(0, -1), future: [s.deck, ...s.future] }
        : s,
    )
  }, [])

  const redo = useCallback(() => {
    setState((s) =>
      s.future.length
        ? { deck: s.future[0], past: [...s.past, s.deck], future: s.future.slice(1) }
        : s,
    )
  }, [])

  const exportPptx = useCallback(() => writePptx(state.deck, 'base64'), [state.deck])

  return {
    deck: state.deck,
    setDeck,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    exportPptx,
  }
}
