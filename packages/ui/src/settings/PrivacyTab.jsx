import React from 'react'
import { ShieldCheck, Lock, HardDrive, EyeOff, Ban } from 'lucide-react'

/**
 * Privacy & Independence Declaration Tab for Settings Center.
 */
export function PrivacyTab() {
  return (
    <div className="space-y-6 text-sm text-neutral-700 dark:text-neutral-300">
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <ShieldCheck className="h-5 w-5" />
          <h3 className="text-base font-semibold">Zoffice Privacy Guarantee</h3>
        </div>
        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          Zoffice is engineered from the ground up to guarantee total digital sovereignty and data
          confidentiality.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
            <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            100% Offline-First
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            All document editing, spreadsheet formulas, presentation rendering, and database queries
            execute strictly on your local computer. No cloud connection is ever required.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
            <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Zero Telemetry & Tracking
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Zoffice contains zero telemetry, zero analytics beacons, zero user tracking, and zero
            silent crash uploaders. Your usage patterns remain completely private.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
            <Ban className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            No Accounts or Paywalls
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            No registration, email signups, product keys, subscriptions, or dark patterns. The
            entire suite is 100% free software licensed under the MIT License.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
            <HardDrive className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Local Data Storage
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Your settings, recent documents, notes, mail index, and planner boards are persisted in
            a local SQLite database directly on your system disk.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/50">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Independent Open-Source Software
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
          Zoffice is an independent, community-driven desktop productivity suite. Zoffice is not
          affiliated with, associated with, sponsored by, or endorsed by Microsoft Corporation or
          any of its subsidiaries. All product names, trademarks, and registered trademarks belong
          to their respective holders.
        </p>
      </div>
    </div>
  )
}
