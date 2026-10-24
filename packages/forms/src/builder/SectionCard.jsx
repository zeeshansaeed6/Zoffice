import React from 'react'
import { Trash2 } from 'lucide-react'
import { BRANCHING_ACTIONS } from '../core/constants.js'
import { useFormStore } from '../core/form-store.js'

/**
 * Section break header card.
 * @param {Object} props
 * @param {import('../core/form-model.js').FormSection} props.section
 * @param {number} props.index
 */
export function SectionCard({ section, index }) {
  const { form, updateSection, deleteSection, selectSection, activeSectionId } = useFormStore()
  const isSelected = activeSectionId === section.id
  const otherSections = form.sections.filter((s) => s.id !== section.id)

  return (
    <div
      onClick={() => selectSection(section.id)}
      className={`rounded-xl border bg-neutral-50/80 p-4 transition-all dark:bg-neutral-800/40 ${
        isSelected
          ? 'border-indigo-400 ring-1 ring-indigo-400/20'
          : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2 dark:border-neutral-700">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Section {index + 1} of {form.sections.length}
        </span>
        {form.sections.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              deleteSection(section.id)
            }}
            className="p-1 text-neutral-400 hover:text-red-500"
            title="Delete Section"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateSection(section.id, { title: e.target.value })}
          placeholder="Section Title"
          className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-base font-semibold text-neutral-800 outline-none hover:border-neutral-200 focus:border-indigo-500 dark:text-neutral-100 dark:hover:border-neutral-700"
        />
        <input
          type="text"
          value={section.description}
          onChange={(e) => updateSection(section.id, { description: e.target.value })}
          placeholder="Section description (optional)"
          className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-xs text-neutral-500 outline-none hover:border-neutral-200 focus:border-indigo-400 dark:text-neutral-400 dark:hover:border-neutral-700"
        />
      </div>

      {/* Section End Navigation Rule */}
      <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-2 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        <span>After section {index + 1}:</span>
        <select
          value={
            section.defaultAction === BRANCHING_ACTIONS.GO_TO_SECTION
              ? section.targetSectionId || ''
              : section.defaultAction
          }
          onChange={(e) => {
            const val = e.target.value
            if (val === BRANCHING_ACTIONS.NEXT_SECTION || val === BRANCHING_ACTIONS.SUBMIT_FORM) {
              updateSection(section.id, { defaultAction: val, targetSectionId: null })
            } else {
              updateSection(section.id, {
                defaultAction: BRANCHING_ACTIONS.GO_TO_SECTION,
                targetSectionId: val,
              })
            }
          }}
          className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value={BRANCHING_ACTIONS.NEXT_SECTION}>Continue to next section</option>
          {otherSections.map((s, idx) => (
            <option key={s.id} value={s.id}>
              Go to section {idx + 1} ({s.title || 'Untitled'})
            </option>
          ))}
          <option value={BRANCHING_ACTIONS.SUBMIT_FORM}>Submit form</option>
        </select>
      </div>
    </div>
  )
}
