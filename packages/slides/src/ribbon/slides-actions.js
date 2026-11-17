import {
  createDefaultTextBox,
  createDefaultShape,
  createDefaultTable,
  createDefaultChart,
  createDefaultPicture,
} from '../core/element-factories.js'
import { createSlide } from '../core/slide-model.js'
import { createElementsForLayout, LAYOUT_TYPES } from '../core/slide-layouts.js'
import { SHAPE_TYPES } from '../core/slide-constants.js'
import {
  updateDeckElement,
  deleteDeckElements,
  arrangeDeckElement,
  alignDeckElements,
} from '../core/deck-operations.js'
import {
  setSlideTransition,
  applyTransitionToAllSlides,
  addSlideAnimation,
} from '../core/slide-operations.js'
import { setElementsProperties, duplicateElements, setSlideBackground } from '../core/deck-edit.js'

/**
 * Builds the action handlers consumed by getSlidesRibbonConfig.
 *
 * @param {Object} ctx
 * @param {Object} ctx.deck - Current deck
 * @param {(updater: (deck: Object) => Object) => void} ctx.setDeck
 * @param {Object} ctx.currentSlide
 * @param {Object|undefined} ctx.selectedElement
 * @param {string[]} ctx.selectedElementIds
 * @param {(ids: string[]) => void} ctx.setSelectedElementIds
 * @param {number} ctx.activeSlideIndex
 * @param {Object} ctx.ui - Dialog / pane / show-mode setters
 * @param {Object} ctx.history - { undo, redo, canUndo, canRedo }
 * @param {() => void} ctx.onSave
 */
export function buildSlidesActions(ctx) {
  const { setDeck, currentSlide, selectedElement, selectedElementIds, setSelectedElementIds, ui } =
    ctx
  const props = selectedElement?.properties || {}

  const insertElement = (factory) => {
    const element = factory()
    setDeck((p) => ({
      ...p,
      slides: p.slides.map((s) =>
        s.id === p.activeSlideId ? { ...s, elements: [...s.elements, element] } : s,
      ),
    }))
    setSelectedElementIds([element.id])
  }
  const toggleProperty = (prop) =>
    selectedElement &&
    setDeck((p) =>
      updateDeckElement(p, {
        ...selectedElement,
        properties: { ...props, [prop]: !props[prop] },
      }),
    )
  const patchSelected = (patch) =>
    selectedElementIds.length > 0 &&
    setDeck((p) => setElementsProperties(p, selectedElementIds, patch))
  const startShow = (mode, index) => {
    ui.setShowStartIndex(index)
    ui.setShowMode(mode)
  }

  return {
    onSave: ctx.onSave,
    ...ctx.history,
    onNewSlide: () => {
      const layout = LAYOUT_TYPES.TITLE_AND_CONTENT
      const slide = createSlide({ layout, elements: createElementsForLayout(layout) })
      setDeck((p) => ({ ...p, activeSlideId: slide.id, slides: [...p.slides, slide] }))
      setSelectedElementIds([])
    },
    onOpenLayoutPicker: () => ui.setIsLayoutPickerOpen(true),
    onOpenThemeGallery: () => ui.setIsThemeGalleryOpen(true),
    onOpenExportDialog: () => ui.setIsExportDialogOpen(true),
    onPlayFromBeginning: () => startShow('slideshow', 0),
    onPlayFromCurrent: () => startShow('slideshow', ctx.activeSlideIndex),
    onStartPresenterView: () => startShow('presenter', ctx.activeSlideIndex),
    onInsertTextBox: () => insertElement(createDefaultTextBox),
    onInsertShape: (type = SHAPE_TYPES.RECTANGLE) => insertElement(() => createDefaultShape(type)),
    onInsertTable: () => insertElement(createDefaultTable),
    onInsertChart: () => insertElement(createDefaultChart),
    onInsertPicture: () => insertElement(createDefaultPicture),
    onSetTransition: (t) => setDeck((p) => setSlideTransition(p, p.activeSlideId, t)),
    onApplyTransitionToAll: () =>
      setDeck((p) =>
        applyTransitionToAllSlides(p, currentSlide.transition || { type: 'fade', duration: 0.5 }),
      ),
    onAddAnimation: (type) => {
      if (!selectedElement) return
      const animation = {
        id: `anim_${Date.now()}`,
        elementId: selectedElement.id,
        type,
        trigger: 'on_click',
        duration: 0.5,
      }
      setDeck((p) => addSlideAnimation(p, p.activeSlideId, animation))
      ui.setIsAnimationPaneOpen(true)
    },
    onToggleAnimationPane: () => ui.setIsAnimationPaneOpen((p) => !p),
    bold: !!props.bold,
    italic: !!props.italic,
    underline: !!props.underline,
    align: props.align || 'left',
    toggleBold: () => toggleProperty('bold'),
    toggleItalic: () => toggleProperty('italic'),
    toggleUnderline: () => toggleProperty('underline'),
    setAlign: (align) => patchSelected({ align }),
    onSetFontFamily: (fontFamily) => patchSelected({ fontFamily }),
    onSetFontSize: (fontSize) => patchSelected({ fontSize }),
    onSetTextColor: (color) => patchSelected({ color }),
    onSetBackground: (color) => setDeck((p) => setSlideBackground(p, color)),
    onDuplicate: () => {
      if (selectedElementIds.length === 0) return
      const { deck, newIds } = duplicateElements(ctx.deck, selectedElementIds)
      setDeck(() => deck)
      setSelectedElementIds(newIds)
    },
    onDeleteSelected: () => {
      if (selectedElementIds.length === 0) return
      setDeck((p) => deleteDeckElements(p, selectedElementIds))
      setSelectedElementIds([])
    },
    onArrange: (dir) =>
      selectedElement && setDeck((p) => arrangeDeckElement(p, selectedElement.id, dir)),
    onAlignElements: (alignment) =>
      selectedElementIds.length > 0 &&
      setDeck((p) => alignDeckElements(p, selectedElementIds, alignment)),
    onToggleAi: () => ui.setShowAiSidebar((p) => !p),
  }
}
