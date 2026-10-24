/**
 * ZMail Search Engine — filters and searches across all mail messages.
 * @module mail-search
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [query='']
 * @property {string} [folderId]
 * @property {string} [accountId]
 * @property {boolean} [unreadOnly=false]
 * @property {boolean} [flaggedOnly=false]
 * @property {boolean} [hasAttachments=false]
 */

/**
 * Filter and search messages based on query and attributes.
 * @param {import('./mail-model.js').Message[]} messages
 * @param {SearchFilters} filters
 * @returns {import('./mail-model.js').Message[]}
 */
export function searchMessages(messages = [], filters = {}) {
  if (!Array.isArray(messages)) return []

  const query = (filters.query || '').trim().toLowerCase()
  const { folderId, accountId, unreadOnly, flaggedOnly, hasAttachments } = filters

  return messages.filter((msg) => {
    // Account match
    if (accountId && msg.accountId !== accountId) return false

    // Folder match
    if (folderId && msg.folderId !== folderId) return false

    // Flags & unread
    if (unreadOnly && !msg.unread) return false
    if (flaggedOnly && !msg.flagged) return false
    if (hasAttachments && (!msg.attachments || msg.attachments.length === 0)) return false

    // Text search query
    if (!query) return true

    if (msg.subject && msg.subject.toLowerCase().includes(query)) return true
    if (msg.from && msg.from.toLowerCase().includes(query)) return true
    if (Array.isArray(msg.to) && msg.to.some((t) => t.toLowerCase().includes(query))) return true
    if (Array.isArray(msg.cc) && msg.cc.some((c) => c.toLowerCase().includes(query))) return true
    if (msg.bodyText && msg.bodyText.toLowerCase().includes(query)) return true
    if (msg.bodyHtml && msg.bodyHtml.toLowerCase().includes(query)) return true
    if (Array.isArray(msg.labels) && msg.labels.some((l) => l.toLowerCase().includes(query)))
      return true
    if (
      Array.isArray(msg.attachments) &&
      msg.attachments.some((a) => a.filename.toLowerCase().includes(query))
    ) {
      return true
    }

    return false
  })
}
