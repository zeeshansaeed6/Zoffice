/**
 * Supported slide transitions and their CSS transition configurations.
 */

export const TRANSITION_TYPES = {
  NONE: 'none',
  FADE: 'fade',
  PUSH: 'push',
  WIPE: 'wipe',
  ZOOM: 'zoom',
  CUBE: 'cube',
  FLIP: 'flip',
}

export const TRANSITION_OPTIONS = [
  { id: TRANSITION_TYPES.NONE, name: 'None' },
  { id: TRANSITION_TYPES.FADE, name: 'Fade' },
  { id: TRANSITION_TYPES.PUSH, name: 'Push' },
  { id: TRANSITION_TYPES.WIPE, name: 'Wipe' },
  { id: TRANSITION_TYPES.ZOOM, name: 'Zoom' },
  { id: TRANSITION_TYPES.CUBE, name: 'Cube' },
  { id: TRANSITION_TYPES.FLIP, name: 'Flip' },
]

/**
 * Returns CSS styles for a given transition type and animation progress state.
 *
 * @param {string} transitionType
 * @param {'entering'|'entered'|'exiting'} stage
 * @param {number} [duration=0.5]
 * @returns {React.CSSProperties}
 */
export function getTransitionStyle(transitionType, stage, duration = 0.5) {
  const transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`

  switch (transitionType) {
    case TRANSITION_TYPES.FADE:
      return {
        transition,
        opacity: stage === 'entering' || stage === 'exiting' ? 0 : 1,
      }

    case TRANSITION_TYPES.PUSH:
      return {
        transition,
        transform:
          stage === 'entering'
            ? 'translate3d(100%, 0, 0)'
            : stage === 'exiting'
              ? 'translate3d(-100%, 0, 0)'
              : 'translate3d(0, 0, 0)',
      }

    case TRANSITION_TYPES.ZOOM:
      return {
        transition,
        opacity: stage === 'entering' ? 0 : 1,
        transform:
          stage === 'entering' ? 'scale(0.7)' : stage === 'exiting' ? 'scale(1.2)' : 'scale(1)',
      }

    case TRANSITION_TYPES.CUBE:
      return {
        transition,
        transformOrigin: '50% 50% -400px',
        transform:
          stage === 'entering'
            ? 'rotateY(-90deg)'
            : stage === 'exiting'
              ? 'rotateY(90deg)'
              : 'rotateY(0deg)',
      }

    case TRANSITION_TYPES.FLIP:
      return {
        transition,
        transform:
          stage === 'entering'
            ? 'rotateX(90deg)'
            : stage === 'exiting'
              ? 'rotateX(-90deg)'
              : 'rotateX(0deg)',
      }

    case TRANSITION_TYPES.WIPE:
      return {
        transition,
        clipPath:
          stage === 'entering'
            ? 'polygon(0 0, 0 0, 0 100%, 0 100%)'
            : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      }

    case TRANSITION_TYPES.NONE:
    default:
      return {}
  }
}
