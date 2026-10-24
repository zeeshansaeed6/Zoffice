import React from 'react'
import {
  MailPlus,
  Trash2,
  Archive,
  Reply,
  ReplyAll,
  Forward,
  Flag,
  MailOpen,
  Search,
  Settings,
  FolderPlus,
  CheckCheck,
} from 'lucide-react'

/**
 * Returns tabs configuration for Mail view.
 * @param {Object} actions
 * @returns {any[]}
 */
export function getMailTabs(actions = {}) {
  return [
    {
      id: 'mail-home',
      label: 'Home',
      groups: [
        {
          id: 'mail-new',
          label: 'New',
          controls: [
            {
              id: 'btn-new-email',
              type: 'button',
              label: 'New Email',
              size: 'large',
              icon: <MailPlus size={18} />,
              onClick: actions.onNewEmail,
            },
          ],
        },
        {
          id: 'mail-delete',
          label: 'Delete',
          controls: [
            {
              id: 'btn-delete',
              type: 'button',
              label: 'Delete',
              icon: <Trash2 size={14} />,
              onClick: actions.onDeleteMessage,
            },
            {
              id: 'btn-archive',
              type: 'button',
              label: 'Archive',
              icon: <Archive size={14} />,
              onClick: actions.onArchiveMessage,
            },
          ],
        },
        {
          id: 'mail-respond',
          label: 'Respond',
          controls: [
            {
              id: 'btn-reply',
              type: 'button',
              label: 'Reply',
              icon: <Reply size={14} />,
              onClick: actions.onReply,
            },
            {
              id: 'btn-reply-all',
              type: 'button',
              label: 'Reply All',
              icon: <ReplyAll size={14} />,
              onClick: actions.onReplyAll,
            },
            {
              id: 'btn-forward',
              type: 'button',
              label: 'Forward',
              icon: <Forward size={14} />,
              onClick: actions.onForward,
            },
          ],
        },
        {
          id: 'mail-tags',
          label: 'Tags',
          controls: [
            {
              id: 'btn-flag',
              type: 'button',
              label: 'Flag',
              icon: <Flag size={14} className="text-red-500" />,
              onClick: actions.onToggleFlag,
            },
            {
              id: 'btn-mark-unread',
              type: 'button',
              label: 'Mark Read/Unread',
              icon: <MailOpen size={14} />,
              onClick: actions.onToggleUnread,
            },
          ],
        },
        {
          id: 'mail-find',
          label: 'Find',
          controls: [
            {
              id: 'btn-search',
              type: 'button',
              label: 'Search',
              size: 'large',
              icon: <Search size={18} />,
              onClick: actions.onFocusSearch,
            },
          ],
        },
      ],
    },
    {
      id: 'mail-folder',
      label: 'Folder & Settings',
      groups: [
        {
          id: 'fld-actions',
          label: 'Folder',
          controls: [
            {
              id: 'btn-new-fld',
              type: 'button',
              label: 'New Folder',
              icon: <FolderPlus size={14} />,
              onClick: actions.onNewFolder,
            },
            {
              id: 'btn-mark-all-read',
              type: 'button',
              label: 'Mark All Read',
              icon: <CheckCheck size={14} />,
              onClick: actions.onMarkAllRead,
            },
          ],
        },
        {
          id: 'mail-accounts',
          label: 'Accounts',
          controls: [
            {
              id: 'btn-acc-settings',
              type: 'button',
              label: 'Accounts',
              size: 'large',
              icon: <Settings size={18} />,
              onClick: actions.onOpenAccountSettings,
            },
          ],
        },
      ],
    },
  ]
}
