/**
 * ExportModal — dialog for exporting diagrams to SVG, PNG, and PDF.
 * @module ExportModal
 */

import React, { useState } from 'react'
import { X, Download, FileImage, FileCode, CheckCircle } from 'lucide-react'
import { useDrawStore } from '../core/draw-store.js'
import { exportDiagramToSvg } from '../core/svg-exporter.js'

export function ExportModal() {
  const { diagram, isExportModalOpen, setIsExportModalOpen } = useDrawStore()
  const [success, setSuccess] = useState('')

  if (!isExportModalOpen) return null

  const handleExportSvg = () => {
    const svgStr = exportDiagramToSvg(diagram)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${diagram.title.replace(/\s+/g, '_')}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setSuccess('Diagram exported as SVG!')
    setTimeout(() => setIsExportModalOpen(false), 1200)
  }

  const handleExportPng = () => {
    const svgStr = exportDiagramToSvg(diagram)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width || 1200
      canvas.height = img.height || 800
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob)
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = `${diagram.title.replace(/\s+/g, '_')}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(pngUrl)
            setSuccess('Diagram exported as PNG!')
            setTimeout(() => setIsExportModalOpen(false), 1200)
          }
        }, 'image/png')
      }
      URL.revokeObjectURL(url)
    }

    img.src = url
  }

  const handleExportPdf = () => {
    window.print()
    setIsExportModalOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Export Diagram
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-3 p-6 text-xs">
          <p className="mb-4 text-slate-500">
            Select a high-fidelity format to export your diagram offline:
          </p>

          <button
            type="button"
            onClick={handleExportSvg}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-950/20"
          >
            <FileCode className="h-7 w-7 shrink-0 text-indigo-600" />
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                SVG Vector Graphic (.svg)
              </div>
              <div className="text-[11px] text-slate-400">
                Scalable vector format with infinite resolution and preserved paths
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportPng}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-950/20"
          >
            <FileImage className="h-7 w-7 shrink-0 text-emerald-600" />
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                PNG Raster Image (.png)
              </div>
              <div className="text-[11px] text-slate-400">
                Lossless raster graphic suitable for documents, slides, and websites
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:bg-blue-950/20"
          >
            <Download className="h-7 w-7 shrink-0 text-rose-600" />
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                PDF Document Print (.pdf)
              </div>
              <div className="text-[11px] text-slate-400">
                Print-ready document via native print-to-PDF
              </div>
            </div>
          </button>

          {success && (
            <div className="mt-3 flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-2.5 text-emerald-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
