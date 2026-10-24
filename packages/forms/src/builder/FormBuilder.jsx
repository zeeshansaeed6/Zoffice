import React from 'react'
import { Plus, SplitSquareVertical } from 'lucide-react'
import { useFormStore } from '../core/form-store.js'
import { SectionCard } from './SectionCard.jsx'
import { QuestionEditor } from './QuestionEditor.jsx'
import { BranchingModal } from './BranchingModal.jsx'

/**
 * Main drag-and-drop form builder canvas.
 */
export function FormBuilder() {
  const { form, setTitle, setDescription, addQuestion, addSection } = useFormStore()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      {/* Form Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-2 w-full" style={{ backgroundColor: form.themeColor || '#4f46e5' }} />
        <div className="p-6">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title"
            className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-2xl font-bold text-neutral-900 outline-none hover:border-neutral-200 focus:border-indigo-500 dark:text-neutral-50 dark:hover:border-neutral-700"
          />
          <textarea
            value={form.description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Form description"
            rows={2}
            className="mt-2 w-full resize-none rounded border border-transparent bg-transparent px-2 py-1 text-xs text-neutral-600 outline-none hover:border-neutral-200 focus:border-indigo-500 dark:text-neutral-400 dark:hover:border-neutral-700"
          />
        </div>
      </div>

      {/* Sections and Questions */}
      {form.sections.map((section, sIdx) => {
        const sectionQuestions = form.questions
          .filter((q) => q.sectionId === section.id)
          .sort((a, b) => a.order - b.order)

        return (
          <div key={section.id} className="flex flex-col gap-4">
            <SectionCard section={section} index={sIdx} />

            <div className="flex flex-col gap-3 pl-2 sm:pl-4">
              {sectionQuestions.map((q) => (
                <QuestionEditor key={q.id} question={q} />
              ))}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => addQuestion(section.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-indigo-500"
                >
                  <Plus size={14} />
                  Add Question to Section
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Global Bottom Actions */}
      <div className="flex items-center justify-center gap-3 border-t border-neutral-200 py-6 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => addQuestion()}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Question
        </button>

        <button
          type="button"
          onClick={() => addSection()}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
        >
          <SplitSquareVertical size={16} />
          Add Section Break
        </button>
      </div>

      <BranchingModal />
    </div>
  )
}
