/**
 * ZMail Database Bridge — interfaces with main-process SQLite and safeStorage via IPC.
 * @module mail-bridge
 */

/**
 * Access the validated IPC bridge from preload.
 * @returns {Object}
 */
function getApi() {
  if (typeof window !== 'undefined' && window.zofficeAPI?.mail) {
    return window.zofficeAPI.mail
  }
  return {
    getAccounts: async () => [],
    saveAccount: async () => true,
    deleteAccount: async () => true,
    getFolders: async () => [],
    getMessages: async () => [],
    saveMessage: async () => true,
    deleteMessage: async () => true,
    markRead: async () => true,
    setFlag: async () => true,
  }
}

/** @returns {Promise<Array<any>>} */
export async function fetchAccounts() {
  return getApi().getAccounts()
}

/**
 * @param {Object} account
 * @param {string} [password]
 * @returns {Promise<boolean>}
 */
export async function persistAccount(account, password = '') {
  return getApi().saveAccount(account, password)
}

/**
 * @param {string} accountId
 * @returns {Promise<boolean>}
 */
export async function removeAccount(accountId) {
  return getApi().deleteAccount(accountId)
}

/**
 * @param {string} accountId
 * @returns {Promise<Array<any>>}
 */
export async function fetchFolders(accountId) {
  return getApi().getFolders(accountId)
}

/**
 * @param {string} [accountId]
 * @param {string} [folderId]
 * @returns {Promise<Array<any>>}
 */
export async function fetchMessages(accountId, folderId) {
  return getApi().getMessages(accountId, folderId)
}

/**
 * @param {Object} message
 * @returns {Promise<boolean>}
 */
export async function persistMessage(message) {
  return getApi().saveMessage(message)
}

/**
 * @param {string} messageId
 * @returns {Promise<boolean>}
 */
export async function removeMessage(messageId) {
  return getApi().deleteMessage(messageId)
}

/**
 * @param {string} messageId
 * @param {boolean} unread
 * @returns {Promise<boolean>}
 */
export async function updateMessageRead(messageId, unread) {
  return getApi().markRead(messageId, unread)
}

/**
 * @param {string} messageId
 * @param {boolean} flagged
 * @returns {Promise<boolean>}
 */
export async function updateMessageFlag(messageId, flagged) {
  return getApi().setFlag(messageId, flagged)
}
