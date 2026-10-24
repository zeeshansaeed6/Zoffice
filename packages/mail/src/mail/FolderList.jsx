import React from 'react'
import {
  Inbox,
  Send,
  FileText,
  Archive,
  AlertOctagon,
  Trash2,
  Folder,
  Plus,
  Settings,
} from 'lucide-react'
import { useMailStore } from '../core/mail-store.js'
import { FOLDER_TYPES } from '../core/constants.js'

const FOLDER_ICONS = {
  [FOLDER_TYPES.INBOX]: Inbox,
  [FOLDER_TYPES.SENT]: Send,
  [FOLDER_TYPES.DRAFTS]: FileText,
  [FOLDER_TYPES.ARCHIVE]: Archive,
  [FOLDER_TYPES.SPAM]: AlertOctagon,
  [FOLDER_TYPES.TRASH]: Trash2,
}

/**
 * Left folder navigation panel in ZMail.
 *
 * @param {Object} props
 * @param {() => void} props.onOpenAccountSetup
 */
export function FolderList({ onOpenAccountSetup }) {
  const {
    accounts,
    activeAccountId,
    selectAccount,
    folders,
    activeFolderId,
    selectFolder,
    messages,
  } = useMailStore()

  // Calculate unread counts dynamically
  const getUnreadCount = (folderId) => {
    return messages.filter(
      (m) =>
        m.folderId === folderId &&
        m.unread &&
        (!activeAccountId || m.accountId === activeAccountId),
    ).length
  }

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0]

  return (
    <div className="flex h-full w-56 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
      {/* Account Selector */}
      <div className="flex items-center justify-between border-b border-neutral-200 p-3 dark:border-neutral-800">
        <div className="truncate">
          <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {activeAccount?.name || 'Local Mailbox'}
          </p>
          <p className="truncate text-[10px] text-neutral-400">
            {activeAccount?.email || 'offline'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAccountSetup}
          className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          title="Account Settings"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Account Switcher if multiple accounts */}
      {accounts.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 p-1.5 dark:border-neutral-800">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => selectAccount(acc.id)}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                activeAccountId === acc.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300'
              }`}
            >
              {acc.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Folders List */}
      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Mail Folders
        </div>
        {folders.map((folder) => {
          const IconComponent = FOLDER_ICONS[folder.type] || Folder
          const unread = getUnreadCount(folder.type)
          const isSelected = activeFolderId === folder.type

          return (
            <button
              key={folder.id || folder.type}
              type="button"
              onClick={() => selectFolder(folder.type)}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <IconComponent
                  size={14}
                  className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'}
                />
                <span className="truncate">{folder.name}</span>
              </div>
              {unread > 0 && (
                <span className="py-0.2 rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Quick Add Account at Bottom */}
      <div className="border-t border-neutral-200 p-2 dark:border-neutral-800">
        <button
          type="button"
          onClick={onOpenAccountSetup}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-neutral-300 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <Plus size={12} /> Add Account
        </button>
      </div>
    </div>
  )
}
