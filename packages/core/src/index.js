export {
  t,
  setLocale,
  getLocale,
  registerLocale,
  SUPPORTED_LOCALES,
  RTL_LOCALES,
  isRtlLocale,
  subscribeLocale,
} from './i18n/i18n.js'
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
export {
  createPluginEngine,
  getSharedPluginEngine,
  createSandboxedApi,
  executeInSandbox,
  validatePluginManifest,
  PLUGIN_PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
} from './plugins/index.js'
export {
  TEMPLATES,
  CATEGORIES,
  getTemplates,
  getTemplateById,
  getFeaturedTemplates,
  getCategoriesWithCounts,
} from './templates/index.js'
export {
  AI_PROVIDERS,
  PROVIDER_OPTIONS,
  DEFAULT_AI_CONFIG,
  REWRITE_TONES,
  TRANSLATE_LANGUAGES,
  sendAiPrompt,
  loadAiConfig,
  saveAiConfig,
  rewriteText,
  summarizeText,
  translateText,
  generateFormulaHelp,
  generateSlideOutline,
} from './ai/index.js'

