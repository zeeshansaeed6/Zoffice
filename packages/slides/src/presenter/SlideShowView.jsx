import React, { useEffect, useState, useRef, useCallback } from 'react'
import { getTransitionStyle } from './transitions.js'
import { SlideElement } from '../canvas/SlideElement.jsx'

/**
 * SlideShowView runs full-screen presentation mode with transitions and keyboard controls.
 *
 * @param {Object} props
 * @param {Array<Object>} props.slides
 * @param {number} [props.initialIndex=0]
 * @param {Object} props.dimensions
 * @param {() => void} props.onExit
 */
export function SlideShowView({
  slides = [],
  initialIndex = 0,
  dimensions = { width: 960, height: 540 },
  onExit,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [stage, setStage] = useState('entered') // 'entering' | 'entered' | 'exiting'
  const [isBlackout, setIsBlackout] = useState(false)
  const [isLaserActive, setIsLaserActive] = useState(false)
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 })
  const containerRef = useRef(null)

  const activeSlide = slides[currentIndex] || slides[0]
  const transitionType = activeSlide.transition?.type || 'none'
  const transitionDuration = activeSlide.transition?.duration || 0.5

  const goToSlide = useCallback(
    (newIndex) => {
      if (newIndex < 0 || newIndex >= slides.length || newIndex === currentIndex) return
      setStage('exiting')
      setTimeout(() => {
        setCurrentIndex(newIndex)
        setStage('entering')
        setTimeout(() => setStage('entered'), 20)
      }, transitionDuration * 500)
    },
    [slides.length, currentIndex, transitionDuration]
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onExit()
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        goToSlide(currentIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToSlide(currentIndex - 1)
      } else if (e.key.toLowerCase() === 'b') {
        setIsBlackout((prev) => !prev)
      } else if (e.key.toLowerCase() === 'l') {
        setIsLaserActive((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, goToSlide, onExit])

  const handleMouseMove = (e) => {
    if (isLaserActive) {
      setLaserPos({ x: e.clientX, y: e.clientY })
    }
  }

  const transStyle = getTransitionStyle(transitionType, stage, transitionDuration)

  return (
    <div
      ref={containerRef}
      data-testid="slideshow-view"
      className="fixed inset-0 z-50 flex select-none items-center justify-center bg-black"
      onMouseMove={handleMouseMove}
      onClick={() => goToSlide(currentIndex + 1)}
    >
      {/* Blackout overlay */}
      {isBlackout && <div className="absolute inset-0 z-40 bg-black" />}

      {/* Slide frame */}
      <div
        className="relative shadow-2xl transition-all"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          backgroundColor: activeSlide.background?.color || '#ffffff',
          ...transStyle,
        }}
      >
        {activeSlide.elements.map((el) => (
          <SlideElement key={el.id} element={el} isSelected={false} onSelect={() => {}} />
        ))}
      </div>

      {/* Laser pointer overlay */}
      {isLaserActive && (
        <div
          className="pointer-events-none fixed z-50 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-[0_0_15px_rgba(239,68,68,1)]"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
        />
      )}

      {/* Controls HUD */}
      <div
        className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-neutral-900/80 px-4 py-1.5 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => goToSlide(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="rounded p-1 hover:bg-neutral-800 disabled:opacity-30"
        >
          ◀
        </button>
        <span>
          {currentIndex + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => goToSlide(currentIndex + 1)}
          disabled={currentIndex === slides.length - 1}
          className="rounded p-1 hover:bg-neutral-800 disabled:opacity-30"
        >
          ▶
        </button>
        <span className="text-neutral-500">|</span>
        <button
          type="button"
          onClick={() => setIsLaserActive(!isLaserActive)}
          className={`rounded px-2 py-0.5 text-[10px] ${isLaserActive ? 'bg-red-600 font-bold' : 'hover:bg-neutral-800'}`}
        >
          Laser (L)
        </button>
        <button
          type="button"
          onClick={() => setIsBlackout(!isBlackout)}
          className={`rounded px-2 py-0.5 text-[10px] ${isBlackout ? 'bg-blue-600 font-bold' : 'hover:bg-neutral-800'}`}
        >
          Blackout (B)
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-950"
        >
          Exit (Esc)
        </button>
      </div>
    </div>
  )
}
