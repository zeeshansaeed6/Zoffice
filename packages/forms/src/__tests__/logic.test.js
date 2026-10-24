import { describe, it, expect } from 'vitest'
import { getNextSection, validateSection } from '../core/logic-engine.js'
import { createSection, createQuestion, createChoice } from '../core/form-model.js'
import { QUESTION_TYPES, BRANCHING_ACTIONS } from '../core/constants.js'

describe('ZForms Logic Engine & Validation', () => {
  const sec1 = createSection({ id: 'sec-1', title: 'Intro', order: 0 })
  const sec2 = createSection({ id: 'sec-2', title: 'Developer Questions', order: 1 })
  const sec3 = createSection({ id: 'sec-3', title: 'Designer Questions', order: 2 })
  const sec4 = createSection({ id: 'sec-4', title: 'Summary', order: 3 })
  const sections = [sec1, sec2, sec3, sec4]

  const choiceDev = createChoice('Developer', {
    action: BRANCHING_ACTIONS.GO_TO_SECTION,
    targetSectionId: 'sec-2',
  })
  const choiceDes = createChoice('Designer', {
    action: BRANCHING_ACTIONS.GO_TO_SECTION,
    targetSectionId: 'sec-3',
  })
  const choiceExit = createChoice('Not Applicable', {
    action: BRANCHING_ACTIONS.SUBMIT_FORM,
  })

  const qRole = createQuestion({
    id: 'q-role',
    sectionId: 'sec-1',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    choices: [choiceDev, choiceDes, choiceExit],
    required: true,
  })

  it('routes to specific section based on choice branching rule', () => {
    // When Developer is picked -> sec-2
    const resDev = getNextSection('sec-1', sections, [qRole], { 'q-role': 'Developer' })
    expect(resDev.nextSectionId).toBe('sec-2')
    expect(resDev.shouldSubmit).toBe(false)

    // When Designer is picked -> sec-3
    const resDes = getNextSection('sec-1', sections, [qRole], { 'q-role': 'Designer' })
    expect(resDes.nextSectionId).toBe('sec-3')
    expect(resDes.shouldSubmit).toBe(false)
  })

  it('triggers immediate submission when choice branching specifies submit_form', () => {
    const resExit = getNextSection('sec-1', sections, [qRole], { 'q-role': 'Not Applicable' })
    expect(resExit.shouldSubmit).toBe(true)
    expect(resExit.nextSectionId).toBeNull()
  })

  it('advances sequentially when no question branching rule matches', () => {
    const qText = createQuestion({ id: 'q-text', sectionId: 'sec-2' })
    const resSeq = getNextSection('sec-2', sections, [qText], {})
    expect(resSeq.nextSectionId).toBe('sec-3')
    expect(resSeq.shouldSubmit).toBe(false)
  })

  it('submits on final section', () => {
    const resFinal = getNextSection('sec-4', sections, [], {})
    expect(resFinal.shouldSubmit).toBe(true)
    expect(resFinal.nextSectionId).toBeNull()
  })

  it('validates required fields in a section', () => {
    const qReqText = createQuestion({
      id: 'q-req-1',
      sectionId: 'sec-1',
      type: QUESTION_TYPES.SHORT_TEXT,
      required: true,
    })
    const qReqCheck = createQuestion({
      id: 'q-req-2',
      sectionId: 'sec-1',
      type: QUESTION_TYPES.CHECKBOXES,
      required: true,
    })
    const qOpt = createQuestion({
      id: 'q-opt',
      sectionId: 'sec-1',
      type: QUESTION_TYPES.PARAGRAPH,
      required: false,
    })

    const questions = [qReqText, qReqCheck, qOpt]

    // Missing required fields
    const invalidRes = validateSection('sec-1', questions, {})
    expect(invalidRes.isValid).toBe(false)
    expect(invalidRes.errors['q-req-1']).toBeDefined()
    expect(invalidRes.errors['q-req-2']).toBeDefined()
    expect(invalidRes.errors['q-opt']).toBeUndefined()

    // Valid answers provided
    const validRes = validateSection('sec-1', questions, {
      'q-req-1': 'Alice',
      'q-req-2': ['Option 1'],
    })
    expect(validRes.isValid).toBe(true)
    expect(Object.keys(validRes.errors).length).toBe(0)
  })
})
