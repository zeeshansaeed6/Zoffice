import React, { useState, useRef } from 'react'
import { X, Send, Paperclip, Trash2 } from 'lucide-react'
import { useMailStore } from '../core/mail-store.js'
import { createAttachment } from '../core/mail-model.js'

/**
 * Compose email modal for drafting and sending emails.
 */
export function ComposeModal() {
  const { isComposeOpen, composeDraft, closeCompose, updateComposeDraft, sendDraft } =
    useMailStore()
  const [showCc, setShowCc] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  if (!isComposeOpen || !composeDraft) return null

  const handleFileChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const att = createAttachment({
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          dataUrl: String(event.target.result),
        })
        const currentAtts = composeDraft.attachments || []
        updateComposeDraft({ attachments: [...currentAtts, att] })
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAttachment = (attId) => {
    const nextAtts = (composeDraft.attachments || []).filter((a) => a.id !== attId)
    updateComposeDraft({ attachments: nextAtts })
  }

  const handleSend = () => {
    if (!composeDraft.to.trim()) {
      setErrorMessage('Please enter at least one recipient in the "To" field.')
      return
    }
    setErrorMessage('')
    sendDraft()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex h-[580px] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2
            id="compose-title"
            className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
          >
            {composeDraft.subject ? `Compose: ${composeDraft.subject}` : 'New Message'}
          </h2>
          <button
            type="button"
            onClick={closeCompose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-2 border-b border-neutral-200 px-4 py-2 text-xs dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-12 font-medium text-neutral-500">To:</span>
            <input
              type="text"
              value={composeDraft.to}
              onChange={(e) => updateComposeDraft({ to: e.target.value })}
              placeholder="recipient@example.com"
              className="flex-1 bg-transparent py-1 text-neutral-800 outline-none dark:text-neutral-100"
              autoFocus
            />
            {!showCc && (
              <button
                type="button"
                onClick={() => setShowCc(true)}
                className="text-[10px] text-blue-600 hover:underline"
              >
                Cc / Bcc
              </button>
            )}
          </div>

          {showCc && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-12 font-medium text-neutral-500">Cc:</span>
                <input
                  type="text"
                  value={composeDraft.cc}
                  onChange={(e) => updateComposeDraft({ cc: e.target.value })}
                  placeholder="cc@example.com"
                  className="flex-1 bg-transparent py-1 text-neutral-800 outline-none dark:text-neutral-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 font-medium text-neutral-500">Bcc:</span>
                <input
                  type="text"
                  value={composeDraft.bcc}
                  onChange={(e) => updateComposeDraft({ bcc: e.target.value })}
                  placeholder="bcc@example.com"
                  className="flex-1 bg-transparent py-1 text-neutral-800 outline-none dark:text-neutral-100"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2 border-t border-neutral-100 pt-1 dark:border-neutral-800">
            <span className="w-12 font-medium text-neutral-500">Subject:</span>
            <input
              type="text"
              value={composeDraft.subject}
              onChange={(e) => updateComposeDraft({ subject: e.target.value })}
              placeholder="Subject..."
              className="flex-1 bg-transparent py-1 font-medium text-neutral-800 outline-none dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Attachment Chips */}
        {composeDraft.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-800 dark:bg-neutral-800/40">
            {composeDraft.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-0.5 text-[11px] shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                <Paperclip size={10} className="text-neutral-400" />
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {att.filename}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-neutral-400 hover:text-red-500"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Body Textarea */}
        <div className="flex-1 p-4">
          <textarea
            value={composeDraft.body}
            onChange={(e) => updateComposeDraft({ body: e.target.value })}
            placeholder="Write your email message here..."
            className="h-full w-full resize-none bg-transparent text-sm leading-relaxed text-neutral-800 placeholder-neutral-400 outline-none dark:text-neutral-100"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <Paperclip size={14} /> Attach File
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeCompose}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
