import React from 'react'
import { Plus, SplitSquareVertical, Eye, FileText, Download, Code } from 'lucide-react'
import { THEME_COLORS, FORM_TABS } from './core/constants.js'

/**
 * Creates data-driven ribbon configuration for ZForms.
 *
 * @param {Object} [actions={}]
 * @param {string} [_activeTab=FORM_TABS.BUILDER]
 * @returns {any}
 */
export function getFormsRibbonConfig(actions = {}, _activeTab = FORM_TABS.BUILDER) {
  return {
    appId: 'forms',
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
        id: 'forms-builder',
        label: 'Form Builder',
        groups: [
          {
            id: 'grp-insert',
            label: 'Insert',
            controls: [
              {
                id: 'btn-add-q',
                type: 'button',
                label: 'Add Question',
                size: 'large',
                icon: <Plus size={18} />,
                onClick: actions.onAddQuestion,
              },
              {
                id: 'btn-add-sec',
                type: 'button',
                label: 'Section Break',
                icon: <SplitSquareVertical size={14} />,
                onClick: actions.onAddSection,
              },
            ],
          },
          {
            id: 'grp-modes',
            label: 'Mode',
            controls: [
              {
                id: 'btn-mode-builder',
                type: 'button',
                label: 'Questions',
                size: 'large',
                icon: <FileText size={18} />,
                onClick: () => actions.onSetTab(FORM_TABS.BUILDER),
              },
              {
                id: 'btn-mode-preview',
                type: 'button',
                label: 'Preview',
                size: 'large',
                icon: <Eye size={18} />,
                onClick: () => actions.onSetTab(FORM_TABS.PREVIEW),
              },
            ],
          },
          {
            id: 'grp-theme',
            label: 'Theme',
            controls: THEME_COLORS.slice(0, 5).map((theme) => ({
              id: `btn-theme-${theme.id}`,
              type: 'button',
              label: theme.name,
              icon: (
                <div
                  className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                />
              ),
              onClick: () => actions.onSetThemeColor(theme.primary),
            })),
          },
        ],
      },
      {
        id: 'forms-responses',
        label: 'Responses & Share',
        groups: [
          {
            id: 'grp-export',
            label: 'Export',
            controls: [
              {
                id: 'btn-export-csv',
                type: 'button',
                label: 'Export CSV',
                size: 'large',
                icon: <Download size={18} />,
                onClick: actions.onExportCsv,
              },
              {
                id: 'btn-embed-code',
                type: 'button',
                label: 'Embed Code',
                size: 'large',
                icon: <Code size={18} />,
                onClick: actions.onOpenEmbed,
              },
            ],
          },
          {
            id: 'grp-view-resp',
            label: 'View',
            controls: [
              {
                id: 'btn-show-responses',
                type: 'button',
                label: 'Responses Dashboard',
                icon: <Eye size={14} />,
                onClick: () => actions.onSetTab(FORM_TABS.RESPONSES),
              },
            ],
          },
        ],
      },
    ],
  }
}
