/**
 * Plugin manifest validator and normalizer.
 * @module plugin-manifest
 */

import { ALLOWED_PERMISSIONS } from './constants.js'

const VALID_APPS = [
  'writer',
  'sheets',
  'slides',
  'notes',
  'mail',
  'forms',
  'planner',
  'draw',
  'base',
  'drive',
  '*',
]

/**
 * Validates a plugin manifest.json object.
 *
 * @param {any} manifest
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePluginManifest(manifest) {
  const errors = []

  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, errors: ['Manifest must be a non-null JSON object.'] }
  }

  // ID validation
  if (!manifest.id || typeof manifest.id !== 'string') {
    errors.push('Plugin manifest missing required string field "id".')
  } else if (!/^[a-z0-9-_.]+$/i.test(manifest.id)) {
    errors.push('Plugin "id" must only contain alphanumeric characters, hyphens, and dots.')
  }

  // Name validation
  if (!manifest.name || typeof manifest.name !== 'string' || !manifest.name.trim()) {
    errors.push('Plugin manifest missing required non-empty string "name".')
  }

  // Version validation
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('Plugin manifest missing required string field "version".')
  }

  // Entry point validation
  if (!manifest.main || typeof manifest.main !== 'string') {
    errors.push('Plugin manifest missing required string field "main" (entry script).')
  }

  // Target apps validation
  if (manifest.targetApps && Array.isArray(manifest.targetApps)) {
    for (const app of manifest.targetApps) {
      if (!VALID_APPS.includes(app)) {
        errors.push(`Invalid targetApp "${app}". Allowed: ${VALID_APPS.join(', ')}`)
      }
    }
  }

  // Permissions validation
  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push('Manifest "permissions" must be an array of permission strings.')
    } else {
      for (const perm of manifest.permissions) {
        if (!ALLOWED_PERMISSIONS.includes(perm)) {
          errors.push(`Unknown permission requested: "${perm}".`)
        }
      }
    }
  }

  // Contributions validation
  if (manifest.contributions) {
    if (typeof manifest.contributions !== 'object') {
      errors.push('Manifest "contributions" must be an object.')
    } else {
      const { ribbonButtons, sidebarPanels, fileFormatHandlers } = manifest.contributions
      if (ribbonButtons && !Array.isArray(ribbonButtons)) {
        errors.push('"contributions.ribbonButtons" must be an array.')
      }
      if (sidebarPanels && !Array.isArray(sidebarPanels)) {
        errors.push('"contributions.sidebarPanels" must be an array.')
      }
      if (fileFormatHandlers && !Array.isArray(fileFormatHandlers)) {
        errors.push('"contributions.fileFormatHandlers" must be an array.')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
