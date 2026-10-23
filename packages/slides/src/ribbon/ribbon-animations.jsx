import React from 'react'
import { Sparkles, Sliders } from 'lucide-react'
import { ANIMATION_OPTIONS } from '../animations/animation-engine.js'

/**
 * Creates animations ribbon tab configuration.
 *
 * @param {Object} actions
 * @returns {Object} Tab configuration
 */
export function getAnimationsTab(actions = {}) {
  return {
    id: 'animations',
    label: 'Animations',
    groups: [
      {
        id: 'animation-effects',
        label: 'Animation',
        controls: ANIMATION_OPTIONS.slice(0, 6).map((opt) => ({
          id: `anim-${opt.id}`,
          type: 'button',
          label: opt.name,
          size: 'small',
          icon: <Sparkles size={13} />,
          onClick: () => actions.onAddAnimation?.(opt.id),
        })),
      },
      {
        id: 'advanced-animation',
        label: 'Advanced Animation',
        controls: [
          {
            id: 'toggle-anim-pane',
            type: 'button',
            label: 'Animation Pane',
            size: 'large',
            icon: <Sliders size={18} />,
            onClick: actions.onToggleAnimationPane,
          },
        ],
      },
    ],
  }
}
