import React from 'react'
import { Reply, ReplyAll, Forward, Trash2, Flag, Mail, Download, Paperclip } from 'lucide-react'
import { useMailStore } from '../core/mail-store.js'

/**
 * Message reading panel (right column of 3-pane layout).
 */
export function ReadingPane() {
  const { messages, activeMessageId, deleteMessage, toggleFlag, openCompose } = useMailStore()

  const message = messages.find((m) => m.id === activeMessageId)

  if (!message) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 text-center dark:bg-neutral-900">
        <Mail size={48} className="mb-3 text-neutral-300 dark:text-neutral-700" />
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          No message selected
        </h3>
        <p className="mt-1 text-xs text-neutral-400">
          Choose a message from the list on the left to read it here.
        </p>
      </div>
    )
  }

  const handleReply = () => {
    openCompose({
      to: message.from,
      subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${message.from}\nDate: ${new Date(message.date).toLocaleString()}\n\n${message.bodyText}`,
      inReplyTo: message.id,
    })
  }

  const handleReplyAll = () => {
    const allRecipients = Array.from(new Set([message.from, ...(message.to || [])]))
      .filter((r) => !r.includes('user@zoffice'))
      .join(', ')

    openCompose({
      to: allRecipients || message.from,
      cc: (message.cc || []).join(', '),
      subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${message.from}\n\n${message.bodyText}`,
      inReplyTo: message.id,
    })
  }

  const handleForward = () => {
    openCompose({
      to: '',
      subject: message.subject.startsWith('Fwd:') ? message.subject : `Fwd: ${message.subject}`,
      body: `\n\n---------- Forwarded message ---------\nFrom: ${message.from}\nDate: ${new Date(message.date).toLocaleString()}\nSubject: ${message.subject}\nTo: ${(message.to || []).join(', ')}\n\n${message.bodyText}`,
      attachments: message.attachments || [],
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-2.5 dark:border-neutral-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReply}
            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Reply size={14} /> Reply
          </button>
          <button
            type="button"
            onClick={handleReplyAll}
            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <ReplyAll size={14} /> Reply All
          </button>
          <button
            type="button"
            onClick={handleForward}
            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Forward size={14} /> Forward
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFlag(message.id)}
            className={`rounded-md p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              message.flagged ? 'text-red-500' : 'text-neutral-400'
            }`}
            title="Flag message"
          >
            <Flag size={15} fill={message.flagged ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => deleteMessage(message.id)}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Message Header Info */}
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {message.subject || '(No Subject)'}
        </h1>

        <div className="mt-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
              {message.from.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {message.from}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                To: {message.to.join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">
            {new Date(message.date).toLocaleString()}
          </span>
        </div>

        {/* Attachments list if present */}
        {message.attachments?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-100 pt-2 dark:border-neutral-800">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              >
                <Paperclip size={12} className="text-neutral-400" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {att.filename}
                </span>
                <span className="text-[10px] text-neutral-400">
                  ({Math.round(att.size / 1024)} KB)
                </span>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  title="Download attachment"
                >
                  <Download size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Body Content */}
      <div className="flex-1 overflow-y-auto p-6 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        <div
          dangerouslySetInnerHTML={{ __html: message.bodyHtml || `<p>${message.bodyText}</p>` }}
          className="prose dark:prose-invert max-w-none"
        />
      </div>
    </div>
  )
}
