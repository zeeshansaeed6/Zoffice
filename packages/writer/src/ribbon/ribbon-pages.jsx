import React from 'react'
import {
  RectangleVertical,
  Columns,
  Ruler,
  FileType,
  ListTree,
  SpellCheck,
  Hash,
  ZoomIn,
  ZoomOut,
  Printer,
  Maximize,
} from 'lucide-react'
import { PAGE_MARGINS } from '../page-layout/page-utils.js'

const item = (id, label, onClick) => ({ id, label, onClick })
const bigButton = (id, label, icon, onClick) => ({
  id,
  type: 'button',
  label,
  size: 'large',
  icon,
  onClick,
})
const bigDropdown = (id, label, icon, items) => ({
  id,
  type: 'dropdown',
  label,
  size: 'large',
  icon,
  items,
})

/** Layout tab groups: page setup and columns. @param {Object} a */
export function getLayoutRibbonGroups(a) {
  return [
    {
      id: 'page-setup',
      label: 'Page Setup',
      controls: [
        bigDropdown(
          'margins',
          'Margins',
          <Ruler size={20} />,
          Object.entries(PAGE_MARGINS).map(([key, m]) =>
            item(`margin-${key}`, m.name, () => a.onSetMargins?.(key)),
          ),
        ),
        bigDropdown('orientation', 'Orientation', <RectangleVertical size={20} />, [
          item('portrait', 'Portrait', () => a.onSetOrientation?.('portrait')),
          item('landscape', 'Landscape', () => a.onSetOrientation?.('landscape')),
        ]),
        bigDropdown('page-size', 'Size', <FileType size={20} />, [
          item('size-a4', 'A4', () => a.onSetPageSize?.('a4')),
          item('size-letter', 'Letter', () => a.onSetPageSize?.('letter')),
        ]),
        bigDropdown('columns', 'Columns', <Columns size={20} />, [
          item('cols-1', 'One', () => a.onSetColumns?.(1)),
          item('cols-2', 'Two', () => a.onSetColumns?.(2)),
          item('cols-3', 'Three', () => a.onSetColumns?.(3)),
        ]),
      ],
    },
  ]
}

/** References tab groups. @param {Object} a */
export function getReferencesRibbonGroups(a) {
  return [
    {
      id: 'toc',
      label: 'Table of Contents',
      controls: [
        bigButton('insert-toc', 'Table of Contents', <ListTree size={20} />, a.onInsertToc),
      ],
    },
  ]
}

/** Review tab groups. @param {Object} a */
export function getReviewRibbonGroups(a) {
  return [
    {
      id: 'proofing',
      label: 'Proofing',
      controls: [
        bigButton('word-count', 'Word Count', <Hash size={20} />, a.onOpenWordCount),
        {
          id: 'spellcheck',
          type: 'toggle',
          label: 'Spelling',
          size: 'large',
          icon: <SpellCheck size={20} />,
          pressed: a.spellcheck,
          onToggle: a.onToggleSpellcheck,
        },
      ],
    },
  ]
}

/** View tab groups. @param {Object} a */
export function getViewRibbonGroups(a) {
  return [
    {
      id: 'zoom',
      label: 'Zoom',
      controls: [
        bigButton('zoom-in', 'Zoom In', <ZoomIn size={20} />, a.onZoomIn),
        bigButton('zoom-out', 'Zoom Out', <ZoomOut size={20} />, a.onZoomOut),
        bigButton('zoom-100', '100%', <Maximize size={20} />, a.onZoomReset),
      ],
    },
    {
      id: 'print',
      label: 'Print',
      controls: [bigButton('print', 'Print', <Printer size={20} />, a.onPrint)],
    },
  ]
}
