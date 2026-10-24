import React, { useState } from 'react'
import { Download, Code, Trash2, PieChart, User } from 'lucide-react'
import { exportResponsesToCsv } from '../core/export-csv.js'
import { useFormStore } from '../core/form-store.js'
import { SummaryCharts } from './SummaryCharts.jsx'
import { IndividualResponseViewer } from './IndividualResponseViewer.jsx'
import { EmbedModal } from './EmbedModal.jsx'

/**
 * Download text payload as a CSV file.
 * @param {string} csvText
 * @param {string} filename
 */
function downloadCsv(csvText, filename) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Form responses dashboard and analytics view.
 */
export function ResponsesView() {
  const { form, responses, setFormSettings, setEmbedModalOpen, clearResponses } = useFormStore()
  const [subTab, setSubTab] = useState('summary') // 'summary' | 'individual'

  const handleExportCsv = () => {
    const csv = exportResponsesToCsv(form, responses)
    downloadCsv(csv, `${form.title.replace(/\s+/g, '_')}_responses.csv`)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
          </h2>
          <label className="mt-1 flex cursor-pointer items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={form.acceptResponses}
              onChange={(e) => setFormSettings({ acceptResponses: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Accepting responses</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={responses.length === 0}
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setEmbedModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <Code size={14} />
            Embed
          </button>

          {responses.length > 0 && (
            <button
              type="button"
              onClick={clearResponses}
              className="flex items-center gap-1 rounded-lg p-1.5 text-neutral-400 hover:text-red-600"
              title="Clear all responses"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Subtab Switcher */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setSubTab('summary')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            subTab === 'summary'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
        >
          <PieChart size={14} />
          Summary
        </button>

        <button
          type="button"
          onClick={() => setSubTab('individual')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
            subTab === 'individual'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
          }`}
        >
          <User size={14} />
          Individual
        </button>
      </div>

      {/* Subtab Content */}
      {subTab === 'summary' && <SummaryCharts form={form} responses={responses} />}
      {subTab === 'individual' && <IndividualResponseViewer form={form} responses={responses} />}

      <EmbedModal />
    </div>
  )
}
