import React, { useMemo } from 'react'
import { Search, Flag, Paperclip } from 'lucide-react'
import { useMailStore } from '../core/mail-store.js'
import { searchMessages } from '../core/mail-search.js'

/**
 * Message list panel (middle column of 3-pane layout).
 */
export function MessageList() {
  const {
    messages,
    activeFolderId,
    activeAccountId,
    activeMessageId,
    selectMessage,
    toggleFlag,
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
  } = useMailStore()

  const filteredMessages = useMemo(() => {
    return searchMessages(messages, {
      query: searchQuery,
      folderId: activeFolderId,
      accountId: activeAccountId || undefined,
      unreadOnly: filterMode === 'unread',
      flaggedOnly: filterMode === 'flagged',
    }).sort((a, b) => b.date - a.date)
  }, [messages, searchQuery, activeFolderId, activeAccountId, filterMode])

  const formatDate = (timestamp) => {
    const d = new Date(timestamp)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex h-full w-80 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      {/* Search Bar */}
      <div className="border-b border-neutral-200 p-2.5 dark:border-neutral-800">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all mail..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-1.5 pl-8 pr-3 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        {/* Filter Pills */}
        <div className="mt-2 flex gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'flagged', label: 'Flagged' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                filterMode === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Items List */}
      <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-800">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No messages found in this folder.
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = activeMessageId === msg.id

            return (
              <div
                key={msg.id}
                onClick={() => selectMessage(msg.id)}
                className={`group relative flex cursor-pointer flex-col p-3 transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {/* Unread Indicator Bar */}
                {msg.unread && <span className="absolute bottom-0 left-0 top-0 w-1 bg-blue-600" />}

                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`truncate pr-2 ${
                      msg.unread
                        ? 'font-bold text-neutral-900 dark:text-neutral-100'
                        : 'font-medium text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {msg.from.split('<')[0].trim() || msg.from}
                  </span>
                  <span className="shrink-0 text-[10px] text-neutral-400">
                    {formatDate(msg.date)}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <p
                    className={`truncate text-xs ${
                      msg.unread
                        ? 'font-semibold text-neutral-900 dark:text-neutral-200'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {msg.subject || '(No Subject)'}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5 pl-2">
                    {msg.attachments?.length > 0 && (
                      <Paperclip size={12} className="text-neutral-400" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFlag(msg.id)
                      }}
                      className={`p-0.5 ${
                        msg.flagged
                          ? 'text-red-500'
                          : 'text-neutral-300 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Flag size={12} fill={msg.flagged ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <p className="mt-1 line-clamp-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {msg.bodyText || msg.bodyHtml.replace(/<[^>]+>/g, ' ')}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
