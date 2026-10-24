/**
 * ZDrive Data Models — factory functions for files, folders, and version history.
 * @module drive-model
 */

import { FILE_KINDS, EXTENSION_MAP } from './constants.js'

/**
 * Generate unique entity ID.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Infer document kind from filename extension.
 * @param {string} filename
 * @returns {string}
 */
export function inferKindFromFilename(filename = '') {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return EXTENSION_MAP[ext] || FILE_KINDS.OTHER
}

/**
 * Format bytes into human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes = 0) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * @typedef {Object} FileVersion
 * @property {string} id
 * @property {string} fileId
 * @property {number} versionNumber
 * @property {number} size
 * @property {string} comment
 * @property {string} [content]
 * @property {number} createdAt
 */

/**
 * Create a new file version record.
 * @param {string} fileId
 * @param {Partial<FileVersion>} [overrides={}]
 * @returns {FileVersion}
 */
export function createFileVersion(fileId, overrides = {}) {
  const now = Date.now()
  return {
    id: overrides.id || generateId('ver'),
    fileId,
    versionNumber: overrides.versionNumber || 1,
    size: overrides.size || 1024,
    comment: overrides.comment || 'Saved version',
    content: overrides.content || '',
    createdAt: overrides.createdAt || now,
  }
}

/**
 * @typedef {Object} DriveItem
 * @property {string} id
 * @property {string} name
 * @property {string} kind - One of FILE_KINDS
 * @property {string|null} parentId - Folder ID or null for root
 * @property {number} size - File size in bytes (0 for folder)
 * @property {boolean} starred
 * @property {boolean} trashed
 * @property {string} colorTag
 * @property {FileVersion[]} versions
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a drive file or folder item.
 * @param {string} name
 * @param {string} [kind=FILE_KINDS.WRITER]
 * @param {string|null} [parentId=null]
 * @param {Partial<DriveItem>} [overrides={}]
 * @returns {DriveItem}
 */
export function createDriveItem(
  name = 'New Item',
  kind = FILE_KINDS.WRITER,
  parentId = null,
  overrides = {},
) {
  const now = Date.now()
  const itemId = overrides.id || generateId(kind === FILE_KINDS.FOLDER ? 'fld' : 'fil')

  const initialVersion =
    kind !== FILE_KINDS.FOLDER
      ? [
          createFileVersion(itemId, {
            versionNumber: 1,
            size: overrides.size || 2048,
            comment: 'Initial upload',
          }),
        ]
      : []

  return {
    id: itemId,
    name: overrides.name || name,
    kind: overrides.kind || kind,
    parentId: overrides.parentId ?? parentId,
    size: kind === FILE_KINDS.FOLDER ? 0 : overrides.size || 2048,
    starred: overrides.starred || false,
    trashed: overrides.trashed || false,
    colorTag: overrides.colorTag || 'none',
    versions: overrides.versions || initialVersion,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}

/**
 * Create a starter drive catalog with sample folder and documents.
 * @returns {DriveItem[]}
 */
export function createStarterDrive() {
  const fldDocs = createDriveItem('Documents', FILE_KINDS.FOLDER, null, {
    id: 'fld-docs',
    colorTag: 'blue',
  })
  const fldProjects = createDriveItem('Projects', FILE_KINDS.FOLDER, null, {
    id: 'fld-projects',
    colorTag: 'purple',
  })

  const doc1 = createDriveItem('Quarterly Report.docx', FILE_KINDS.WRITER, fldDocs.id, {
    size: 24576,
    starred: true,
    colorTag: 'green',
  })
  const sheet1 = createDriveItem('Budget Forecast 2026.xlsx', FILE_KINDS.SHEETS, fldDocs.id, {
    size: 48120,
    starred: true,
  })
  const slide1 = createDriveItem('Product Roadmap.pptx', FILE_KINDS.SLIDES, fldProjects.id, {
    size: 154200,
  })
  const note1 = createDriveItem('Engineering Standup.znotes', FILE_KINDS.NOTES, fldProjects.id, {
    size: 8400,
  })
  const base1 = createDriveItem('Inventory Catalog.zbase', FILE_KINDS.BASE, null, {
    size: 64200,
    starred: true,
  })
  const draw1 = createDriveItem('Architecture Diagram.zdraw', FILE_KINDS.DRAW, null, {
    size: 18900,
    colorTag: 'orange',
  })

  return [fldDocs, fldProjects, doc1, sheet1, slide1, note1, base1, draw1]
}
