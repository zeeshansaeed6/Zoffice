import { describe, it, expect } from 'vitest'
import {
  createAccount,
  createFolder,
  createMessage,
  createAttachment,
  generateId,
} from '../core/mail-model.js'
import { FOLDER_TYPES, PRIORITY } from '../core/constants.js'

describe('ZMail Data Models', () => {
  it('generates prefixed IDs', () => {
    expect(generateId('acc')).toMatch(/^acc-/)
    expect(generateId('msg')).toMatch(/^msg-/)
    expect(generateId('fld')).toMatch(/^fld-/)
    expect(generateId('att')).toMatch(/^att-/)
  })

  it('creates an account with default properties and ports', () => {
    const acc = createAccount({
      name: 'Work Email',
      email: 'work@example.com',
      imapHost: 'imap.work.com',
    })
    expect(acc.id).toMatch(/^acc-/)
    expect(acc.name).toBe('Work Email')
    expect(acc.email).toBe('work@example.com')
    expect(acc.imapHost).toBe('imap.work.com')
    expect(acc.imapPort).toBe(993)
    expect(acc.imapSecure).toBe(true)
    expect(acc.smtpPort).toBe(587)
  })

  it('creates a folder descriptor', () => {
    const fld = createFolder('acc-1', FOLDER_TYPES.INBOX, { name: 'Inbox', unreadCount: 5 })
    expect(fld.id).toMatch(/^fld-/)
    expect(fld.accountId).toBe('acc-1')
    expect(fld.type).toBe('inbox')
    expect(fld.name).toBe('Inbox')
    expect(fld.unreadCount).toBe(5)
  })

  it('creates an email message item', () => {
    const msg = createMessage({
      accountId: 'acc-1',
      from: 'alice@example.com',
      to: ['bob@example.com'],
      subject: 'Quarterly Review',
      bodyText: 'Let us meet tomorrow.',
      unread: true,
      flagged: false,
      priority: PRIORITY.HIGH,
    })
    expect(msg.id).toMatch(/^msg-/)
    expect(msg.from).toBe('alice@example.com')
    expect(msg.to).toContain('bob@example.com')
    expect(msg.subject).toBe('Quarterly Review')
    expect(msg.unread).toBe(true)
    expect(msg.priority).toBe('high')
    expect(msg.threadId).toBe(msg.id)
  })

  it('creates an attachment descriptor', () => {
    const att = createAttachment({
      filename: 'report.pdf',
      size: 10240,
      mimeType: 'application/pdf',
      dataUrl: 'data:application/pdf;base64,AAA...',
    })
    expect(att.id).toMatch(/^att-/)
    expect(att.filename).toBe('report.pdf')
    expect(att.size).toBe(10240)
    expect(att.mimeType).toBe('application/pdf')
  })
})
