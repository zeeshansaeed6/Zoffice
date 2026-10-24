import React from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { QUESTION_TYPES } from '../core/constants.js'
import { useFormStore } from '../core/form-store.js'

/**
 * Live preview and respondent filling interface.
 */
export function FormPreview() {
  const {
    form,
    previewSectionId,
    previewAnswers,
    previewErrors,
    isSubmitted,
    setAnswer,
    advanceSection,
    goToPrevSection,
    resetPreview,
  } = useFormStore()

  if (isSubmitted) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Response Submitted!
        </h2>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Your response has been recorded offline in local SQLite storage.
        </p>
        {form.allowMultiple && (
          <button
            type="button"
            onClick={resetPreview}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Submit Another Response
          </button>
        )}
      </div>
    )
  }

  const currentSection = form.sections.find((s) => s.id === previewSectionId) || form.sections[0]
  const currentSectionIndex = form.sections.findIndex((s) => s.id === currentSection?.id)
  const isLastSection = currentSectionIndex === form.sections.length - 1
  const isFirstSection = currentSectionIndex === 0

  const sectionQuestions = form.questions
    .filter((q) => q.sectionId === currentSection?.id)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      {/* Header Card */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-2.5 w-full" style={{ backgroundColor: form.themeColor || '#4f46e5' }} />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              {form.description}
            </p>
          )}

          {form.sections.length > 1 && (
            <div className="mt-4 border-t border-neutral-100 pt-3 text-xs font-medium text-neutral-400 dark:border-neutral-800">
              Section {currentSectionIndex + 1} of {form.sections.length}: {currentSection?.title}
            </div>
          )}
        </div>
      </div>

      {/* Section Questions */}
      <div className="flex flex-col gap-4">
        {sectionQuestions.map((q) => {
          const value = previewAnswers[q.id]
          const error = previewErrors[q.id]

          return (
            <div
              key={q.id}
              className={`rounded-xl border bg-white p-5 shadow-sm transition-all dark:bg-neutral-900 ${
                error
                  ? 'border-red-400 ring-1 ring-red-400/30'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {q.title}
                    {q.required && <span className="ml-1 text-red-500">*</span>}
                  </h3>
                  {q.description && (
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {q.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Input Widgets */}
              <div className="mt-4">
                {/* Short Text */}
                {q.type === QUESTION_TYPES.SHORT_TEXT && (
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder="Your answer"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                )}

                {/* Paragraph */}
                {q.type === QUESTION_TYPES.PARAGRAPH && (
                  <textarea
                    rows={3}
                    value={value || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    placeholder="Your answer"
                    className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                )}

                {/* Multiple Choice */}
                {q.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                  <div className="space-y-2">
                    {q.choices.map((c) => (
                      <label
                        key={c.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-100 p-2 text-xs text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={value === c.text}
                          onChange={() => setAnswer(q.id, c.text)}
                          className="h-4 w-4 border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{c.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkboxes */}
                {q.type === QUESTION_TYPES.CHECKBOXES && (
                  <div className="space-y-2">
                    {q.choices.map((c) => {
                      const checkedList = Array.isArray(value) ? value : []
                      const isChecked = checkedList.includes(c.text)
                      return (
                        <label
                          key={c.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-100 p-2 text-xs text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...checkedList, c.text]
                                : checkedList.filter((item) => item !== c.text)
                              setAnswer(q.id, next)
                            }}
                            className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{c.text}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {/* Dropdown */}
                {q.type === QUESTION_TYPES.DROPDOWN && (
                  <select
                    value={value || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">Select an option…</option>
                    {q.choices.map((c) => (
                      <option key={c.id} value={c.text}>
                        {c.text}
                      </option>
                    ))}
                  </select>
                )}

                {/* Linear Scale */}
                {q.type === QUESTION_TYPES.LINEAR_SCALE && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{q.scaleMinLabel}</span>
                      <span>{q.scaleMaxLabel}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 overflow-x-auto py-2">
                      {Array.from(
                        { length: q.scaleMax - q.scaleMin + 1 },
                        (_, i) => q.scaleMin + i,
                      ).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAnswer(q.id, num)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                            value === num
                              ? 'bg-indigo-600 text-white shadow'
                              : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                {q.type === QUESTION_TYPES.DATE && (
                  <input
                    type="date"
                    value={value || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                )}
                {q.type === QUESTION_TYPES.TIME && (
                  <input
                    type="time"
                    value={value || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                )}

                {/* File Upload */}
                {q.type === QUESTION_TYPES.FILE_UPLOAD && (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 p-4 hover:border-indigo-400 dark:border-neutral-700">
                    <Upload size={18} className="text-neutral-400" />
                    <span className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {value ? value.filename : 'Click to select a file'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setAnswer(q.id, { filename: file.name, size: file.size, type: file.type })
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Error Message */}
              {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        {!isFirstSection && (
          <button
            type="button"
            onClick={goToPrevSection}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <ChevronLeft size={14} />
            Back
          </button>
        )}

        <div className="ml-auto">
          <button
            type="button"
            onClick={advanceSection}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span>{isLastSection ? 'Submit' : 'Next'}</span>
            {!isLastSection && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
