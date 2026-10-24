import { describe, it, expect } from 'vitest'
import { normalizeSubject, groupIntoThreads } from '../core/threading.js'
import { createMessage } from '../core/mail-model.js'

describe('ZMail Conversation Threading', () => {
  it('normalizes email subjects removing reply and forward prefixes', () => {
    expect(normalizeSubject('Re: Project Status')).toBe('project status')
    expect(normalizeSubject('RE: Fwd: Re: Roadmap Update')).toBe('roadmap update')
    expect(normalizeSubject('Fwd: Meeting notes')).toBe('meeting notes')
    expect(normalizeSubject('Direct Message')).toBe('direct message')
  })

  it('groups messages with the same threadId into a conversation thread', () => {
    const msg1 = createMessage({
      threadId: 'thread-1',
      subject: 'Budget Discussion',
      from: 'alice@example.com',
      date: 1000,
      unread: false,
    })
    const msg2 = createMessage({
      threadId: 'thread-1',
      subject: 'Re: Budget Discussion',
      from: 'bob@example.com',
      date: 2000,
      unread: true,
    })
    const msg3 = createMessage({
      threadId: 'thread-2',
      subject: 'Design Review',
      from: 'carol@example.com',
      date: 1500,
      unread: false,
    })

    const threads = groupIntoThreads([msg1, msg2, msg3])

    expect(threads.length).toBe(2)
    // Most recent thread first
    expect(threads[0].threadId).toBe('thread-1')
    expect(threads[0].messages.length).toBe(2)
    expect(threads[0].hasUnread).toBe(true)
    expect(threads[0].senders).toContain('alice@example.com')
    expect(threads[0].senders).toContain('bob@example.com')

    expect(threads[1].threadId).toBe('thread-2')
    expect(threads[1].messages.length).toBe(1)
  })

  it('groups by normalized subject when threadId is not explicitly set', () => {
    const msg1 = createMessage({
      threadId: '',
      subject: 'Weekly Sync',
      from: 'alice@example.com',
      date: 1000,
    })
    const msg2 = createMessage({
      threadId: '',
      subject: 'Re: Weekly Sync',
      from: 'bob@example.com',
      date: 2000,
    })

    const threads = groupIntoThreads([msg1, msg2])
    expect(threads.length).toBe(1)
    expect(threads[0].messages.length).toBe(2)
  })

  it('handles empty message array gracefully', () => {
    expect(groupIntoThreads([])).toEqual([])
  })
})
