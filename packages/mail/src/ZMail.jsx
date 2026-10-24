import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { Mail, Calendar, Users } from 'lucide-react'
import { getMailRibbonConfig } from './ribbon/ribbon-config.jsx'
import { MailView } from './mail/MailView.jsx'
import { CalendarView } from './calendar/CalendarView.jsx'
import { ContactList } from './contacts/ContactList.jsx'
import { useMailStore } from './core/mail-store.js'
import { useCalendarStore } from './calendar/calendar-store.js'
import { useContactStore } from './contacts/contact-store.js'
import { exportToIcs, parseIcs } from './calendar/ics.js'
import { exportToVcard, parseVcard } from './contacts/vcard.js'
import { downloadTextFile } from './core/file-download.js'

/**
 * ZMail Desktop Suite Component — Mail, Calendar, and Contacts.
 *
 * @param {Object} props
 * @param {string} props.id - Document tab ID
 * @param {string} [props.title='ZMail'] - Tab title
 * @param {string} [props.initialContent=''] - Stored state JSON
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZMail({
  id: _id,
  title: _title = 'ZMail',
  initialContent: _initialContent = '',
  onChange,
  onSave,
}) {
  const [activeSection, setActiveSection] = useState('mail') // 'mail' | 'calendar' | 'contacts'
  const icsInputRef = useRef(null)
  const vcfInputRef = useRef(null)

  const {
    messages,
    activeFolderId,
    initDefault: initMail,
    openCompose,
    deleteMessage,
    activeMessageId,
    toggleFlag,
    toggleUnread,
    setAccountModalOpen,
  } = useMailStore()

  const {
    events,
    selectedDate,
    viewMode,
    initDefault: initCalendar,
    openCreateEvent,
    setViewMode,
    setSelectedDate,
  } = useCalendarStore()

  const { contacts, initDefault: initContacts, openCreateContact } = useContactStore()

  // Initialize defaults on mount
  useEffect(() => {
    initMail()
    initCalendar()
    initContacts()
  }, [initMail, initCalendar, initContacts])

  // Notify parent of state changes
  useEffect(() => {
    if (onChange && messages.length > 0) {
      onChange(JSON.stringify({ messages, events, contacts }))
    }
  }, [messages, events, contacts, onChange])

  const handleImportIcs = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const parsed = parseIcs(String(event.target?.result || ''))
      parsed.forEach((ev) => useCalendarStore.getState().addEvent(ev))
    }
    reader.readAsText(file)
  }

  const handleImportVcf = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const parsed = parseVcard(String(event.target?.result || ''))
      parsed.forEach((c) => useContactStore.getState().addContact(c))
    }
    reader.readAsText(file)
  }

  const ribbonActions = useMemo(() => {
    const handleToday = () => setSelectedDate(new Date())
    const handlePrevDate = () => {
      const d = new Date(selectedDate)
      if (viewMode === 'month') d.setMonth(d.getMonth() - 1)
      else if (viewMode === 'day') d.setDate(d.getDate() - 1)
      else d.setDate(d.getDate() - 7)
      setSelectedDate(d)
    }
    const handleNextDate = () => {
      const d = new Date(selectedDate)
      if (viewMode === 'month') d.setMonth(d.getMonth() + 1)
      else if (viewMode === 'day') d.setDate(d.getDate() + 1)
      else d.setDate(d.getDate() + 7)
      setSelectedDate(d)
    }

    const handleExportIcs = () => {
      const icsText = exportToIcs(events)
      downloadTextFile(icsText, 'calendar-export.ics', 'text/calendar')
    }

    const handleExportVcf = () => {
      const vcfText = exportToVcard(contacts)
      downloadTextFile(vcfText, 'contacts-export.vcf', 'text/vcard')
    }

    const handleSave = () => {
      if (onSave) {
        onSave(JSON.stringify({ messages, events, contacts }, null, 2))
      }
    }

    return {
      onSave: handleSave,
      canSave: true,
      onNewEmail: () => openCompose(),
      onDeleteMessage: () => activeMessageId && deleteMessage(activeMessageId),
      onArchiveMessage: () =>
        activeMessageId && useMailStore.getState().moveMessage(activeMessageId, 'archive'),
      onReply: () => {
        const msg = messages.find((m) => m.id === activeMessageId)
        if (msg) openCompose({ to: msg.from, subject: `Re: ${msg.subject}` })
      },
      onReplyAll: () => {
        const msg = messages.find((m) => m.id === activeMessageId)
        if (msg) openCompose({ to: msg.from, subject: `Re: ${msg.subject}` })
      },
      onForward: () => {
        const msg = messages.find((m) => m.id === activeMessageId)
        if (msg) openCompose({ subject: `Fwd: ${msg.subject}`, body: msg.bodyText })
      },
      onToggleFlag: () => activeMessageId && toggleFlag(activeMessageId),
      onToggleUnread: () => activeMessageId && toggleUnread(activeMessageId),
      onOpenAccountSettings: () => setAccountModalOpen(true),
      onNewFolder: () => {},
      onMarkAllRead: () => {
        messages.forEach((m) => {
          if (m.folderId === activeFolderId && m.unread) toggleUnread(m.id)
        })
      },
      onNewEvent: () => openCreateEvent(),
      onToday: handleToday,
      onPrevDate: handlePrevDate,
      onNextDate: handleNextDate,
      onSetCalendarView: (mode) => setViewMode(mode),
      onExportIcs: handleExportIcs,
      onImportIcs: () => icsInputRef.current?.click(),
      onNewContact: () => openCreateContact(),
      onEditContact: () => {
        const id = useContactStore.getState().activeContactId
        if (id) useContactStore.getState().openEditContact(id)
      },
      onDeleteContact: () => {
        const id = useContactStore.getState().activeContactId
        if (id) useContactStore.getState().deleteContact(id)
      },
      onExportVcard: handleExportVcf,
      onImportVcard: () => vcfInputRef.current?.click(),
    }
  }, [
    onSave,
    messages,
    events,
    contacts,
    openCompose,
    activeMessageId,
    deleteMessage,
    toggleFlag,
    toggleUnread,
    setAccountModalOpen,
    activeFolderId,
    openCreateEvent,
    setViewMode,
    openCreateContact,
    selectedDate,
    viewMode,
    setSelectedDate,
  ])

  const ribbonConfig = useMemo(
    () => getMailRibbonConfig(ribbonActions, activeSection),
    [ribbonActions, activeSection],
  )

  const unreadCount = messages.filter((m) => m.unread).length

  return (
    <div
      data-testid="zmail-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left App Switcher Bar (Outlook style) */}
        <div className="flex w-12 flex-col items-center justify-between border-r border-neutral-200 bg-neutral-100 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              data-testid="switcher-mail"
              onClick={() => setActiveSection('mail')}
              title="Mail"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                activeSection === 'mail'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Mail size={18} />
            </button>
            <button
              type="button"
              data-testid="switcher-calendar"
              onClick={() => setActiveSection('calendar')}
              title="Calendar"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                activeSection === 'calendar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Calendar size={18} />
            </button>
            <button
              type="button"
              data-testid="switcher-contacts"
              onClick={() => setActiveSection('contacts')}
              title="People / Contacts"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                activeSection === 'contacts'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <Users size={18} />
            </button>
          </div>
        </div>

        {/* Content View */}
        {activeSection === 'mail' && <MailView />}
        {activeSection === 'calendar' && <CalendarView />}
        {activeSection === 'contacts' && <ContactList />}
      </div>

      {/* Hidden file inputs for ICS and VCF import */}
      <input
        ref={icsInputRef}
        type="file"
        accept=".ics"
        className="hidden"
        onChange={handleImportIcs}
      />
      <input
        ref={vcfInputRef}
        type="file"
        accept=".vcf"
        className="hidden"
        onChange={handleImportVcf}
      />

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              {activeSection === 'mail'
                ? `${messages.length} items (${unreadCount} unread)`
                : activeSection === 'calendar'
                  ? `${events.length} events scheduled`
                  : `${contacts.length} contacts`}
            </StatusBarSlot>
            <StatusBarSlot>All folders up to date</StatusBarSlot>
            <StatusBarSlot>Connected (Offline-First Cache)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
      />
    </div>
  )
}
