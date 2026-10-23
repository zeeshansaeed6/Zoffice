import React from 'react'
import {
  PlusSquare,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Square,
  Circle,
  ArrowRight,
  Star,
  MessageSquare,
  BringToFront,
  SendToBack,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Palette,
  Image,
  Table,
  BarChart3,
} from 'lucide-react'
import { SHAPE_TYPES } from './core/slide-constants.js'
import { getTransitionsTab } from './ribbon/ribbon-transitions.jsx'
import { getAnimationsTab } from './ribbon/ribbon-animations.jsx'

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
                id: 'change-layout',
                type: 'button',
                label: 'Layout',
                size: 'large',
                icon: <PlusSquare size={18} />,
                onClick: actions.onOpenLayoutPicker,
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
                {
                  id: 'underline',
                  type: 'toggle',
                  label: 'Underline',
                  icon: <Underline size={13} />,
                  pressed: actions.underline,
                  onToggle: actions.toggleUnderline,
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
          {
            id: 'drawing',
            label: 'Drawing',
            controls: [
              {
                id: 'insert-text',
                type: 'button',
                label: 'Text Box',
                size: 'small',
                icon: <Type size={14} />,
                onClick: actions.onInsertTextBox,
              },
              {
                id: 'insert-rect',
                type: 'button',
                label: 'Rectangle',
                size: 'small',
                icon: <Square size={14} />,
                onClick: () => actions.onInsertShape?.(SHAPE_TYPES.RECTANGLE),
              },
              {
                id: 'insert-ellipse',
                type: 'button',
                label: 'Circle',
                size: 'small',
                icon: <Circle size={14} />,
                onClick: () => actions.onInsertShape?.(SHAPE_TYPES.ELLIPSE),
              },
              {
                id: 'insert-arrow',
                type: 'button',
                label: 'Arrow',
                size: 'small',
                icon: <ArrowRight size={14} />,
                onClick: () => actions.onInsertShape?.(SHAPE_TYPES.RIGHT_ARROW),
              },
              {
                id: 'insert-star',
                type: 'button',
                label: 'Star',
                size: 'small',
                icon: <Star size={14} />,
                onClick: () => actions.onInsertShape?.(SHAPE_TYPES.STAR_5),
              },
              {
                id: 'insert-bubble',
                type: 'button',
                label: 'Callout',
                size: 'small',
                icon: <MessageSquare size={14} />,
                onClick: () => actions.onInsertShape?.(SHAPE_TYPES.SPEECH_BUBBLE),
              },
            ],
          },
          {
            id: 'arrange',
            label: 'Arrange',
            controls: [
              [
                {
                  id: 'bring-front',
                  type: 'button',
                  label: 'Bring to Front',
                  size: 'small',
                  icon: <BringToFront size={13} />,
                  onClick: () => actions.onArrange?.('front'),
                },
                {
                  id: 'send-back',
                  type: 'button',
                  label: 'Send to Back',
                  size: 'small',
                  icon: <SendToBack size={13} />,
                  onClick: () => actions.onArrange?.('back'),
                },
              ],
              [
                {
                  id: 'align-center-btn',
                  type: 'button',
                  label: 'Align Center',
                  size: 'small',
                  icon: <AlignHorizontalDistributeCenter size={13} />,
                  onClick: () => actions.onAlignElements?.('center'),
                },
                {
                  id: 'align-middle-btn',
                  type: 'button',
                  label: 'Align Middle',
                  size: 'small',
                  icon: <AlignVerticalDistributeCenter size={13} />,
                  onClick: () => actions.onAlignElements?.('middle'),
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
            id: 'tables-group',
            label: 'Tables',
            controls: [
              {
                id: 'insert-table-btn',
                type: 'button',
                label: 'Table',
                size: 'large',
                icon: <Table size={18} />,
                onClick: actions.onInsertTable,
              },
            ],
          },
          {
            id: 'illustrations-group',
            label: 'Illustrations',
            controls: [
              {
                id: 'insert-picture-btn',
                type: 'button',
                label: 'Pictures',
                size: 'large',
                icon: <Image size={18} />,
                onClick: actions.onInsertPicture,
              },
              {
                id: 'insert-chart-btn',
                type: 'button',
                label: 'Chart',
                size: 'large',
                icon: <BarChart3 size={18} />,
                onClick: actions.onInsertChart,
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
    ],
  }
}
