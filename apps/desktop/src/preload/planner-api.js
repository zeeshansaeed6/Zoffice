import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZPlanner.
 */
export const plannerBridge = {
  getBoards: () => ipcRenderer.invoke('planner:getBoards'),
  getBoard: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('planner:getBoard', id)
  },
  saveBoard: (board) => {
    if (!board || typeof board !== 'object' || typeof board.id !== 'string') {
      return Promise.reject(new TypeError('board must have string id'))
    }
    return ipcRenderer.invoke('planner:saveBoard', board)
  },
  deleteBoard: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('planner:deleteBoard', id)
  },
}
