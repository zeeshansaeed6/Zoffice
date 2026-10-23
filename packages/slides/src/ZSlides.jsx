import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.jsx'
import { SlideCanvas } from './canvas/SlideCanvas.jsx'
import { ThumbnailPanel } from './thumbnails/ThumbnailPanel.jsx'
import { LayoutPickerDialog } from './dialogs/LayoutPickerDialog.jsx'
import { ThemeGalleryDialog } from './dialogs/ThemeGalleryDialog.jsx'
import {
  createPresentationDeck,
  createSlide,
  createSlideElement,
  createTextElement,
} from './core/slide-model.js'
import { ELEMENT_TYPES, SHAPE_TYPES } from './core/slide-constants.js'
import { createElementsForLayout, LAYOUT_TYPES } from './core/slide-layouts.js'
import { reorderElement, alignElements } from './core/arrange-utils.js'
import { applyThemeToDeck } from './core/theme-engine.js'

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

  // Slide management
  const handleNewSlide = useCallback((layout = LAYOUT_TYPES.TITLE_AND_CONTENT) => {
    const newSlide = createSlide({
      layout,
      elements: createElementsForLayout(layout),
    })
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
      slides: prev.slides.map((s) => {
        if (s.id !== prev.activeSlideId) return s
        return {
          ...s,
          layout: layoutType,
          elements: createElementsForLayout(layoutType, prev.dimensions),
        }
      }),
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
      const source = prev.slides[idx]
      const cloned = {
        ...source,
        id: `slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        elements: source.elements.map((el) => ({
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
      const nextActive = newSlides[Math.max(0, idx - 1)].id
      return { ...prev, activeSlideId: nextActive, slides: newSlides }
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

  // Element actions
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
    onNewSlide: () => handleNewSlide(),
    onOpenLayoutPicker: () => setIsLayoutPickerOpen(true),
    onOpenThemeGallery: () => setIsThemeGalleryOpen(true),
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
        {/* Thumbnails Sidebar */}
        <ThumbnailPanel
          slides={deck.slides}
          activeSlideId={deck.activeSlideId}
          dimensions={deck.dimensions}
          onSelectSlide={(id) => {
            setDeck((prev) => ({ ...prev, activeSlideId: id }))
            setSelectedElementIds([])
          }}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onToggleHideSlide={handleToggleHideSlide}
          onReorderSlides={handleReorderSlides}
        />

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
            <StatusBarSlot>Theme: {deck.themeId}</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Slide Layout Picker Dialog */}
      <LayoutPickerDialog
        isOpen={isLayoutPickerOpen}
        onClose={() => setIsLayoutPickerOpen(false)}
        onSelectLayout={handleApplyLayout}
      />

      {/* Theme Gallery Dialog */}
      <ThemeGalleryDialog
        isOpen={isThemeGalleryOpen}
        currentThemeId={deck.themeId}
        onClose={() => setIsThemeGalleryOpen(false)}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  )
}
