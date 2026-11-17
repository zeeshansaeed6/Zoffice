import React from 'react'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  PaintBucket,
  Baseline,
  Eraser,
  Hash,
  ArrowLeftToLine,
  ArrowRightToLine,
} from 'lucide-react'

const COLORS = [
  { id: 'none', label: 'None', value: null },
  { id: 'yellow', label: 'Yellow', value: '#fef08a' },
  { id: 'green', label: 'Green', value: '#bbf7d0' },
  { id: 'blue', label: 'Blue', value: '#bfdbfe' },
  { id: 'red', label: 'Red', value: '#fecaca' },
  { id: 'black', label: 'Black', value: '#0f172a' },
  { id: 'white', label: 'White', value: '#ffffff' },
]

const colorItems = (prefix, onPick) =>
  COLORS.map((c) => ({ id: `${prefix}-${c.id}`, label: c.label, onClick: () => onPick?.(c.value) }))

const toggle = (id, label, icon, pressed, onToggle) => ({
  id,
  type: 'toggle',
  label,
  icon,
  pressed,
  onToggle,
})

/** Home tab groups for ZSheets. @param {Object} a */
export function getHomeGroups(a) {
  const style = a.activeStyle || {}
  return [
    {
      id: 'font',
      label: 'Font',
      controls: [
        [
          toggle('bold', 'Bold', <Bold size={13} />, !!style.bold, a.onToggleBold),
          toggle('italic', 'Italic', <Italic size={13} />, !!style.italic, a.onToggleItalic),
        ],
        [
          {
            id: 'fill-color',
            type: 'dropdown',
            label: 'Fill',
            size: 'small',
            icon: <PaintBucket size={13} />,
            items: colorItems('fill', a.onSetFill),
          },
          {
            id: 'text-color',
            type: 'dropdown',
            label: 'Text Color',
            size: 'small',
            icon: <Baseline size={13} />,
            items: colorItems('text', a.onSetTextColor),
          },
        ],
      ],
    },
    {
      id: 'alignment',
      label: 'Alignment',
      controls: [
        [
          toggle('align-left', 'Align Left', <AlignLeft size={13} />, style.align === 'left', () =>
            a.onSetAlign?.('left'),
          ),
          toggle(
            'align-center',
            'Align Center',
            <AlignCenter size={13} />,
            style.align === 'center',
            () => a.onSetAlign?.('center'),
          ),
          toggle(
            'align-right',
            'Align Right',
            <AlignRight size={13} />,
            style.align === 'right',
            () => a.onSetAlign?.('right'),
          ),
        ],
      ],
    },
    {
      id: 'number',
      label: 'Number',
      controls: [
        {
          id: 'currency',
          type: 'button',
          label: 'Currency',
          size: 'large',
          icon: <DollarSign size={18} />,
          onClick: () => a.onSetNumberFormat?.('currency'),
        },
        {
          id: 'percent',
          type: 'button',
          label: 'Percent',
          size: 'large',
          icon: <Percent size={18} />,
          onClick: () => a.onSetNumberFormat?.('percent'),
        },
        [
          {
            id: 'number-format',
            type: 'dropdown',
            label: 'Format',
            size: 'small',
            icon: <Hash size={13} />,
            items: [
              {
                id: 'fmt-general',
                label: 'General',
                onClick: () => a.onSetNumberFormat?.('general'),
              },
              { id: 'fmt-number', label: 'Number', onClick: () => a.onSetNumberFormat?.('number') },
              {
                id: 'fmt-integer',
                label: 'Integer',
                onClick: () => a.onSetNumberFormat?.('integer'),
              },
            ],
          },
          {
            id: 'decimals-less',
            type: 'button',
            label: 'Fewer Decimals',
            icon: <ArrowLeftToLine size={13} />,
            onClick: () => a.onChangeDecimals?.(-1),
          },
          {
            id: 'decimals-more',
            type: 'button',
            label: 'More Decimals',
            icon: <ArrowRightToLine size={13} />,
            onClick: () => a.onChangeDecimals?.(1),
          },
        ],
      ],
    },
    {
      id: 'editing',
      label: 'Editing',
      controls: [
        {
          id: 'clear',
          type: 'button',
          label: 'Clear Contents',
          size: 'large',
          icon: <Eraser size={18} />,
          onClick: a.onClearContents,
        },
      ],
    },
  ]
}
