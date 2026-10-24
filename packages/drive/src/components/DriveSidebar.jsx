/**
 * ZDrive Sidebar Navigation Component.
 * @module DriveSidebar
 */

import React, { useMemo } from 'react'
import { HardDrive, Clock, Star, Trash2, PieChart, FolderPlus } from 'lucide-react'
import { DRIVE_SECTIONS } from '../core/constants.js'
import { calculateStorageStats } from '../core/storage-calculator.js'

/**
 * @param {Object} props
 * @param {string} props.activeSection
 * @param {import('../core/drive-model.js').DriveItem[]} props.items
 * @param {(section: string) => void} props.onSelectSection
 * @param {() => void} props.onOpenNewFolder
 */
export function DriveSidebar({ activeSection, items, onSelectSection, onOpenNewFolder }) {
  const stats = useMemo(() => calculateStorageStats(items), [items])

  const navItems = [
    {
      id: DRIVE_SECTIONS.MY_DRIVE,
      label: 'My Drive',
      icon: <HardDrive size={16} />,
    },
    {
      id: DRIVE_SECTIONS.RECENT,
      label: 'Recent',
      icon: <Clock size={16} />,
    },
    {
      id: DRIVE_SECTIONS.STARRED,
      label: 'Starred',
      icon: <Star size={16} />,
    },
    {
      id: DRIVE_SECTIONS.TRASH,
      label: 'Trash',
      icon: <Trash2 size={16} />,
    },
    {
      id: DRIVE_SECTIONS.STORAGE,
      label: 'Storage',
      icon: <PieChart size={16} />,
    },
  ]

  return (
    <div className="flex h-full w-56 flex-col justify-between border-r border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4">
        {/* New Folder Button */}
        <button
          onClick={onOpenNewFolder}
          className="shadow-xs flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <FolderPlus size={16} />
          <span>New Folder</span>
        </button>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-100/70 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Storage Meter Widget */}
      <div
        onClick={() => onSelectSection(DRIVE_SECTIONS.STORAGE)}
        className="shadow-2xs cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <PieChart size={13} className="text-blue-500" />
            <span>Storage</span>
          </span>
          <span className="text-[11px] text-slate-400">{stats.formattedTotal}</span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${Math.min(100, Math.max(5, (stats.totalBytes / (500 * 1024 * 1024)) * 100))}%`,
            }}
          />
        </div>

        <p className="mt-1.5 text-[10px] text-slate-400">
          {stats.totalFiles} files &bull; Offline workspace
        </p>
      </div>
    </div>
  )
}
