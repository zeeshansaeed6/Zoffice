/**
 * ZMail & ZCalendar Constants — folders, flags, calendar views, recurrence.
 * @module constants
 */

/** @enum {string} Standard mailbox folder IDs */
export const FOLDER_TYPES = {
  INBOX: 'inbox',
  SENT: 'sent',
  DRAFTS: 'drafts',
  TRASH: 'trash',
  ARCHIVE: 'archive',
  SPAM: 'spam',
}

/** Folder metadata with labels and Lucide icon names */
export const FOLDER_META = {
  [FOLDER_TYPES.INBOX]: { label: 'Inbox', icon: 'Inbox', color: '#2563eb' },
  [FOLDER_TYPES.SENT]: { label: 'Sent', icon: 'Send', color: '#059669' },
  [FOLDER_TYPES.DRAFTS]: { label: 'Drafts', icon: 'FileText', color: '#d97706' },
  [FOLDER_TYPES.ARCHIVE]: { label: 'Archive', icon: 'Archive', color: '#6b7280' },
  [FOLDER_TYPES.SPAM]: { label: 'Junk / Spam', icon: 'AlertOctagon', color: '#dc2626' },
  [FOLDER_TYPES.TRASH]: { label: 'Trash', icon: 'Trash2', color: '#9ca3af' },
}

/** @enum {string} Message priority levels */
export const PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
}

/** @enum {string} Calendar view modes */
export const CALENDAR_VIEWS = {
  DAY: 'day',
  WORK_WEEK: 'work_week',
  WEEK: 'week',
  MONTH: 'month',
}

/** @enum {string} Recurrence rule frequencies */
export const RECURRENCE_FREQ = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
}

/** Default email server settings for popular services */
export const PROVIDER_PRESETS = [
  {
    id: 'gmail',
    name: 'Google / Gmail',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    imapSecure: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpSecure: true,
    hint: 'Use a Google App Password if 2-Step Verification is enabled.',
  },
  {
    id: 'custom_imap',
    name: 'Custom IMAP / SMTP',
    imapHost: 'mail.example.com',
    imapPort: 993,
    imapSecure: true,
    smtpHost: 'mail.example.com',
    smtpPort: 587,
    smtpSecure: false,
    hint: 'Contact your email service administrator for server addresses.',
  },
]
