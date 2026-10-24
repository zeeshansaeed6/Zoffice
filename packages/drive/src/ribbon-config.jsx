/**
 * ZDrive Ribbon Configuration.
 * Data-driven ribbon layout integrating with @zoffice/ui.
 * @module ribbon-config
 */

import React from 'react'
import {
  FolderPlus,
  FilePlus,
  LayoutGrid,
  List,
  Star,
  Trash2,
  PieChart,
  History,
  HardDrive,
} from 'lucide-react'
import { VIEW_MODES } from './core/constants.js'

/**
 * Creates data-driven ribbon configuration for ZDrive.
 *
 * @param {Object} [actions={}]
 * @param {string} [activeViewMode=VIEW_MODES.GRID]
 * @returns {any}
 */
export function getDriveRibbonConfig(actions = {}, activeViewMode = VIEW_MODES.GRID) {
  return {
    appId: 'drive',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    canSave: true,
    tabs: [
      {
        id: 'drive-home',
        label: 'Home & Files',
        groups: [
          {
            id: 'grp-new',
            label: 'Create',
            controls: [
              {
                id: 'btn-new-folder',
                label: 'New Folder',
                icon: <FolderPlus size={16} className="text-blue-600" />,
                onClick: actions.onNewFolder,
              },
              {
                id: 'btn-new-file',
                label: 'New Document',
                icon: <FilePlus size={16} className="text-emerald-600" />,
                onClick: actions.onNewFile,
              },
            ],
          },
          {
            id: 'grp-layout',
            label: 'Layout',
            controls: [
              {
                id: 'btn-layout-grid',
                label: 'Grid',
                icon: <LayoutGrid size={16} />,
                active: activeViewMode === VIEW_MODES.GRID,
                onClick: () => actions.onSetViewMode?.(VIEW_MODES.GRID),
              },
              {
                id: 'btn-layout-list',
                label: 'List',
                icon: <List size={16} />,
                active: activeViewMode === VIEW_MODES.LIST,
                onClick: () => actions.onSetViewMode?.(VIEW_MODES.LIST),
              },
            ],
          },
          {
            id: 'grp-actions',
            label: 'Actions',
            controls: [
              {
                id: 'btn-star-item',
                label: 'Star',
                icon: <Star size={16} className="text-amber-500" />,
                onClick: actions.onStarItem,
              },
              {
                id: 'btn-trash-item',
                label: 'Trash',
                icon: <Trash2 size={16} className="text-red-500" />,
                onClick: actions.onTrashItem,
              },
            ],
          },
        ],
      },
      {
        id: 'drive-manage',
        label: 'Manage & Storage',
        groups: [
          {
            id: 'grp-storage',
            label: 'Storage & Analytics',
            controls: [
              {
                id: 'btn-open-storage',
                label: 'Storage Overview',
                icon: <PieChart size={16} className="text-purple-600" />,
                onClick: actions.onOpenStorage,
              },
              {
                id: 'btn-refresh',
                label: 'Drive Home',
                icon: <HardDrive size={16} />,
                onClick: actions.onOpenMyDrive,
              },
            ],
          },
          {
            id: 'grp-versions',
            label: 'Versions',
            controls: [
              {
                id: 'btn-version-history',
                label: 'Version History',
                icon: <History size={16} className="text-blue-600" />,
                onClick: actions.onOpenVersions,
              },
            ],
          },
        ],
      },
    ],
  }
}
