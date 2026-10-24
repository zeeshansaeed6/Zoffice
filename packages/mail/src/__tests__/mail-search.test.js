import { describe, it, expect } from 'vitest'
import { searchMessages } from '../core/mail-search.js'
import { createMessage, createAttachment } from '../core/mail-model.js'

describe('ZMail Search & Filter', () => {
  const msg1 = createMessage({
    id: 'm1',
    subject: 'Quarterly Sales Numbers',
    from: 'sales@company.com',
    to: ['me@zoffice.local'],
    bodyText: 'We achieved 120% of target in Q3.',
    unread: true,
    flagged: true,
    folderId: 'inbox',
    accountId: 'acc-1',
  })

  const msg2 = createMessage({
    id: 'm2',
    subject: 'Engineering All Hands',
    from: 'cto@company.com',
    to: ['eng-team@company.com'],
    bodyText: 'Please review the slide deck before Friday.',
    unread: false,
    flagged: false,
    folderId: 'inbox',
    accountId: 'acc-1',
    attachments: [createAttachment({ filename: 'slides.pptx' })],
  })

  const msg3 = createMessage({
    id: 'm3',
    subject: 'Draft Proposal',
    from: 'me@zoffice.local',
    to: ['client@partner.com'],
    bodyText: 'Attached is our service proposal.',
    folderId: 'drafts',
    accountId: 'acc-2',
    unread: false,
    flagged: false,
  })

  const all = [msg1, msg2, msg3]

  it('searches by keyword matching subject', () => {
    const results = searchMessages(all, { query: 'sales' })
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('m1')
  })

  it('searches by keyword matching body text', () => {
    const results = searchMessages(all, { query: 'Friday' })
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('m2')
  })

  it('searches by keyword matching attachment filename', () => {
    const results = searchMessages(all, { query: 'slides.pptx' })
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('m2')
  })

  it('filters by folderId and accountId', () => {
    expect(searchMessages(all, { folderId: 'drafts' }).length).toBe(1)
    expect(searchMessages(all, { accountId: 'acc-1' }).length).toBe(2)
  })

  it('filters by unreadOnly and flaggedOnly', () => {
    expect(searchMessages(all, { unreadOnly: true }).length).toBe(1)
    expect(searchMessages(all, { flaggedOnly: true }).length).toBe(1)
  })

  it('filters by hasAttachments', () => {
    const results = searchMessages(all, { hasAttachments: true })
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('m2')
  })
})
