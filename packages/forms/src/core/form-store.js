/**
 * ZForms Zustand Store — manages form definition, builder state, preview mode, and responses.
 * @module form-store
 */

import { create } from 'zustand'
import { createForm, createSection, createQuestion, createChoice } from './form-model.js'
import { createResponse } from './response-model.js'
import { getNextSection, validateSection } from './logic-engine.js'
import { FORM_TABS } from './constants.js'

export const useFormStore = create((set, get) => ({
  form: createForm(),
  activeTab: FORM_TABS.BUILDER,
  activeSectionId: null,
  activeQuestionId: null,
  responses: [],

  // Modals
  isEmbedModalOpen: false,
  isBranchingModalOpen: false,
  branchingQuestionId: null,

  // Respondent / Preview State
  previewSectionId: null,
  previewAnswers: {},
  previewErrors: {},
  isSubmitted: false,

  /** Initialize or reset with a fresh form */
  initForm: (customForm) => {
    const f = customForm || createForm()
    set({
      form: f,
      activeSectionId: f.sections[0]?.id || null,
      activeQuestionId: f.questions[0]?.id || null,
      previewSectionId: f.sections[0]?.id || null,
      previewAnswers: {},
      previewErrors: {},
      isSubmitted: false,
    })
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab })
    if (tab === FORM_TABS.PREVIEW) {
      get().resetPreview()
    }
  },

  // Form Properties
  setTitle: (title) => set((s) => ({ form: { ...s.form, title, updatedAt: Date.now() } })),
  setDescription: (description) =>
    set((s) => ({ form: { ...s.form, description, updatedAt: Date.now() } })),
  setThemeColor: (themeColor) =>
    set((s) => ({ form: { ...s.form, themeColor, updatedAt: Date.now() } })),
  setFormSettings: (settings) =>
    set((s) => ({ form: { ...s.form, ...settings, updatedAt: Date.now() } })),

  // Section Management
  selectSection: (id) => set({ activeSectionId: id }),
  addSection: () => {
    const newSec = createSection({
      title: `Section ${get().form.sections.length + 1}`,
      order: get().form.sections.length,
    })
    set((s) => ({
      form: { ...s.form, sections: [...s.form.sections, newSec], updatedAt: Date.now() },
      activeSectionId: newSec.id,
    }))
    return newSec
  },
  updateSection: (id, updates) => {
    set((s) => ({
      form: {
        ...s.form,
        sections: s.form.sections.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec)),
        updatedAt: Date.now(),
      },
    }))
  },
  deleteSection: (id) => {
    set((s) => {
      if (s.form.sections.length <= 1) return s
      const nextSections = s.form.sections.filter((sec) => sec.id !== id)
      const nextQuestions = s.form.questions.filter((q) => q.sectionId !== id)
      return {
        form: {
          ...s.form,
          sections: nextSections,
          questions: nextQuestions,
          updatedAt: Date.now(),
        },
        activeSectionId: nextSections[0]?.id || null,
      }
    })
  },

  // Question Management
  selectQuestion: (id) => set({ activeQuestionId: id }),
  addQuestion: (sectionId, overrides = {}) => {
    const secId = sectionId || get().activeSectionId || get().form.sections[0]?.id || ''
    const currentQuestions = get().form.questions
    const newQ = createQuestion({
      sectionId: secId,
      order: currentQuestions.length,
      ...overrides,
    })
    set((s) => ({
      form: { ...s.form, questions: [...s.form.questions, newQ], updatedAt: Date.now() },
      activeQuestionId: newQ.id,
      activeSectionId: secId,
    }))
    return newQ
  },
  updateQuestion: (id, updates) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        updatedAt: Date.now(),
      },
    }))
  },
  deleteQuestion: (id) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.filter((q) => q.id !== id),
        updatedAt: Date.now(),
      },
      activeQuestionId: s.activeQuestionId === id ? null : s.activeQuestionId,
    }))
  },
  duplicateQuestion: (id) => {
    const target = get().form.questions.find((q) => q.id === id)
    if (!target) return
    const clone = createQuestion({
      ...target,
      id: undefined,
      title: `${target.title} (Copy)`,
      order: target.order + 1,
    })
    set((s) => ({
      form: { ...s.form, questions: [...s.form.questions, clone], updatedAt: Date.now() },
      activeQuestionId: clone.id,
    }))
  },

  // Choice Management
  addChoice: (questionId, text) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId ? { ...q, choices: [...q.choices, createChoice(text)] } : q,
        ),
        updatedAt: Date.now(),
      },
    }))
  },
  updateChoice: (questionId, choiceId, updates) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                choices: q.choices.map((c) => (c.id === choiceId ? { ...c, ...updates } : c)),
              }
            : q,
        ),
        updatedAt: Date.now(),
      },
    }))
  },
  deleteChoice: (questionId, choiceId) => {
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) =>
          q.id === questionId ? { ...q, choices: q.choices.filter((c) => c.id !== choiceId) } : q,
        ),
        updatedAt: Date.now(),
      },
    }))
  },

  // Respondent / Preview Actions
  resetPreview: () => {
    const s = get()
    set({
      previewSectionId: s.form.sections[0]?.id || null,
      previewAnswers: {},
      previewErrors: {},
      isSubmitted: false,
    })
  },
  setAnswer: (questionId, value) => {
    set((s) => ({
      previewAnswers: { ...s.previewAnswers, [questionId]: value },
      previewErrors: { ...s.previewErrors, [questionId]: '' },
    }))
  },
  advanceSection: () => {
    const { previewSectionId, form, previewAnswers } = get()
    if (!previewSectionId) return

    const { isValid, errors } = validateSection(previewSectionId, form.questions, previewAnswers)
    if (!isValid) {
      set({ previewErrors: errors })
      return false
    }

    const { nextSectionId, shouldSubmit } = getNextSection(
      previewSectionId,
      form.sections,
      form.questions,
      previewAnswers,
    )

    if (shouldSubmit || !nextSectionId) {
      get().submitResponse()
      return true
    }

    set({ previewSectionId: nextSectionId, previewErrors: {} })
    return true
  },
  goToPrevSection: () => {
    const { previewSectionId, form } = get()
    const currentIndex = form.sections.findIndex((s) => s.id === previewSectionId)
    if (currentIndex > 0) {
      set({ previewSectionId: form.sections[currentIndex - 1].id, previewErrors: {} })
    }
  },
  submitResponse: () => {
    const { form, previewAnswers } = get()
    const newResp = createResponse(form.id, previewAnswers)
    set((s) => ({
      responses: [...s.responses, newResp],
      isSubmitted: true,
      previewErrors: {},
    }))
    return newResp
  },

  // Modals & UI
  setEmbedModalOpen: (open) => set({ isEmbedModalOpen: open }),
  setBranchingModalOpen: (open, questionId = null) =>
    set({ isBranchingModalOpen: open, branchingQuestionId: questionId }),
  clearResponses: () => set({ responses: [] }),
}))
