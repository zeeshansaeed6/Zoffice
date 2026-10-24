import { describe, it, expect, beforeEach } from 'vitest'
import { useFormStore } from '../core/form-store.js'
import { QUESTION_TYPES, FORM_TABS } from '../core/constants.js'

describe('ZForms Zustand Store', () => {
  beforeEach(() => {
    useFormStore.getState().initForm()
  })

  it('initializes default form with sections and questions', () => {
    const state = useFormStore.getState()
    expect(state.form).toBeDefined()
    expect(state.form.sections.length).toBe(1)
    expect(state.form.questions.length).toBe(2)
    expect(state.activeTab).toBe(FORM_TABS.BUILDER)
    expect(state.responses.length).toBe(0)
  })

  it('manages form metadata and theme color', () => {
    const store = useFormStore.getState()
    store.setTitle('Quarterly Product Review')
    store.setDescription('Reviewing Q3 achievements and Q4 roadmaps')
    store.setThemeColor('#059669')

    const updated = useFormStore.getState().form
    expect(updated.title).toBe('Quarterly Product Review')
    expect(updated.description).toBe('Reviewing Q3 achievements and Q4 roadmaps')
    expect(updated.themeColor).toBe('#059669')
  })

  it('adds, updates, and deletes sections', () => {
    const store = useFormStore.getState()
    const sec2 = store.addSection()

    let state = useFormStore.getState()
    expect(state.form.sections.length).toBe(2)
    expect(state.activeSectionId).toBe(sec2.id)

    store.updateSection(sec2.id, { title: 'Feedback Details' })
    expect(useFormStore.getState().form.sections.find((s) => s.id === sec2.id).title).toBe(
      'Feedback Details',
    )

    store.deleteSection(sec2.id)
    state = useFormStore.getState()
    expect(state.form.sections.length).toBe(1)
    expect(state.form.sections.some((s) => s.id === sec2.id)).toBe(false)
  })

  it('adds, duplicates, updates, and deletes questions', () => {
    const store = useFormStore.getState()
    const q = store.addQuestion(undefined, {
      title: 'Which operating system do you use?',
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
    })

    let state = useFormStore.getState()
    expect(state.form.questions.some((item) => item.id === q.id)).toBe(true)

    // Update
    store.updateQuestion(q.id, { required: true })
    expect(useFormStore.getState().form.questions.find((item) => item.id === q.id).required).toBe(
      true,
    )

    // Duplicate
    store.duplicateQuestion(q.id)
    state = useFormStore.getState()
    expect(state.form.questions.some((item) => item.title.includes('(Copy)'))).toBe(true)

    // Delete
    store.deleteQuestion(q.id)
    expect(useFormStore.getState().form.questions.some((item) => item.id === q.id)).toBe(false)
  })

  it('manages choice options on choice questions', () => {
    const store = useFormStore.getState()
    const q = store.addQuestion(undefined, {
      type: QUESTION_TYPES.MULTIPLE_CHOICE,
      choices: [],
    })

    store.addChoice(q.id, 'Option Alpha')
    store.addChoice(q.id, 'Option Beta')

    const state = useFormStore.getState()
    let currentQ = state.form.questions.find((item) => item.id === q.id)
    expect(currentQ.choices.length).toBe(2)
    expect(currentQ.choices[0].text).toBe('Option Alpha')

    const firstChoiceId = currentQ.choices[0].id
    store.updateChoice(q.id, firstChoiceId, { text: 'Updated Alpha' })
    currentQ = useFormStore.getState().form.questions.find((item) => item.id === q.id)
    expect(currentQ.choices[0].text).toBe('Updated Alpha')

    store.deleteChoice(q.id, firstChoiceId)
    currentQ = useFormStore.getState().form.questions.find((item) => item.id === q.id)
    expect(currentQ.choices.length).toBe(1)
  })

  it('executes respondent preview navigation and response recording', () => {
    const store = useFormStore.getState()
    store.setActiveTab(FORM_TABS.PREVIEW)

    const q1Id = store.form.questions[0].id
    store.setAnswer(q1Id, 'Alex Rivers')

    const q2Id = store.form.questions[1].id
    store.setAnswer(q2Id, 'alex@zoffice.local')

    // Advance to end / submit
    const advanced = store.advanceSection()
    expect(advanced).toBe(true)

    const state = useFormStore.getState()
    expect(state.isSubmitted).toBe(true)
    expect(state.responses.length).toBe(1)
    expect(state.responses[0].answers[q1Id]).toBe('Alex Rivers')

    // Clear responses
    store.clearResponses()
    expect(useFormStore.getState().responses.length).toBe(0)
  })
})
