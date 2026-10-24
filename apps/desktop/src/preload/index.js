import { contextBridge, ipcRenderer } from 'electron'
import { notesBridge } from './notes-api.js'
import { mailBridge, calendarBridge, contactsBridge } from './mail-api.js'
import { formsBridge } from './forms-api.js'
import { plannerBridge } from './planner-api.js'

/**
 * Validated Electron IPC Bridge.
 * Strictly checks types and parameters before sending over IPC channels.
 */
const zofficeAPI = {
  file: {
    /**
     * @returns {Promise<{ cancelled: boolean, filePath?: string, content?: string, title?: string, appId?: string }>}
     */
    open: () => ipcRenderer.invoke('file:open'),

    /**
     * @param {string} filePath
     * @param {string} content
     * @returns {Promise<{ success: boolean }>}
     */
    save: (filePath, content) => {
      if (typeof filePath !== 'string' || typeof content !== 'string') {
        return Promise.reject(new TypeError('filePath and content must be strings'))
      }
      return ipcRenderer.invoke('file:save', filePath, content)
    },

    /**
     * @param {string} defaultName
     * @param {string} content
     * @param {string} [defaultExt='docx']
     * @returns {Promise<{ cancelled: boolean, filePath?: string }>}
     */
    saveAs: (defaultName, content, defaultExt = 'docx') => {
      if (typeof defaultName !== 'string' || typeof content !== 'string') {
        return Promise.reject(new TypeError('defaultName and content must be strings'))
      }
      return ipcRenderer.invoke('file:saveAs', defaultName, content, String(defaultExt))
    },
  },

  recent: {
    /**
     * @param {number} [limit=20]
     * @returns {Promise<Array<any>>}
     */
    list: (limit = 20) => {
      return ipcRenderer.invoke('recent:list', Number(limit) || 20)
    },

    /**
     * @param {Object} item
     * @param {string} item.filePath
     * @param {string} item.title
     * @param {string} item.appId
     * @returns {Promise<boolean>}
     */
    add: (item) => {
      if (!item || typeof item.filePath !== 'string') {
        return Promise.reject(new TypeError('item must contain a string filePath'))
      }
      return ipcRenderer.invoke('recent:add', {
        filePath: String(item.filePath),
        title: String(item.title || 'Untitled'),
        appId: String(item.appId || 'writer'),
      })
    },

    clear: () => ipcRenderer.invoke('recent:clear'),
  },

  settings: {
    /**
     * @param {string} key
     * @returns {Promise<any>}
     */
    get: (key) => {
      if (typeof key !== 'string') {
        return Promise.reject(new TypeError('key must be a string'))
      }
      return ipcRenderer.invoke('settings:get', key)
    },

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<boolean>}
     */
    set: (key, value) => {
      if (typeof key !== 'string') {
        return Promise.reject(new TypeError('key must be a string'))
      }
      return ipcRenderer.invoke('settings:set', key, value)
    },
  },

  autosave: {
    /**
     * @param {Object} doc
     * @returns {Promise<boolean>}
     */
    save: (doc) => {
      if (!doc || typeof doc.id !== 'string') {
        return Promise.reject(new TypeError('doc.id must be a string'))
      }
      return ipcRenderer.invoke('autosave:save', doc)
    },

    /**
     * @returns {Promise<Array<any>>}
     */
    list: () => ipcRenderer.invoke('autosave:list'),

    /**
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    remove: (id) => {
      if (typeof id !== 'string') {
        return Promise.reject(new TypeError('id must be a string'))
      }
      return ipcRenderer.invoke('autosave:remove', id)
    },
  },

  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (mode) => {
      if (typeof mode !== 'string') {
        return Promise.reject(new TypeError('theme mode must be a string'))
      }
      return ipcRenderer.invoke('theme:set', mode)
    },
  },

  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  },

  dialog: {
    /**
     * @param {Object} options
     * @returns {Promise<number>}
     */
    confirm: (options) => {
      if (!options || typeof options !== 'object') {
        return Promise.reject(new TypeError('options must be an object'))
      }
      return ipcRenderer.invoke('dialog:confirm', options)
    },
  },

  notes: notesBridge,
  mail: mailBridge,
  calendar: calendarBridge,
  contacts: contactsBridge,
  forms: formsBridge,
  planner: plannerBridge,

  /**
   * Subscribe to native menu actions and keyboard shortcuts.
   * @param {(action: string) => void} callback
   * @returns {() => void} unsubscribe function
   */
  onMenuAction: (callback) => {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function')
    }
    const handler = (_event, action) => callback(action)
    ipcRenderer.on('menu:action', handler)
    return () => {
      ipcRenderer.removeListener('menu:action', handler)
    }
  },
}

contextBridge.exposeInMainWorld('zofficeAPI', zofficeAPI)
contextBridge.exposeInMainWorld('api', zofficeAPI)
