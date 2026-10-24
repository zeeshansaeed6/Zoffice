import React from 'react'
import {
  Scissors,
  Copy,
  Clipboard,
  FilePlus,
  FolderPlus,
  BookPlus,
  CheckSquare,
  Star,
  HelpCircle,
  Bookmark,
  Search,
  Type,
  ListTodo,
  Table,
  Image,
  Mic,
  Users,
  Target,
  GraduationCap,
  Link,
  PenTool,
  Archive,
  Paperclip,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react'

/**
 * Creates data-driven ribbon configuration for ZNotes.
 *
 * @param {Object} [actions={}]
 * @returns {any}
 */
export function getNotesRibbonConfig(actions = {}) {
  return {
    appId: 'notes',
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
        id: 'home',
        label: 'Home',
        groups: [
          {
            id: 'clipboard',
            label: 'Clipboard',
            controls: [
              {
                id: 'paste',
                type: 'button',
                label: 'Paste',
                size: 'large',
                icon: <Clipboard size={18} />,
                onClick: actions.onPaste,
              },
              {
                id: 'cut',
                type: 'button',
                label: 'Cut',
                icon: <Scissors size={14} />,
                onClick: actions.onCut,
              },
              {
                id: 'copy',
                type: 'button',
                label: 'Copy',
                icon: <Copy size={14} />,
                onClick: actions.onCopy,
              },
            ],
          },
          {
            id: 'organization',
            label: 'Organize',
            controls: [
              {
                id: 'new-page',
                type: 'button',
                label: 'New Page',
                size: 'large',
                icon: <FilePlus size={18} />,
                onClick: actions.onNewPage,
              },
              {
                id: 'new-section',
                type: 'button',
                label: 'New Section',
                icon: <FolderPlus size={14} />,
                onClick: actions.onNewSection,
              },
              {
                id: 'new-notebook',
                type: 'button',
                label: 'New Notebook',
                icon: <BookPlus size={14} />,
                onClick: actions.onNewNotebook,
              },
            ],
          },
          {
            id: 'tags',
            label: 'Tags',
            controls: [
              {
                id: 'tag-todo',
                type: 'button',
                label: 'To Do',
                icon: <CheckSquare size={14} className="text-blue-500" />,
                onClick: () => actions.onToggleTag?.('todo'),
              },
              {
                id: 'tag-important',
                type: 'button',
                label: 'Important',
                icon: <Star size={14} className="text-red-500" />,
                onClick: () => actions.onToggleTag?.('important'),
              },
              {
                id: 'tag-question',
                type: 'button',
                label: 'Question',
                icon: <HelpCircle size={14} className="text-amber-500" />,
                onClick: () => actions.onToggleTag?.('question'),
              },
              {
                id: 'tag-remember',
                type: 'button',
                label: 'Remember',
                icon: <Bookmark size={14} className="text-emerald-500" />,
                onClick: () => actions.onToggleTag?.('remember'),
              },
            ],
          },
          {
            id: 'find',
            label: 'Find',
            controls: [
              {
                id: 'search-notes',
                type: 'button',
                label: 'Search All',
                size: 'large',
                icon: <Search size={18} />,
                onClick: actions.onOpenSearch,
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
            id: 'insert-blocks',
            label: 'Blocks',
            controls: [
              {
                id: 'insert-text',
                type: 'button',
                label: 'Text Box',
                size: 'large',
                icon: <Type size={18} />,
                onClick: () => actions.onAddBlock?.('text'),
              },
              {
                id: 'insert-checklist',
                type: 'button',
                label: 'Checklist',
                size: 'large',
                icon: <ListTodo size={18} />,
                onClick: () => actions.onAddBlock?.('checklist'),
              },
              {
                id: 'insert-table',
                type: 'button',
                label: 'Table',
                size: 'large',
                icon: <Table size={18} />,
                onClick: () => actions.onAddBlock?.('table'),
              },
              {
                id: 'insert-image',
                type: 'button',
                label: 'Picture',
                size: 'large',
                icon: <Image size={18} />,
                onClick: () => actions.onAddBlock?.('image'),
              },
              {
                id: 'insert-audio',
                type: 'button',
                label: 'Audio Record',
                size: 'large',
                icon: <Mic size={18} />,
                onClick: () => actions.onAddBlock?.('audio'),
              },
            ],
          },
          {
            id: 'templates',
            label: 'Page Templates',
            controls: [
              {
                id: 'tmpl-meeting',
                type: 'button',
                label: 'Meeting',
                icon: <Users size={14} />,
                onClick: () => actions.onApplyTemplate?.('meeting-notes'),
              },
              {
                id: 'tmpl-todo',
                type: 'button',
                label: 'Tasks',
                icon: <CheckSquare size={14} />,
                onClick: () => actions.onApplyTemplate?.('todo-list'),
              },
              {
                id: 'tmpl-project',
                type: 'button',
                label: 'Project',
                icon: <Target size={14} />,
                onClick: () => actions.onApplyTemplate?.('project-plan'),
              },
              {
                id: 'tmpl-lecture',
                type: 'button',
                label: 'Lecture',
                icon: <GraduationCap size={14} />,
                onClick: () => actions.onApplyTemplate?.('lecture-notes'),
              },
            ],
          },
          {
            id: 'links',
            label: 'Links',
            controls: [
              {
                id: 'insert-link',
                type: 'button',
                label: 'Page Link',
                size: 'large',
                icon: <Link size={18} />,
                onClick: actions.onOpenPageLinkDialog,
              },
            ],
          },
        ],
      },
      {
        id: 'draw',
        label: 'Draw & Sketch',
        groups: [
          {
            id: 'drawing-tools',
            label: 'Tools',
            controls: [
              {
                id: 'add-drawing',
                type: 'button',
                label: 'Ink Canvas',
                size: 'large',
                icon: <PenTool size={18} />,
                onClick: () => actions.onAddBlock?.('ink'),
              },
            ],
          },
        ],
      },
      {
        id: 'tools',
        label: 'Tools & Export',
        groups: [
          {
            id: 'export-group',
            label: 'Export',
            controls: [
              {
                id: 'export-zip',
                type: 'button',
                label: 'Export .ZIP',
                size: 'large',
                icon: <Archive size={18} />,
                onClick: actions.onExportZip,
              },
            ],
          },
          {
            id: 'clipping-group',
            label: 'Web Clipper',
            controls: [
              {
                id: 'web-clip',
                type: 'button',
                label: 'Paste HTML',
                size: 'large',
                icon: <Paperclip size={18} />,
                onClick: actions.onWebClip,
              },
            ],
          },
          {
            id: 'zoom-group',
            label: 'Zoom',
            controls: [
              {
                id: 'zoom-in',
                type: 'button',
                label: 'In',
                icon: <ZoomIn size={14} />,
                onClick: actions.onZoomIn,
              },
              {
                id: 'zoom-out',
                type: 'button',
                label: 'Out',
                icon: <ZoomOut size={14} />,
                onClick: actions.onZoomOut,
              },
              {
                id: 'zoom-reset',
                type: 'button',
                label: '100%',
                icon: <RotateCcw size={14} />,
                onClick: actions.onZoomReset,
              },
            ],
          },
        ],
      },
    ],
  }
}
