/**
 * ZForms Response Model — stores respondent answers.
 * @module response-model
 */

import { generateId } from './form-model.js'

/**
 * @typedef {Object} FormResponse
 * @property {string} id
 * @property {string} formId
 * @property {Record<string, any>} answers - Keyed by questionId
 * @property {number} submittedAt
 */

/**
 * Create a new form response record.
 * @param {string} formId
 * @param {Record<string, any>} [answers={}]
 * @param {Partial<FormResponse>} [overrides={}]
 * @returns {FormResponse}
 */
export function createResponse(formId, answers = {}, overrides = {}) {
  return {
    id: overrides.id || generateId('resp'),
    formId,
    answers: overrides.answers || answers,
    submittedAt: overrides.submittedAt || Date.now(),
  }
}
