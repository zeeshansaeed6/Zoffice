import React from 'react'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  FileText,
  Table,
  Image,
  Link,
  Printer,
  Columns,
  Search,
} from 'lucide-react'

/**
 * Creates data-driven ribbon configuration for ZWriter.
 * @param {Object} [actions]
 * @returns {import('@zoffice/ui').RibbonConfig}
 */
export function getWriterRibbonConfig(actions = {}) {
  return {
    appId: 'writer',
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
                {
                  id: 'underline',
                  type: 'toggle',
                  label: 'Underline',
                  icon: <Underline size={13} />,
                  pressed: actions.underline,
                  onToggle: actions.toggleUnderline,
                },
              ],
            ],
          },
          {
            id: 'paragraph',
            label: 'Paragraph',
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
                {
                  id: 'align-justify',
                  type: 'toggle',
                  label: 'Justify',
                  icon: <AlignJustify size={13} />,
                  pressed: actions.align === 'justify',
                  onToggle: () => actions.setAlign?.('justify'),
                },
              ],
            ],
          },
          {
            id: 'styles',
            label: 'Styles',
            controls: [
              {
                id: 'normal',
                type: 'button',
                label: 'Normal',
                size: 'large',
                icon: <FileText size={18} />,
                onClick: () => actions.setStyle?.('normal'),
              },
              {
                id: 'heading1',
                type: 'button',
                label: 'Heading 1',
                size: 'large',
                icon: <FileText size={18} />,
                onClick: () => actions.setStyle?.('h1'),
              },
            ],
          },
          {
            id: 'editing',
            label: 'Editing',
            controls: [
              {
                id: 'find',
                type: 'button',
                label: 'Find',
                size: 'large',
                icon: <Search size={18} />,
                onClick: actions.onFind,
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
          {
            id: 'illustrations',
            label: 'Illustrations',
            controls: [
              {
                id: 'image',
                type: 'button',
                label: 'Pictures',
                size: 'large',
                icon: <Image size={18} />,
                onClick: actions.onInsertImage,
              },
            ],
          },
          {
            id: 'links',
            label: 'Links',
            controls: [
              {
                id: 'link',
                type: 'button',
                label: 'Link',
                size: 'large',
                icon: <Link size={18} />,
                onClick: actions.onInsertLink,
              },
            ],
          },
        ],
      },
      {
        id: 'layout',
        label: 'Layout',
        groups: [
          {
            id: 'page-setup',
            label: 'Page Setup',
            controls: [
              {
                id: 'columns',
                type: 'button',
                label: 'Columns',
                size: 'large',
                icon: <Columns size={18} />,
                onClick: actions.onLayoutColumns,
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
            id: 'views',
            label: 'Document Views',
            controls: [
              {
                id: 'print-layout',
                type: 'button',
                label: 'Print Layout',
                size: 'large',
                icon: <Printer size={18} />,
                onClick: () => actions.setView?.('print'),
              },
            ],
          },
        ],
      },
    ],
  }
}
