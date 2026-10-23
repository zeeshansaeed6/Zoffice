import React from 'react'
import {
  PlusSquare,
  Layout,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Shapes,
  Palette,
  Play,
  Presentation,
} from 'lucide-react'

/**
 * Creates data-driven ribbon configuration for ZSlides.
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
      {
        id: 'home',
        label: 'Home',
        groups: [
          {
            id: 'slides',
            label: 'Slides',
            controls: [
              {
                id: 'new-slide',
                type: 'button',
                label: 'New Slide',
                size: 'large',
                icon: <PlusSquare size={18} />,
                onClick: actions.onNewSlide,
              },
              {
                id: 'layout',
                type: 'button',
                label: 'Layout',
                size: 'large',
                icon: <Layout size={18} />,
                onClick: actions.onSlideLayout,
              },
            ],
          },
          {
            id: 'font',
            label: 'Font',
            controls: [
              [
                {
                  id: 'bold',
                  type: 'toggle',
                  label: 'Bold',
                  icon: <Bold size={13} />,
                  pressed: actions.bold,
                  onToggle: actions.toggleBold,
                },
                {
                  id: 'italic',
                  type: 'toggle',
                  label: 'Italic',
                  icon: <Italic size={13} />,
                  pressed: actions.italic,
                  onToggle: actions.toggleItalic,
                },
              ],
            ],
          },
          {
            id: 'paragraph',
            label: 'Paragraph',
            controls: [
              [
                {
                  id: 'align-left',
                  type: 'toggle',
                  label: 'Align Left',
                  icon: <AlignLeft size={13} />,
                  pressed: actions.align === 'left',
                  onToggle: () => actions.setAlign?.('left'),
                },
                {
                  id: 'align-center',
                  type: 'toggle',
                  label: 'Align Center',
                  icon: <AlignCenter size={13} />,
                  pressed: actions.align === 'center',
                  onToggle: () => actions.setAlign?.('center'),
                },
                {
                  id: 'align-right',
                  type: 'toggle',
                  label: 'Align Right',
                  icon: <AlignRight size={13} />,
                  pressed: actions.align === 'right',
                  onToggle: () => actions.setAlign?.('right'),
                },
              ],
            ],
          },
        ],
      },
      {
        id: 'insert',
        label: 'Insert',
        groups: [
          {
            id: 'media',
            label: 'Media',
            controls: [
              {
                id: 'pictures',
                type: 'button',
                label: 'Pictures',
                size: 'large',
                icon: <Image size={18} />,
                onClick: actions.onInsertPicture,
              },
              {
                id: 'shapes',
                type: 'button',
                label: 'Shapes',
                size: 'large',
                icon: <Shapes size={18} />,
                onClick: actions.onInsertShapes,
              },
            ],
          },
        ],
      },
      {
        id: 'design',
        label: 'Design',
        groups: [
          {
            id: 'themes',
            label: 'Themes',
            controls: [
              {
                id: 'theme-palette',
                type: 'button',
                label: 'Themes',
                size: 'large',
                icon: <Palette size={18} />,
                onClick: actions.onSelectTheme,
              },
            ],
          },
        ],
      },
      {
        id: 'transitions',
        label: 'Transitions',
        groups: [
          {
            id: 'transition-effects',
            label: 'Transition to This Slide',
            controls: [
              {
                id: 'fade',
                type: 'button',
                label: 'Fade',
                size: 'large',
                icon: <Play size={18} />,
                onClick: () => actions.onSetTransition?.('fade'),
              },
            ],
          },
        ],
      },
      {
        id: 'view',
        label: 'View',
        groups: [
          {
            id: 'presentation-views',
            label: 'Presentation Views',
            controls: [
              {
                id: 'slide-show',
                type: 'button',
                label: 'Slide Show',
                size: 'large',
                icon: <Presentation size={18} />,
                onClick: actions.onStartSlideShow,
              },
            ],
          },
        ],
      },
    ],
  }
}
