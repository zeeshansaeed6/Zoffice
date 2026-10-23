import React from 'react'
import { Presentation, Play, Monitor } from 'lucide-react'

/**
 * Creates Slide Show ribbon tab configuration.
 *
 * @param {Object} actions
 * @returns {Object} Tab configuration
 */
export function getSlideShowTab(actions = {}) {
  return {
    id: 'slideshow',
    label: 'Slide Show',
    groups: [
      {
        id: 'start-slideshow',
        label: 'Start Slide Show',
        controls: [
          {
            id: 'play-from-start',
            type: 'button',
            label: 'From Beginning',
            size: 'large',
            icon: <Play size={18} />,
            onClick: actions.onPlayFromBeginning,
          },
          {
            id: 'play-from-current',
            type: 'button',
            label: 'From Current',
            size: 'large',
            icon: <Presentation size={18} />,
            onClick: actions.onPlayFromCurrent,
          },
          {
            id: 'presenter-view-btn',
            type: 'button',
            label: 'Presenter View',
            size: 'large',
            icon: <Monitor size={18} />,
            onClick: actions.onStartPresenterView,
          },
        ],
      },
    ],
  }
}
