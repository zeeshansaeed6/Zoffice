/**
 * ZBase SQL Query Console Modal — interactive SQL query engine interface.
 * @module SqlQueryConsoleModal
 */

import React, { useState } from 'react'
import { X, Play, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react'
import { executeSqlQuery } from '../core/sql-console-engine.js'

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../core/base-model.js').BaseTable[]} props.tables
 * @param {() => void} props.onClose
 */
export function SqlQueryConsoleModal({ isOpen, tables, onClose }) {
  if (!isOpen) return null

  const defaultQuery = tables[0] ? `SELECT * FROM ${tables[0].name}` : 'SELECT * FROM Projects'
  const [query, setQuery] = useState(defaultQuery)
  const [result, setResult] = useState(null)

  const handleRunQuery = () => {
    const res = executeSqlQuery(query, tables)
    setResult(res)
  }

  const sampleQueries = [
    `SELECT * FROM ${tables[0]?.name || 'Projects'}`,
    `SELECT * FROM ${tables[0]?.name || 'Projects'} WHERE "Budget ($)" > 15000`,
    tables[1] ? `SELECT * FROM ${tables[1].name}` : 'SELECT * FROM Team',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Terminal size={18} className="text-blue-500" />
            <h3 className="text-sm font-bold">ZBase SQL Console</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Query Input Section */}
        <div className="flex flex-col gap-2.5 border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              SQL Query (SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...)
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Templates:</span>
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(sample)}
                  className="rounded bg-slate-200/70 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                >
                  Query {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 bg-white p-2.5 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="SELECT * FROM Projects WHERE Status = 'Active'"
          />

          <div className="flex justify-end">
            <button
              onClick={handleRunQuery}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <Play size={13} /> Run Query
            </button>
          </div>
        </div>

        {/* Query Results Section */}
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Results</span>
            {result && (
              <span className="flex items-center gap-1 text-[11px]">
                {result.success ? (
                  <>
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span>{result.rowCount} row(s) returned</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} className="text-red-500" />
                    <span className="text-red-500">Query Failed</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            {result?.error && (
              <div className="m-4 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {result.error}
              </div>
            )}

            {result?.success && result.rows && (
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <tr>
                    {result.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="border-r border-slate-200 px-3 py-2 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-slate-100 hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-900/40"
                    >
                      {result.columns.map((col, cIdx) => (
                        <td
                          key={cIdx}
                          className="border-r border-slate-100 px-3 py-1.5 text-slate-800 dark:border-slate-800 dark:text-slate-200"
                        >
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!result && (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Enter a query above and click &ldquo;Run Query&rdquo; to execute.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
