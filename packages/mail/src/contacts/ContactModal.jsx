import React from 'react'
import { X, Check, User } from 'lucide-react'
import { useContactStore } from './contact-store.js'

/**
 * Create or edit contact card modal.
 */
export function ContactModal() {
  const { isContactModalOpen, contactDraft, activeContactId, closeContactModal, saveContactDraft } =
    useContactStore()

  if (!isContactModalOpen || !contactDraft) return null

  const setField = (field, value) => {
    useContactStore.setState((s) => ({
      contactDraft: s.contactDraft ? { ...s.contactDraft, [field]: value } : null,
    }))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-600 dark:text-blue-400" />
            <h2
              id="contact-modal-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              {activeContactId ? 'Edit Contact' : 'New Contact'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeContactModal}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 p-5 text-xs">
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Full Name
            </label>
            <input
              type="text"
              value={contactDraft.name || ''}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Full Name"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              value={contactDraft.email || ''}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="contact@example.com"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={contactDraft.phone || ''}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Organization / Company
            </label>
            <input
              type="text"
              value={contactDraft.organization || ''}
              onChange={(e) => setField('organization', e.target.value)}
              placeholder="Acme Inc."
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Notes
            </label>
            <textarea
              rows={2}
              value={contactDraft.notes || ''}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Notes..."
              className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={closeContactModal}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveContactDraft}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Check size={14} /> Save Contact
          </button>
        </div>
      </div>
    </div>
  )
}
