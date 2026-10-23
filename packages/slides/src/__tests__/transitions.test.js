import { describe, it, expect } from 'vitest'
import {
  TRANSITION_TYPES,
  TRANSITION_OPTIONS,
  getTransitionStyle,
} from '../presenter/transitions.js'

describe('ZSlides Step 7 - Transitions Engine', () => {
  it('exposes all 6 key transition styles', () => {
    expect(TRANSITION_OPTIONS.length).toBe(7) // None + 6 effects
    const ids = TRANSITION_OPTIONS.map((o) => o.id)
    expect(ids).toContain(TRANSITION_TYPES.FADE)
    expect(ids).toContain(TRANSITION_TYPES.PUSH)
    expect(ids).toContain(TRANSITION_TYPES.WIPE)
    expect(ids).toContain(TRANSITION_TYPES.ZOOM)
    expect(ids).toContain(TRANSITION_TYPES.CUBE)
    expect(ids).toContain(TRANSITION_TYPES.FLIP)
  })

  it('computes hardware-accelerated 3D transform for push transition', () => {
    const entering = getTransitionStyle(TRANSITION_TYPES.PUSH, 'entering', 0.6)
    expect(entering.transform).toBe('translate3d(100%, 0, 0)')
    expect(entering.transition).toContain('0.6s')

    const entered = getTransitionStyle(TRANSITION_TYPES.PUSH, 'entered', 0.6)
    expect(entered.transform).toBe('translate3d(0, 0, 0)')

    const exiting = getTransitionStyle(TRANSITION_TYPES.PUSH, 'exiting', 0.6)
    expect(exiting.transform).toBe('translate3d(-100%, 0, 0)')
  })

  it('computes 3D cube rotation transforms', () => {
    const cubeIn = getTransitionStyle(TRANSITION_TYPES.CUBE, 'entering', 0.5)
    expect(cubeIn.transform).toBe('rotateY(-90deg)')
    expect(cubeIn.transformOrigin).toBe('50% 50% -400px')
  })

  it('computes fade opacity stages', () => {
    expect(getTransitionStyle(TRANSITION_TYPES.FADE, 'entering').opacity).toBe(0)
    expect(getTransitionStyle(TRANSITION_TYPES.FADE, 'entered').opacity).toBe(1)
    expect(getTransitionStyle(TRANSITION_TYPES.FADE, 'exiting').opacity).toBe(0)
  })
})
