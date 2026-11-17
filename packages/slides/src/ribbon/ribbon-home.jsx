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
  Sparkles,
  Copy,
  Trash2,
  CaseSensitive,
  Baseline,
  TextCursorInput,
} from 'lucide-react'
import { SHAPE_TYPES } from '../core/slide-constants.js'

export const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Carlito', value: 'Carlito, sans-serif' },
  { label: 'Liberation Sans', value: "'Liberation Sans', sans-serif" },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'monospace' },
]
export const FONT_SIZES = [12, 14, 18, 24, 32, 40, 48, 64, 72]
export const TEXT_COLORS = [
  { label: 'Slate', value: '#1e293b' },
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#ffffff' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Green', value: '#16a34a' },
]

const dropdown = (id, label, icon, entries, onPick) => ({
  id,
  type: 'dropdown',
  label,
  size: 'small',
  icon,
  items: entries.map((e) => ({
    id: `${id}-${e.label}`,
    label: e.label,
    onClick: () => onPick?.(e.value),
  })),
})

/**
 * Returns the Home tab definition for the ZSlides ribbon.
 *
 * @param {Object} actions
 * @returns {Object} Ribbon tab descriptor
 */
export function getHomeTab(actions = {}) {
  return {
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
          [
            dropdown(
              'font-family',
              'Font',
              <CaseSensitive size={13} />,
              FONT_FAMILIES,
              actions.onSetFontFamily,
            ),
            dropdown(
              'font-size',
              'Size',
              <TextCursorInput size={13} />,
              FONT_SIZES.map((n) => ({ label: String(n), value: n })),
              actions.onSetFontSize,
            ),
            dropdown(
              'font-color',
              'Color',
              <Baseline size={13} />,
              TEXT_COLORS,
              actions.onSetTextColor,
            ),
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
            id: 'insert-speech',
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
              id: 'duplicate-element',
              type: 'button',
              label: 'Duplicate',
              size: 'small',
              icon: <Copy size={13} />,
              onClick: actions.onDuplicate,
            },
            {
              id: 'delete-element',
              type: 'button',
              label: 'Delete',
              size: 'small',
              icon: <Trash2 size={13} />,
              onClick: actions.onDeleteSelected,
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
      {
        id: 'ai-tools',
        label: 'AI Tools',
        controls: [
          {
            id: 'ai-slides-assistant',
            type: 'button',
            label: 'AI Outline',
            size: 'large',
            icon: <Sparkles size={18} className="text-purple-600" />,
            onClick: actions.onToggleAi,
          },
        ],
      },
    ],
  }
}
