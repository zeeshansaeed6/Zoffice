import React from 'react'
import { Sparkles, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { ANIMATION_TRIGGERS, ANIMATION_OPTIONS } from './animation-engine.js'

/**
 * AnimationPane component for managing element animations, ordering, and triggers.
 *
 * @param {Object} props
 * @param {Array<Object>} props.animations - Array<{ id, elementId, type, trigger, duration, delay }>
 * @param {Array<Object>} props.elements - Slide elements for label display
 * @param {(animations: Array<Object>) => void} props.onUpdateAnimations
 * @param {() => void} props.onClose
 */
export function AnimationPane({ animations = [], elements = [], onUpdateAnimations, onClose }) {
  const getElementName = (elementId) => {
    const el = elements.find((e) => e.id === elementId)
    if (!el) return 'Element'
    if (el.type === 'text') return `Text: "${(el.properties?.text || '').substring(0, 15)}..."`
    if (el.type === 'shape') return `Shape: ${el.properties?.shapeType || 'rect'}`
    return el.type
  }

  const handleMove = (index, dir) => {
    const next = [...animations]
    const targetIdx = index + dir
    if (targetIdx < 0 || targetIdx >= animations.length) return
    const [moved] = next.splice(index, 1)
    next.splice(targetIdx, 0, moved)
    onUpdateAnimations(next)
  }

  const handleDelete = (index) => {
    const next = animations.filter((_, i) => i !== index)
    onUpdateAnimations(next)
  }

  const handleTriggerChange = (index, trigger) => {
    const next = animations.map((anim, i) => (i === index ? { ...anim, trigger } : anim))
    onUpdateAnimations(next)
  }

  return (
    <div
      data-testid="slides-animation-pane"
      className="flex h-full w-64 select-none flex-col border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 p-3 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200">
          <Sparkles size={14} className="text-blue-500" />
          Animation Pane
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {animations.length === 0 ? (
          <div className="p-4 text-center text-xs text-neutral-400">
            No animations on this slide. Select an element and choose an animation from the ribbon.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {animations.map((anim, idx) => {
              const opt = ANIMATION_OPTIONS.find((o) => o.id === anim.type)
              return (
                <div
                  key={anim.id || `anim-${idx}`}
                  className="flex flex-col gap-1 rounded border border-neutral-200 bg-neutral-50 p-2 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {idx + 1}. {opt?.name || anim.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        className="rounded p-0.5 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 dark:hover:bg-neutral-700"
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === animations.length - 1}
                        className="rounded p-0.5 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 dark:hover:bg-neutral-700"
                      >
                        <ArrowDown size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        className="rounded p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="truncate text-[10px] text-neutral-500">
                    {getElementName(anim.elementId)}
                  </div>

                  <select
                    value={anim.trigger || ANIMATION_TRIGGERS.ON_CLICK}
                    onChange={(e) => handleTriggerChange(idx, e.target.value)}
                    className="mt-1 rounded border border-neutral-300 bg-white p-1 text-[10px] text-neutral-700 outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200"
                  >
                    <option value={ANIMATION_TRIGGERS.ON_CLICK}>Start: On Click</option>
                    <option value={ANIMATION_TRIGGERS.WITH_PREVIOUS}>Start: With Previous</option>
                    <option value={ANIMATION_TRIGGERS.AFTER_PREVIOUS}>Start: After Previous</option>
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
