import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.jsx'
import { SlideCanvas } from './canvas/SlideCanvas.jsx'
import { ThumbnailPanel } from './thumbnails/ThumbnailPanel.jsx'
import { LayoutPickerDialog } from './dialogs/LayoutPickerDialog.jsx'
import { ThemeGalleryDialog } from './dialogs/ThemeGalleryDialog.jsx'
import { createPresentationDeck, createSlide } from './core/slide-model.js'
import { SHAPE_TYPES } from './core/slide-constants.js'
import { createElementsForLayout, LAYOUT_TYPES } from './core/slide-layouts.js'
import { applyThemeToDeck } from './core/theme-engine.js'
import {
  createDefaultTextBox,
  createDefaultShape,
  createDefaultTable,
  createDefaultChart,
  createDefaultPicture,
} from './core/element-factories.js'
import {
  updateDeckElement,
  deleteDeckElements,
  arrangeDeckElement,
  alignDeckElements,
} from './core/deck-operations.js'

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
  const [isLayoutPickerOpen, setIsLayoutPickerOpen] = useState(false)
  const [isThemeGalleryOpen, setIsThemeGalleryOpen] = useState(false)

  const activeSlideIndex = useMemo(() => {
    const idx = deck.slides.findIndex((s) => s.id === deck.activeSlideId)
    return idx >= 0 ? idx : 0
  }, [deck.slides, deck.activeSlideId])

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0]

  const selectedElement = useMemo(() => {
    return currentSlide.elements.find((el) => selectedElementIds.includes(el.id))
  }, [currentSlide.elements, selectedElementIds])

  // Slide deck mutations
  const handleNewSlide = useCallback((layout = LAYOUT_TYPES.TITLE_AND_CONTENT) => {
    const newSlide = createSlide({ layout, elements: createElementsForLayout(layout) })
    setDeck((prev) => ({
      ...prev,
      activeSlideId: newSlide.id,
      slides: [...prev.slides, newSlide],
    }))
    setSelectedElementIds([])
  }, [])

  const handleApplyLayout = useCallback((layoutType) => {
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id !== prev.activeSlideId
          ? s
          : {
              ...s,
              layout: layoutType,
              elements: createElementsForLayout(layoutType, prev.dimensions),
            },
      ),
    }))
    setSelectedElementIds([])
  }, [])

  const handleSelectTheme = useCallback((themeId) => {
    setDeck((prev) => applyThemeToDeck(prev, themeId))
  }, [])

  const handleDuplicateSlide = useCallback((slideId) => {
    setDeck((prev) => {
      const idx = prev.slides.findIndex((s) => s.id === slideId)
      if (idx === -1) return prev
      const src = prev.slides[idx]
      const cloned = {
        ...src,
        id: `slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        elements: src.elements.map((el) => ({
          ...el,
          id: `elem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        })),
      }
      const newSlides = [...prev.slides]
      newSlides.splice(idx + 1, 0, cloned)
      return { ...prev, activeSlideId: cloned.id, slides: newSlides }
    })
  }, [])

  const handleDeleteSlide = useCallback((slideId) => {
    setDeck((prev) => {
      if (prev.slides.length <= 1) return prev
      const idx = prev.slides.findIndex((s) => s.id === slideId)
      const newSlides = prev.slides.filter((s) => s.id !== slideId)
      return { ...prev, activeSlideId: newSlides[Math.max(0, idx - 1)].id, slides: newSlides }
    })
  }, [])

  const handleToggleHideSlide = useCallback((slideId) => {
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === slideId ? { ...s, hidden: !s.hidden } : s)),
    }))
  }, [])

  const handleReorderSlides = useCallback((fromIndex, toIndex) => {
    setDeck((prev) => {
      const copy = [...prev.slides]
      const [moved] = copy.splice(fromIndex, 1)
      copy.splice(toIndex, 0, moved)
      return { ...prev, slides: copy }
    })
  }, [])

  // Element insertion
  const insertElement = useCallback((factory) => {
    const elem = factory()
    setDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === prev.activeSlideId ? { ...s, elements: [...s.elements, elem] } : s,
      ),
    }))
    setSelectedElementIds([elem.id])
  }, [])

  // Element mutations
  const handleElementChange = useCallback((upd) => setDeck((p) => updateDeckElement(p, upd)), [])
  const handleDeleteElements = useCallback((ids) => {
    setDeck((p) => deleteDeckElements(p, ids))
    setSelectedElementIds([])
  }, [])

  const toggleProperty = useCallback(
    (prop) => {
      if (!selectedElement) return
      const curr = !!selectedElement.properties[prop]
      handleElementChange({
        ...selectedElement,
        properties: { ...selectedElement.properties, [prop]: !curr },
      })
    },
    [selectedElement, handleElementChange],
  )

  const setAlign = useCallback(
    (align) => {
      if (!selectedElement) return
      handleElementChange({
        ...selectedElement,
        properties: { ...selectedElement.properties, align },
      })
    },
    [selectedElement, handleElementChange],
  )

  const ribbonConfig = getSlidesRibbonConfig({
    onNewSlide: () => handleNewSlide(),
    onOpenLayoutPicker: () => setIsLayoutPickerOpen(true),
    onOpenThemeGallery: () => setIsThemeGalleryOpen(true),
    onInsertTextBox: () => insertElement(createDefaultTextBox),
    onInsertShape: (shapeType = SHAPE_TYPES.RECTANGLE) =>
      insertElement(() => createDefaultShape(shapeType)),
    onInsertTable: () => insertElement(createDefaultTable),
    onInsertChart: () => insertElement(createDefaultChart),
    onInsertPicture: () => insertElement(createDefaultPicture),
    bold: !!selectedElement?.properties?.bold,
    italic: !!selectedElement?.properties?.italic,
    underline: !!selectedElement?.properties?.underline,
    align: selectedElement?.properties?.align || 'left',
    toggleBold: () => toggleProperty('bold'),
    toggleItalic: () => toggleProperty('italic'),
    toggleUnderline: () => toggleProperty('underline'),
    setAlign,
    onArrange: (act) =>
      selectedElement && setDeck((p) => arrangeDeckElement(p, selectedElement.id, act)),
    onAlignElements: (al) => setDeck((p) => alignDeckElements(p, selectedElementIds, al)),
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zslides-app"
      className="flex h-full w-full select-none flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />
      <div className="flex flex-1 overflow-hidden">
        <ThumbnailPanel
          slides={deck.slides}
          activeSlideId={deck.activeSlideId}
          dimensions={deck.dimensions}
          onSelectSlide={(id) => {
            setDeck((p) => ({ ...p, activeSlideId: id }))
            setSelectedElementIds([])
          }}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onToggleHideSlide={handleToggleHideSlide}
          onReorderSlides={handleReorderSlides}
        />
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
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              Slide {activeSlideIndex + 1} of {deck.slides.length}
            </StatusBarSlot>
            <StatusBarSlot>Theme: {deck.themeId}</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />
      <LayoutPickerDialog
        isOpen={isLayoutPickerOpen}
        onClose={() => setIsLayoutPickerOpen(false)}
        onSelectLayout={handleApplyLayout}
      />
      <ThemeGalleryDialog
        isOpen={isThemeGalleryOpen}
        currentThemeId={deck.themeId}
        onClose={() => setIsThemeGalleryOpen(false)}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  )
}
