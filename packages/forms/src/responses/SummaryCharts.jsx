import React from 'react'
import { QUESTION_TYPES } from '../core/constants.js'

/**
 * Visual summary charts (bar charts, percentage distributions) for form responses.
 * Pure SVG/HTML without external heavy charting libraries.
 *
 * @param {Object} props
 * @param {import('../core/form-model.js').FormSchema} props.form
 * @param {import('../core/response-model.js').FormResponse[]} props.responses
 */
export function SummaryCharts({ form, responses = [] }) {
  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-neutral-400">
        No responses yet. Switch to Preview tab to submit test responses.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {form.questions.map((q) => {
        const isChoice =
          q.type === QUESTION_TYPES.MULTIPLE_CHOICE ||
          q.type === QUESTION_TYPES.DROPDOWN ||
          q.type === QUESTION_TYPES.CHECKBOXES
        const isScale = q.type === QUESTION_TYPES.LINEAR_SCALE

        // Collect answers
        const rawAnswers = responses
          .map((r) => r.answers?.[q.id])
          .filter((v) => v !== undefined && v !== null && v !== '')

        return (
          <div
            key={q.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="border-b border-neutral-100 pb-2 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                {q.title}
              </h3>
              <span className="text-xs text-neutral-400">
                {rawAnswers.length} {rawAnswers.length === 1 ? 'response' : 'responses'}
              </span>
            </div>

            <div className="mt-4">
              {/* Choice-based Bar Chart */}
              {isChoice && (
                <div className="space-y-3">
                  {q.choices.map((choice) => {
                    // Count frequency
                    let count = 0
                    for (const ans of rawAnswers) {
                      if (Array.isArray(ans) && ans.includes(choice.text)) count++
                      else if (ans === choice.text) count++
                    }
                    const percent =
                      rawAnswers.length > 0 ? Math.round((count / rawAnswers.length) * 100) : 0

                    return (
                      <div key={choice.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          <span>{choice.text}</span>
                          <span>
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Linear Scale Chart */}
              {isScale && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{q.scaleMinLabel}</span>
                    <span>{q.scaleMaxLabel}</span>
                  </div>
                  <div className="grid grid-flow-col gap-2 pt-1">
                    {Array.from(
                      { length: q.scaleMax - q.scaleMin + 1 },
                      (_, i) => q.scaleMin + i,
                    ).map((num) => {
                      const count = rawAnswers.filter((a) => a === num).length
                      const percent =
                        rawAnswers.length > 0 ? Math.round((count / rawAnswers.length) * 100) : 0

                      return (
                        <div key={num} className="flex flex-col items-center gap-1.5">
                          <div className="flex h-24 w-full flex-col justify-end rounded bg-neutral-100 p-1 dark:bg-neutral-800">
                            <div
                              className="w-full rounded bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                              style={{ height: `${percent}%`, minHeight: count > 0 ? '4px' : '0' }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            {num}
                          </span>
                          <span className="text-[10px] text-neutral-400">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Text, Date, Time, File answers */}
              {!isChoice && !isScale && (
                <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                  {rawAnswers.slice(0, 50).map((ans, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-300"
                    >
                      {typeof ans === 'object' && ans.filename ? ans.filename : String(ans)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
