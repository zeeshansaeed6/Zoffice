export { t, setLocale, getLocale, registerLocale } from './i18n/i18n.js'
export { createShortcutRegistry } from './shortcuts/shortcut-registry.js'
export { createUndoRedoStack } from './undo-redo/undo-redo.js'
export {
  ALLOWED_EXTENSIONS,
  isAllowedExtension,
  openFile,
  saveFile,
  saveFileAs,
} from './file-manager.js'
export { createAutosaveController } from './autosave.js'
export { getRecoverableDocuments, clearRecoveryDocument } from './recovery.js'
export { getRecentFiles, addRecentFile, clearRecentFiles } from './recent-files.js'
export { getSetting, setSetting } from './settings.js'
