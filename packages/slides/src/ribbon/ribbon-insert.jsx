import React from 'react'
import { Table, Image, BarChart3 } from 'lucide-react'

/**
 * Returns the Insert tab definition for the ZSlides ribbon.
 *
 * @param {Object} actions
 * @returns {Object} Ribbon tab descriptor
 */
export function getInsertTab(actions = {}) {
  return {
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
  }
}
