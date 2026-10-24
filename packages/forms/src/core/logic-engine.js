/**
 * ZForms Branching Logic & Section Routing Engine.
 * Determines subsequent sections or submission states based on respondent answers.
 * @module logic-engine
 */

import { QUESTION_TYPES, BRANCHING_ACTIONS } from './constants.js'

/**
 * Determine the next navigation target for a given section based on answers.
 *
 * @param {string} currentSectionId
 * @param {import('./form-model.js').FormSection[]} sections
 * @param {import('./form-model.js').Question[]} questions
 * @param {Record<string, any>} answers
 * @returns {{ nextSectionId: string | null, shouldSubmit: boolean }}
 */
export function getNextSection(currentSectionId, sections = [], questions = [], answers = {}) {
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId)
  if (currentIndex === -1) {
    return { nextSectionId: null, shouldSubmit: true }
  }

  const currentSection = sections[currentIndex]
  const sectionQuestions = questions.filter((q) => q.sectionId === currentSectionId)

  // 1. Check for question-level choice branching (e.g. Multiple Choice or Dropdown)
  for (const q of sectionQuestions) {
    if (q.type === QUESTION_TYPES.MULTIPLE_CHOICE || q.type === QUESTION_TYPES.DROPDOWN) {
      const selectedChoiceText = answers[q.id]
      if (selectedChoiceText && Array.isArray(q.choices)) {
        const matchingChoice = q.choices.find((c) => c.text === selectedChoiceText)
        if (matchingChoice && matchingChoice.action) {
          if (matchingChoice.action === BRANCHING_ACTIONS.SUBMIT_FORM) {
            return { nextSectionId: null, shouldSubmit: true }
          }
          if (
            matchingChoice.action === BRANCHING_ACTIONS.GO_TO_SECTION &&
            matchingChoice.targetSectionId
          ) {
            return { nextSectionId: matchingChoice.targetSectionId, shouldSubmit: false }
          }
        }
      }
    }
  }

  // 2. Check section-level default action
  if (currentSection.defaultAction === BRANCHING_ACTIONS.SUBMIT_FORM) {
    return { nextSectionId: null, shouldSubmit: true }
  }

  if (
    currentSection.defaultAction === BRANCHING_ACTIONS.GO_TO_SECTION &&
    currentSection.targetSectionId
  ) {
    return { nextSectionId: currentSection.targetSectionId, shouldSubmit: false }
  }

  // 3. Fall through to the next sequential section
  const nextSection = sections[currentIndex + 1]
  if (nextSection) {
    return { nextSectionId: nextSection.id, shouldSubmit: false }
  }

  // No further sections — submit form
  return { nextSectionId: null, shouldSubmit: true }
}

/**
 * Validate that all required questions in the specified section are answered.
 *
 * @param {string} sectionId
 * @param {import('./form-model.js').Question[]} questions
 * @param {Record<string, any>} answers
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateSection(sectionId, questions = [], answers = {}) {
  const sectionQuestions = questions.filter((q) => q.sectionId === sectionId)
  /** @type {Record<string, string>} */
  const errors = {}

  for (const q of sectionQuestions) {
    if (!q.required) continue

    const val = answers[q.id]
    if (val === undefined || val === null || val === '') {
      errors[q.id] = 'This question is required.'
    } else if (Array.isArray(val) && val.length === 0) {
      errors[q.id] = 'Please select at least one option.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
