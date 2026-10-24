import { describe, it, expect } from 'vitest'
import {
  createForm,
  createSection,
  createQuestion,
  createChoice,
  generateId,
} from '../core/form-model.js'
import { createResponse } from '../core/response-model.js'
import { QUESTION_TYPES, BRANCHING_ACTIONS } from '../core/constants.js'

describe('ZForms Data Models', () => {
  it('generates unique prefixed IDs', () => {
    const formId = generateId('form')
    const qId = generateId('q')
    const secId = generateId('sec')

    expect(formId).toMatch(/^form-/)
    expect(qId).toMatch(/^q-/)
    expect(secId).toMatch(/^sec-/)
    expect(formId).not.toBe(qId)
  })

  it('creates form with default sections and questions', () => {
    const form = createForm({ title: 'Customer Feedback Survey' })

    expect(form.id).toMatch(/^form-/)
    expect(form.title).toBe('Customer Feedback Survey')
    expect(form.themeColor).toBe('#4f46e5')
    expect(form.acceptResponses).toBe(true)
    expect(form.allowMultiple).toBe(true)
    expect(form.sections.length).toBe(1)
    expect(form.questions.length).toBe(2)
    expect(form.questions[0].title).toBe('Full Name')
    expect(form.questions[1].title).toBe('Email Address')
  })

  it('creates choice options with branching defaults', () => {
    const choice = createChoice('Yes, definitely', {
      action: BRANCHING_ACTIONS.GO_TO_SECTION,
      targetSectionId: 'sec-2',
    })

    expect(choice.id).toMatch(/^opt-/)
    expect(choice.text).toBe('Yes, definitely')
    expect(choice.action).toBe(BRANCHING_ACTIONS.GO_TO_SECTION)
    expect(choice.targetSectionId).toBe('sec-2')
  })

  it('creates question with choice defaults for multiple choice', () => {
    const mcQ = createQuestion({
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      title: 'How satisfied are you?',
      required: true,
    })

    expect(mcQ.id).toMatch(/^q-/)
    expect(mcQ.type).toBe(QUESTION_TYPES.MULTIPLE_CHOICE)
    expect(mcQ.required).toBe(true)
    expect(mcQ.choices.length).toBe(2)
  })

  it('creates linear scale question with custom range and labels', () => {
    const scaleQ = createQuestion({
      type: QUESTION_TYPES.LINEAR_SCALE,
      title: 'Rate your overall experience',
      scaleMin: 1,
      scaleMax: 10,
      scaleMinLabel: 'Very Poor',
      scaleMaxLabel: 'Outstanding',
    })

    expect(scaleQ.scaleMin).toBe(1)
    expect(scaleQ.scaleMax).toBe(10)
    expect(scaleQ.scaleMinLabel).toBe('Very Poor')
    expect(scaleQ.scaleMaxLabel).toBe('Outstanding')
  })

  it('creates section breaks with default action and target', () => {
    const sec = createSection({
      title: 'Background Information',
      defaultAction: BRANCHING_ACTIONS.SUBMIT_FORM,
    })

    expect(sec.id).toMatch(/^sec-/)
    expect(sec.title).toBe('Background Information')
    expect(sec.defaultAction).toBe(BRANCHING_ACTIONS.SUBMIT_FORM)
  })

  it('creates response records with timestamp and answers dictionary', () => {
    const resp = createResponse('form-123', {
      'q-1': 'Jane Doe',
      'q-2': 'jane@example.com',
      'q-3': ['Feature A', 'Feature B'],
    })

    expect(resp.id).toMatch(/^resp-/)
    expect(resp.formId).toBe('form-123')
    expect(resp.answers['q-1']).toBe('Jane Doe')
    expect(resp.answers['q-3']).toEqual(['Feature A', 'Feature B'])
    expect(typeof resp.submittedAt).toBe('number')
  })
})
