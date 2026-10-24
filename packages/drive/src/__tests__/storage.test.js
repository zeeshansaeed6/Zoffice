import { describe, it, expect } from 'vitest'
import { calculateStorageStats } from '../core/storage-calculator.js'
import { createDriveItem } from '../core/drive-model.js'
import { FILE_KINDS } from '../core/constants.js'

describe('ZDrive Storage Calculator', () => {
  it('handles empty items array', () => {
    const stats = calculateStorageStats([])
    expect(stats.totalBytes).toBe(0)
    expect(stats.totalFiles).toBe(0)
    expect(stats.totalFolders).toBe(0)
    expect(stats.breakdown).toEqual([])
  })

  it('calculates total bytes and ignores folders and trashed items', () => {
    const items = [
      createDriveItem('Folder 1', FILE_KINDS.FOLDER),
      createDriveItem('Doc 1.docx', FILE_KINDS.WRITER, null, { size: 1000 }),
      createDriveItem('Sheet 1.xlsx', FILE_KINDS.SHEETS, null, { size: 2000 }),
      createDriveItem('Old Doc.docx', FILE_KINDS.WRITER, null, { size: 5000, trashed: true }),
    ]

    const stats = calculateStorageStats(items)
    expect(stats.totalBytes).toBe(3000)
    expect(stats.totalFiles).toBe(2)
    expect(stats.totalFolders).toBe(1)
  })

  it('groups breakdown by document kind with percentages', () => {
    const items = [
      createDriveItem('Doc 1.docx', FILE_KINDS.WRITER, null, { size: 1000 }),
      createDriveItem('Doc 2.docx', FILE_KINDS.WRITER, null, { size: 1000 }),
      createDriveItem('Sheet 1.xlsx', FILE_KINDS.SHEETS, null, { size: 2000 }),
    ]

    const stats = calculateStorageStats(items)
    expect(stats.totalBytes).toBe(4000)
    expect(stats.breakdown.length).toBe(2)

    const writerStat = stats.breakdown.find((b) => b.kind === FILE_KINDS.WRITER)
    const sheetsStat = stats.breakdown.find((b) => b.kind === FILE_KINDS.SHEETS)

    expect(writerStat.count).toBe(2)
    expect(writerStat.bytes).toBe(2000)
    expect(writerStat.percentage).toBe(50)

    expect(sheetsStat.count).toBe(1)
    expect(sheetsStat.bytes).toBe(2000)
    expect(sheetsStat.percentage).toBe(50)
  })
})
