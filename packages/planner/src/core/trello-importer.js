/**
 * ZPlanner Trello Importer & Board Exporter.
 * Converts Trello JSON board exports into native ZPlanner boards and exports boards to JSON.
 * @module trello-importer
 */

import { createBoard, createColumn, createTask, createChecklistItem } from './planner-model.js'
import { PRIORITY } from './constants.js'

/**
 * Map Trello label colors or text to ZPlanner PRIORITY.
 * @param {Array<{ color?: string, name?: string }>} labels
 * @returns {string}
 */
function mapTrelloPriority(labels = []) {
  for (const l of labels) {
    const color = (l.color || '').toLowerCase()
    const name = (l.name || '').toLowerCase()
    if (color === 'red' || name.includes('urgent')) return PRIORITY.URGENT
    if (color === 'orange' || name.includes('high')) return PRIORITY.HIGH
    if (color === 'yellow' || color === 'blue' || name.includes('medium')) return PRIORITY.MEDIUM
    if (color === 'green' || name.includes('low')) return PRIORITY.LOW
  }
  return PRIORITY.MEDIUM
}

/**
 * Import a Trello JSON export into a native ZPlanner board.
 *
 * @param {string|Object} trelloData - Raw JSON string or parsed object
 * @returns {import('./planner-model.js').Board}
 */
export function importTrelloBoard(trelloData) {
  const data = typeof trelloData === 'string' ? JSON.parse(trelloData) : trelloData
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid Trello JSON data format')
  }

  const boardTitle = data.name || 'Imported Trello Board'
  const boardDesc = data.desc || ''

  // 1. Map open lists to columns
  const rawLists = Array.isArray(data.lists) ? data.lists.filter((l) => !l.closed) : []
  /** @type {Map<string, string>} trelloListId -> zplannerColId */
  const listIdMap = new Map()

  const columns = rawLists.map((list, idx) => {
    const col = createColumn('', list.name || `Column ${idx + 1}`, { order: idx })
    listIdMap.set(list.id, col.id)
    return col
  })

  // 2. Map checklists
  /** @type {Map<string, import('./planner-model.js').ChecklistItem[]>} */
  const checklistMap = new Map()
  if (Array.isArray(data.checklists)) {
    for (const chk of data.checklists) {
      const cardId = chk.idCard
      if (!checklistMap.has(cardId)) checklistMap.set(cardId, [])
      if (Array.isArray(chk.checkItems)) {
        for (const item of chk.checkItems) {
          checklistMap
            .get(cardId)
            .push(createChecklistItem(item.name || '', item.state === 'complete'))
        }
      }
    }
  }

  // 3. Map cards to tasks
  const rawCards = Array.isArray(data.cards) ? data.cards.filter((c) => !c.closed) : []
  const tasks = []

  for (const card of rawCards) {
    const targetColId = listIdMap.get(card.idList) || columns[0]?.id || ''
    const priority = mapTrelloPriority(card.labels)
    const checklist = checklistMap.get(card.id) || []

    const t = createTask(targetColId, '', {
      title: card.name || 'Untitled Card',
      description: card.desc || '',
      priority,
      startDate: card.start || undefined,
      dueDate: card.due || undefined,
      checklist,
      order: card.pos || 0,
    })
    tasks.push(t)
  }

  return createBoard({
    title: boardTitle,
    description: boardDesc,
    columns: columns.length > 0 ? columns : undefined,
    tasks,
  })
}

/**
 * Export a ZPlanner board to a formatted JSON string.
 *
 * @param {import('./planner-model.js').Board} board
 * @returns {string}
 */
export function exportBoardToJson(board) {
  return JSON.stringify(board, null, 2)
}
