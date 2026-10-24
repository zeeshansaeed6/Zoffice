/**
 * ZMail Zustand Store — manages email accounts, folders, messages, and compose state.
 * @module mail-store
 */

import { create } from 'zustand'
import { createAccount, createFolder, createMessage } from './mail-model.js'
import { FOLDER_TYPES } from './constants.js'

export const useMailStore = create((set, get) => ({
  accounts: [],
  activeAccountId: null,
  folders: [],
  activeFolderId: FOLDER_TYPES.INBOX,
  messages: [],
  activeMessageId: null,

  // Search & Filters
  searchQuery: '',
  filterMode: 'all', // 'all' | 'unread' | 'flagged'

  // Compose State
  isComposeOpen: false,
  composeDraft: null,

  // Account Setup Modal State
  isAccountModalOpen: false,

  /** Initialize store with default sample account and welcome emails if empty */
  initDefault: () => {
    const state = get()
    if (state.accounts.length > 0) return

    const defaultAcc = createAccount({
      name: 'Nicholas / Local User',
      email: 'user@zoffice.local',
      color: '#2563eb',
    })

    const folders = [
      createFolder(defaultAcc.id, FOLDER_TYPES.INBOX, { name: 'Inbox', unreadCount: 2 }),
      createFolder(defaultAcc.id, FOLDER_TYPES.SENT, { name: 'Sent' }),
      createFolder(defaultAcc.id, FOLDER_TYPES.DRAFTS, { name: 'Drafts' }),
      createFolder(defaultAcc.id, FOLDER_TYPES.ARCHIVE, { name: 'Archive' }),
      createFolder(defaultAcc.id, FOLDER_TYPES.SPAM, { name: 'Junk' }),
      createFolder(defaultAcc.id, FOLDER_TYPES.TRASH, { name: 'Trash' }),
    ]

    const msg1 = createMessage({
      accountId: defaultAcc.id,
      folderId: FOLDER_TYPES.INBOX,
      from: 'Zoffice Team <team@zoffice.org>',
      to: ['user@zoffice.local'],
      subject: 'Welcome to ZMail & ZCalendar!',
      bodyHtml: `
        <h2>Welcome to your new offline-first email suite</h2>
        <p>ZMail and ZCalendar give you complete desktop productivity with zero telemetry and 100% data ownership.</p>
        <ul>
          <li><strong>Offline-First:</strong> Read, search, and compose anytime.</li>
          <li><strong>3-Pane Layout:</strong> Browse folders, conversations, and reading pane side-by-side.</li>
          <li><strong>Integrated Calendar:</strong> Schedule meetings, set reminders, and import .ics events.</li>
        </ul>
        <p>Set up your IMAP/SMTP accounts in Account Settings to synchronize external mailboxes.</p>
      `,
      bodyText: 'Welcome to your new offline-first email suite. Read, search, and compose anytime.',
      unread: true,
      flagged: true,
      date: Date.now() - 3600000,
    })

    const msg2 = createMessage({
      accountId: defaultAcc.id,
      folderId: FOLDER_TYPES.INBOX,
      from: 'System Notifications <notifications@zoffice.local>',
      to: ['user@zoffice.local'],
      subject: 'Storage & Encryption Status',
      bodyHtml:
        '<p>All credentials and cached messages are secured via local SQLite and Electron safeStorage encryption.</p>',
      bodyText: 'All credentials and cached messages are secured locally.',
      unread: true,
      flagged: false,
      date: Date.now() - 7200000,
    })

    set({
      accounts: [defaultAcc],
      activeAccountId: defaultAcc.id,
      folders,
      activeFolderId: FOLDER_TYPES.INBOX,
      messages: [msg1, msg2],
      activeMessageId: msg1.id,
    })
  },

  selectAccount: (accountId) => {
    set({ activeAccountId: accountId, activeFolderId: FOLDER_TYPES.INBOX, activeMessageId: null })
  },

  addAccount: (acc) => {
    const newAcc = createAccount(acc)
    const newFolders = [
      createFolder(newAcc.id, FOLDER_TYPES.INBOX, { name: 'Inbox' }),
      createFolder(newAcc.id, FOLDER_TYPES.SENT, { name: 'Sent' }),
      createFolder(newAcc.id, FOLDER_TYPES.DRAFTS, { name: 'Drafts' }),
      createFolder(newAcc.id, FOLDER_TYPES.ARCHIVE, { name: 'Archive' }),
      createFolder(newAcc.id, FOLDER_TYPES.TRASH, { name: 'Trash' }),
    ]
    set((s) => ({
      accounts: [...s.accounts, newAcc],
      folders: [...s.folders, ...newFolders],
      activeAccountId: newAcc.id,
    }))
    return newAcc
  },

  deleteAccount: (accountId) => {
    set((s) => ({
      accounts: s.accounts.filter((a) => a.id !== accountId),
      folders: s.folders.filter((f) => f.accountId !== accountId),
      messages: s.messages.filter((m) => m.accountId !== accountId),
      activeAccountId:
        s.activeAccountId === accountId ? s.accounts[0]?.id || null : s.activeAccountId,
    }))
  },

  selectFolder: (folderId) => {
    set({ activeFolderId: folderId, activeMessageId: null })
  },

  selectMessage: (messageId) => {
    set((s) => {
      // Mark as read when opened
      const nextMessages = s.messages.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
      return { activeMessageId: messageId, messages: nextMessages }
    })
  },

  deleteMessage: (messageId) => {
    set((s) => {
      const target = s.messages.find((m) => m.id === messageId)
      if (!target) return s
      // If already in trash, remove permanently, otherwise move to trash
      if (target.folderId === FOLDER_TYPES.TRASH) {
        return {
          messages: s.messages.filter((m) => m.id !== messageId),
          activeMessageId: s.activeMessageId === messageId ? null : s.activeMessageId,
        }
      }
      return {
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, folderId: FOLDER_TYPES.TRASH } : m,
        ),
        activeMessageId: s.activeMessageId === messageId ? null : s.activeMessageId,
      }
    })
  },

  toggleFlag: (messageId) => {
    set((s) => ({
      messages: s.messages.map((m) => (m.id === messageId ? { ...m, flagged: !m.flagged } : m)),
    }))
  },

  toggleUnread: (messageId) => {
    set((s) => ({
      messages: s.messages.map((m) => (m.id === messageId ? { ...m, unread: !m.unread } : m)),
    }))
  },

  moveMessage: (messageId, targetFolderId) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === messageId ? { ...m, folderId: targetFolderId } : m,
      ),
    }))
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterMode: (mode) => set({ filterMode: mode }),

  // Compose Actions
  openCompose: (initialDraft = {}) => {
    const to = initialDraft.to
      ? Array.isArray(initialDraft.to)
        ? initialDraft.to.join(', ')
        : initialDraft.to
      : ''
    const cc = initialDraft.cc
      ? Array.isArray(initialDraft.cc)
        ? initialDraft.cc.join(', ')
        : initialDraft.cc
      : ''
    const bcc = initialDraft.bcc
      ? Array.isArray(initialDraft.bcc)
        ? initialDraft.bcc.join(', ')
        : initialDraft.bcc
      : ''
    const body = initialDraft.body || initialDraft.bodyText || ''

    set({
      isComposeOpen: true,
      composeDraft: {
        to,
        cc,
        bcc,
        subject: initialDraft.subject || '',
        body,
        attachments: initialDraft.attachments || [],
        inReplyTo: initialDraft.inReplyTo || null,
      },
    })
  },

  closeCompose: () => set({ isComposeOpen: false, composeDraft: null }),

  updateComposeDraft: (updates) => {
    set((s) => ({
      composeDraft: s.composeDraft ? { ...s.composeDraft, ...updates } : null,
    }))
  },

  sendDraft: () => {
    const { composeDraft, activeAccountId, accounts } = get()
    if (!composeDraft) return null

    const account = accounts.find((a) => a.id === activeAccountId) || accounts[0]
    const toList = composeDraft.to
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const ccList = composeDraft.cc
      ? composeDraft.cc
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    const sentMessage = createMessage({
      accountId: account?.id || 'acc-default',
      folderId: FOLDER_TYPES.SENT,
      from: account?.email || 'user@zoffice.local',
      to: toList,
      cc: ccList,
      subject: composeDraft.subject || '(No Subject)',
      bodyHtml: `<p>${composeDraft.body.replace(/\n/g, '<br/>')}</p>`,
      bodyText: composeDraft.body,
      attachments: composeDraft.attachments,
      unread: false,
    })

    set((s) => ({
      messages: [sentMessage, ...s.messages],
      isComposeOpen: false,
      composeDraft: null,
    }))
    return sentMessage
  },

  sendMessage: () => get().sendDraft(),

  setAccountModalOpen: (open) => set({ isAccountModalOpen: open }),
}))
