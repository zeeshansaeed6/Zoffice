/**
 * Plugin Sandbox — isolated execution container with strict permission gating.
 * @module plugin-sandbox
 */

import { PLUGIN_PERMISSIONS } from './constants.js'

/**
 * Creates a sandboxed API instance tailored to a plugin's granted permissions.
 *
 * @param {string} pluginId
 * @param {string[]} grantedPermissions
 * @param {Object} hostContext - Host application callbacks & document references
 * @returns {any}
 */
export function createSandboxedApi(pluginId, grantedPermissions, hostContext = {}) {
  const hasPerm = (perm) => grantedPermissions.includes(perm)

  // Local plugin storage sandbox
  const storageMap = new Map()

  const api = {
    pluginId,

    document: {
      getContent: () => {
        if (!hasPerm(PLUGIN_PERMISSIONS.DOC_READ)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.DOC_READ}" required to read document content.`)
        }
        return hostContext.getContent ? hostContext.getContent() : ''
      },

      setContent: (newContent) => {
        if (!hasPerm(PLUGIN_PERMISSIONS.DOC_WRITE)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.DOC_WRITE}" required to modify document content.`)
        }
        if (hostContext.setContent) {
          hostContext.setContent(newContent)
        }
      },

      getSelectedText: () => {
        if (!hasPerm(PLUGIN_PERMISSIONS.DOC_READ)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.DOC_READ}" required to read selection.`)
        }
        return hostContext.getSelectedText ? hostContext.getSelectedText() : ''
      },
    },

    storage: {
      get: (key) => {
        if (!hasPerm(PLUGIN_PERMISSIONS.STORAGE)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.STORAGE}" required to access plugin storage.`)
        }
        return storageMap.get(key)
      },

      set: (key, value) => {
        if (!hasPerm(PLUGIN_PERMISSIONS.STORAGE)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.STORAGE}" required to access plugin storage.`)
        }
        storageMap.set(key, value)
      },

      remove: (key) => {
        if (!hasPerm(PLUGIN_PERMISSIONS.STORAGE)) {
          throw new Error(`Permission denied: "${PLUGIN_PERMISSIONS.STORAGE}" required to access plugin storage.`)
        }
        storageMap.delete(key)
      },
    },

    ui: {
      showToast: (msg) => {
        if (hostContext.showToast) {
          hostContext.showToast(msg)
        }
      },
    },
  }

  return Object.freeze(api)
}

/**
 * Executes plugin code inside a sandboxed scope.
 *
 * @param {string} code
 * @param {any} sandboxedApi
 * @returns {any} Plugin exported activation object / hooks
 */
export function executeInSandbox(code, sandboxedApi) {
  // Pass only sandboxed API and safe math/string utilities; shadow globals
  const sandboxFn = new Function(
    'zoffice',
    'window',
    'document',
    'globalThis',
    'process',
    `
    "use strict";
    const module = { exports: {} };
    const exports = module.exports;
    (function(api) {
      ${code}
    })(zoffice);
    return module.exports;
    `,
  )

  return sandboxFn(sandboxedApi, undefined, undefined, undefined, undefined)
}
