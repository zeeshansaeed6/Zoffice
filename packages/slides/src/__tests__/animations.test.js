import { describe, it, expect } from 'vitest'
import {
  ANIMATION_TYPES,
  ANIMATION_TRIGGERS,
  ANIMATION_OPTIONS,
  getAnimationKeyframes,
} from '../animations/animation-engine.js'

describe('ZSlides Step 8 - Animation Engine', () => {
  it('exposes all entrance, emphasis, and exit animation types', () => {
    expect(ANIMATION_OPTIONS.length).toBe(8)
    const types = ANIMATION_OPTIONS.map((a) => a.id)
    expect(types).toContain(ANIMATION_TYPES.FADE_IN)
    expect(types).toContain(ANIMATION_TYPES.FLY_IN)
    expect(types).toContain(ANIMATION_TYPES.ZOOM_IN)
    expect(types).toContain(ANIMATION_TYPES.SPIN)
    expect(types).toContain(ANIMATION_TYPES.PULSE)
    expect(types).toContain(ANIMATION_TYPES.FADE_OUT)
    expect(types).toContain(ANIMATION_TYPES.FLY_OUT)
  })

  it('supports all standard triggers', () => {
    expect(ANIMATION_TRIGGERS.ON_CLICK).toBe('on_click')
    expect(ANIMATION_TRIGGERS.WITH_PREVIOUS).toBe('with_previous')
    expect(ANIMATION_TRIGGERS.AFTER_PREVIOUS).toBe('after_previous')
  })

  it('computes Web Animations keyframes for Fly In', () => {
    const config = getAnimationKeyframes(ANIMATION_TYPES.FLY_IN, { duration: 0.8, delay: 0.2 })
    expect(config.timing.duration).toBe(800)
    expect(config.timing.delay).toBe(200)
    expect(config.keyframes[0].transform).toBe('translate3d(0, 100px, 0)')
    expect(config.keyframes[1].transform).toBe('translate3d(0, 0, 0)')
  })

  it('computes Web Animations keyframes for Spin', () => {
    const config = getAnimationKeyframes(ANIMATION_TYPES.SPIN)
    expect(config.keyframes[0].transform).toBe('rotate(0deg)')
    expect(config.keyframes[1].transform).toBe('rotate(360deg)')
  })
})
