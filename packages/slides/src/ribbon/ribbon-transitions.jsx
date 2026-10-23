import React from 'react'
import { Play, RotateCw, Zap } from 'lucide-react'
import { TRANSITION_OPTIONS } from '../presenter/transitions.js'

/**
 * Creates transitions ribbon tab configuration.
 *
 * @param {Object} actions
 * @returns {Object} Tab configuration
 */
export function getTransitionsTab(actions = {}) {
  return {
    id: 'transitions',
    label: 'Transitions',
    groups: [
      {
        id: 'transition-effects',
        label: 'Transition to This Slide',
        controls: TRANSITION_OPTIONS.map((opt) => ({
          id: `trans-${opt.id}`,
          type: 'button',
          label: opt.name,
          size: 'small',
          icon: opt.id === 'none' ? <RotateCw size={13} /> : <Zap size={13} />,
          onClick: () => actions.onSetTransition?.(opt.id),
        })),
      },
      {
        id: 'transition-timing',
        label: 'Timing',
        controls: [
          {
            id: 'apply-all-trans',
            type: 'button',
            label: 'Apply to All',
            size: 'large',
            icon: <Play size={18} />,
            onClick: actions.onApplyTransitionToAll,
          },
        ],
      },
    ],
  }
}
