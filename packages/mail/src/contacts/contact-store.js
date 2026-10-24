/**
 * ZMail Contacts Zustand Store — manages address book and contact cards.
 * @module contact-store
 */

import { create } from 'zustand'
import { createContact } from './contact-model.js'

export const useContactStore = create((set, get) => ({
  contacts: [],
  activeContactId: null,
  searchQuery: '',

  isContactModalOpen: false,
  contactDraft: null,

  /** Initialize with sample contacts if empty */
  initDefault: () => {
    const state = get()
    if (state.contacts.length > 0) return

    const c1 = createContact({
      name: 'Nicholas Saeed',
      email: 'nicholas@zoffice.org',
      phone: '+1 (555) 019-2831',
      organization: 'Zoffice Core Team',
      notes: 'Lead developer on Zoffice suite.',
      avatarColor: '#2563eb',
    })

    const c2 = createContact({
      name: 'Sarah Lin',
      email: 'sarah.lin@example.com',
      phone: '+1 (555) 014-9822',
      organization: 'Acme Systems',
      notes: 'Product partner and design lead.',
      avatarColor: '#7c3aed',
    })

    set({
      contacts: [c1, c2],
      activeContactId: c1.id,
    })
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  selectContact: (id) => set({ activeContactId: id }),

  addContact: (data) => {
    const newContact = createContact(data)
    set((s) => ({ contacts: [...s.contacts, newContact], activeContactId: newContact.id }))
    return newContact
  },

  updateContact: (id, updates) => {
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c,
      ),
    }))
  },

  deleteContact: (id) => {
    set((s) => ({
      contacts: s.contacts.filter((c) => c.id !== id),
      activeContactId: s.activeContactId === id ? s.contacts[0]?.id || null : s.activeContactId,
    }))
  },

  openCreateContact: () => {
    set({
      isContactModalOpen: true,
      contactDraft: {
        name: '',
        email: '',
        phone: '',
        organization: '',
        notes: '',
      },
    })
  },

  openEditContact: (id) => {
    const c = get().contacts.find((item) => item.id === id)
    if (!c) return
    set({
      isContactModalOpen: true,
      activeContactId: id,
      contactDraft: { ...c },
    })
  },

  closeContactModal: () => set({ isContactModalOpen: false, contactDraft: null }),

  saveContactDraft: () => {
    const { contactDraft, activeContactId } = get()
    if (!contactDraft || !contactDraft.name.trim()) return

    if (activeContactId && get().contacts.some((c) => c.id === activeContactId)) {
      get().updateContact(activeContactId, contactDraft)
    } else {
      get().addContact(contactDraft)
    }
    set({ isContactModalOpen: false, contactDraft: null })
  },
}))
