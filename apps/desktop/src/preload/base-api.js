import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZBase databases.
 */
export const baseBridge = {
  getBases: () => ipcRenderer.invoke('base:getBases'),
  getBase: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('base:getBase', id)
  },
  saveBase: (base) => {
    if (!base || typeof base !== 'object' || typeof base.id !== 'string') {
      return Promise.reject(new TypeError('base must have string id'))
    }
    return ipcRenderer.invoke('base:saveBase', base)
  },
  deleteBase: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('base:deleteBase', id)
  },
}
