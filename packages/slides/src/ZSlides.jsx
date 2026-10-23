import React, { useState } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getSlidesRibbonConfig } from './ribbon-config.js'

/**
 * ZSlides Presentation Application Component.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} [props.title='Untitled Presentation']
 * @param {() => void} [props.onSave]
 */
export function ZSlides({ onSave }) {
  const [slides, setSlides] = useState([
    { id: 1, title: 'Click to add title', subtitle: 'Click to add subtitle' },
  ])
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [align, setAlign] = useState('center')

  const currentSlide = slides[activeSlideIndex] || slides[0]

  const handleUpdateCurrentSlide = (field, value) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, [field]: value } : s)),
    )
  }

  const handleNewSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: 'New Slide Title',
      subtitle: 'New slide content',
    }
    setSlides((prev) => [...prev, newSlide])
    setActiveSlideIndex(slides.length)
  }

  const ribbonConfig = getSlidesRibbonConfig({
    bold,
    italic,
    align,
    toggleBold: () => setBold(!bold),
    toggleItalic: () => setItalic(!italic),
    setAlign,
    onNewSlide: handleNewSlide,
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zslides-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Main Slide Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slides Thumbnail Sidebar */}
        <div className="flex w-44 flex-col gap-3 overflow-y-auto border-r border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlideIndex(idx)}
              className={`flex flex-col gap-1 rounded border p-2 text-left transition-all ${
                activeSlideIndex === idx
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/30 dark:bg-neutral-800'
                  : 'border-neutral-300 bg-neutral-100/60 hover:bg-white dark:border-neutral-700 dark:bg-neutral-800/40'
              }`}
            >
              <span className="text-[10px] font-bold text-neutral-500">{idx + 1}</span>
              <div className="aspect-video w-full truncate rounded bg-white p-1 text-[8px] shadow-sm dark:bg-neutral-900 dark:text-neutral-300">
                {s.title || 'Slide'}
              </div>
            </button>
          ))}
        </div>

        {/* Slide Canvas */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-8">
          <div
            className="flex aspect-video w-[720px] origin-center flex-col items-center justify-center gap-6 rounded border border-neutral-200 bg-white p-12 shadow-lg transition-transform dark:border-neutral-800 dark:bg-neutral-900"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <input
              type="text"
              aria-label="Slide title"
              value={currentSlide.title}
              onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
              className={`w-full border-b border-dashed border-transparent bg-transparent text-center text-3xl font-bold text-neutral-900 outline-none hover:border-neutral-300 focus:border-blue-500 dark:text-neutral-100 ${
                bold ? 'font-black' : ''
              } ${italic ? 'italic' : ''}`}
            />
            <textarea
              aria-label="Slide subtitle"
              value={currentSlide.subtitle}
              onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
              rows={3}
              className={`w-3/4 resize-none border border-dashed border-transparent bg-transparent text-center text-base text-neutral-600 outline-none hover:border-neutral-300 focus:border-blue-500 dark:text-neutral-400 ${
                italic ? 'italic' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              Slide {activeSlideIndex + 1} of {slides.length}
            </StatusBarSlot>
            <StatusBarSlot>English (US)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
