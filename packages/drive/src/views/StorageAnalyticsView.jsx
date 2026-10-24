/**
 * ZDrive Storage Analytics View Component — visual disk quota breakdown.
 * @module StorageAnalyticsView
 */

import React, { useMemo } from 'react'
import { HardDrive, PieChart, FileText, ArrowUpRight } from 'lucide-react'
import { calculateStorageStats } from '../core/storage-calculator.js'
import { formatFileSize } from '../core/drive-model.js'
import { FileIcon } from '../components/FileIcon.jsx'
import { FILE_KINDS } from '../core/constants.js'

const KIND_COLORS = {
  [FILE_KINDS.WRITER]: '#2563eb',
  [FILE_KINDS.SHEETS]: '#059669',
  [FILE_KINDS.SLIDES]: '#d97706',
  [FILE_KINDS.NOTES]: '#7c3aed',
  [FILE_KINDS.BASE]: '#9333ea',
  [FILE_KINDS.DRAW]: '#0891b2',
  [FILE_KINDS.FORMS]: '#0d9488',
  [FILE_KINDS.PLANNER]: '#e11d48',
  [FILE_KINDS.OTHER]: '#64748b',
}

/**
 * @param {Object} props
 * @param {import('../core/drive-model.js').DriveItem[]} props.items
 * @param {(file: import('../core/drive-model.js').DriveItem) => void} props.onOpenFile
 */
export function StorageAnalyticsView({ items, onOpenFile }) {
  const stats = useMemo(() => calculateStorageStats(items), [items])

  const largestFiles = useMemo(() => {
    return items
      .filter((i) => i.kind !== FILE_KINDS.FOLDER && !i.trashed)
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
  }, [items])

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-900">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <HardDrive size={15} className="text-blue-500" />
            <span>Total Storage Used</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.formattedTotal}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Offline SQLite workspace</p>
        </div>

        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <FileText size={15} className="text-emerald-500" />
            <span>Total Documents</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.totalFiles}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{stats.totalFolders} organized folders</p>
        </div>

        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <PieChart size={15} className="text-purple-500" />
            <span>Document Types</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {stats.breakdown.length}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Active format categories</p>
        </div>
      </div>

      {/* Storage Distribution Progress Bar */}
      <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Storage Distribution
        </h3>

        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {stats.breakdown.map((stat) => (
            <div
              key={stat.kind}
              style={{
                width: `${stat.percentage}%`,
                backgroundColor: KIND_COLORS[stat.kind] || '#64748b',
              }}
              title={`${stat.kind}: ${stat.formattedSize} (${stat.percentage}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          {stats.breakdown.map((stat) => (
            <div key={stat.kind} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: KIND_COLORS[stat.kind] || '#64748b' }}
              />
              <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
                {stat.kind}
              </span>
              <span className="text-slate-400">({stat.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown Table & Largest Files */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Breakdown table */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Breakdown by Document Kind
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.breakdown.map((stat) => (
              <div key={stat.kind} className="flex items-center justify-between py-2 text-xs">
                <div className="flex items-center gap-2">
                  <FileIcon kind={stat.kind} size={18} />
                  <span className="font-medium capitalize text-slate-800 dark:text-slate-200">
                    {stat.kind}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                  <span>{stat.count} items</span>
                  <span className="w-16 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {stat.formattedSize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Largest files */}
        <div className="shadow-xs rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Largest Files
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {largestFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => onOpenFile(file)}
                className="flex cursor-pointer items-center justify-between rounded px-1 py-2 text-xs transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileIcon kind={file.kind} size={18} />
                  <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatFileSize(file.size)}
                  </span>
                  <ArrowUpRight size={13} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
