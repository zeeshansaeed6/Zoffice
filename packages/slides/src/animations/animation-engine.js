/**
 * Supported slide animation effect types, triggers, and execution parameters.
 */

export const ANIMATION_TYPES = {
  FADE_IN: 'fade_in',
  FLY_IN: 'fly_in',
  ZOOM_IN: 'zoom_in',
  SPIN: 'spin',
  PULSE: 'pulse',
  WIPE: 'wipe',
  FADE_OUT: 'fade_out',
  FLY_OUT: 'fly_out',
}

export const ANIMATION_TRIGGERS = {
  ON_CLICK: 'on_click',
  WITH_PREVIOUS: 'with_previous',
  AFTER_PREVIOUS: 'after_previous',
}

export const ANIMATION_OPTIONS = [
  { id: ANIMATION_TYPES.FADE_IN, name: 'Fade In', category: 'entrance' },
  { id: ANIMATION_TYPES.FLY_IN, name: 'Fly In', category: 'entrance' },
  { id: ANIMATION_TYPES.ZOOM_IN, name: 'Zoom In', category: 'entrance' },
  { id: ANIMATION_TYPES.SPIN, name: 'Spin', category: 'emphasis' },
  { id: ANIMATION_TYPES.PULSE, name: 'Pulse', category: 'emphasis' },
  { id: ANIMATION_TYPES.WIPE, name: 'Wipe', category: 'entrance' },
  { id: ANIMATION_TYPES.FADE_OUT, name: 'Fade Out', category: 'exit' },
  { id: ANIMATION_TYPES.FLY_OUT, name: 'Fly Out', category: 'exit' },
]

/**
 * Returns keyframes and options for the Web Animations API based on animation type.
 *
 * @param {string} animationType
 * @param {Object} [options]
 * @param {number} [options.duration=0.5] - in seconds
 * @param {number} [options.delay=0] - in seconds
 * @returns {{ keyframes: Array<Object>, timing: KeyframeEffectOptions }}
 */
export function getAnimationKeyframes(animationType, options = {}) {
  const durationMs = (options.duration ?? 0.5) * 1000
  const delayMs = (options.delay ?? 0) * 1000
  const timing = {
    duration: durationMs,
    delay: delayMs,
    fill: 'forwards',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }

  switch (animationType) {
    case ANIMATION_TYPES.FLY_IN:
      return {
        keyframes: [
          { transform: 'translate3d(0, 100px, 0)', opacity: 0 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
        ],
        timing,
      }

    case ANIMATION_TYPES.ZOOM_IN:
      return {
        keyframes: [
          { transform: 'scale(0.3)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        timing,
      }

    case ANIMATION_TYPES.SPIN:
      return {
        keyframes: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        timing,
      }

    case ANIMATION_TYPES.PULSE:
      return {
        keyframes: [
          { transform: 'scale(1)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' },
        ],
        timing,
      }

    case ANIMATION_TYPES.FADE_OUT:
      return {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        timing,
      }

    case ANIMATION_TYPES.FLY_OUT:
      return {
        keyframes: [
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          { transform: 'translate3d(0, -100px, 0)', opacity: 0 },
        ],
        timing,
      }

    case ANIMATION_TYPES.FADE_IN:
    default:
      return {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        timing,
      }
  }
}
