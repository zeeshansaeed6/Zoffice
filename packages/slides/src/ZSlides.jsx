import React, { useState, useMemo, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot, AiAssistantSidebar } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.jsx'
import { buildSlidesActions } from './ribbon/slides-actions.js'
import { SlideCanvas } from './canvas/SlideCanvas.jsx'
import { ThumbnailPanel } from './thumbnails/ThumbnailPanel.jsx'
import { AnimationPane } from './animations/AnimationPane.jsx'
import { NotesPanel } from './notes/NotesPanel.jsx'
import { SlideDialogsOverlay } from './dialogs/SlideDialogsOverlay.jsx'
import { createSlide } from './core/slide-model.js'
import { createElementsForLayout, LAYOUT_TYPES } from './core/slide-layouts.js'
import { applyThemeToDeck } from './core/theme-engine.js'
import { downloadBlob } from './core/export-utils.js'
import { writePptxFile } from './pptx/pptx-writer.js'
import { useDeck } from './core/use-deck.js'
import { setSlideNotes } from './core/deck-edit.js'
import { updateDeckElement, deleteDeckElements } from './core/deck-operations.js'
import {
  duplicateDeckSlide,
  deleteDeckSlide,
  reorderDeckSlides,
  toggleSlideHidden,
  applySlideLayout,
} from './core/slide-operations.js'

/**
 * ZSlides Presentation Application Component.
 *
 * @param {Object} props
 * @param {string} [props.initialContent] - Deck JSON or base64 .pptx
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZSlides({ onSave, onChange, initialContent }) {
  const { deck, setDeck, undo, redo, canUndo, canRedo, exportPptx } = useDeck({
    initialContent,
    onChange,
  })
  const [zoom, setZoom] = useState(100)
  const [selectedElementIds, setSelectedElementIds] = useState([])
  const [isLayoutPickerOpen, setIsLayoutPickerOpen] = useState(false)
  const [isThemeGalleryOpen, setIsThemeGalleryOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isAnimationPaneOpen, setIsAnimationPaneOpen] = useState(false)
  const [showMode, setShowMode] = useState(null) // 'slideshow' | 'presenter' | null
  const [showStartIndex, setShowStartIndex] = useState(0)
  const [showAiSidebar, setShowAiSidebar] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const handleAiInsert = useCallback(
    (result) => {
      if (!result?.slides || !Array.isArray(result.slides)) return
      const newSlides = result.slides.map((s, idx) => {
        const layout = s.layout || 'title_and_content'
        const elements = createElementsForLayout(layout, {
          title: s.title || `Slide ${idx + 1}`,
          body: s.bullets?.join('\n') || '',
        })
        return { ...createSlide({ layout }), elements }
      })
      setDeck((prev) => ({
        ...prev,
        slides: [...prev.slides, ...newSlides],
        activeSlideId: newSlides[0]?.id || prev.activeSlideId,
      }))
    },
    [setDeck],
  )

  const activeSlideIndex = useMemo(() => {
    const idx = deck.slides.findIndex((s) => s.id === deck.activeSlideId)
    return idx >= 0 ? idx : 0
  }, [deck.slides, deck.activeSlideId])

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0]
  const selectedElement = useMemo(
    () => currentSlide.elements.find((el) => selectedElementIds.includes(el.id)),
    [currentSlide.elements, selectedElementIds],
  )

  const handleExportPptx = useCallback(async () => {
    try {
      const buffer = await writePptxFile(deck, 'arraybuffer')
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      })
      downloadBlob(blob, 'presentation.pptx')
    } catch (err) {
      console.error('[ZSlides] PPTX export failed:', err)
    }
  }, [deck])

  const handleSave = useCallback(async () => {
    if (onSave) onSave(await exportPptx())
  }, [onSave, exportPptx])

  const ribbonConfig = getSlidesRibbonConfig({
    ...buildSlidesActions({
      deck,
      setDeck,
      currentSlide,
      selectedElement,
      selectedElementIds,
      setSelectedElementIds,
      activeSlideIndex,
      ui: {
        setIsLayoutPickerOpen,
        setIsThemeGalleryOpen,
        setIsExportDialogOpen,
        setIsAnimationPaneOpen,
        setShowMode,
        setShowStartIndex,
        setShowAiSidebar,
      },
      history: { onUndo: undo, onRedo: redo, canUndo, canRedo },
      onSave: handleSave,
    }),
    canSave: true,
  })

  const newSlide = () => {
    const layout = LAYOUT_TYPES.TITLE_AND_CONTENT
    const slide = createSlide({ layout, elements: createElementsForLayout(layout) })
    setDeck((p) => ({ ...p, activeSlideId: slide.id, slides: [...p.slides, slide] }))
    setSelectedElementIds([])
  }

  return (
    <div
      data-testid="zslides-app"
      className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-100 font-sans dark:bg-neutral-900"
    >
      <Ribbon config={ribbonConfig} />
      <div className="relative flex flex-1 overflow-hidden">
        <ThumbnailPanel
          slides={deck.slides}
          activeSlideId={deck.activeSlideId}
          onSelectSlide={(id) => {
            setDeck((p) => ({ ...p, activeSlideId: id }))
            setSelectedElementIds([])
          }}
          onNewSlide={newSlide}
          onDuplicateSlide={(id) => setDeck((p) => duplicateDeckSlide(p, id))}
          onDeleteSlide={(id) => setDeck((p) => deleteDeckSlide(p, id))}
          onToggleHideSlide={(id) => setDeck((p) => toggleSlideHidden(p, id))}
          onReorderSlides={(from, to) => setDeck((p) => reorderDeckSlides(p, from, to))}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
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
          {showNotes && (
            <NotesPanel
              slideId={currentSlide.id}
              notes={currentSlide.notes || ''}
              onChange={(id, notes) => setDeck((p) => setSlideNotes(p, id, notes))}
            />
          )}
        </div>
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
        <AiAssistantSidebar
          isOpen={showAiSidebar}
          onClose={() => setShowAiSidebar(false)}
          appId="slides"
          onInsert={handleAiInsert}
        />
      </div>
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              Slide {activeSlideIndex + 1} of {deck.slides.length}
            </StatusBarSlot>
            <StatusBarSlot>Theme: {deck.themeId}</StatusBarSlot>
            <StatusBarSlot>
              <button
                type="button"
                aria-pressed={showNotes}
                onClick={() => setShowNotes((p) => !p)}
                className="font-medium hover:text-blue-600"
              >
                Notes
              </button>
            </StatusBarSlot>
            <StatusBarSlot>
              <button
                type="button"
                onClick={() => setShowAiSidebar((p) => !p)}
                className="font-medium hover:text-purple-600 dark:hover:text-purple-400"
              >
                AI Assistant
              </button>
            </StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />
      <SlideDialogsOverlay
        isLayoutPickerOpen={isLayoutPickerOpen}
        setIsLayoutPickerOpen={setIsLayoutPickerOpen}
        isThemeGalleryOpen={isThemeGalleryOpen}
        setIsThemeGalleryOpen={setIsThemeGalleryOpen}
        isExportDialogOpen={isExportDialogOpen}
        setIsExportDialogOpen={setIsExportDialogOpen}
        showMode={showMode}
        setShowMode={setShowMode}
        showStartIndex={showStartIndex}
        deck={deck}
        handleExportPptx={handleExportPptx}
        onApplyLayout={(lt) => {
          setDeck((p) => applySlideLayout(p, p.activeSlideId, lt))
          setSelectedElementIds([])
        }}
        onApplyTheme={(t) => setDeck((p) => applyThemeToDeck(p, t))}
      />
    </div>
  )
}
