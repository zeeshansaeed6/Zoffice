import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZNotes.
 */
export const notesBridge = {
  listNotebooks: () => ipcRenderer.invoke('notes:listNotebooks'),
  saveNotebook: (nb) => {
    if (!nb || typeof nb !== 'object' || typeof nb.id !== 'string') {
      return Promise.reject(new TypeError('nb must have string id'))
    }
    return ipcRenderer.invoke('notes:saveNotebook', nb)
  },
  deleteNotebook: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('notes:deleteNotebook', id)
  },
  listSections: (nbId) => {
    if (typeof nbId !== 'string') return Promise.reject(new TypeError('nbId must be string'))
    return ipcRenderer.invoke('notes:listSections', nbId)
  },
  saveSection: (sec) => {
    if (!sec || typeof sec !== 'object' || typeof sec.id !== 'string') {
      return Promise.reject(new TypeError('sec must have string id'))
    }
    return ipcRenderer.invoke('notes:saveSection', sec)
  },
  deleteSection: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('notes:deleteSection', id)
  },
  listPages: (secId) => {
    if (typeof secId !== 'string') return Promise.reject(new TypeError('secId must be string'))
    return ipcRenderer.invoke('notes:listPages', secId)
  },
  savePage: (pg) => {
    if (!pg || typeof pg !== 'object' || typeof pg.id !== 'string') {
      return Promise.reject(new TypeError('pg must have string id'))
    }
    return ipcRenderer.invoke('notes:savePage', pg)
  },
  deletePage: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('notes:deletePage', id)
  },
  listBlocks: (pageId) => {
    if (typeof pageId !== 'string') return Promise.reject(new TypeError('pageId must be string'))
    return ipcRenderer.invoke('notes:listBlocks', pageId)
  },
  saveBlock: (b) => {
    if (!b || typeof b !== 'object' || typeof b.id !== 'string') {
      return Promise.reject(new TypeError('b must have string id'))
    }
    return ipcRenderer.invoke('notes:saveBlock', b)
  },
  deleteBlock: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('notes:deleteBlock', id)
  },
}
