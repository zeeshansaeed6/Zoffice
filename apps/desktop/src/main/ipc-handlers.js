import { ipcMain, app, dialog } from 'electron'
import { showOpenDialog, saveToFile, showSaveAsDialog, isValidExtension } from './file-service.js'
import { getRecentFiles, addRecentFile, clearRecentFiles } from './recent-files.js'
import { getSetting, setSetting } from './settings.js'
import { saveAutosaveDocument, listAutosaveDocuments, removeAutosaveDocument } from './autosave.js'

/**
 * Registers all validated IPC handlers for main process.
 * @param {Electron.BrowserWindow} win
 */
export function registerIpcHandlers(win) {
  // File operations
  ipcMain.handle('file:open', async () => {
    return showOpenDialog(win)
  })

  ipcMain.handle('file:save', async (_event, filePath, content) => {
    if (typeof filePath !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid arguments for file:save')
    }
    if (!isValidExtension(filePath)) {
      throw new Error('Unsupported file extension')
    }
    return saveToFile(filePath, content)
  })

  ipcMain.handle('file:saveAs', async (_event, defaultName, content, defaultExt) => {
    if (typeof defaultName !== 'string' || typeof content !== 'string') {
      throw new Error('Invalid arguments for file:saveAs')
    }
    const safeExt = typeof defaultExt === 'string' ? defaultExt : 'docx'
    return showSaveAsDialog(win, defaultName, content, safeExt)
  })

  // Recent files
  ipcMain.handle('recent:list', async (_event, limit) => {
    const safeLimit = typeof limit === 'number' ? limit : 20
    return getRecentFiles(safeLimit)
  })

  ipcMain.handle('recent:add', async (_event, item) => {
    if (!item || typeof item !== 'object' || typeof item.filePath !== 'string') {
      throw new Error('Invalid item for recent:add')
    }
    addRecentFile(item)
    return true
  })

  ipcMain.handle('recent:clear', async () => {
    clearRecentFiles()
    return true
  })

  // Settings
  ipcMain.handle('settings:get', async (_event, key) => {
    if (typeof key !== 'string') {
      throw new Error('Invalid key for settings:get')
    }
    return getSetting(key)
  })

  ipcMain.handle('settings:set', async (_event, key, value) => {
    if (typeof key !== 'string') {
      throw new Error('Invalid arguments for settings:set')
    }
    return setSetting(key, value)
  })

  // Autosave & Recovery
  ipcMain.handle('autosave:save', async (_event, doc) => {
    if (!doc || typeof doc !== 'object' || typeof doc.id !== 'string') {
      throw new Error('Invalid document for autosave:save')
    }
    saveAutosaveDocument(doc)
    return true
  })

  ipcMain.handle('autosave:list', async () => {
    return listAutosaveDocuments()
  })

  ipcMain.handle('autosave:remove', async (_event, id) => {
    if (typeof id !== 'string') {
      throw new Error('Invalid ID for autosave:remove')
    }
    removeAutosaveDocument(id)
    return true
  })

  // Theme
  ipcMain.handle('theme:get', async () => {
    return getSetting('theme_mode') || 'system'
  })

  ipcMain.handle('theme:set', async (_event, mode) => {
    if (typeof mode !== 'string') throw new Error('Invalid theme mode')
    setSetting('theme_mode', mode)
    return true
  })

  // App metadata
  ipcMain.handle('app:getVersion', async () => {
    return app.getVersion()
  })

  ipcMain.handle('app:getPlatform', async () => {
    return process.platform
  })

  // Native Confirm Dialog
  ipcMain.handle('dialog:confirm', async (_event, options) => {
    if (!options || typeof options !== 'object') {
      throw new Error('Invalid options for dialog:confirm')
    }
    const result = await dialog.showMessageBox(win, {
      type: 'question',
      buttons: options.buttons || ['Cancel', 'OK'],
      defaultId: 1,
      cancelId: 0,
      title: options.title || 'Confirm',
      message: options.message || '',
      detail: options.detail || '',
    })
    return result.response
  })
}
