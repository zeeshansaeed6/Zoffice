/**
 * PropertiesPanel — Inspector sidebar for editing selected shape and connector styles.
 * @module PropertiesPanel
 */

import React from 'react'
import { Palette, Maximize2, Type, GitCommit, Sliders } from 'lucide-react'
import { useDrawStore } from '../core/draw-store.js'
import { ROUTING_MODES, COLOR_PALETTES } from '../core/constants.js'

export function PropertiesPanel() {
  const { diagram, selectedShapeIds, selectedConnectorIds, updateShape, updateConnector } =
    useDrawStore()

  const selectedShape = diagram.shapes.find((s) => s.id === selectedShapeIds[0])
  const selectedConnector = diagram.connectors.find((c) => c.id === selectedConnectorIds[0])

  if (!selectedShape && !selectedConnector) {
    return (
      <div className="flex w-64 shrink-0 flex-col justify-between border-l border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="mb-3 flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            <Sliders className="h-3.5 w-3.5" /> Canvas Info
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Shapes:</span>
              <span className="font-semibold">{diagram.shapes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Connectors:</span>
              <span className="font-semibold">{diagram.connectors.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Canvas Size:</span>
              <span className="font-semibold">
                {diagram.canvas.width} × {diagram.canvas.height}
              </span>
            </div>
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-400">
          Select an element to edit its styles and properties.
        </p>
      </div>
    )
  }

  // Selected Shape Inspector
  if (selectedShape) {
    return (
      <div className="flex w-64 shrink-0 select-none flex-col space-y-5 overflow-y-auto border-l border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          <Palette className="h-3.5 w-3.5 text-blue-600" /> Shape Properties
        </div>

        {/* Text */}
        <div>
          <label className="mb-1 block flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Type className="h-3.5 w-3.5" /> Label Text
          </label>
          <input
            type="text"
            value={selectedShape.text}
            onChange={(e) => updateShape(selectedShape.id, { text: e.target.value })}
            className="w-full rounded border border-slate-300 bg-slate-50 p-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Label text..."
          />
        </div>

        {/* Color Presets */}
        <div>
          <label className="mb-1.5 block font-semibold text-slate-700 dark:text-slate-300">
            Color Palette
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {COLOR_PALETTES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  updateShape(selectedShape.id, {
                    fill: p.fill,
                    stroke: p.stroke,
                    textColor: p.text,
                  })
                }
                style={{ backgroundColor: p.stroke }}
                className="shadow-xs h-7 w-7 rounded-md border-2 border-white transition-transform hover:scale-110"
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Fill & Stroke */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Fill Color</label>
            <input
              type="color"
              value={selectedShape.fill.startsWith('#') ? selectedShape.fill : '#eff6ff'}
              onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Stroke Color</label>
            <input
              type="color"
              value={selectedShape.stroke.startsWith('#') ? selectedShape.stroke : '#2563eb'}
              onChange={(e) => updateShape(selectedShape.id, { stroke: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Stroke Width & Dash */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">
              Width: {selectedShape.strokeWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedShape.strokeWidth}
              onChange={(e) =>
                updateShape(selectedShape.id, { strokeWidth: Number(e.target.value) })
              }
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Line Style</label>
            <select
              value={selectedShape.strokeDash}
              onChange={(e) => updateShape(selectedShape.id, { strokeDash: e.target.value })}
              className="w-full rounded border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="mb-1 block flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Maximize2 className="h-3.5 w-3.5" /> Dimensions
          </label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">W: </span>
              <input
                type="number"
                value={selectedShape.width}
                onChange={(e) => updateShape(selectedShape.id, { width: Number(e.target.value) })}
                className="w-20 rounded border border-slate-300 p-1 dark:border-slate-700"
              />
            </div>
            <div>
              <span className="text-slate-400">H: </span>
              <input
                type="number"
                value={selectedShape.height}
                onChange={(e) => updateShape(selectedShape.id, { height: Number(e.target.value) })}
                className="w-20 rounded border border-slate-300 p-1 dark:border-slate-700"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Selected Connector Inspector
  return (
    <div className="w-64 shrink-0 select-none space-y-4 border-l border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
        <GitCommit className="h-3.5 w-3.5 text-blue-600" /> Connector Properties
      </div>

      <div>
        <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Routing Mode
        </label>
        <select
          value={selectedConnector.routing}
          onChange={(e) => updateConnector(selectedConnector.id, { routing: e.target.value })}
          className="w-full rounded border border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800"
        >
          <option value={ROUTING_MODES.ORTHOGONAL}>Orthogonal (90°)</option>
          <option value={ROUTING_MODES.CURVED}>Curved Bezier</option>
          <option value={ROUTING_MODES.STRAIGHT}>Straight Line</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Label Text
        </label>
        <input
          type="text"
          value={selectedConnector.text}
          onChange={(e) => updateConnector(selectedConnector.id, { text: e.target.value })}
          className="w-full rounded border border-slate-300 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800"
          placeholder="Connector label..."
        />
      </div>

      <div>
        <label className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Line Color
        </label>
        <input
          type="color"
          value={selectedConnector.stroke}
          onChange={(e) => updateConnector(selectedConnector.id, { stroke: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border border-slate-300 dark:border-slate-700"
        />
      </div>
    </div>
  )
}
