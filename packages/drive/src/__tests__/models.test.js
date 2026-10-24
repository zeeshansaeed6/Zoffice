import { describe, it, expect } from 'vitest'
import {
  generateId,
  inferKindFromFilename,
  formatFileSize,
  createDriveItem,
  createFileVersion,
  createStarterDrive,
} from '../core/drive-model.js'
import { FILE_KINDS } from '../core/constants.js'

describe('ZDrive Data Models', () => {
  it('generates unique IDs with prefix', () => {
    const id1 = generateId('fil')
    const id2 = generateId('fil')
    expect(id1.startsWith('fil-')).toBe(true)
    expect(id1).not.toBe(id2)
  })

  it('infers file kinds from extension correctly', () => {
    expect(inferKindFromFilename('report.docx')).toBe(FILE_KINDS.WRITER)
    expect(inferKindFromFilename('sheet.xlsx')).toBe(FILE_KINDS.SHEETS)
    expect(inferKindFromFilename('deck.pptx')).toBe(FILE_KINDS.SLIDES)
    expect(inferKindFromFilename('notes.znotes')).toBe(FILE_KINDS.NOTES)
    expect(inferKindFromFilename('diagram.zdraw')).toBe(FILE_KINDS.DRAW)
    expect(inferKindFromFilename('database.zbase')).toBe(FILE_KINDS.BASE)
    expect(inferKindFromFilename('unknown.xyz')).toBe(FILE_KINDS.OTHER)
  })

  it('formats byte sizes into readable units', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(5242880)).toBe('5 MB')
  })

  it('creates folder items with zero size and no versions', () => {
    const folder = createDriveItem('My Folder', FILE_KINDS.FOLDER)
    expect(folder.kind).toBe(FILE_KINDS.FOLDER)
    expect(folder.size).toBe(0)
    expect(folder.versions).toEqual([])
    expect(folder.starred).toBe(false)
  })

  it('creates file items with initial version snapshot', () => {
    const file = createDriveItem('Test.docx', FILE_KINDS.WRITER, null, { size: 4096 })
    expect(file.kind).toBe(FILE_KINDS.WRITER)
    expect(file.size).toBe(4096)
    expect(file.versions.length).toBe(1)
    expect(file.versions[0].versionNumber).toBe(1)
  })

  it('creates file versions with timestamps', () => {
    const ver = createFileVersion('fil-1', { versionNumber: 2, comment: 'Draft update' })
    expect(ver.versionNumber).toBe(2)
    expect(ver.comment).toBe('Draft update')
    expect(ver.createdAt).toBeGreaterThan(0)
  })

  it('creates starter drive with sample folders and files', () => {
    const items = createStarterDrive()
    expect(items.length).toBeGreaterThanOrEqual(8)
    const folders = items.filter((i) => i.kind === FILE_KINDS.FOLDER)
    const files = items.filter((i) => i.kind !== FILE_KINDS.FOLDER)
    expect(folders.length).toBeGreaterThanOrEqual(2)
    expect(files.length).toBeGreaterThanOrEqual(5)
  })
})
