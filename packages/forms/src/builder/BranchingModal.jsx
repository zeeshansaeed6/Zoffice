import React from 'react'
import { X, GitBranch } from 'lucide-react'
import { BRANCHING_ACTIONS } from '../core/constants.js'
import { useFormStore } from '../core/form-store.js'

/**
 * Modal to configure conditional branching rules per choice option.
 */
export function BranchingModal() {
  const { form, isBranchingModalOpen, branchingQuestionId, setBranchingModalOpen, updateChoice } =
    useFormStore()

  if (!isBranchingModalOpen || !branchingQuestionId) return null

  const targetQuestion = form.questions.find((q) => q.id === branchingQuestionId)
  if (!targetQuestion) return null

  const sections = form.sections

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="branching-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-indigo-600 dark:text-indigo-400" />
            <h2
              id="branching-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-100"
            >
              Branching Logic: {targetQuestion.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setBranchingModalOpen(false)}
            className="rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          <p className="text-neutral-500 dark:text-neutral-400">
            Select the destination section or action when a respondent chooses each option:
          </p>

          <div className="space-y-3">
            {targetQuestion.choices.map((choice) => (
              <div
                key={choice.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/40"
              >
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {choice.text}
                </span>

                <select
                  value={
                    choice.action === BRANCHING_ACTIONS.GO_TO_SECTION
                      ? choice.targetSectionId || ''
                      : choice.action || BRANCHING_ACTIONS.NEXT_SECTION
                  }
                  onChange={(e) => {
                    const val = e.target.value
                    if (
                      val === BRANCHING_ACTIONS.NEXT_SECTION ||
                      val === BRANCHING_ACTIONS.SUBMIT_FORM
                    ) {
                      updateChoice(targetQuestion.id, choice.id, {
                        action: val,
                        targetSectionId: null,
                      })
                    } else {
                      updateChoice(targetQuestion.id, choice.id, {
                        action: BRANCHING_ACTIONS.GO_TO_SECTION,
                        targetSectionId: val,
                      })
                    }
                  }}
                  className="rounded border border-neutral-200 bg-white px-2.5 py-1 text-xs outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value={BRANCHING_ACTIONS.NEXT_SECTION}>Continue to next section</option>
                  {sections.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      Go to Section {idx + 1}: {s.title}
                    </option>
                  ))}
                  <option value={BRANCHING_ACTIONS.SUBMIT_FORM}>Submit form</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setBranchingModalOpen(false)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
