import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.jsx'
import { SlideCanvas } from './canvas/SlideCanvas.jsx'
import { ThumbnailPanel } from './thumbnails/ThumbnailPanel.jsx'
import { LayoutPickerDialog } from './dialogs/LayoutPickerDialog.jsx'
import { ThemeGalleryDialog } from './dialogs/ThemeGalleryDialog.jsx'
import { ExportDialog } from './dialogs/ExportDialog.jsx'
import { AnimationPane } from './animations/AnimationPane.jsx'
import { SlideShowView } from './presenter/SlideShowView.jsx'
import { PresenterView } from './presenter/PresenterView.jsx'
import { createPresentationDeck, createSlide } from './core/slide-model.js'
import { SHAPE_TYPES } from './core/slide-constants.js'
import { createElementsForLayout, LAYOUT_TYPES } from './core/slide-layouts.js'
import { applyThemeToDeck } from './core/theme-engine.js'
import { writePptxFile } from './pptx/pptx-writer.js'
import { downloadBlob } from './core/export-utils.js'
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
import {
  duplicateDeckSlide,
  deleteDeckSlide,
  reorderDeckSlides,
  toggleSlideHidden,
  setSlideTransition,
  applyTransitionToAllSlides,
  applySlideLayout,
  addSlideAnimation,
} from './core/slide-operations.js'

/**
 * ZSlides Presentation Application Component.
 *
 * @param {Object} props
 * @param {() => void} [props.onSave]
 */
export function ZSlides({ onSave }) {
  const [deck, setDeck] = useState(() => createPresentationDeck())
  const [zoom, setZoom] = useState(100)
  const [selectedElementIds, setSelectedElementIds] = useState([])
  const [isLayoutPickerOpen, setIsLayoutPickerOpen] = useState(false)
  const [isThemeGalleryOpen, setIsThemeGalleryOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isAnimationPaneOpen, setIsAnimationPaneOpen] = useState(false)
  const [showMode, setShowMode] = useState(null) // 'slideshow' | 'presenter' | null
  const [showStartIndex, setShowStartIndex] = useState(0)

  const activeSlideIndex = useMemo(() => {
    const idx = deck.slides.findIndex((s) => s.id === deck.activeSlideId)
    return idx >= 0 ? idx : 0
  }, [deck.slides, deck.activeSlideId])

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0]
  const selectedElement = useMemo(
    () => currentSlide.elements.find((el) => selectedElementIds.includes(el.id)),
    [currentSlide.elements, selectedElementIds],
  )

  const handleNewSlide = useCallback((layout = LAYOUT_TYPES.TITLE_AND_CONTENT) => {
    const newSlide = createSlide({ layout, elements: createElementsForLayout(layout) })
    setDeck((prev) => ({ ...prev, activeSlideId: newSlide.id, slides: [...prev.slides, newSlide] }))
    setSelectedElementIds([])
  }, [])

  const insertElement = useCallback((factory) => {
    const elem = factory()
    setDeck((p) => ({
      ...p,
      slides: p.slides.map((s) =>
        s.id === p.activeSlideId ? { ...s, elements: [...s.elements, elem] } : s,
      ),
    }))
    setSelectedElementIds([elem.id])
  }, [])

  const toggleProperty = useCallback(
    (prop) => {
      if (!selectedElement) return
      const curr = !!selectedElement.properties[prop]
      setDeck((p) =>
        updateDeckElement(p, {
          ...selectedElement,
          properties: { ...selectedElement.properties, [prop]: !curr },
        }),
      )
    },
    [selectedElement],
  )

  const handleExportPptx = useCallback(async () => {
    try {
      const blob = await writePptxFile(deck)
      downloadBlob(blob, 'presentation.pptx')
    } catch {
      // ignore or handle export error
    }
  }, [deck])

  const ribbonConfig = getSlidesRibbonConfig({
    onNewSlide: () => handleNewSlide(),
    onOpenLayoutPicker: () => setIsLayoutPickerOpen(true),
    onOpenThemeGallery: () => setIsThemeGalleryOpen(true),
    onOpenExportDialog: () => setIsExportDialogOpen(true),
    onPlayFromBeginning: () => {
      setShowStartIndex(0)
      setShowMode('slideshow')
    },
    onPlayFromCurrent: () => {
      setShowStartIndex(activeSlideIndex)
      setShowMode('slideshow')
    },
    onStartPresenterView: () => {
      setShowStartIndex(activeSlideIndex)
      setShowMode('presenter')
    },
    onInsertTextBox: () => insertElement(createDefaultTextBox),
    onInsertShape: (st = SHAPE_TYPES.RECTANGLE) => insertElement(() => createDefaultShape(st)),
    onInsertTable: () => insertElement(createDefaultTable),
    onInsertChart: () => insertElement(createDefaultChart),
    onInsertPicture: () => insertElement(createDefaultPicture),
    onSetTransition: (t) => setDeck((p) => setSlideTransition(p, p.activeSlideId, t)),
    onApplyTransitionToAll: () =>
      setDeck((p) =>
        applyTransitionToAllSlides(p, currentSlide.transition || { type: 'fade', duration: 0.5 }),
      ),
    onAddAnimation: (animType) => {
      if (!selectedElement) return
      const newAnim = {
        id: `anim_${Date.now()}`,
        elementId: selectedElement.id,
        type: animType,
        trigger: 'on_click',
        duration: 0.5,
      }
      setDeck((p) => addSlideAnimation(p, p.activeSlideId, newAnim))
      setIsAnimationPaneOpen(true)
    },
    onToggleAnimationPane: () => setIsAnimationPaneOpen((p) => !p),
    bold: !!selectedElement?.properties?.bold,
    italic: !!selectedElement?.properties?.italic,
    underline: !!selectedElement?.properties?.underline,
    align: selectedElement?.properties?.align || 'left',
    toggleBold: () => toggleProperty('bold'),
    toggleItalic: () => toggleProperty('italic'),
    toggleUnderline: () => toggleProperty('underline'),
    setAlign: (al) =>
      selectedElement &&
      setDeck((p) =>
        updateDeckElement(p, {
          ...selectedElement,
          properties: { ...selectedElement.properties, align: al },
        }),
      ),
    onArrange: (dir) =>
      selectedElement && setDeck((p) => arrangeDeckElement(p, selectedElement.id, dir)),
    onAlignElements: (alignment) =>
      selectedElementIds.length > 0 &&
      setDeck((p) => alignDeckElements(p, selectedElementIds, alignment)),
    onSave,
  })

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-100 font-sans dark:bg-neutral-900">
      <Ribbon config={ribbonConfig} />
      <div className="relative flex flex-1 overflow-hidden">
        <ThumbnailPanel
          slides={deck.slides}
          activeSlideId={deck.activeSlideId}
          onSelectSlide={(id) => {
            setDeck((p) => ({ ...p, activeSlideId: id }))
            setSelectedElementIds([])
          }}
          onNewSlide={() => handleNewSlide()}
          onDuplicateSlide={(id) => setDeck((p) => duplicateDeckSlide(p, id))}
          onDeleteSlide={(id) => setDeck((p) => deleteDeckSlide(p, id))}
          onToggleHideSlide={(id) => setDeck((p) => toggleSlideHidden(p, id))}
          onReorderSlides={(from, to) => setDeck((p) => reorderDeckSlides(p, from, to))}
        />
        <SlideCanvas
          slide={currentSlide}
          dimensions={deck.dimensions}
          zoom={zoom}
          selectedElementIds={selectedElementIds}
          onSelectionChange={setSelectedElementIds}
          onElementChange={(upd) => setDeck((p) => updateDeckElement(p, upd))}
          onDeleteElements={(ids) => {
            setDeck((p) => deleteDeckElements(p, ids))
            setSelectedElementIds([])
          }}
        />
        {isAnimationPaneOpen && (
          <AnimationPane
            animations={currentSlide.animations || []}
            elements={currentSlide.elements}
            onUpdateAnimations={(upd) =>
              setDeck((p) => ({
                ...p,
                slides: p.slides.map((s) =>
                  s.id === p.activeSlideId ? { ...s, animations: upd } : s,
                ),
              }))
            }
            onClose={() => setIsAnimationPaneOpen(false)}
          />
        )}
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
        onSelectLayout={(lt) => {
          setDeck((p) => applySlideLayout(p, p.activeSlideId, lt))
          setSelectedElementIds([])
        }}
      />
      <ThemeGalleryDialog
        isOpen={isThemeGalleryOpen}
        currentThemeId={deck.themeId}
        onClose={() => setIsThemeGalleryOpen(false)}
        onSelectTheme={(t) => setDeck((p) => applyThemeToDeck(p, t))}
      />
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        slides={deck.slides}
        onExportPptx={handleExportPptx}
      />
      {showMode === 'slideshow' && (
        <SlideShowView
          slides={deck.slides}
          initialIndex={showStartIndex}
          dimensions={deck.dimensions}
          onExit={() => setShowMode(null)}
        />
      )}
      {showMode === 'presenter' && (
        <PresenterView
          slides={deck.slides}
          initialIndex={showStartIndex}
          dimensions={deck.dimensions}
          onExit={() => setShowMode(null)}
        />
      )}
    </div>
  )
}
