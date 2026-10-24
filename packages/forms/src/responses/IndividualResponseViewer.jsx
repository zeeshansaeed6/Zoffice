import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

/**
 * Paged view for inspecting individual form submissions.
 *
 * @param {Object} props
 * @param {import('../core/form-model.js').FormSchema} props.form
 * @param {import('../core/response-model.js').FormResponse[]} props.responses
 */
export function IndividualResponseViewer({ form, responses = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (responses.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-400">
        No individual responses recorded yet.
      </div>
    )
  }

  const current = responses[currentIndex] || responses[0]

  return (
    <div className="flex flex-col gap-5">
      {/* Pager Bar */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {currentIndex + 1} of {responses.length}
          </span>
          <button
            type="button"
            disabled={currentIndex === responses.length - 1}
            onClick={() => setCurrentIndex((i) => Math.min(responses.length - 1, i + 1))}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <Clock size={13} />
          <span>{new Date(current.submittedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Answers List */}
      <div className="flex flex-col gap-3">
        {form.questions.map((q) => {
          const ans = current.answers ? current.answers[q.id] : undefined
          let displayText = 'No answer provided'

          if (ans !== undefined && ans !== null && ans !== '') {
            if (Array.isArray(ans)) {
              displayText = ans.join(', ')
            } else if (typeof ans === 'object' && ans.filename) {
              displayText = ans.filename
            } else {
              displayText = String(ans)
            }
          }

          return (
            <div
              key={q.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {q.title}
              </h4>
              <p className="mt-2 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {displayText}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
