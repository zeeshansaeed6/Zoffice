/**
 * ShapeLibraryPanel — Collapsible shape picker panel organized by categories.
 * @module ShapeLibraryPanel
 */

import React, { useState } from 'react'
import {
  Square,
  Circle,
  Diamond,
  Triangle,
  Database,
  Server,
  Cloud,
  FileText,
  Plus,
  Network,
  Share2,
} from 'lucide-react'
import { SHAPE_CATEGORIES, SHAPE_LIBRARY } from '../core/constants.js'
import { useDrawStore } from '../core/draw-store.js'

export function ShapeLibraryPanel() {
  const { addShape, setIsCustomShapeModalOpen } = useDrawStore()
  const [activeCategory, setActiveCategory] = useState(SHAPE_CATEGORIES.FLOWCHART)

  const categories = [
    { id: SHAPE_CATEGORIES.FLOWCHART, label: 'Flowchart' },
    { id: SHAPE_CATEGORIES.BASIC, label: 'Basic' },
    { id: SHAPE_CATEGORIES.UML, label: 'UML' },
    { id: SHAPE_CATEGORIES.ERD, label: 'ERD' },
    { id: SHAPE_CATEGORIES.NETWORK, label: 'Network' },
  ]

  const shapes = SHAPE_LIBRARY.filter((s) => s.category === activeCategory)

  const getShapeIcon = (id) => {
    switch (id) {
      case 'ellipse':
      case 'uml-interface':
      case 'erd-attribute':
        return <Circle className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      case 'diamond':
      case 'fc-decision':
      case 'erd-relationship':
        return <Diamond className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case 'triangle':
        return <Triangle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      case 'cylinder':
      case 'net-database':
        return <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case 'net-server':
        return <Server className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      case 'net-cloud':
        return <Cloud className="h-5 w-5 text-sky-500" />
      case 'fc-document':
        return <FileText className="h-5 w-5 text-violet-500" />
      case 'net-router':
      case 'net-switch':
        return <Network className="h-5 w-5 text-cyan-600" />
      case 'uml-class':
      case 'erd-entity':
        return <Share2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      default:
        return <Square className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    }
  }

  return (
    <div className="flex w-64 shrink-0 select-none flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900/50">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'shadow-xs bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Shapes Grid */}
      <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-y-auto p-3">
        {shapes.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/zdraw-shape', item.id)
            }}
            onClick={() => addShape(item.id, 240, 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                addShape(item.id, 240, 200)
              }
            }}
            className="group flex cursor-grab flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-center transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-blue-950/30"
            title={`Click or drag ${item.name} to canvas`}
          >
            <div className="shadow-2xs mb-2 rounded bg-white p-1.5 transition-transform group-hover:scale-110 dark:bg-slate-800">
              {getShapeIcon(item.id)}
            </div>
            <span className="text-[11px] font-medium leading-tight text-slate-700 dark:text-slate-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Custom Shape Button */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setIsCustomShapeModalOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"
        >
          <Plus className="h-3.5 w-3.5" /> Custom Shape (SVG)
        </button>
      </div>
    </div>
  )
}
