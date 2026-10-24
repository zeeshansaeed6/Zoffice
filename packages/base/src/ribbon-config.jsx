/**
 * ZBase Ribbon Configuration.
 * Data-driven ribbon layout integrating with @zoffice/ui.
 * @module ribbon-config
 */

import React from 'react'
import {
  Plus,
  Table as TableIcon,
  Columns,
  Terminal,
  Download,
  Calendar,
  LayoutGrid,
  FileText,
  Save,
} from 'lucide-react'
import { VIEW_TYPES } from './core/constants.js'

/**
 * Creates data-driven ribbon configuration for ZBase.
 *
 * @param {Object} [actions={}]
 * @param {string} [activeViewType=VIEW_TYPES.GRID]
 * @returns {any}
 */
export function getBaseRibbonConfig(actions = {}, activeViewType = VIEW_TYPES.GRID) {
  return {
    appId: 'base',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    canSave: true,
    tabs: [
      {
        id: 'base-home',
        label: 'Home & Data',
        groups: [
          {
            id: 'grp-records',
            label: 'Records',
            controls: [
              {
                id: 'btn-add-record',
                label: 'New Record',
                icon: <Plus size={16} className="text-blue-600" />,
                onClick: actions.onAddRecord,
              },
            ],
          },
          {
            id: 'grp-fields',
            label: 'Fields',
            controls: [
              {
                id: 'btn-add-field',
                label: 'Add Field',
                icon: <Columns size={16} className="text-purple-600" />,
                onClick: actions.onAddField,
              },
            ],
          },
          {
            id: 'grp-views',
            label: 'Views',
            controls: [
              {
                id: 'btn-view-grid',
                label: 'Grid',
                icon: <TableIcon size={16} />,
                active: activeViewType === VIEW_TYPES.GRID,
                onClick: () => actions.onSwitchViewType?.(VIEW_TYPES.GRID),
              },
              {
                id: 'btn-view-kanban',
                label: 'Kanban',
                icon: <LayoutGrid size={16} />,
                active: activeViewType === VIEW_TYPES.KANBAN,
                onClick: () => actions.onSwitchViewType?.(VIEW_TYPES.KANBAN),
              },
              {
                id: 'btn-view-calendar',
                label: 'Calendar',
                icon: <Calendar size={16} />,
                active: activeViewType === VIEW_TYPES.CALENDAR,
                onClick: () => actions.onSwitchViewType?.(VIEW_TYPES.CALENDAR),
              },
              {
                id: 'btn-view-gallery',
                label: 'Gallery',
                icon: <LayoutGrid size={16} />,
                active: activeViewType === VIEW_TYPES.GALLERY,
                onClick: () => actions.onSwitchViewType?.(VIEW_TYPES.GALLERY),
              },
              {
                id: 'btn-view-form',
                label: 'Form',
                icon: <FileText size={16} />,
                active: activeViewType === VIEW_TYPES.FORM,
                onClick: () => actions.onSwitchViewType?.(VIEW_TYPES.FORM),
              },
            ],
          },
        ],
      },
      {
        id: 'base-tools',
        label: 'Tools & SQL',
        groups: [
          {
            id: 'grp-sql',
            label: 'Query',
            controls: [
              {
                id: 'btn-sql-console',
                label: 'SQL Console',
                icon: <Terminal size={16} className="text-amber-600" />,
                onClick: actions.onOpenSqlConsole,
              },
            ],
          },
          {
            id: 'grp-export',
            label: 'Export',
            controls: [
              {
                id: 'btn-export-csv',
                label: 'Export CSV',
                icon: <Download size={16} />,
                onClick: actions.onExportCsv,
              },
              {
                id: 'btn-save-base',
                label: 'Save Base',
                icon: <Save size={16} />,
                onClick: actions.onSave,
              },
            ],
          },
        ],
      },
    ],
  }
}
