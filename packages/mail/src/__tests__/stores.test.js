import { describe, it, expect, beforeEach } from 'vitest'
import { useMailStore } from '../core/mail-store.js'
import { useCalendarStore } from '../calendar/calendar-store.js'
import { useContactStore } from '../contacts/contact-store.js'
import { FOLDER_TYPES, CALENDAR_VIEWS } from '../core/constants.js'

describe('ZMail & ZCalendar Zustand Stores', () => {
  beforeEach(() => {
    // Reset stores to empty initial states
    useMailStore.setState({
      accounts: [],
      activeAccountId: null,
      folders: [],
      activeFolderId: FOLDER_TYPES.INBOX,
      messages: [],
      activeMessageId: null,
      searchQuery: '',
      filterMode: 'all',
      isComposeOpen: false,
      composeDraft: null,
    })

    useCalendarStore.setState({
      events: [],
      selectedDate: new Date().toISOString(),
      viewMode: CALENDAR_VIEWS.MONTH,
      activeEventId: null,
      isEventModalOpen: false,
      eventDraft: null,
    })

    useContactStore.setState({
      contacts: [],
      activeContactId: null,
      searchQuery: '',
      isContactModalOpen: false,
      contactDraft: null,
    })
  })

  describe('useMailStore', () => {
    it('initializes default account and sample emails', () => {
      const store = useMailStore.getState()
      store.initDefault()

      const updated = useMailStore.getState()
      expect(updated.accounts.length).toBe(1)
      expect(updated.folders.length).toBe(6)
      expect(updated.messages.length).toBe(2)
      expect(updated.activeAccountId).toBe(updated.accounts[0].id)
    })

    it('adds and deletes accounts with associated folders and messages', () => {
      const store = useMailStore.getState()
      const newAcc = store.addAccount({
        name: 'Work Email',
        email: 'work@zoffice.local',
      })

      let state = useMailStore.getState()
      expect(state.accounts.some((a) => a.id === newAcc.id)).toBe(true)
      expect(state.folders.filter((f) => f.accountId === newAcc.id).length).toBe(5)

      store.deleteAccount(newAcc.id)
      state = useMailStore.getState()
      expect(state.accounts.some((a) => a.id === newAcc.id)).toBe(false)
      expect(state.folders.filter((f) => f.accountId === newAcc.id).length).toBe(0)
    })

    it('manages compose drafts and sending messages', () => {
      const store = useMailStore.getState()
      store.initDefault()

      store.openCompose({
        to: ['colleague@zoffice.org'],
        subject: 'Quick Question',
        bodyText: 'Do you have time for a sync today?',
      })

      let state = useMailStore.getState()
      expect(state.isComposeOpen).toBe(true)
      expect(state.composeDraft.subject).toBe('Quick Question')

      store.sendMessage()
      state = useMailStore.getState()
      expect(state.isComposeOpen).toBe(false)
      expect(state.composeDraft).toBeNull()

      const sentMsg = state.messages.find((m) => m.folderId === FOLDER_TYPES.SENT)
      expect(sentMsg).toBeDefined()
      expect(sentMsg.subject).toBe('Quick Question')
    })

    it('toggles flags and deletes messages to trash', () => {
      const store = useMailStore.getState()
      store.initDefault()

      const initialMsgs = useMailStore.getState().messages
      const targetId = initialMsgs[0].id
      const initialFlag = initialMsgs[0].flagged

      store.toggleFlag(targetId)
      expect(useMailStore.getState().messages.find((m) => m.id === targetId).flagged).toBe(
        !initialFlag,
      )

      store.deleteMessage(targetId)
      const movedMsg = useMailStore.getState().messages.find((m) => m.id === targetId)
      expect(movedMsg.folderId).toBe(FOLDER_TYPES.TRASH)

      // Deleting again permanently removes it
      store.deleteMessage(targetId)
      expect(useMailStore.getState().messages.find((m) => m.id === targetId)).toBeUndefined()
    })
  })

  describe('useCalendarStore', () => {
    it('initializes default sample events and supports event CRUD', () => {
      const calStore = useCalendarStore.getState()
      calStore.initDefault()

      let state = useCalendarStore.getState()
      expect(state.events.length).toBe(2)

      const newEv = calStore.addEvent({
        title: 'Team Retrospective',
        startDate: '2026-10-25T14:00:00.000Z',
        endDate: '2026-10-25T15:00:00.000Z',
        location: 'Meeting Room 2',
      })

      state = useCalendarStore.getState()
      expect(state.events.some((e) => e.id === newEv.id)).toBe(true)

      calStore.updateEvent(newEv.id, { location: 'Virtual' })
      expect(useCalendarStore.getState().events.find((e) => e.id === newEv.id).location).toBe(
        'Virtual',
      )

      calStore.deleteEvent(newEv.id)
      expect(useCalendarStore.getState().events.some((e) => e.id === newEv.id)).toBe(false)
    })

    it('switches view mode and navigates dates', () => {
      const calStore = useCalendarStore.getState()
      calStore.setViewMode(CALENDAR_VIEWS.WEEK)
      expect(useCalendarStore.getState().viewMode).toBe(CALENDAR_VIEWS.WEEK)

      const targetDate = new Date(2026, 11, 25)
      calStore.setSelectedDate(targetDate)
      expect(new Date(useCalendarStore.getState().selectedDate).getMonth()).toBe(11)
    })
  })

  describe('useContactStore', () => {
    it('initializes default contacts and manages contact lifecycle', () => {
      const cStore = useContactStore.getState()
      cStore.initDefault()

      let state = useContactStore.getState()
      expect(state.contacts.length).toBe(2)

      const created = cStore.addContact({
        name: 'Grace Hopper',
        email: 'grace@navy.mil',
        organization: 'US Navy',
      })

      state = useContactStore.getState()
      expect(state.contacts.some((c) => c.id === created.id)).toBe(true)

      cStore.updateContact(created.id, { phone: '+1 800 555 1234' })
      expect(useContactStore.getState().contacts.find((c) => c.id === created.id).phone).toBe(
        '+1 800 555 1234',
      )

      cStore.deleteContact(created.id)
      expect(useContactStore.getState().contacts.some((c) => c.id === created.id)).toBe(false)
    })
  })
})
