import { app, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'

/**
 * Initializes autoUpdater and registers IPC handlers for renderer communication.
 * @param {import('electron').BrowserWindow} mainWindow
 */
export function setupAutoUpdater(mainWindow) {
  const autoUpdater = electronUpdater.autoUpdater || electronUpdater.default?.autoUpdater
  if (!autoUpdater) return

  // Respect user sovereignty: do not automatically download in background
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  const sendStatus = (payload) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('updater:status', payload)
    }
  }

  autoUpdater.on('checking-for-update', () => {
    sendStatus({ status: 'checking' })
  })

  autoUpdater.on('update-available', (info) => {
    sendStatus({
      status: 'available',
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes,
    })
  })

  autoUpdater.on('update-not-available', (info) => {
    sendStatus({
      status: 'not-available',
      version: info?.version,
    })
  })

  autoUpdater.on('error', (err) => {
    sendStatus({
      status: 'error',
      error: err?.message || 'Unknown update error',
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    sendStatus({
      status: 'downloading',
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendStatus({
      status: 'downloaded',
      version: info.version,
    })
  })

  // IPC Handlers
  ipcMain.handle('updater:check', async () => {
    if (!app.isPackaged) {
      return {
        status: 'not-available',
        version: app.getVersion(),
        devMode: true,
      }
    }
    try {
      const result = await autoUpdater.checkForUpdates()
      return { status: 'checking', updateInfo: result?.updateInfo }
    } catch (err) {
      return { status: 'error', error: err.message }
    }
  })

  ipcMain.handle('updater:download', async () => {
    if (!app.isPackaged) {
      return { success: false, reason: 'dev-mode' }
    }
    await autoUpdater.downloadUpdate()
    return { success: true }
  })

  ipcMain.handle('updater:install', async () => {
    if (!app.isPackaged) {
      return { success: false, reason: 'dev-mode' }
    }
    setImmediate(() => {
      autoUpdater.quitAndInstall(false, true)
    })
    return { success: true }
  })
}
