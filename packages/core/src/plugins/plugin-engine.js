/**
 * Plugin Engine — registry, lifecycle, and contribution aggregation.
 * @module plugin-engine
 */

import { validatePluginManifest } from './plugin-manifest.js'
import { createSandboxedApi, executeInSandbox } from './plugin-sandbox.js'
import { PLUGIN_PERMISSIONS } from './constants.js'

/**
 * Creates an instance of the Zoffice Plugin Engine.
 */
export function createPluginEngine() {
  /** @type {Map<string, { manifest: any, code: string, enabled: boolean, permissions: string[], instance: any }>} */
  const plugins = new Map()

  /**
   * Registers a new plugin with manifest, source code, and granted permissions.
   *
   * @param {any} manifest
   * @param {string} code
   * @param {string[]} [initialPermissions=[]]
   * @returns {{ success: boolean, errors?: string[] }}
   */
  function registerPlugin(manifest, code, initialPermissions = []) {
    const val = validatePluginManifest(manifest)
    if (!val.valid) {
      return { success: false, errors: val.errors }
    }

    // Default granted permissions are those requested and explicitly approved
    const approved = initialPermissions.filter((p) => manifest.permissions?.includes(p))

    plugins.set(manifest.id, {
      manifest,
      code,
      enabled: true,
      permissions: approved,
      instance: null,
    })

    return { success: true }
  }

  function enablePlugin(id) {
    const p = plugins.get(id)
    if (p) p.enabled = true
  }

  function disablePlugin(id) {
    const p = plugins.get(id)
    if (p) {
      p.enabled = false
      p.instance = null
    }
  }

  function uninstallPlugin(id) {
    return plugins.delete(id)
  }

  function updatePermissions(id, permissions) {
    const p = plugins.get(id)
    if (!p) return false
    const valid = permissions.filter((perm) => p.manifest.permissions?.includes(perm))
    p.permissions = valid
    p.instance = null // re-instantiate on next invocation
    return true
  }

  function getPlugins() {
    return Array.from(plugins.values()).map((p) => ({
      id: p.manifest.id,
      name: p.manifest.name,
      version: p.manifest.version,
      description: p.manifest.description || '',
      author: p.manifest.author || '',
      targetApps: p.manifest.targetApps || ['*'],
      permissions: p.manifest.permissions || [],
      grantedPermissions: p.permissions,
      enabled: p.enabled,
    }))
  }

  function getPlugin(id) {
    const p = plugins.get(id)
    if (!p) return null
    return {
      ...p.manifest,
      grantedPermissions: p.permissions,
      enabled: p.enabled,
    }
  }

  /**
   * Instantiates or retrieves the cached execution context of a plugin.
   * @param {string} id
   * @param {Object} hostContext
   */
  function getOrInitInstance(id, hostContext = {}) {
    const p = plugins.get(id)
    if (!p || !p.enabled) return null
    if (!p.instance) {
      const api = createSandboxedApi(id, p.permissions, hostContext)
      p.instance = executeInSandbox(p.code, api)
    }
    return p.instance
  }

  /**
   * Collects contributed ribbon buttons for a given application ID.
   * @param {string} appId
   * @param {Object} hostContext
   */
  function getRibbonButtons(appId, hostContext = {}) {
    const buttons = []
    for (const [id, p] of plugins.entries()) {
      if (!p.enabled) continue
      if (!p.permissions.includes(PLUGIN_PERMISSIONS.UI_RIBBON)) continue

      const targets = p.manifest.targetApps || ['*']
      if (!targets.includes('*') && !targets.includes(appId)) continue

      const contributed = p.manifest.contributions?.ribbonButtons || []
      for (const btn of contributed) {
        buttons.push({
          id: `${id}-${btn.id}`,
          pluginId: id,
          label: btn.label,
          iconName: btn.icon,
          tabId: btn.tabId || 'home',
          groupId: btn.groupId || 'plugins',
          run: () => {
            const instance = getOrInitInstance(id, hostContext)
            if (instance && typeof instance[btn.action] === 'function') {
              return instance[btn.action](hostContext)
            }
          },
        })
      }
    }
    return buttons
  }

  /**
   * Collects contributed sidebar panels for a given application ID.
   * @param {string} appId
   * @param {Object} hostContext
   */
  function getSidebarPanels(appId, hostContext = {}) {
    const panels = []
    for (const [id, p] of plugins.entries()) {
      if (!p.enabled) continue
      if (!p.permissions.includes(PLUGIN_PERMISSIONS.UI_SIDEBAR)) continue

      const targets = p.manifest.targetApps || ['*']
      if (!targets.includes('*') && !targets.includes(appId)) continue

      const contributed = p.manifest.contributions?.sidebarPanels || []
      for (const panel of contributed) {
        panels.push({
          id: `${id}-${panel.id}`,
          pluginId: id,
          title: panel.title,
          iconName: panel.icon,
          render: () => {
            const instance = getOrInitInstance(id, hostContext)
            if (instance && typeof instance[panel.render] === 'function') {
              return instance[panel.render](hostContext)
            }
            return null
          },
        })
      }
    }
    return panels
  }

  /**
   * Collects contributed file format handlers.
   */
  function getFileFormatHandlers() {
    const handlers = []
    for (const [id, p] of plugins.entries()) {
      if (!p.enabled) continue
      if (!p.permissions.includes(PLUGIN_PERMISSIONS.FILE_HANDLER)) continue

      const contributed = p.manifest.contributions?.fileFormatHandlers || []
      for (const h of contributed) {
        handlers.push({
          pluginId: id,
          extension: h.extension,
          mimeType: h.mimeType,
          handler: h.handler,
        })
      }
    }
    return handlers
  }

  return {
    registerPlugin,
    enablePlugin,
    disablePlugin,
    uninstallPlugin,
    updatePermissions,
    getPlugins,
    getPlugin,
    getRibbonButtons,
    getSidebarPanels,
    getFileFormatHandlers,
    getOrInitInstance,
  }
}

let sharedPluginEngine = null

/**
 * Returns the singleton PluginEngine instance, pre-registering bundled reference plugins.
 * @returns {ReturnType<typeof createPluginEngine>}
 */
export function getSharedPluginEngine() {
  if (!sharedPluginEngine) {
    sharedPluginEngine = createPluginEngine()
    sharedPluginEngine.registerPlugin(
      {
        id: 'zoffice-word-counter',
        name: 'Word Frequency Counter',
        version: '1.0.0',
        description:
          'Analyzes word frequency, vocabulary diversity, and reading time in ZWriter documents.',
        author: 'Zoffice Community',
        targetApps: ['writer'],
        main: 'index.js',
        permissions: ['active-document:read', 'ui:ribbon', 'ui:sidebar'],
      },
      'module.exports = { openStats() {}, renderSidebar() {} }',
      ['active-document:read', 'ui:ribbon', 'ui:sidebar'],
    )
    sharedPluginEngine.registerPlugin(
      {
        id: 'zoffice-csv-cleaner',
        name: 'CSV Data Cleaner',
        version: '1.0.0',
        description:
          'Cleans, trims whitespace, normalizes delimiters, and removes duplicates from CSV datasets in ZSheets.',
        author: 'Zoffice Community',
        targetApps: ['sheets'],
        main: 'index.js',
        permissions: [
          'active-document:read',
          'active-document:write',
          'ui:ribbon',
          'file-format:handler',
        ],
      },
      'module.exports = { cleanCsvData() {}, cleanAndParseCsv() {} }',
      ['active-document:read', 'active-document:write', 'ui:ribbon', 'file-format:handler'],
    )
  }
  return sharedPluginEngine
}
