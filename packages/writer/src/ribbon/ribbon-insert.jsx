import React from 'react'
import {
  Table,
  Image,
  Link as LinkIcon,
  Bookmark,
  FileText,
  Minus,
  Clock,
  Sigma,
  Omega,
  Plus,
  Split,
} from 'lucide-react'

/**
 * Builds ribbon groups for ZWriter Insert tab.
 *
 * @param {Object} actions
 * @returns {Array<Object>}
 */
export function getInsertRibbonGroups(actions) {
  return [
    {
      id: 'pages',
      label: 'Pages',
      controls: [
        {
          id: 'page-break',
          type: 'button',
          label: 'Page Break',
          size: 'large',
          icon: <FileText size={20} />,
          onClick: actions.onInsertPageBreak,
        },
      ],
    },
    {
      id: 'tables',
      label: 'Tables',
      controls: [
        {
          id: 'insert-table',
          type: 'button',
          label: 'Table',
          size: 'large',
          icon: <Table size={20} />,
          onClick: actions.onOpenTablePicker,
        },
        [
          {
            id: 'table-row-actions',
            type: 'dropdown',
            label: 'Row',
            size: 'small',
            icon: <Plus size={13} />,
            items: [
              { id: 'row-above', label: 'Insert Row Above', onClick: actions.onAddRowAbove },
              { id: 'row-below', label: 'Insert Row Below', onClick: actions.onAddRowBelow },
              { id: 'del-row', label: 'Delete Row', onClick: actions.onDeleteRow },
            ],
          },
          {
            id: 'table-col-actions',
            type: 'dropdown',
            label: 'Column',
            size: 'small',
            icon: <Plus size={13} />,
            items: [
              { id: 'col-left', label: 'Insert Column Left', onClick: actions.onAddColumnLeft },
              { id: 'col-right', label: 'Insert Column Right', onClick: actions.onAddColumnRight },
              { id: 'del-col', label: 'Delete Column', onClick: actions.onDeleteColumn },
            ],
          },
          {
            id: 'table-cell-actions',
            type: 'dropdown',
            label: 'Cells',
            size: 'small',
            icon: <Split size={13} />,
            items: [
              { id: 'merge', label: 'Merge Cells', onClick: actions.onMergeCells },
              { id: 'split', label: 'Split Cell', onClick: actions.onSplitCell },
              { id: 'del-table', label: 'Delete Entire Table', onClick: actions.onDeleteTable },
            ],
          },
        ],
      ],
    },
    {
      id: 'illustrations',
      label: 'Illustrations',
      controls: [
        {
          id: 'insert-picture',
          type: 'button',
          label: 'Picture',
          size: 'large',
          icon: <Image size={20} />,
          onClick: actions.onOpenImageDialog,
        },
        {
          id: 'insert-hr',
          type: 'button',
          label: 'Horizontal Line',
          size: 'large',
          icon: <Minus size={20} />,
          onClick: actions.onInsertHorizontalRule,
        },
      ],
    },
    {
      id: 'links',
      label: 'Links',
      controls: [
        {
          id: 'insert-hyperlink',
          type: 'button',
          label: 'Link',
          size: 'large',
          icon: <LinkIcon size={20} />,
          onClick: actions.onOpenHyperlinkDialog,
        },
        {
          id: 'insert-bookmark',
          type: 'button',
          label: 'Bookmark',
          size: 'large',
          icon: <Bookmark size={20} />,
          onClick: actions.onOpenBookmarkDialog,
        },
      ],
    },
    {
      id: 'text-tools',
      label: 'Text',
      controls: [
        {
          id: 'insert-datetime',
          type: 'dropdown',
          label: 'Date & Time',
          size: 'large',
          icon: <Clock size={20} />,
          items: [
            {
              id: 'dt-date',
              label: 'Date (e.g. October 24, 2026)',
              onClick: () => actions.onInsertDateTime?.('date'),
            },
            {
              id: 'dt-time',
              label: 'Time (e.g. 3:45 PM)',
              onClick: () => actions.onInsertDateTime?.('time'),
            },
            {
              id: 'dt-full',
              label: 'Date & Time',
              onClick: () => actions.onInsertDateTime?.('full'),
            },
          ],
        },
      ],
    },
    {
      id: 'symbols',
      label: 'Symbols',
      controls: [
        {
          id: 'insert-equation',
          type: 'button',
          label: 'Equation',
          size: 'large',
          icon: <Sigma size={20} />,
          onClick: actions.onOpenEquationDialog,
        },
        {
          id: 'insert-symbol',
          type: 'button',
          label: 'Symbol',
          size: 'large',
          icon: <Omega size={20} />,
          onClick: actions.onOpenSymbolDialog,
        },
      ],
    },
  ]
}
