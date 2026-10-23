import React from 'react'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Sigma,
  Filter,
  Grid,
  Table,
} from 'lucide-react'

/**
 * Creates data-driven ribbon configuration for ZSheets.
 * @param {Object} [actions]
 * @returns {import('@zoffice/ui').RibbonConfig}
 */
export function getSheetsRibbonConfig(actions = {}) {
  return {
    appId: 'sheets',
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
            id: 'alignment',
            label: 'Alignment',
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
            id: 'number',
            label: 'Number',
            controls: [
              {
                id: 'currency',
                type: 'button',
                label: 'Currency',
                size: 'large',
                icon: <DollarSign size={18} />,
                onClick: actions.onCurrency,
              },
              {
                id: 'percent',
                type: 'button',
                label: 'Percent',
                size: 'large',
                icon: <Percent size={18} />,
                onClick: actions.onPercent,
              },
            ],
          },
        ],
      },
      {
        id: 'insert',
        label: 'Insert',
        groups: [
          {
            id: 'tables',
            label: 'Tables',
            controls: [
              {
                id: 'table',
                type: 'button',
                label: 'Table',
                size: 'large',
                icon: <Table size={18} />,
                onClick: actions.onInsertTable,
              },
            ],
          },
        ],
      },
      {
        id: 'formulas',
        label: 'Formulas',
        groups: [
          {
            id: 'function-library',
            label: 'Function Library',
            controls: [
              {
                id: 'autosum',
                type: 'button',
                label: 'AutoSum',
                size: 'large',
                icon: <Sigma size={18} />,
                onClick: actions.onAutoSum,
              },
            ],
          },
        ],
      },
      {
        id: 'data',
        label: 'Data',
        groups: [
          {
            id: 'sort-filter',
            label: 'Sort & Filter',
            controls: [
              {
                id: 'filter',
                type: 'button',
                label: 'Filter',
                size: 'large',
                icon: <Filter size={18} />,
                onClick: actions.onFilter,
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
            id: 'show',
            label: 'Show',
            controls: [
              {
                id: 'gridlines',
                type: 'button',
                label: 'Gridlines',
                size: 'large',
                icon: <Grid size={18} />,
                onClick: actions.onToggleGridlines,
              },
            ],
          },
        ],
      },
    ],
  }
}
