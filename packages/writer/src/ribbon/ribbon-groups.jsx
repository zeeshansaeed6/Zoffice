import React from 'react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Search,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  CheckSquare,
} from 'lucide-react'
import { LINE_SPACINGS } from './ribbon-options.js'
import { getFontRibbonGroup } from './ribbon-font-group.jsx'

/**
 * Builds ribbon groups for ZWriter Home tab.
 * @param {Object} actions
 * @param {Object} marks
 * @returns {Array<Object>}
 */
export function getHomeRibbonGroups(actions, marks) {
  return [
    {
      id: 'clipboard',
      label: 'Clipboard',
      controls: [
        {
          id: 'paste',
          type: 'button',
          label: 'Paste',
          size: 'large',
          icon: <Clipboard size={20} />,
          onClick: actions.onPaste,
        },
        [
          {
            id: 'cut',
            type: 'button',
            label: 'Cut',
            size: 'small',
            icon: <Scissors size={13} />,
            onClick: actions.onCut,
          },
          {
            id: 'copy',
            type: 'button',
            label: 'Copy',
            size: 'small',
            icon: <Copy size={13} />,
            onClick: actions.onCopy,
          },
          {
            id: 'format-painter',
            type: 'toggle',
            label: 'Format Painter',
            icon: <Paintbrush size={13} />,
            pressed: actions.isFormatPainting,
            onToggle: actions.onFormatPainter,
          },
        ],
      ],
    },
    getFontRibbonGroup(actions, marks),
    {
      id: 'paragraph',
      label: 'Paragraph',
      controls: [
        [
          {
            id: 'bullet-list',
            type: 'toggle',
            label: 'Bullets',
            icon: <List size={13} />,
            pressed: marks.bulletList,
            onToggle: actions.toggleBulletList,
          },
          {
            id: 'ordered-list',
            type: 'toggle',
            label: 'Numbering',
            icon: <ListOrdered size={13} />,
            pressed: marks.orderedList,
            onToggle: actions.toggleOrderedList,
          },
          {
            id: 'line-spacing',
            type: 'dropdown',
            label: 'Spacing',
            size: 'small',
            items: LINE_SPACINGS.map((l) => ({
              id: l.id,
              label: l.label,
              onClick: () => actions.setLineSpacing?.(l.value),
            })),
          },
        ],
        [
          {
            id: 'align-left',
            type: 'toggle',
            label: 'Left',
            icon: <AlignLeft size={13} />,
            pressed: marks.align === 'left',
            onToggle: () => actions.setTextAlign?.('left'),
          },
          {
            id: 'align-center',
            type: 'toggle',
            label: 'Center',
            icon: <AlignCenter size={13} />,
            pressed: marks.align === 'center',
            onToggle: () => actions.setTextAlign?.('center'),
          },
          {
            id: 'align-right',
            type: 'toggle',
            label: 'Right',
            icon: <AlignRight size={13} />,
            pressed: marks.align === 'right',
            onToggle: () => actions.setTextAlign?.('right'),
          },
          {
            id: 'align-justify',
            type: 'toggle',
            label: 'Justify',
            icon: <AlignJustify size={13} />,
            pressed: marks.align === 'justify',
            onToggle: () => actions.setTextAlign?.('justify'),
          },
        ],
      ],
    },
    {
      id: 'styles',
      label: 'Styles',
      controls: [
        {
          id: 'normal',
          type: 'button',
          label: 'Normal',
          size: 'small',
          icon: <Type size={16} />,
          pressed: !marks.heading1 && !marks.heading2 && !marks.heading3,
          onClick: () => actions.setStyle?.('normal'),
        },
        {
          id: 'heading1',
          type: 'button',
          label: 'H1',
          size: 'small',
          icon: <Heading1 size={16} />,
          pressed: marks.heading1,
          onClick: () => actions.setStyle?.('h1'),
        },
        {
          id: 'heading2',
          type: 'button',
          label: 'H2',
          size: 'small',
          icon: <Heading2 size={16} />,
          pressed: marks.heading2,
          onClick: () => actions.setStyle?.('h2'),
        },
        {
          id: 'heading3',
          type: 'button',
          label: 'H3',
          size: 'small',
          icon: <Heading3 size={16} />,
          pressed: marks.heading3,
          onClick: () => actions.setStyle?.('h3'),
        },
        {
          id: 'quote',
          type: 'button',
          label: 'Quote',
          size: 'small',
          icon: <Quote size={16} />,
          pressed: marks.blockquote,
          onClick: () => actions.setStyle?.('quote'),
        },
        {
          id: 'code',
          type: 'button',
          label: 'Code',
          size: 'small',
          icon: <Code size={16} />,
          pressed: marks.codeBlock,
          onClick: () => actions.setStyle?.('code'),
        },
      ],
    },
    {
      id: 'editing',
      label: 'Editing',
      controls: [
        {
          id: 'find-replace',
          type: 'button',
          label: 'Find & Replace',
          size: 'large',
          icon: <Search size={18} />,
          onClick: actions.onFindReplace,
        },
        {
          id: 'select-all',
          type: 'button',
          label: 'Select All',
          size: 'large',
          icon: <CheckSquare size={18} />,
          onClick: actions.onSelectAll,
        },
      ],
    },
  ]
}
