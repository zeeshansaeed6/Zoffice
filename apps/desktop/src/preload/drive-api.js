import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZDrive items.
 */
export const driveBridge = {
  getItems: () => ipcRenderer.invoke('drive:getItems'),
  getItem: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('drive:getItem', id)
  },
  saveItems: (items) => {
    if (!Array.isArray(items)) {
      return Promise.reject(new TypeError('items must be an array'))
    }
    return ipcRenderer.invoke('drive:saveItems', items)
  },
  deleteItem: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('drive:deleteItem', id)
  },
}
