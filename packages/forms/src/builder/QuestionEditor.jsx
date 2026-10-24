import React from 'react'
import { Trash2, Copy, Plus, GitBranch, X, CheckSquare, Circle } from 'lucide-react'
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../core/constants.js'
import { useFormStore } from '../core/form-store.js'

/**
 * Question editor card for the form builder.
 * @param {Object} props
 * @param {import('../core/form-model.js').Question} props.question
 */
export function QuestionEditor({ question }) {
  const {
    activeQuestionId,
    selectQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    addChoice,
    updateChoice,
    deleteChoice,
    setBranchingModalOpen,
  } = useFormStore()

  const isActive = activeQuestionId === question.id

  const handleTypeChange = (e) => {
    const newType = e.target.value
    updateQuestion(question.id, { type: newType })
  }

  const isChoiceType =
    question.type === QUESTION_TYPES.MULTIPLE_CHOICE ||
    question.type === QUESTION_TYPES.CHECKBOXES ||
    question.type === QUESTION_TYPES.DROPDOWN

  return (
    <div
      onClick={() => selectQuestion(question.id)}
      className={`group relative rounded-xl border bg-white p-5 transition-all dark:bg-neutral-900 ${
        isActive
          ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
          : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
      }`}
    >
      {/* Top Question Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
          placeholder="Question Title"
          className="flex-1 rounded-lg border border-transparent bg-transparent px-2.5 py-1.5 text-base font-medium text-neutral-900 outline-none hover:border-neutral-200 focus:border-indigo-500 focus:bg-neutral-50 dark:text-neutral-100 dark:hover:border-neutral-700 dark:focus:bg-neutral-800"
        />

        <div className="flex items-center gap-2">
          <select
            value={question.type}
            onChange={handleTypeChange}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {Object.entries(QUESTION_TYPE_LABELS).map(([t, label]) => (
              <option key={t} value={t}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <input
        type="text"
        value={question.description}
        onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
        placeholder="Description or help text (optional)"
        className="mt-1 w-full rounded border border-transparent px-2.5 py-1 text-xs text-neutral-500 outline-none hover:border-neutral-200 focus:border-indigo-400 dark:text-neutral-400 dark:hover:border-neutral-700"
      />

      {/* Question Type Specific Body */}
      <div className="mt-4">
        {/* Choice Options List */}
        {isChoiceType && (
          <div className="space-y-2">
            {question.choices.map((choice, idx) => (
              <div key={choice.id} className="flex items-center gap-2">
                <span className="text-neutral-400">
                  {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && <Circle size={14} />}
                  {question.type === QUESTION_TYPES.CHECKBOXES && <CheckSquare size={14} />}
                  {question.type === QUESTION_TYPES.DROPDOWN && (
                    <span className="text-xs font-semibold">{idx + 1}.</span>
                  )}
                </span>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => updateChoice(question.id, choice.id, { text: e.target.value })}
                  className="flex-1 rounded border border-transparent px-2 py-1 text-xs text-neutral-800 outline-none hover:border-neutral-200 focus:border-indigo-500 dark:text-neutral-200 dark:hover:border-neutral-700"
                />
                {question.choices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteChoice(question.id, choice.id)}
                    className="p-1 text-neutral-400 hover:text-red-500"
                    title="Remove Option"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addChoice(question.id, `Option ${question.choices.length + 1}`)}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <Plus size={14} />
              Add Option
            </button>
          </div>
        )}

        {/* Short Text Preview */}
        {question.type === QUESTION_TYPES.SHORT_TEXT && (
          <div className="w-1/2 border-b border-dashed border-neutral-300 py-1.5 text-xs text-neutral-400 dark:border-neutral-700">
            Short answer text
          </div>
        )}

        {/* Paragraph Preview */}
        {question.type === QUESTION_TYPES.PARAGRAPH && (
          <div className="w-3/4 border-b border-dashed border-neutral-300 py-3 text-xs text-neutral-400 dark:border-neutral-700">
            Long answer text
          </div>
        )}

        {/* Linear Scale Editor */}
        {question.type === QUESTION_TYPES.LINEAR_SCALE && (
          <div className="flex flex-col gap-3 rounded-lg bg-neutral-50 p-3 text-xs dark:bg-neutral-800/50">
            <div className="flex items-center gap-3">
              <span>Scale from</span>
              <select
                value={question.scaleMin}
                onChange={(e) => updateQuestion(question.id, { scaleMin: Number(e.target.value) })}
                className="rounded border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
              </select>
              <span>to</span>
              <select
                value={question.scaleMax}
                onChange={(e) => updateQuestion(question.id, { scaleMax: Number(e.target.value) })}
                className="rounded border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={question.scaleMinLabel}
                onChange={(e) => updateQuestion(question.id, { scaleMinLabel: e.target.value })}
                placeholder="Low Label (e.g. Poor)"
                className="rounded border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
              <input
                type="text"
                value={question.scaleMaxLabel}
                onChange={(e) => updateQuestion(question.id, { scaleMaxLabel: e.target.value })}
                placeholder="High Label (e.g. Excellent)"
                className="rounded border border-neutral-200 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>
        )}

        {/* Date / Time */}
        {(question.type === QUESTION_TYPES.DATE || question.type === QUESTION_TYPES.TIME) && (
          <div className="flex items-center gap-2 border-b border-neutral-200 py-1.5 text-xs text-neutral-400 dark:border-neutral-700">
            <span>{question.type === QUESTION_TYPES.DATE ? 'MM / DD / YYYY' : 'HH : MM'}</span>
          </div>
        )}

        {/* File Upload Settings */}
        {question.type === QUESTION_TYPES.FILE_UPLOAD && (
          <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">
            Respondents will upload files. Max file size: {question.maxFileSizeMb} MB.
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {/* Branching Button for Choice Types */}
          {isChoiceType && (
            <button
              type="button"
              onClick={() => setBranchingModalOpen(true, question.id)}
              className="flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              title="Configure conditional branching logic"
            >
              <GitBranch size={13} />
              Branching Logic
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Required Toggle */}
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <span>Required</span>
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Duplicate Button */}
          <button
            type="button"
            onClick={() => duplicateQuestion(question.id)}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            title="Duplicate Question"
          >
            <Copy size={15} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => deleteQuestion(question.id)}
            className="p-1 text-neutral-400 hover:text-red-600"
            title="Delete Question"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
