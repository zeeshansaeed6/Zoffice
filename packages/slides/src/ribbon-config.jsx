import React from 'react'
import { Palette } from 'lucide-react'
import { getHomeTab } from './ribbon/ribbon-home.jsx'
import { getInsertTab } from './ribbon/ribbon-insert.jsx'
import { getTransitionsTab } from './ribbon/ribbon-transitions.jsx'
import { getAnimationsTab } from './ribbon/ribbon-animations.jsx'
import { getSlideShowTab } from './ribbon/ribbon-slideshow.jsx'

/**
 * Creates data-driven ribbon configuration for ZSlides.
 *
 * @param {Object} [actions]
 * @returns {import('@zoffice/ui').RibbonConfig}
 */
export function getSlidesRibbonConfig(actions = {}) {
  return {
    appId: 'slides',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    onUndo: actions.onUndo,
    onRedo: actions.onRedo,
    canUndo: actions.canUndo,
    canRedo: actions.canRedo,
    canSave: actions.canSave,
    tabs: [
      getHomeTab(actions),
      getInsertTab(actions),
      {
        id: 'design',
        label: 'Design',
        groups: [
          {
            id: 'themes-group',
            label: 'Themes',
            controls: [
              {
                id: 'theme-gallery',
                type: 'button',
                label: 'Themes',
                size: 'large',
                icon: <Palette size={18} />,
                onClick: actions.onOpenThemeGallery,
              },
            ],
          },
        ],
      },
      getTransitionsTab(actions),
      getAnimationsTab(actions),
      getSlideShowTab(actions),
    ],
  }
}
