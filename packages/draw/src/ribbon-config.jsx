/**
 * ZDraw Ribbon Configuration.
 * Data-driven ribbon layout integrating with @zoffice/ui.
 * @module ribbon-config
 */

import React from 'react'
import {
  MousePointer,
  Hand,
  Type,
  Trash2,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  Layers,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Group,
  Ungroup,
  Plus,
} from 'lucide-react'
import { TOOLS } from './core/constants.js'

/**
 * Creates data-driven ribbon configuration for ZDraw.
 *
 * @param {Object} [actions={}]
 * @param {string} [activeTool=TOOLS.SELECT]
 * @param {number} [zoom=1]
 * @returns {any}
 */
export function getDrawRibbonConfig(actions = {}, activeTool = TOOLS.SELECT, _zoom = 1) {
  return {
    appId: 'draw',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    onUndo: actions.onUndo,
    onRedo: actions.onRedo,
    canUndo: actions.canUndo,
    canRedo: actions.canRedo,
    canSave: actions.canSave !== false,
    tabs: [
      {
        id: 'draw-home',
        label: 'Home & Tools',
        groups: [
          {
            id: 'grp-tools',
            label: 'Tools',
            controls: [
              {
                id: 'btn-tool-select',
                type: 'button',
                label: 'Select',
                size: 'large',
                icon: <MousePointer size={18} />,
                active: activeTool === TOOLS.SELECT,
                onClick: () => actions.onSetTool(TOOLS.SELECT),
              },
              {
                id: 'btn-tool-pan',
                type: 'button',
                label: 'Pan Canvas',
                size: 'large',
                icon: <Hand size={18} />,
                active: activeTool === TOOLS.PAN,
                onClick: () => actions.onSetTool(TOOLS.PAN),
              },
            ],
          },
          {
            id: 'grp-insert',
            label: 'Insert',
            controls: [
              {
                id: 'btn-insert-text',
                type: 'button',
                label: 'Text Box',
                icon: <Type size={14} />,
                onClick: actions.onAddText,
              },
              {
                id: 'btn-custom-shape',
                type: 'button',
                label: 'Custom SVG',
                icon: <Plus size={14} />,
                onClick: actions.onOpenCustomShape,
              },
            ],
          },
          {
            id: 'grp-edit',
            label: 'Edit',
            controls: [
              {
                id: 'btn-delete',
                type: 'button',
                label: 'Delete',
                icon: <Trash2 size={14} />,
                onClick: actions.onDelete,
              },
              {
                id: 'btn-undo',
                type: 'button',
                label: 'Undo',
                icon: <Undo size={14} />,
                onClick: actions.onUndo,
              },
              {
                id: 'btn-redo',
                type: 'button',
                label: 'Redo',
                icon: <Redo size={14} />,
                onClick: actions.onRedo,
              },
            ],
          },
        ],
      },
      {
        id: 'draw-arrange',
        label: 'Arrange & Align',
        groups: [
          {
            id: 'grp-align',
            label: 'Align',
            controls: [
              {
                id: 'btn-align-left',
                type: 'button',
                label: 'Left',
                icon: <AlignLeft size={14} />,
                onClick: () => actions.onAlign('left'),
              },
              {
                id: 'btn-align-center',
                type: 'button',
                label: 'Center',
                icon: <AlignCenter size={14} />,
                onClick: () => actions.onAlign('center'),
              },
              {
                id: 'btn-align-right',
                type: 'button',
                label: 'Right',
                icon: <AlignRight size={14} />,
                onClick: () => actions.onAlign('right'),
              },
              {
                id: 'btn-align-middle',
                type: 'button',
                label: 'Middle',
                icon: <AlignVerticalJustifyCenter size={14} />,
                onClick: () => actions.onAlign('middle'),
              },
            ],
          },
          {
            id: 'grp-grouping',
            label: 'Group',
            controls: [
              {
                id: 'btn-group',
                type: 'button',
                label: 'Group',
                icon: <Group size={14} />,
                onClick: actions.onGroup,
              },
              {
                id: 'btn-ungroup',
                type: 'button',
                label: 'Ungroup',
                icon: <Ungroup size={14} />,
                onClick: actions.onUngroup,
              },
            ],
          },
          {
            id: 'grp-order',
            label: 'Layer Order',
            controls: [
              {
                id: 'btn-bring-front',
                type: 'button',
                label: 'Bring to Front',
                icon: <Layers size={14} />,
                onClick: actions.onBringToFront,
              },
              {
                id: 'btn-send-back',
                type: 'button',
                label: 'Send to Back',
                icon: <Layers size={14} />,
                onClick: actions.onSendToBack,
              },
            ],
          },
        ],
      },
      {
        id: 'draw-view-export',
        label: 'View & Export',
        groups: [
          {
            id: 'grp-zoom',
            label: 'Zoom',
            controls: [
              {
                id: 'btn-zoom-in',
                type: 'button',
                label: 'Zoom In',
                icon: <ZoomIn size={14} />,
                onClick: actions.onZoomIn,
              },
              {
                id: 'btn-zoom-out',
                type: 'button',
                label: 'Zoom Out',
                icon: <ZoomOut size={14} />,
                onClick: actions.onZoomOut,
              },
              {
                id: 'btn-zoom-fit',
                type: 'button',
                label: 'Reset (100%)',
                icon: <Maximize2 size={14} />,
                onClick: actions.onZoomReset,
              },
            ],
          },
          {
            id: 'grp-io',
            label: 'Export & Save',
            controls: [
              {
                id: 'btn-export',
                type: 'button',
                label: 'Export Image',
                size: 'large',
                icon: <Download size={18} />,
                onClick: actions.onOpenExport,
              },
              {
                id: 'btn-save',
                type: 'button',
                label: 'Save Diagram',
                icon: <Save size={14} />,
                onClick: actions.onSave,
              },
            ],
          },
        ],
      },
    ],
  }
}
