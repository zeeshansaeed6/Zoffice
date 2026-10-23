import { dialog } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { basename, extname } from 'path'
import { addRecentFile } from './recent-files.js'

const ALLOWED_EXTENSIONS = new Set([
  'docx',
  'xlsx',
  'pptx',
  'odt',
  'ods',
  'txt',
  'md',
  'csv',
  'html',
  'rtf',
])

/**
 * Validates whether the given path has an allowed extension.
 * @param {string} filePath
 * @returns {boolean}
 */
export function isValidExtension(filePath) {
  if (typeof filePath !== 'string') return false
  const ext = extname(filePath).replace('.', '').toLowerCase()
  return ALLOWED_EXTENSIONS.has(ext)
}

/**
 * File filter configurations for open/save dialogs.
 */
const FILE_FILTERS = [
  {
    name: 'All Supported Office Files',
    extensions: Array.from(ALLOWED_EXTENSIONS),
  },
  {
    name: 'Word Documents (*.docx, *.odt, *.rtf, *.txt)',
    extensions: ['docx', 'odt', 'rtf', 'txt', 'md'],
  },
  { name: 'Spreadsheets (*.xlsx, *.ods, *.csv)', extensions: ['xlsx', 'ods', 'csv'] },
  { name: 'Presentations (*.pptx)', extensions: ['pptx'] },
]

/**
 * Show native open file dialog and return file metadata and content.
 * @param {Electron.BrowserWindow} win
 * @returns {Promise<{ cancelled: boolean, filePath?: string, content?: string, title?: string, appId?: string }>}
 */
export async function showOpenDialog(win) {
  const result = await dialog.showOpenDialog(win, {
    title: 'Open Document',
    filters: FILE_FILTERS,
    properties: ['openFile'],
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { cancelled: true }
  }

  const filePath = result.filePaths[0]
  if (!isValidExtension(filePath)) {
    throw new Error('Unsupported file extension')
  }

  const content = readFileSync(filePath, 'utf-8')
  const title = basename(filePath)
  const ext = extname(filePath).replace('.', '').toLowerCase()

  let appId = 'writer'
  if (['xlsx', 'ods', 'csv'].includes(ext)) appId = 'sheets'
  if (['pptx'].includes(ext)) appId = 'slides'

  addRecentFile({ filePath, title, appId })

  return { cancelled: false, filePath, content, title, appId }
}

/**
 * Save content to an existing file path.
 * @param {string} filePath
 * @param {string} content
 * @returns {{ success: boolean }}
 */
export function saveToFile(filePath, content) {
  if (!isValidExtension(filePath)) {
    throw new Error('Unsupported file extension for save')
  }
  writeFileSync(filePath, content, 'utf-8')
  return { success: true }
}

/**
 * Show native Save As dialog and save content.
 * @param {Electron.BrowserWindow} win
 * @param {string} defaultName
 * @param {string} content
 * @param {string} [defaultExtension='docx']
 * @returns {Promise<{ cancelled: boolean, filePath?: string }>}
 */
export async function showSaveAsDialog(win, defaultName, content, defaultExtension = 'docx') {
  const result = await dialog.showSaveDialog(win, {
    title: 'Save As',
    defaultPath: defaultName || `Untitled.${defaultExtension}`,
    filters: FILE_FILTERS,
  })

  if (result.canceled || !result.filePath) {
    return { cancelled: true }
  }

  const filePath = result.filePath
  if (!isValidExtension(filePath)) {
    throw new Error('Unsupported file extension for save')
  }

  writeFileSync(filePath, content, 'utf-8')

  const title = basename(filePath)
  const ext = extname(filePath).replace('.', '').toLowerCase()
  let appId = 'writer'
  if (['xlsx', 'ods', 'csv'].includes(ext)) appId = 'sheets'
  if (['pptx'].includes(ext)) appId = 'slides'

  addRecentFile({ filePath, title, appId })

  return { cancelled: false, filePath }
}
