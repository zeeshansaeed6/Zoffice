/**
 * ZNotes page templates — predefined page layouts with blocks.
 * @module templates
 */

import { BLOCK_TYPES } from './constants.js'
import { createPage, createBlock } from './notebook-model.js'

/**
 * @typedef {Object} PageTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon - Lucide icon name
 * @property {Function} create - Factory function returning a Page
 */

/** @type {PageTemplate[]} */
export const PAGE_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start with an empty canvas',
    icon: 'File',
    create: (sectionId) => createPage(sectionId, { title: 'Untitled Page' }),
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Structured notes with agenda, attendees, and action items',
    icon: 'Users',
    create: (sectionId) => {
      const pg = createPage(sectionId, { title: 'Meeting Notes' })
      pg.blocks = [
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: '📅 Meeting Notes — ' + new Date().toLocaleDateString(),
          x: 40, y: 20, width: 500, height: 36,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Attendees: ',
          x: 40, y: 70, width: 500, height: 30,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Agenda:',
          x: 40, y: 120, width: 500, height: 30,
        }),
        createBlock(pg.id, BLOCK_TYPES.CHECKLIST, {
          content: JSON.stringify({
            items: [
              { text: 'Action item 1', checked: false },
              { text: 'Action item 2', checked: false },
            ],
          }),
          x: 40, y: 170, width: 400, height: 80,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Notes:',
          x: 40, y: 270, width: 500, height: 30,
        }),
      ]
      return pg
    },
  },
  {
    id: 'todo-list',
    name: 'To-Do List',
    description: 'Task checklist with categories',
    icon: 'CheckSquare',
    create: (sectionId) => {
      const pg = createPage(sectionId, { title: 'To-Do List', tags: ['todo'] })
      pg.blocks = [
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: '✅ To-Do List',
          x: 40, y: 20, width: 400, height: 36,
        }),
        createBlock(pg.id, BLOCK_TYPES.CHECKLIST, {
          content: JSON.stringify({
            items: [
              { text: 'High priority task', checked: false },
              { text: 'Medium priority task', checked: false },
              { text: 'Low priority task', checked: false },
            ],
          }),
          x: 40, y: 70, width: 400, height: 120,
        }),
      ]
      return pg
    },
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Overview with goals, timeline, and milestones',
    icon: 'Target',
    create: (sectionId) => {
      const pg = createPage(sectionId, { title: 'Project Plan' })
      pg.blocks = [
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: '🎯 Project Plan',
          x: 40, y: 20, width: 500, height: 36,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Goal:',
          x: 40, y: 70, width: 500, height: 30,
        }),
        createBlock(pg.id, BLOCK_TYPES.TABLE, {
          content: JSON.stringify({
            rows: [
              ['Milestone', 'Due Date', 'Status'],
              ['Phase 1', '', 'Not Started'],
              ['Phase 2', '', 'Not Started'],
            ],
          }),
          x: 40, y: 120, width: 500, height: 120,
        }),
      ]
      return pg
    },
  },
  {
    id: 'lecture-notes',
    name: 'Lecture Notes',
    description: 'Organized notes with key concepts and questions',
    icon: 'GraduationCap',
    create: (sectionId) => {
      const pg = createPage(sectionId, { title: 'Lecture Notes' })
      pg.blocks = [
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: '📖 Lecture Notes — ' + new Date().toLocaleDateString(),
          x: 40, y: 20, width: 500, height: 36,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Topic:',
          x: 40, y: 70, width: 500, height: 30,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Key Concepts:',
          x: 40, y: 120, width: 500, height: 30,
        }),
        createBlock(pg.id, BLOCK_TYPES.TEXT, {
          content: 'Questions:',
          x: 40, y: 280, width: 500, height: 30, order: 4,
        }),
      ]
      pg.tags = ['question']
      return pg
    },
  },
]

/**
 * Get a template by ID.
 * @param {string} id
 * @returns {PageTemplate|undefined}
 */
export function getTemplate(id) {
  return PAGE_TEMPLATES.find((t) => t.id === id)
}
