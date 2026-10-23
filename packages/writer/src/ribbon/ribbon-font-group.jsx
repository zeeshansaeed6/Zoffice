import React from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  RemoveFormatting,
  Palette,
  Highlighter,
} from 'lucide-react'
import { FONT_FAMILIES, FONT_SIZES, TEXT_COLORS, HIGHLIGHT_COLORS } from './ribbon-options.js'

/**
 * Creates the Font group controls for the ribbon.
 * @param {Object} actions
 * @param {Object} marks
 * @returns {Object}
 */
export function getFontRibbonGroup(actions, marks) {
  return {
    id: 'font',
    label: 'Font',
    controls: [
      [
        {
          id: 'font-family',
          type: 'dropdown',
          label: marks.fontFamily || 'Inter',
          size: 'small',
          items: FONT_FAMILIES.map((f) => ({
            id: f.id,
            label: f.label,
            onClick: () => actions.setFontFamily?.(f.value),
          })),
        },
        {
          id: 'font-size',
          type: 'dropdown',
          label: marks.fontSize ? marks.fontSize.replace('px', '') : '16',
          size: 'small',
          items: FONT_SIZES.map((s) => ({
            id: `size-${s}`,
            label: String(s),
            onClick: () => actions.setFontSize?.(s),
          })),
        },
        {
          id: 'grow-font',
          type: 'button',
          label: 'A+',
          size: 'small',
          icon: <Type size={13} />,
          onClick: actions.onGrowFont,
        },
        {
          id: 'shrink-font',
          type: 'button',
          label: 'A-',
          size: 'small',
          icon: <Type size={11} />,
          onClick: actions.onShrinkFont,
        },
        {
          id: 'clear-formatting',
          type: 'button',
          label: 'Clear',
          size: 'small',
          icon: <RemoveFormatting size={13} />,
          onClick: actions.onClearFormatting,
        },
      ],
      [
        {
          id: 'bold',
          type: 'toggle',
          label: 'Bold',
          icon: <Bold size={13} />,
          pressed: marks.bold,
          onToggle: actions.toggleBold,
        },
        {
          id: 'italic',
          type: 'toggle',
          label: 'Italic',
          icon: <Italic size={13} />,
          pressed: marks.italic,
          onToggle: actions.toggleItalic,
        },
        {
          id: 'underline',
          type: 'toggle',
          label: 'Underline',
          icon: <Underline size={13} />,
          pressed: marks.underline,
          onToggle: actions.toggleUnderline,
        },
        {
          id: 'strike',
          type: 'toggle',
          label: 'Strike',
          icon: <Strikethrough size={13} />,
          pressed: marks.strike,
          onToggle: actions.toggleStrike,
        },
        {
          id: 'subscript',
          type: 'toggle',
          label: 'Sub',
          icon: <Subscript size={13} />,
          pressed: marks.subscript,
          onToggle: actions.toggleSubscript,
        },
        {
          id: 'superscript',
          type: 'toggle',
          label: 'Super',
          icon: <Superscript size={13} />,
          pressed: marks.superscript,
          onToggle: actions.toggleSuperscript,
        },
        {
          id: 'text-color',
          type: 'dropdown',
          label: 'Color',
          icon: <Palette size={13} />,
          size: 'small',
          items: TEXT_COLORS.map((c) => ({
            id: c.id,
            label: c.label,
            onClick: () => actions.setTextColor?.(c.value),
          })),
        },
        {
          id: 'highlight-color',
          type: 'dropdown',
          label: 'Highlight',
          icon: <Highlighter size={13} />,
          size: 'small',
          items: HIGHLIGHT_COLORS.map((h) => ({
            id: h.id,
            label: h.label,
            onClick: () => actions.setHighlightColor?.(h.value),
          })),
        },
      ],
    ],
  }
}
