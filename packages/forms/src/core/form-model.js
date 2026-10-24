/**
 * ZForms Data Models — factory functions for forms, sections, questions, and choices.
 * @module form-model
 */

import { QUESTION_TYPES, BRANCHING_ACTIONS } from './constants.js'

/**
 * Generate unique entity ID.
 * @param {string} [prefix='']
 * @returns {string}
 */
export function generateId(prefix = '') {
  const p = prefix ? `${prefix}-` : ''
  return `${p}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} text
 * @property {string} [action] - One of BRANCHING_ACTIONS
 * @property {string|null} [targetSectionId]
 */

/**
 * Create a question choice option.
 * @param {string} text
 * @param {Partial<Choice>} [overrides={}]
 * @returns {Choice}
 */
export function createChoice(text = 'Option', overrides = {}) {
  return {
    id: overrides.id || generateId('opt'),
    text: overrides.text || text,
    action: overrides.action || BRANCHING_ACTIONS.NEXT_SECTION,
    targetSectionId: overrides.targetSectionId || null,
  }
}

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} sectionId
 * @property {string} title
 * @property {string} description
 * @property {string} type - One of QUESTION_TYPES
 * @property {boolean} required
 * @property {Choice[]} choices
 * @property {number} scaleMin
 * @property {number} scaleMax
 * @property {string} scaleMinLabel
 * @property {string} scaleMaxLabel
 * @property {number} maxFileSizeMb
 * @property {string} allowedFileTypes
 * @property {number} order
 */

/**
 * Create a new form question.
 * @param {Partial<Question>} [overrides={}]
 * @returns {Question}
 */
export function createQuestion(overrides = {}) {
  const type = overrides.type || QUESTION_TYPES.SHORT_TEXT
  const defaultChoices =
    type === QUESTION_TYPES.MULTIPLE_CHOICE ||
    type === QUESTION_TYPES.CHECKBOXES ||
    type === QUESTION_TYPES.DROPDOWN
      ? [createChoice('Option 1'), createChoice('Option 2')]
      : []

  return {
    id: overrides.id || generateId('q'),
    sectionId: overrides.sectionId || '',
    title: overrides.title || 'Untitled Question',
    description: overrides.description || '',
    type,
    required: overrides.required ?? false,
    choices: overrides.choices || defaultChoices,
    scaleMin: overrides.scaleMin ?? 1,
    scaleMax: overrides.scaleMax ?? 5,
    scaleMinLabel: overrides.scaleMinLabel || 'Low',
    scaleMaxLabel: overrides.scaleMaxLabel || 'High',
    maxFileSizeMb: overrides.maxFileSizeMb ?? 10,
    allowedFileTypes: overrides.allowedFileTypes || '*/*',
    order: overrides.order ?? 0,
  }
}

/**
 * @typedef {Object} FormSection
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} order
 * @property {string} defaultAction - One of BRANCHING_ACTIONS
 * @property {string|null} targetSectionId
 */

/**
 * Create a new section break.
 * @param {Partial<FormSection>} [overrides={}]
 * @returns {FormSection}
 */
export function createSection(overrides = {}) {
  return {
    id: overrides.id || generateId('sec'),
    title: overrides.title || 'Section',
    description: overrides.description || '',
    order: overrides.order ?? 0,
    defaultAction: overrides.defaultAction || BRANCHING_ACTIONS.NEXT_SECTION,
    targetSectionId: overrides.targetSectionId || null,
  }
}

/**
 * @typedef {Object} FormSchema
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} themeColor
 * @property {boolean} acceptResponses
 * @property {boolean} allowMultiple
 * @property {FormSection[]} sections
 * @property {Question[]} questions
 * @property {number} createdAt
 * @property {number} updatedAt
 */

/**
 * Create a new form document.
 * @param {Partial<FormSchema>} [overrides={}]
 * @returns {FormSchema}
 */
export function createForm(overrides = {}) {
  const now = Date.now()
  const initialSection = createSection({
    title: 'General Information',
    description: 'Please fill out all required fields below.',
    order: 0,
  })

  const initialQuestions = [
    createQuestion({
      sectionId: initialSection.id,
      title: 'Full Name',
      type: QUESTION_TYPES.SHORT_TEXT,
      required: true,
      order: 0,
    }),
    createQuestion({
      sectionId: initialSection.id,
      title: 'Email Address',
      type: QUESTION_TYPES.SHORT_TEXT,
      required: true,
      order: 1,
    }),
  ]

  return {
    id: overrides.id || generateId('form'),
    title: overrides.title || 'Untitled Form',
    description: overrides.description || '',
    themeColor: overrides.themeColor || '#4f46e5',
    acceptResponses: overrides.acceptResponses ?? true,
    allowMultiple: overrides.allowMultiple ?? true,
    sections: overrides.sections || [initialSection],
    questions: overrides.questions || initialQuestions,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}
