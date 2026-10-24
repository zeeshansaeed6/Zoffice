import React, { useMemo } from 'react'
import { Search, Mail, Phone, Building, User, Plus, Trash2, Edit3 } from 'lucide-react'
import { useContactStore } from './contact-store.js'
import { useMailStore } from '../core/mail-store.js'
import { ContactModal } from './ContactModal.jsx'

/**
 * Address book and contact list view for ZMail.
 */
export function ContactList() {
  const {
    contacts,
    activeContactId,
    selectContact,
    deleteContact,
    searchQuery,
    setSearchQuery,
    openCreateContact,
    openEditContact,
  } = useContactStore()
  const { openCompose } = useMailStore()

  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return contacts
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.organization && c.organization.toLowerCase().includes(q)),
    )
  }, [contacts, searchQuery])

  const activeContact = contacts.find((c) => c.id === activeContactId) || filteredContacts[0]

  const handleSendEmail = (email) => {
    openCompose({ to: email })
  }

  return (
    <div
      className="flex flex-1 overflow-hidden bg-white dark:bg-neutral-900"
      data-testid="zcontacts-view"
    >
      {/* Left Column: Contact List */}
      <div className="flex h-full w-80 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="space-y-2 border-b border-neutral-200 p-3 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Address Book ({filteredContacts.length})
            </h2>
            <button
              type="button"
              onClick={openCreateContact}
              className="shadow-xs flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-blue-700"
            >
              <Plus size={12} /> Contact
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-1.5 pl-8 pr-3 text-xs text-neutral-800 outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="flex-1 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-800">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectContact(c.id)}
              className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                activeContact?.id === c.id
                  ? 'bg-blue-50 dark:bg-blue-950/40'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <span
                style={{ backgroundColor: c.avatarColor || '#2563eb' }}
                className="shadow-xs flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              >
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {c.name}
                </p>
                <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                  {c.email || c.phone || 'No contact info'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Contact Detail Card */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white p-8 dark:bg-neutral-900">
        {activeContact ? (
          <div className="max-w-xl">
            {/* Header with Avatar and Actions */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
              <div className="flex items-center gap-4">
                <span
                  style={{ backgroundColor: activeContact.avatarColor || '#2563eb' }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-md"
                >
                  {activeContact.name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {activeContact.name}
                  </h1>
                  {activeContact.organization && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <Building size={14} /> {activeContact.organization}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditContact(activeContact.id)}
                  className="rounded-lg border border-neutral-300 p-2 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  title="Edit contact"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteContact(activeContact.id)}
                  className="rounded-lg border border-neutral-300 p-2 text-neutral-400 hover:bg-neutral-50 hover:text-red-600 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  title="Delete contact"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mt-6 space-y-4 text-xs">
              {activeContact.email && (
                <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-600" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-neutral-400">Email</p>
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        {activeContact.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendEmail(activeContact.email)}
                    className="shadow-xs flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
                  >
                    <Mail size={12} /> Send Mail
                  </button>
                </div>
              )}

              {activeContact.phone && (
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <Phone size={16} className="text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-neutral-400">Phone</p>
                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                      {activeContact.phone}
                    </p>
                  </div>
                </div>
              )}

              {activeContact.notes && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                  <p className="mb-1 text-[10px] font-semibold uppercase text-neutral-400">Notes</p>
                  <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {activeContact.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <User size={48} className="mb-2 text-neutral-300 dark:text-neutral-700" />
            <p className="text-sm font-medium text-neutral-500">No contact selected</p>
          </div>
        )}
      </div>

      <ContactModal />
    </div>
  )
}
