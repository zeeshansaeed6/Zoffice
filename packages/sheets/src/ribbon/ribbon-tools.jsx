import React from 'react'
import {
  Sigma,
  Sparkles,
  Grid,
  ArrowDownAZ,
  ArrowUpZA,
  FileDown,
  Rows3,
  Columns3,
  Trash2,
} from 'lucide-react'

const item = (id, label, onClick) => ({ id, label, onClick })

const AGGREGATES = [
  ['SUM', 'Sum'],
  ['AVERAGE', 'Average'],
  ['COUNT', 'Count Numbers'],
  ['MAX', 'Max'],
  ['MIN', 'Min'],
]

/** Insert tab groups. @param {Object} a */
export function getInsertGroups(a) {
  return [
    {
      id: 'cells',
      label: 'Rows & Columns',
      controls: [
        {
          id: 'rows',
          type: 'dropdown',
          label: 'Rows',
          size: 'large',
          icon: <Rows3 size={18} />,
          items: [
            item('row-insert', 'Insert Row Above', () => a.onStructure?.('row', 'insert')),
            item('row-delete', 'Delete Row', () => a.onStructure?.('row', 'delete')),
          ],
        },
        {
          id: 'cols',
          type: 'dropdown',
          label: 'Columns',
          size: 'large',
          icon: <Columns3 size={18} />,
          items: [
            item('col-insert', 'Insert Column Left', () => a.onStructure?.('col', 'insert')),
            item('col-delete', 'Delete Column', () => a.onStructure?.('col', 'delete')),
          ],
        },
        {
          id: 'delete-sheet',
          type: 'button',
          label: 'Delete Sheet',
          size: 'large',
          icon: <Trash2 size={18} />,
          onClick: a.onDeleteSheet,
        },
      ],
    },
  ]
}

/** Formulas tab groups. @param {Object} a */
export function getFormulaGroups(a) {
  return [
    {
      id: 'function-library',
      label: 'Function Library',
      controls: [
        {
          id: 'autosum',
          type: 'dropdown',
          label: 'AutoSum',
          size: 'large',
          icon: <Sigma size={18} />,
          items: AGGREGATES.map(([fn, label]) => item(`agg-${fn}`, label, () => a.onAutoSum?.(fn))),
        },
      ],
    },
    {
      id: 'ai-tools',
      label: 'AI Assistance',
      controls: [
        {
          id: 'ai-formula',
          type: 'button',
          label: 'Formula AI',
          size: 'large',
          icon: <Sparkles size={18} className="text-purple-600" />,
          onClick: a.onToggleAi,
        },
      ],
    },
  ]
}

/** Data tab groups. @param {Object} a */
export function getDataGroups(a) {
  return [
    {
      id: 'sort',
      label: 'Sort',
      controls: [
        {
          id: 'sort-asc',
          type: 'button',
          label: 'Sort A to Z',
          size: 'large',
          icon: <ArrowDownAZ size={18} />,
          onClick: () => a.onSort?.(true),
        },
        {
          id: 'sort-desc',
          type: 'button',
          label: 'Sort Z to A',
          size: 'large',
          icon: <ArrowUpZA size={18} />,
          onClick: () => a.onSort?.(false),
        },
      ],
    },
    {
      id: 'export',
      label: 'Export',
      controls: [
        {
          id: 'export-csv',
          type: 'button',
          label: 'Export CSV',
          size: 'large',
          icon: <FileDown size={18} />,
          onClick: a.onExportCsv,
        },
      ],
    },
  ]
}

/** View tab groups. @param {Object} a */
export function getViewGroups(a) {
  return [
    {
      id: 'show',
      label: 'Show',
      controls: [
        {
          id: 'gridlines',
          type: 'toggle',
          label: 'Gridlines',
          size: 'large',
          icon: <Grid size={18} />,
          pressed: a.showGridlines,
          onToggle: a.onToggleGridlines,
        },
      ],
    },
  ]
}
