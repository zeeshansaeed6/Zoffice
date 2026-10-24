import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZMail.
 */
export const mailBridge = {
  getAccounts: () => ipcRenderer.invoke('mail:getAccounts'),
  saveAccount: (acc, password = '') => {
    if (!acc || typeof acc !== 'object' || typeof acc.id !== 'string') {
      return Promise.reject(new TypeError('acc must have string id'))
    }
    return ipcRenderer.invoke('mail:saveAccount', acc, String(password))
  },
  deleteAccount: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('mail:deleteAccount', id)
  },
  getMessages: (accId, fldId) => ipcRenderer.invoke('mail:getMessages', accId, fldId),
  saveMessage: (msg) => {
    if (!msg || typeof msg !== 'object' || typeof msg.id !== 'string') {
      return Promise.reject(new TypeError('msg must have string id'))
    }
    return ipcRenderer.invoke('mail:saveMessage', msg)
  },
  deleteMessage: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('mail:deleteMessage', id)
  },
  markRead: (id, unread) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('mail:markRead', id, Boolean(unread))
  },
  setFlag: (id, flagged) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('mail:setFlag', id, Boolean(flagged))
  },
}

/**
 * Validated preload bridge for ZCalendar.
 */
export const calendarBridge = {
  getEvents: () => ipcRenderer.invoke('calendar:getEvents'),
  saveEvent: (ev) => {
    if (!ev || typeof ev !== 'object' || typeof ev.id !== 'string') {
      return Promise.reject(new TypeError('ev must have string id'))
    }
    return ipcRenderer.invoke('calendar:saveEvent', ev)
  },
  deleteEvent: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('calendar:deleteEvent', id)
  },
}

/**
 * Validated preload bridge for ZMail Contacts.
 */
export const contactsBridge = {
  getContacts: () => ipcRenderer.invoke('contacts:getContacts'),
  saveContact: (c) => {
    if (!c || typeof c !== 'object' || typeof c.id !== 'string') {
      return Promise.reject(new TypeError('c must have string id'))
    }
    return ipcRenderer.invoke('contacts:saveContact', c)
  },
  deleteContact: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('contacts:deleteContact', id)
  },
}
