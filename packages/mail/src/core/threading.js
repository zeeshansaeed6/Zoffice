/**
 * ZMail Conversation Threading — groups related messages by thread ID and subject.
 * @module threading
 */

/**
 * Normalize an email subject by stripping prefixes like "Re:", "Fwd:", etc.
 * @param {string} subject
 * @returns {string}
 */
export function normalizeSubject(subject = '') {
  return subject
    .replace(/^(\s*(re|fwd|fw|aw|antw):\s*)+/i, '')
    .trim()
    .toLowerCase()
}

/**
 * @typedef {Object} MessageThread
 * @property {string} threadId
 * @property {string} subject - Display subject (from latest message)
 * @property {import('./mail-model.js').Message[]} messages
 * @property {number} latestDate - Timestamp of latest message
 * @property {boolean} hasUnread
 * @property {boolean} hasAttachments
 * @property {string[]} senders - Unique list of sender names/addresses
 */

/**
 * Group a list of messages into conversation threads.
 * @param {import('./mail-model.js').Message[]} messages
 * @returns {MessageThread[]} Threads sorted by latest date descending
 */
export function groupIntoThreads(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) return []

  /** @type {Map<string, import('./mail-model.js').Message[]>} */
  const groups = new Map()

  for (const msg of messages) {
    const key = msg.threadId || normalizeSubject(msg.subject) || msg.id
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(msg)
  }

  const threads = []

  for (const [threadId, msgs] of groups.entries()) {
    // Sort messages in thread chronologically ascending
    msgs.sort((a, b) => a.date - b.date)
    const latest = msgs[msgs.length - 1]

    const senders = Array.from(new Set(msgs.map((m) => m.from)))
    const hasUnread = msgs.some((m) => m.unread)
    const hasAttachments = msgs.some((m) => m.attachments && m.attachments.length > 0)

    threads.push({
      threadId,
      subject: latest.subject,
      messages: msgs,
      latestDate: latest.date,
      hasUnread,
      hasAttachments,
      senders,
    })
  }

  // Sort threads by newest message first
  threads.sort((a, b) => b.latestDate - a.latestDate)
  return threads
}
