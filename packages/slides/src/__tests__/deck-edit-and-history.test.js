import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createPresentationDeck, createSlide } from '../core/slide-model.js'
import {
  setElementsProperties,
  duplicateElements,
  setSlideBackground,
  setSlideNotes,
} from '../core/deck-edit.js'
import { useDeck } from '../core/use-deck.js'
import { writePptx } from '../pptx/pptx-writer.js'

const firstSlide = (deck) => deck.slides[0]

describe('ZSlides deck edits', () => {
  it('patches properties only on the requested elements', () => {
    const deck = createPresentationDeck()
    const [a, b] = firstSlide(deck).elements
    const next = setElementsProperties(deck, [a.id], { fontSize: 64, color: '#dc2626' })
    expect(firstSlide(next).elements[0].properties).toMatchObject({
      fontSize: 64,
      color: '#dc2626',
    })
    expect(firstSlide(next).elements[1].properties).toEqual(b.properties)
  })

  it('duplicates elements with new ids and an offset', () => {
    const deck = createPresentationDeck()
    const original = firstSlide(deck).elements[0]
    const { deck: next, newIds } = duplicateElements(deck, [original.id], 30)
    const copy = firstSlide(next).elements.find((e) => e.id === newIds[0])
    expect(copy).toMatchObject({ x: original.x + 30, y: original.y + 30 })
    expect(copy.id).not.toBe(original.id)
    expect(firstSlide(next).elements).toHaveLength(firstSlide(deck).elements.length + 1)
  })

  it('sets background and notes without touching other slides', () => {
    const deck = createPresentationDeck()
    const withBg = setSlideBackground(deck, '#0f172a')
    expect(firstSlide(withBg).background).toEqual({ type: 'solid', color: '#0f172a' })
    const withNotes = setSlideNotes(deck, firstSlide(deck).id, 'Say hello')
    expect(firstSlide(withNotes).notes).toBe('Say hello')
  })
})

describe('useDeck', () => {
  it('undoes, redoes, and does not record slide navigation', () => {
    const { result } = renderHook(() => useDeck({}))
    const original = result.current.deck
    act(() => result.current.setDeck((d) => setSlideBackground(d, '#000000')))
    expect(result.current.canUndo).toBe(true)
    act(() => result.current.setDeck((d) => ({ ...d, activeSlideId: d.slides[0].id })))
    act(() => result.current.undo())
    expect(result.current.deck).toBe(original)
    expect(result.current.canRedo).toBe(true)
    act(() => result.current.redo())
    expect(firstSlide(result.current.deck).background.color).toBe('#000000')
  })

  it('coalesces rapid edits into one undo step', () => {
    const { result } = renderHook(() => useDeck({}))
    const original = result.current.deck
    act(() => result.current.setDeck((d) => setSlideBackground(d, '#111111')))
    act(() => result.current.setDeck((d) => setSlideBackground(d, '#222222')))
    act(() => result.current.undo())
    expect(result.current.deck).toBe(original)
    expect(result.current.canUndo).toBe(false)
  })

  it('reports every change through onChange as JSON', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useDeck({ onChange }))
    act(() => result.current.setDeck((d) => setSlideNotes(d, firstSlide(d).id, 'n')))
    const last = JSON.parse(onChange.mock.calls.at(-1)[0])
    expect(last.slides[0].notes).toBe('n')
  })

  it('opens a base64 .pptx and exports one back', async () => {
    const base = createPresentationDeck()
    const source = {
      ...base,
      slides: [base.slides[0], createSlide(), createSlide(), createSlide()],
    }
    const base64 = await writePptx(source, 'base64')
    const { result } = renderHook(() => useDeck({ initialContent: base64 }))
    // The default deck has one slide, so four slides proves the file was parsed
    await waitFor(() => expect(result.current.deck.slides).toHaveLength(4))
    expect(await result.current.exportPptx()).toMatch(/^UEsDB/)
  })
})
