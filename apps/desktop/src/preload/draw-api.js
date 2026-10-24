import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZDraw diagrams.
 */
export const drawBridge = {
  getDiagrams: () => ipcRenderer.invoke('draw:getDiagrams'),
  getDiagram: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('draw:getDiagram', id)
  },
  saveDiagram: (diagram) => {
    if (!diagram || typeof diagram !== 'object' || typeof diagram.id !== 'string') {
      return Promise.reject(new TypeError('diagram must have string id'))
    }
    return ipcRenderer.invoke('draw:saveDiagram', diagram)
  },
  deleteDiagram: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('draw:deleteDiagram', id)
  },
}
