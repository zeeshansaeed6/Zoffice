import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.jsx'
import { SlideCanvas } from './canvas/SlideCanvas.jsx'
import {
  createPresentationDeck,
  createSlide,
  createSlideElement,
  createTextElement,
} from './core/slide-model.js'
import { ELEMENT_TYPES, SHAPE_TYPES } from './core/slide-constants.js'
import { reorderElement, alignElements } from './core/arrange-utils.js'

/**
 * ZSlides Presentation Application Component.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} [props.title='Untitled Presentation']
 * @param {() => void} [props.onSave]
 */
export function ZSlides({ onSave }) {
  const [deck, setDeck] = useState(() => createPresentationDeck())
  const [zoom, setZoom] = useState(100)
  const [selectedElementIds, setSelectedElementIds] = useState([])

  const activeSlideIndex = useMemo(() => {
    const idx = deck.slides.findIndex((s) => s.id === deck.activeSlideId)
    return idx >= 0 ? idx : 0
  }, [deck.slides, deck.activeSlideId])

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0]

  // Currently selected first element
  const selectedElement = useMemo(() => {
    return currentSlide.elements.find((el) => selectedElementIds.includes(el.id))
  }, [currentSlide.elements, selectedElementIds])

  // Add a new slide
  const handleNewSlide = useCallback(() => {
    const newSlide = createSlide({
      layout: 'title_and_content',
      elements: [
        createTextElement({
          x: 80,
          y: 40,
          width: 800,
          height: 60,
          text: 'Slide Title',
          fontSize: 36,
          bold: true,
        }),
        createTextElement({
          x: 80,
          y: 130,
          width: 800,
          height: 300,
          text: '• Click to add bullet points\n• Second bullet point',
          fontSize: 20,
        }),
      ],
    })
    setDeck((prev) => ({
      ...prev,
      activeSlideId: newSlide.id,
      slides: [...prev.slides, newSlide],
    }))
    setSelectedElementIds([])
  }, [])

  // Insert a text box
  const handleInsertTextBox = useCallback(() => {
    const newElem = createTextElement({
      x: 280,
      y: 200,
      width: 400,
      height: 100,
      text: 'Click to add text',
      fontSize: 24,
    })
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === prev.activeSlideId ? { ...s, elements: [...s.elements, newElem] } : s,
      ),
    }))
    setSelectedElementIds([newElem.id])
  }, [])

  // Insert a shape onto current slide
  const handleInsertShape = useCallback((shapeType = SHAPE_TYPES.RECTANGLE) => {
    const newElem = createSlideElement({
      type: ELEMENT_TYPES.SHAPE,
      x: 350,
      y: 200,
      width: 200,
      height: 120,
      properties: {
        fill: '#3b82f6',
        stroke: '#1d4ed8',
        strokeWidth: 2,
        shapeType,
      },
    })
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === prev.activeSlideId ? { ...s, elements: [...s.elements, newElem] } : s,
      ),
    }))
    setSelectedElementIds([newElem.id])
  }, [])

  // Update element properties or transform
  const handleElementChange = useCallback((updated) => {
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => {
        if (s.id !== prev.activeSlideId) return s
        return {
          ...s,
          elements: s.elements.map((el) => (el.id === updated.id ? updated : el)),
        }
      }),
    }))
  }, [])

  // Delete elements
  const handleDeleteElements = useCallback((ids) => {
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => {
        if (s.id !== prev.activeSlideId) return s
        return {
          ...s,
          elements: s.elements.filter((el) => !ids.includes(el.id)),
        }
      }),
    }))
    setSelectedElementIds([])
  }, [])

  // Formatting toggles for selected text element
  const toggleProperty = useCallback(
    (prop) => {
      if (!selectedElement) return
      const current = !!selectedElement.properties[prop]
      handleElementChange({
        ...selectedElement,
        properties: { ...selectedElement.properties, [prop]: !current },
      })
    },
    [selectedElement, handleElementChange],
  )

  const setAlign = useCallback(
    (alignment) => {
      if (!selectedElement) return
      handleElementChange({
        ...selectedElement,
        properties: { ...selectedElement.properties, align: alignment },
      })
    },
    [selectedElement, handleElementChange],
  )

  // Arrange reordering
  const handleArrange = useCallback(
    (action) => {
      if (!selectedElement) return
      setDeck((prev) => ({
        ...prev,
        slides: prev.slides.map((s) => {
          if (s.id !== prev.activeSlideId) return s
          return {
            ...s,
            elements: reorderElement(s.elements, selectedElement.id, action),
          }
        }),
      }))
    },
    [selectedElement],
  )

  // Align elements
  const handleAlignElements = useCallback(
    (alignment) => {
      if (selectedElementIds.length === 0) return
      setDeck((prev) => ({
        ...prev,
        slides: prev.slides.map((s) => {
          if (s.id !== prev.activeSlideId) return s
          return {
            ...s,
            elements: alignElements(s.elements, selectedElementIds, alignment),
          }
        }),
      }))
    },
    [selectedElementIds],
  )

  const ribbonConfig = getSlidesRibbonConfig({
    onNewSlide: handleNewSlide,
    onInsertTextBox: handleInsertTextBox,
    onInsertShape: handleInsertShape,
    bold: !!selectedElement?.properties?.bold,
    italic: !!selectedElement?.properties?.italic,
    underline: !!selectedElement?.properties?.underline,
    align: selectedElement?.properties?.align || 'left',
    toggleBold: () => toggleProperty('bold'),
    toggleItalic: () => toggleProperty('italic'),
    toggleUnderline: () => toggleProperty('underline'),
    setAlign,
    onArrange: handleArrange,
    onAlignElements: handleAlignElements,
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zslides-app"
      className="flex h-full w-full select-none flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Main Slide Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slides Thumbnail Sidebar */}
        <div className="flex w-48 flex-col gap-3 overflow-y-auto border-r border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          {deck.slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setDeck((prev) => ({ ...prev, activeSlideId: s.id }))
                setSelectedElementIds([])
              }}
              className={`flex flex-col gap-1 rounded border p-2 text-left transition-all ${
                deck.activeSlideId === s.id
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/30 dark:bg-neutral-800'
                  : 'border-neutral-300 bg-neutral-100/60 hover:bg-white dark:border-neutral-700 dark:bg-neutral-800/40'
              }`}
            >
              <span className="text-[10px] font-bold text-neutral-500">{idx + 1}</span>
              <div className="aspect-video w-full truncate rounded bg-white p-1 text-[8px] shadow-sm dark:bg-neutral-900 dark:text-neutral-300">
                {s.elements.find((el) => el.type === ELEMENT_TYPES.TEXT)?.properties?.text ||
                  'Slide'}
              </div>
            </button>
          ))}
        </div>

        {/* High-Fidelity Interactive Slide Canvas */}
        <SlideCanvas
          slide={currentSlide}
          dimensions={deck.dimensions}
          zoom={zoom}
          selectedElementIds={selectedElementIds}
          onSelectionChange={setSelectedElementIds}
          onElementChange={handleElementChange}
          onDeleteElements={handleDeleteElements}
        />
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              Slide {activeSlideIndex + 1} of {deck.slides.length}
            </StatusBarSlot>
            <StatusBarSlot>English (US)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
