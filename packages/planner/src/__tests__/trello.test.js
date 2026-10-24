import { describe, it, expect } from 'vitest'
import { importTrelloBoard, exportBoardToJson } from '../core/trello-importer.js'
import { createBoard } from '../core/planner-model.js'
import { PRIORITY } from '../core/constants.js'

describe('Trello Importer & Exporter', () => {
  it('imports trello board JSON successfully', () => {
    const trelloData = {
      name: 'Launch Roadmap',
      desc: 'Q3 launch activities',
      lists: [
        { id: 'list-1', name: 'Ready', closed: false },
        { id: 'list-2', name: 'Archived', closed: true },
        { id: 'list-3', name: 'Done', closed: false },
      ],
      cards: [
        {
          id: 'card-1',
          idList: 'list-1',
          name: 'Publish landing page',
          desc: 'With live demo',
          labels: [{ color: 'red', name: 'urgent' }],
          closed: false,
        },
        {
          id: 'card-2',
          idList: 'list-3',
          name: 'Setup CDN',
          labels: [{ color: 'green', name: 'low' }],
          closed: false,
        },
      ],
      checklists: [
        {
          id: 'chk-1',
          idCard: 'card-1',
          checkItems: [
            { id: 'ci-1', name: 'Copy review', state: 'complete' },
            { id: 'ci-2', name: 'Asset export', state: 'incomplete' },
          ],
        },
      ],
    }

    const board = importTrelloBoard(trelloData)
    expect(board.title).toBe('Launch Roadmap')
    expect(board.columns.length).toBe(2) // 2 open lists
    expect(board.tasks.length).toBe(2)

    const urgentTask = board.tasks.find((t) => t.title === 'Publish landing page')
    expect(urgentTask).toBeDefined()
    expect(urgentTask.priority).toBe(PRIORITY.URGENT)
    expect(urgentTask.checklist.length).toBe(2)
    expect(urgentTask.checklist[0].completed).toBe(true)
    expect(urgentTask.checklist[1].completed).toBe(false)
  })

  it('exports board to JSON string', () => {
    const board = createBoard({ title: 'Export Test' })
    const jsonStr = exportBoardToJson(board)
    const parsed = JSON.parse(jsonStr)
    expect(parsed.title).toBe('Export Test')
    expect(parsed.columns).toBeDefined()
    expect(parsed.tasks).toBeDefined()
  })

  it('throws on invalid trello input', () => {
    expect(() => importTrelloBoard(null)).toThrow()
  })
})
