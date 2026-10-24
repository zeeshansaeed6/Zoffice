/**
 * ZDraw Desktop Application Component.
 * Visio-style vector diagramming suite with infinite canvas, routing connectors, and shape libraries.
 * @module ZDraw
 */

import React, { useEffect, useMemo } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getDrawRibbonConfig } from './ribbon-config.jsx'
import { useDrawStore } from './core/draw-store.js'
import { DiagramCanvas } from './canvas/DiagramCanvas.jsx'
import { ShapeLibraryPanel } from './sidebar/ShapeLibraryPanel.jsx'
import { PropertiesPanel } from './sidebar/PropertiesPanel.jsx'
import { CustomShapeModal } from './dialogs/CustomShapeModal.jsx'
import { ExportModal } from './dialogs/ExportModal.jsx'

/**
 * @param {Object} props
 * @param {string} props.id - Tab document ID
 * @param {string} [props.title='ZDraw'] - Tab title
 * @param {string} [props.initialContent=''] - Stored state JSON
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZDraw({
  id: _id,
  title: _title = 'ZDraw',
  initialContent: _initialContent = '',
  onChange,
  onSave,
}) {
  const {
    diagram,
    activeTool,
    zoom,
    setActiveTool,
    setZoom,
    addShape,
    deleteSelected,
    alignSelected,
    groupSelected,
    ungroupSelected,
    bringSelectedToFront,
    sendSelectedToBack,
    setIsCustomShapeModalOpen,
    setIsExportModalOpen,
    undo,
    redo,
    history,
    future,
  } = useDrawStore()

  // Sync state changes with parent document tab
  useEffect(() => {
    if (onChange && diagram.shapes.length > 0) {
      onChange(JSON.stringify(diagram))
    }
  }, [diagram, onChange])

  const ribbonActions = useMemo(() => {
    const handleSave = () => {
      if (onSave) {
        onSave(JSON.stringify(diagram, null, 2))
      }
    }

    const handleAddText = () => {
      addShape('rect', 260, 240, {
        text: 'Text Label',
        fill: 'transparent',
        stroke: 'transparent',
        shadow: false,
        textColor: '#0f172a',
        width: 100,
        height: 40,
      })
    }

    return {
      onSave: handleSave,
      canSave: true,
      onSetTool: (t) => setActiveTool(t),
      onAddText: handleAddText,
      onOpenCustomShape: () => setIsCustomShapeModalOpen(true),
      onDelete: deleteSelected,
      onAlign: (alignment) => alignSelected(alignment),
      onGroup: groupSelected,
      onUngroup: ungroupSelected,
      onBringToFront: bringSelectedToFront,
      onSendToBack: sendSelectedToBack,
      onZoomIn: () => setZoom(zoom + 0.15),
      onZoomOut: () => setZoom(zoom - 0.15),
      onZoomReset: () => setZoom(1),
      onOpenExport: () => setIsExportModalOpen(true),
      onUndo: undo,
      onRedo: redo,
      canUndo: history.length > 0,
      canRedo: future.length > 0,
    }
  }, [
    onSave,
    diagram,
    zoom,
    history.length,
    future.length,
    setActiveTool,
    setZoom,
    addShape,
    deleteSelected,
    alignSelected,
    groupSelected,
    ungroupSelected,
    bringSelectedToFront,
    sendSelectedToBack,
    setIsCustomShapeModalOpen,
    setIsExportModalOpen,
    undo,
    redo,
  ])

  const ribbonConfig = useMemo(
    () => getDrawRibbonConfig(ribbonActions, activeTool, zoom),
    [ribbonActions, activeTool, zoom],
  )

  return (
    <div
      data-testid="zdraw-app"
      className="flex h-full w-full flex-col overflow-hidden bg-slate-100 dark:bg-slate-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Main 3-Pane Canvas Workspace */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left: Shape Library */}
        <ShapeLibraryPanel />

        {/* Center: Infinite Diagram Canvas */}
        <DiagramCanvas />

        {/* Right: Properties & Styles Inspector */}
        <PropertiesPanel />
      </div>

      {/* Modals */}
      <CustomShapeModal />
      <ExportModal />

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{diagram.shapes.length} shapes</StatusBarSlot>
            <StatusBarSlot>{diagram.connectors.length} connectors</StatusBarSlot>
            <StatusBarSlot>Zoom: {Math.round(zoom * 100)}%</StatusBarSlot>
            <StatusBarSlot>Offline Vector Engine</StatusBarSlot>
          </>
        }
        centerContent="Ready"
      />
    </div>
  )
}
