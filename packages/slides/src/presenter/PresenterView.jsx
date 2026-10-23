import React, { useState, useEffect } from 'react'
import { Clock, SkipForward, SkipBack, X } from 'lucide-react'
import { SlideElement } from '../canvas/SlideElement.jsx'

/**
 * PresenterView renders a dual-screen presenter console with notes, timer, current and next slide previews.
 *
 * @param {Object} props
 * @param {Array<Object>} props.slides
 * @param {number} [props.initialIndex=0]
 * @param {Object} props.dimensions
 * @param {() => void} props.onExit
 */
export function PresenterView({
  slides = [],
  initialIndex = 0,
  dimensions = { width: 960, height: 540 },
  onExit,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const currentSlide = slides[currentIndex] || slides[0]
  const nextSlide = slides[currentIndex + 1]

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0')
    const s = (totalSec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentScale = 480 / dimensions.width
  const nextScale = 240 / dimensions.width

  return (
    <div
      data-testid="presenter-view"
      className="fixed inset-0 z-50 flex select-none flex-col bg-neutral-950 text-white"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-6 py-2.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <Clock size={14} className="text-blue-400" />
            <span className="font-mono font-bold">{formatTimer(elapsedSeconds)}</span>
          </div>
          <span className="text-neutral-600">|</span>
          <span className="text-xs text-neutral-400">
            Slide {currentIndex + 1} of {slides.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1 rounded bg-neutral-800 px-2.5 py-1 text-xs text-red-400 hover:bg-neutral-700"
        >
          <X size={13} />
          End Show
        </button>
      </div>

      {/* Main Console Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Left: Current Slide Live Preview */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="text-xs font-semibold text-neutral-400">Current Slide</div>
          <div
            className="relative overflow-hidden rounded border border-neutral-700 shadow-2xl"
            style={{
              width: '480px',
              height: `${dimensions.height * currentScale}px`,
              backgroundColor: currentSlide.background?.color || '#ffffff',
            }}
          >
            <div
              className="pointer-events-none absolute origin-top-left"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                transform: `scale(${currentScale})`,
              }}
            >
              {currentSlide.elements.map((el) => (
                <SlideElement key={el.id} element={el} isSelected={false} onSelect={() => {}} />
              ))}
            </div>
          </div>

          {/* Navigation bar */}
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((p) => p - 1)}
              className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium hover:bg-neutral-700 disabled:opacity-30"
            >
              <SkipBack size={13} />
              Previous
            </button>
            <button
              type="button"
              disabled={currentIndex === slides.length - 1}
              onClick={() => setCurrentIndex((p) => p + 1)}
              className="flex items-center gap-1 rounded border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-medium hover:bg-blue-500 disabled:opacity-30"
            >
              Next
              <SkipForward size={13} />
            </button>
          </div>
        </div>

        {/* Right: Next Slide and Speaker Notes */}
        <div className="flex w-96 flex-col gap-4">
          {/* Next Slide Preview */}
          <div className="flex flex-col gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="text-xs font-semibold text-neutral-400">Next Slide</div>
            {nextSlide ? (
              <div
                className="relative overflow-hidden rounded border border-neutral-700"
                style={{
                  width: '240px',
                  height: `${dimensions.height * nextScale}px`,
                  backgroundColor: nextSlide.background?.color || '#ffffff',
                }}
              >
                <div
                  className="pointer-events-none absolute origin-top-left"
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    transform: `scale(${nextScale})`,
                  }}
                >
                  {nextSlide.elements.map((el) => (
                    <SlideElement key={el.id} element={el} isSelected={false} onSelect={() => {}} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-28 w-60 items-center justify-center rounded border border-dashed border-neutral-700 text-xs text-neutral-500">
                End of Slide Show
              </div>
            )}
          </div>

          {/* Speaker Notes */}
          <div className="flex flex-1 flex-col gap-1.5 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            <div className="text-xs font-semibold text-neutral-400">Speaker Notes</div>
            <div className="flex-1 overflow-y-auto rounded bg-neutral-950 p-2.5 text-xs leading-relaxed text-neutral-200">
              {currentSlide.notes || 'No speaker notes recorded for this slide.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
