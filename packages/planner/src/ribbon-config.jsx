/**
 * ZPlanner Ribbon Configuration.
 * Data-driven ribbon layout integrating with @zoffice/ui.
 * @module ribbon-config
 */

import React from 'react'
import {
  Plus,
  Columns,
  Kanban,
  BarChart2,
  Calendar,
  Download,
  Upload,
  Save,
  ZoomIn,
} from 'lucide-react'
import { VIEW_MODES, GANTT_ZOOM } from './core/constants.js'

/**
 * Creates data-driven ribbon configuration for ZPlanner.
 *
 * @param {Object} [actions={}]
 * @param {string} [activeView=VIEW_MODES.KANBAN]
 * @param {string} [ganttZoom=GANTT_ZOOM.DAY]
 * @returns {any}
 */
export function getPlannerRibbonConfig(
  actions = {},
  activeView = VIEW_MODES.KANBAN,
  ganttZoom = GANTT_ZOOM.DAY,
) {
  return {
    appId: 'planner',
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
        id: 'planner-home',
        label: 'Tasks & Planning',
        groups: [
          {
            id: 'grp-insert',
            label: 'Insert',
            controls: [
              {
                id: 'btn-add-task',
                type: 'button',
                label: 'New Task',
                size: 'large',
                icon: <Plus size={18} />,
                onClick: actions.onAddTask,
              },
              {
                id: 'btn-add-col',
                type: 'button',
                label: 'New Column',
                icon: <Columns size={14} />,
                onClick: actions.onAddColumn,
              },
            ],
          },
          {
            id: 'grp-views',
            label: 'View Mode',
            controls: [
              {
                id: 'btn-view-kanban',
                type: 'button',
                label: 'Kanban',
                size: 'large',
                icon: <Kanban size={18} />,
                active: activeView === VIEW_MODES.KANBAN,
                onClick: () => actions.onSetView(VIEW_MODES.KANBAN),
              },
              {
                id: 'btn-view-gantt',
                type: 'button',
                label: 'Gantt',
                size: 'large',
                icon: <BarChart2 size={18} />,
                active: activeView === VIEW_MODES.GANTT,
                onClick: () => actions.onSetView(VIEW_MODES.GANTT),
              },
              {
                id: 'btn-view-calendar',
                type: 'button',
                label: 'Calendar',
                size: 'large',
                icon: <Calendar size={18} />,
                active: activeView === VIEW_MODES.CALENDAR,
                onClick: () => actions.onSetView(VIEW_MODES.CALENDAR),
              },
            ],
          },
          ...(activeView === VIEW_MODES.GANTT
            ? [
                {
                  id: 'grp-gantt-zoom',
                  label: 'Timeline Zoom',
                  controls: [
                    {
                      id: 'btn-zoom-day',
                      type: 'button',
                      label: 'Day',
                      active: ganttZoom === GANTT_ZOOM.DAY,
                      icon: <ZoomIn size={14} />,
                      onClick: () => actions.onSetGanttZoom(GANTT_ZOOM.DAY),
                    },
                    {
                      id: 'btn-zoom-week',
                      type: 'button',
                      label: 'Week',
                      active: ganttZoom === GANTT_ZOOM.WEEK,
                      icon: <ZoomIn size={14} />,
                      onClick: () => actions.onSetGanttZoom(GANTT_ZOOM.WEEK),
                    },
                    {
                      id: 'btn-zoom-month',
                      type: 'button',
                      label: 'Month',
                      active: ganttZoom === GANTT_ZOOM.MONTH,
                      icon: <ZoomIn size={14} />,
                      onClick: () => actions.onSetGanttZoom(GANTT_ZOOM.MONTH),
                    },
                  ],
                },
              ]
            : []),
        ],
      },
      {
        id: 'planner-io',
        label: 'Board & Data',
        groups: [
          {
            id: 'grp-io',
            label: 'Import / Export',
            controls: [
              {
                id: 'btn-export-json',
                type: 'button',
                label: 'Export JSON',
                size: 'large',
                icon: <Download size={18} />,
                onClick: actions.onExportJson,
              },
              {
                id: 'btn-import-trello',
                type: 'button',
                label: 'Import Trello',
                size: 'large',
                icon: <Upload size={18} />,
                onClick: actions.onOpenImport,
              },
            ],
          },
          {
            id: 'grp-storage',
            label: 'Persistence',
            controls: [
              {
                id: 'btn-save-board',
                type: 'button',
                label: 'Save Board',
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
