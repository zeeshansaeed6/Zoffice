/**
 * ZDrive Storage and Quota Analytics Engine.
 * @module storage-calculator
 */

import { FILE_KINDS } from './constants.js'
import { formatFileSize } from './drive-model.js'

/**
 * @typedef {Object} KindStorageStat
 * @property {string} kind
 * @property {number} bytes
 * @property {number} count
 * @property {string} formattedSize
 * @property {number} percentage
 */

/**
 * @typedef {Object} StorageSummary
 * @property {number} totalBytes
 * @property {string} formattedTotal
 * @property {number} totalFiles
 * @property {number} totalFolders
 * @property {KindStorageStat[]} breakdown
 */

/**
 * Compute storage distribution across drive items.
 *
 * @param {import('./drive-model.js').DriveItem[]} items
 * @returns {StorageSummary}
 */
export function calculateStorageStats(items = []) {
  let totalBytes = 0
  let totalFiles = 0
  let totalFolders = 0

  const kindBytesMap = new Map()
  const kindCountMap = new Map()

  // Initialize all known kinds
  Object.values(FILE_KINDS).forEach((k) => {
    if (k !== FILE_KINDS.FOLDER) {
      kindBytesMap.set(k, 0)
      kindCountMap.set(k, 0)
    }
  })

  for (const item of items) {
    if (item.trashed) continue

    if (item.kind === FILE_KINDS.FOLDER) {
      totalFolders++
    } else {
      totalFiles++
      const size = item.size || 0
      totalBytes += size

      const currentBytes = kindBytesMap.get(item.kind) || 0
      const currentCount = kindCountMap.get(item.kind) || 0
      kindBytesMap.set(item.kind, currentBytes + size)
      kindCountMap.set(item.kind, currentCount + 1)
    }
  }

  const breakdown = Array.from(kindBytesMap.entries())
    .map(([kind, bytes]) => {
      const count = kindCountMap.get(kind) || 0
      const percentage = totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0
      return {
        kind,
        bytes,
        count,
        formattedSize: formatFileSize(bytes),
        percentage,
      }
    })
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.bytes - a.bytes)

  return {
    totalBytes,
    formattedTotal: formatFileSize(totalBytes),
    totalFiles,
    totalFolders,
    breakdown,
  }
}
