import { dialog } from 'electron'
import { writeFile } from 'fs/promises'

/**
 * Renders the current window to PDF (print stylesheet applies) and saves it.
 * @param {Electron.BrowserWindow} win
 * @param {string} defaultName - Suggested file name without extension
 * @returns {Promise<{ cancelled: boolean, filePath?: string }>}
 */
export async function exportWindowToPdf(win, defaultName) {
  const safeName = defaultName.replace(/[\\/:*?"<>|]/g, '_').trim() || 'Document'
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    defaultPath: `${safeName}.pdf`,
    filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
  })
  if (canceled || !filePath) return { cancelled: true }
  const finalPath = filePath.toLowerCase().endsWith('.pdf') ? filePath : `${filePath}.pdf`
  const pdf = await win.webContents.printToPDF({ printBackground: true })
  await writeFile(finalPath, pdf)
  return { cancelled: false, filePath: finalPath }
}
