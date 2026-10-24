/**
 * ZDraw Zustand Store — state management for canvas diagrams, selection, history, and tools.
 * @module draw-store
 */

import { create } from 'zustand'
import { TOOLS } from './constants.js'
import { createDiagram, createShape, createConnector } from './draw-model.js'
import {
  alignShapes,
  distributeShapes,
  bringToFront,
  sendToBack,
  groupShapes,
  ungroupShapes,
} from './align-distribute.js'
import { saveDiagramToStorage, loadDiagramFromStorage } from './draw-storage.js'

/**
 * @typedef {import('./draw-model.js').Diagram} Diagram
 * @typedef {import('./draw-model.js').DrawShape} DrawShape
 * @typedef {import('./draw-model.js').DrawConnector} DrawConnector
 */

export const useDrawStore = create((set, get) => ({
  diagram: createDiagram(),
  selectedShapeIds: [],
  selectedConnectorIds: [],
  activeTool: TOOLS.SELECT,
  activeShapeType: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  connectionStart: null,
  isCustomShapeModalOpen: false,
  isExportModalOpen: false,

  history: [],
  future: [],

  // Record undo state before mutations
  pushHistory: () => {
    const { diagram, history } = get()
    set({
      history: [...history.slice(-20), JSON.parse(JSON.stringify(diagram))],
      future: [],
    })
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveShapeType: (type) => set({ activeShapeType: type }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.25, zoom)) }),
  setPanOffset: (panOffset) => set({ panOffset }),
  setIsCustomShapeModalOpen: (open) => set({ isCustomShapeModalOpen: open }),
  setIsExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setConnectionStart: (start) => set({ connectionStart: start }),
  setDiagram: (diagram) => set({ diagram, selectedShapeIds: [], selectedConnectorIds: [] }),
  clearSelection: () => set({ selectedShapeIds: [], selectedConnectorIds: [] }),

  selectShape: (id, multi = false) => {
    set((state) => {
      if (!multi) return { selectedShapeIds: [id], selectedConnectorIds: [] }
      const exists = state.selectedShapeIds.includes(id)
      return {
        selectedShapeIds: exists
          ? state.selectedShapeIds.filter((s) => s !== id)
          : [...state.selectedShapeIds, id],
        selectedConnectorIds: [],
      }
    })
  },

  selectConnector: (id, multi = false) => {
    set((state) => ({
      selectedConnectorIds: multi ? [...state.selectedConnectorIds, id] : [id],
      selectedShapeIds: [],
    }))
  },

  addShape: (type = 'rect', x = 200, y = 200, overrides = {}) => {
    get().pushHistory()
    let newShape = null
    set((state) => {
      newShape = createShape({
        type,
        x,
        y,
        ...overrides,
        zIndex: state.diagram.shapes.length,
      })
      return {
        diagram: {
          ...state.diagram,
          shapes: [...state.diagram.shapes, newShape],
          updatedAt: Date.now(),
        },
        selectedShapeIds: [newShape.id],
        selectedConnectorIds: [],
      }
    })
    return newShape
  },

  updateShape: (id, updates) => {
    get().pushHistory()
    set((state) => ({
      diagram: {
        ...state.diagram,
        shapes: state.diagram.shapes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        updatedAt: Date.now(),
      },
    }))
  },

  moveShapes: (dx, dy) => {
    set((state) => {
      const { selectedShapeIds, diagram } = state
      if (selectedShapeIds.length === 0) return state
      return {
        diagram: {
          ...diagram,
          shapes: diagram.shapes.map((s) =>
            selectedShapeIds.includes(s.id) ? { ...s, x: s.x + dx, y: s.y + dy } : s,
          ),
          updatedAt: Date.now(),
        },
      }
    })
  },

  deleteSelected: () => {
    const { selectedShapeIds, selectedConnectorIds, diagram } = get()
    if (selectedShapeIds.length === 0 && selectedConnectorIds.length === 0) return
    get().pushHistory()

    set({
      diagram: {
        ...diagram,
        shapes: diagram.shapes.filter((s) => !selectedShapeIds.includes(s.id)),
        connectors: diagram.connectors.filter(
          (c) =>
            !selectedConnectorIds.includes(c.id) &&
            !selectedShapeIds.includes(c.sourceId) &&
            !selectedShapeIds.includes(c.targetId),
        ),
        updatedAt: Date.now(),
      },
      selectedShapeIds: [],
      selectedConnectorIds: [],
    })
  },

  addConnector: (sourceId, sourceAnchor, targetId, targetAnchor, routing) => {
    if (sourceId === targetId) return
    get().pushHistory()
    const conn = createConnector(sourceId, targetId, {
      sourceAnchor,
      targetAnchor,
      routing,
    })
    set((state) => ({
      diagram: {
        ...state.diagram,
        connectors: [...state.diagram.connectors, conn],
        updatedAt: Date.now(),
      },
      selectedConnectorIds: [conn.id],
      selectedShapeIds: [],
    }))
  },

  updateConnector: (id, updates) => {
    get().pushHistory()
    set((state) => ({
      diagram: {
        ...state.diagram,
        connectors: state.diagram.connectors.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        updatedAt: Date.now(),
      },
    }))
  },

  alignSelected: (alignment) => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length < 2) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: alignShapes(diagram.shapes, selectedShapeIds, alignment),
        updatedAt: Date.now(),
      },
    })
  },

  distributeSelected: (direction) => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length < 3) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: distributeShapes(diagram.shapes, selectedShapeIds, direction),
        updatedAt: Date.now(),
      },
    })
  },

  bringSelectedToFront: () => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length === 0) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: bringToFront(diagram.shapes, selectedShapeIds),
        updatedAt: Date.now(),
      },
    })
  },

  sendSelectedToBack: () => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length === 0) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: sendToBack(diagram.shapes, selectedShapeIds),
        updatedAt: Date.now(),
      },
    })
  },

  groupSelected: () => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length < 2) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: groupShapes(diagram.shapes, selectedShapeIds),
        updatedAt: Date.now(),
      },
    })
  },

  ungroupSelected: () => {
    const { selectedShapeIds, diagram } = get()
    if (selectedShapeIds.length === 0) return
    get().pushHistory()
    set({
      diagram: {
        ...diagram,
        shapes: ungroupShapes(diagram.shapes, selectedShapeIds),
        updatedAt: Date.now(),
      },
    })
  },

  undo: () => {
    const { history, diagram, future } = get()
    if (history.length === 0) return
    const prev = history[history.length - 1]
    set({
      history: history.slice(0, -1),
      future: [JSON.parse(JSON.stringify(diagram)), ...future],
      diagram: prev,
      selectedShapeIds: [],
      selectedConnectorIds: [],
    })
  },

  redo: () => {
    const { future, diagram, history } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      history: [...history, JSON.parse(JSON.stringify(diagram))],
      future: future.slice(1),
      diagram: next,
      selectedShapeIds: [],
      selectedConnectorIds: [],
    })
  },

  saveToBackend: async () => {
    await saveDiagramToStorage(get().diagram)
  },

  loadFromBackend: async (id) => {
    const loaded = await loadDiagramFromStorage(id)
    if (loaded) set({ diagram: loaded })
  },
}))
