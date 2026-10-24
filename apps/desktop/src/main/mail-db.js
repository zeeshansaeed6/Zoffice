import { safeStorage } from 'electron'
import { getDatabase } from './db.js'

/**
 * Ensures mail, calendar, and contact tables exist in SQLite.
 */
export function ensureMailTables() {
  const db = getDatabase()
  db.exec(`
    CREATE TABLE IF NOT EXISTS mail_accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      imap_host TEXT NOT NULL,
      imap_port INTEGER NOT NULL,
      imap_secure INTEGER NOT NULL,
      smtp_host TEXT NOT NULL,
      smtp_port INTEGER NOT NULL,
      smtp_secure INTEGER NOT NULL,
      username TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mail_credentials (
      account_id TEXT PRIMARY KEY,
      encrypted_password TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES mail_accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS mail_messages (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      folder_id TEXT NOT NULL,
      from_addr TEXT NOT NULL,
      to_addrs TEXT NOT NULL,
      cc_addrs TEXT NOT NULL DEFAULT '[]',
      subject TEXT NOT NULL,
      body_html TEXT NOT NULL,
      body_text TEXT NOT NULL,
      date INTEGER NOT NULL,
      unread INTEGER NOT NULL DEFAULT 1,
      flagged INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'normal',
      attachments TEXT NOT NULL DEFAULT '[]',
      thread_id TEXT NOT NULL,
      in_reply_to TEXT,
      FOREIGN KEY (account_id) REFERENCES mail_accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      all_day INTEGER NOT NULL DEFAULT 0,
      recurrence TEXT NOT NULL DEFAULT '{}',
      reminder INTEGER NOT NULL DEFAULT 15,
      color TEXT NOT NULL DEFAULT '#2563eb',
      attendees TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      organization TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      avatar_color TEXT NOT NULL DEFAULT '#2563eb',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_mail_messages_acc_fld ON mail_messages(account_id, folder_id);
    CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON calendar_events(start_date);
  `)
}

// Credential Encryption Helpers using safeStorage
export function encryptPassword(password = '') {
  if (!password) return ''
  try {
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.encryptString(password).toString('hex')
    }
  } catch {
    // fallback
  }
  return Buffer.from(password).toString('base64')
}

export function decryptPassword(encrypted = '') {
  if (!encrypted) return ''
  try {
    if (safeStorage.isEncryptionAvailable()) {
      return safeStorage.decryptString(Buffer.from(encrypted, 'hex'))
    }
  } catch {
    // fallback
  }
  try {
    return Buffer.from(encrypted, 'base64').toString('utf8')
  } catch {
    return ''
  }
}

// Mail Accounts CRUD
export function getAccounts() {
  ensureMailTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM mail_accounts ORDER BY created_at ASC').all()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    imapHost: r.imap_host,
    imapPort: r.imap_port,
    imapSecure: Boolean(r.imap_secure),
    smtpHost: r.smtp_host,
    smtpPort: r.smtp_port,
    smtpSecure: Boolean(r.smtp_secure),
    username: r.username,
    color: r.color,
    createdAt: r.created_at,
  }))
}

export function saveAccount(acc, password = '') {
  ensureMailTables()
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO mail_accounts (id, name, email, imap_host, imap_port, imap_secure, smtp_host, smtp_port, smtp_secure, username, color, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      imap_host = excluded.imap_host,
      imap_port = excluded.imap_port,
      imap_secure = excluded.imap_secure,
      smtp_host = excluded.smtp_host,
      smtp_port = excluded.smtp_port,
      smtp_secure = excluded.smtp_secure,
      username = excluded.username,
      color = excluded.color
  `)
  stmt.run(
    acc.id,
    acc.name,
    acc.email,
    acc.imapHost,
    acc.imapPort,
    acc.imapSecure ? 1 : 0,
    acc.smtpHost,
    acc.smtpPort,
    acc.smtpSecure ? 1 : 0,
    acc.username,
    acc.color || '#2563eb',
    acc.createdAt || Date.now(),
  )

  if (password) {
    const enc = encryptPassword(password)
    db.prepare(
      'INSERT INTO mail_credentials (account_id, encrypted_password) VALUES (?, ?) ON CONFLICT(account_id) DO UPDATE SET encrypted_password = excluded.encrypted_password',
    ).run(acc.id, enc)
  }
  return true
}

export function deleteAccount(id) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('DELETE FROM mail_accounts WHERE id = ?').run(id)
  return true
}

// Mail Messages CRUD
export function getMessages(accountId, folderId) {
  ensureMailTables()
  const db = getDatabase()
  let query = 'SELECT * FROM mail_messages WHERE 1=1'
  const params = []
  if (accountId) {
    query += ' AND account_id = ?'
    params.push(accountId)
  }
  if (folderId) {
    query += ' AND folder_id = ?'
    params.push(folderId)
  }
  query += ' ORDER BY date DESC'
  const rows = db.prepare(query).all(...params)

  return rows.map((r) => ({
    id: r.id,
    accountId: r.account_id,
    folderId: r.folder_id,
    from: r.from_addr,
    to: JSON.parse(r.to_addrs || '[]'),
    cc: JSON.parse(r.cc_addrs || '[]'),
    subject: r.subject,
    bodyHtml: r.body_html,
    bodyText: r.body_text,
    date: r.date,
    unread: Boolean(r.unread),
    flagged: Boolean(r.flagged),
    priority: r.priority,
    attachments: JSON.parse(r.attachments || '[]'),
    threadId: r.thread_id,
    inReplyTo: r.in_reply_to,
  }))
}

export function saveMessage(m) {
  ensureMailTables()
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO mail_messages (id, account_id, folder_id, from_addr, to_addrs, cc_addrs, subject, body_html, body_text, date, unread, flagged, priority, attachments, thread_id, in_reply_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      folder_id = excluded.folder_id,
      unread = excluded.unread,
      flagged = excluded.flagged
  `)
  stmt.run(
    m.id,
    m.accountId,
    m.folderId,
    m.from,
    JSON.stringify(m.to || []),
    JSON.stringify(m.cc || []),
    m.subject,
    m.bodyHtml,
    m.bodyText,
    m.date,
    m.unread ? 1 : 0,
    m.flagged ? 1 : 0,
    m.priority || 'normal',
    JSON.stringify(m.attachments || []),
    m.threadId,
    m.inReplyTo || null,
  )
  return true
}

export function deleteMessage(id) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('DELETE FROM mail_messages WHERE id = ?').run(id)
  return true
}

export function setMessageRead(id, unread) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('UPDATE mail_messages SET unread = ? WHERE id = ?').run(unread ? 1 : 0, id)
  return true
}

export function setMessageFlag(id, flagged) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('UPDATE mail_messages SET flagged = ? WHERE id = ?').run(flagged ? 1 : 0, id)
  return true
}

// Calendar Events CRUD
export function getEvents() {
  ensureMailTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM calendar_events ORDER BY start_date ASC').all()
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    location: r.location,
    startDate: r.start_date,
    endDate: r.end_date,
    allDay: Boolean(r.all_day),
    recurrence: JSON.parse(r.recurrence || '{}'),
    reminder: r.reminder,
    color: r.color,
    attendees: JSON.parse(r.attendees || '[]'),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export function saveEvent(ev) {
  ensureMailTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO calendar_events (id, title, description, location, start_date, end_date, all_day, recurrence, reminder, color, attendees, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      location = excluded.location,
      start_date = excluded.start_date,
      end_date = excluded.end_date,
      all_day = excluded.all_day,
      recurrence = excluded.recurrence,
      reminder = excluded.reminder,
      color = excluded.color,
      attendees = excluded.attendees,
      updated_at = excluded.updated_at
  `)
  stmt.run(
    ev.id,
    ev.title,
    ev.description || '',
    ev.location || '',
    ev.startDate,
    ev.endDate,
    ev.allDay ? 1 : 0,
    JSON.stringify(ev.recurrence || {}),
    ev.reminder || 15,
    ev.color || '#2563eb',
    JSON.stringify(ev.attendees || []),
    ev.createdAt || now,
    ev.updatedAt || now,
  )
  return true
}

export function deleteEvent(id) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('DELETE FROM calendar_events WHERE id = ?').run(id)
  return true
}

// Contacts CRUD
export function getContacts() {
  ensureMailTables()
  const db = getDatabase()
  const rows = db.prepare('SELECT * FROM contacts ORDER BY name ASC').all()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    organization: r.organization,
    notes: r.notes,
    avatarColor: r.avatar_color,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export function saveContact(c) {
  ensureMailTables()
  const db = getDatabase()
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, phone, organization, notes, avatar_color, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      email = excluded.email,
      phone = excluded.phone,
      organization = excluded.organization,
      notes = excluded.notes,
      avatar_color = excluded.avatar_color,
      updated_at = excluded.updated_at
  `)
  stmt.run(
    c.id,
    c.name,
    c.email,
    c.phone || '',
    c.organization || '',
    c.notes || '',
    c.avatarColor || '#2563eb',
    c.createdAt || now,
    c.updatedAt || now,
  )
  return true
}

export function deleteContact(id) {
  ensureMailTables()
  const db = getDatabase()
  db.prepare('DELETE FROM contacts WHERE id = ?').run(id)
  return true
}
