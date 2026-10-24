/**
 * ZMail Data Models — factory functions for accounts, folders, messages, and attachments.
 * @module mail-model
 */

import { FOLDER_TYPES, PRIORITY } from './constants.js'

/**
 * Generate a unique ID with optional entity prefix.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {Object} Account
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} imapHost
 * @property {number} imapPort
 * @property {boolean} imapSecure
 * @property {string} smtpHost
 * @property {number} smtpPort
 * @property {boolean} smtpSecure
 * @property {string} username
 * @property {string} [color]
 * @property {number} createdAt
 */

/**
 * Create a new email account configuration.
 * @param {Partial<Account>} [overrides={}]
 * @returns {Account}
 */
export function createAccount(overrides = {}) {
  return {
    id: generateId('acc'),
    name: overrides.name || 'Personal Account',
    email: overrides.email || 'user@example.com',
    imapHost: overrides.imapHost || 'imap.example.com',
    imapPort: overrides.imapPort ?? 993,
    imapSecure: overrides.imapSecure ?? true,
    smtpHost: overrides.smtpHost || 'smtp.example.com',
    smtpPort: overrides.smtpPort ?? 587,
    smtpSecure: overrides.smtpSecure ?? false,
    username: overrides.username || overrides.email || 'user@example.com',
    color: overrides.color || '#2563eb',
    createdAt: overrides.createdAt || Date.now(),
  }
}

/**
 * @typedef {Object} Attachment
 * @property {string} id
 * @property {string} filename
 * @property {number} size - size in bytes
 * @property {string} mimeType
 * @property {string} [dataUrl] - base64 payload
 */

/**
 * Create an email attachment descriptor.
 * @param {Partial<Attachment>} [overrides={}]
 * @returns {Attachment}
 */
export function createAttachment(overrides = {}) {
  return {
    id: generateId('att'),
    filename: overrides.filename || 'attachment.bin',
    size: overrides.size || 0,
    mimeType: overrides.mimeType || 'application/octet-stream',
    dataUrl: overrides.dataUrl || '',
  }
}

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} accountId
 * @property {string} folderId
 * @property {string} from
 * @property {string[]} to
 * @property {string[]} [cc]
 * @property {string[]} [bcc]
 * @property {string} subject
 * @property {string} bodyHtml
 * @property {string} bodyText
 * @property {number} date - Unix timestamp in ms
 * @property {boolean} unread
 * @property {boolean} flagged
 * @property {string} priority - One of PRIORITY
 * @property {string[]} labels
 * @property {Attachment[]} attachments
 * @property {string} threadId
 * @property {string|null} inReplyTo
 */

/**
 * Create an email message item.
 * @param {Partial<Message>} [overrides={}]
 * @returns {Message}
 */
export function createMessage(overrides = {}) {
  const now = Date.now()
  const id = generateId('msg')
  const threadId = overrides.threadId || id

  return {
    id,
    accountId: overrides.accountId || 'acc-default',
    folderId: overrides.folderId || FOLDER_TYPES.INBOX,
    from: overrides.from || 'sender@example.com',
    to: overrides.to || ['recipient@example.com'],
    cc: overrides.cc || [],
    bcc: overrides.bcc || [],
    subject: overrides.subject || '(No Subject)',
    bodyHtml: overrides.bodyHtml || '<p></p>',
    bodyText: overrides.bodyText || '',
    date: overrides.date || now,
    unread: overrides.unread ?? true,
    flagged: overrides.flagged ?? false,
    priority: overrides.priority || PRIORITY.NORMAL,
    labels: overrides.labels || [],
    attachments: overrides.attachments || [],
    threadId,
    inReplyTo: overrides.inReplyTo || null,
  }
}

/**
 * @typedef {Object} MailFolder
 * @property {string} id
 * @property {string} accountId
 * @property {string} name
 * @property {string} type - One of FOLDER_TYPES
 * @property {number} unreadCount
 */

/**
 * Create a mailbox folder descriptor.
 * @param {string} accountId
 * @param {string} type - FOLDER_TYPES value
 * @param {Partial<MailFolder>} [overrides={}]
 * @returns {MailFolder}
 */
export function createFolder(accountId, type = FOLDER_TYPES.INBOX, overrides = {}) {
  return {
    id: generateId('fld'),
    accountId,
    name: overrides.name || type.charAt(0).toUpperCase() + type.slice(1),
    type,
    unreadCount: overrides.unreadCount || 0,
  }
}
