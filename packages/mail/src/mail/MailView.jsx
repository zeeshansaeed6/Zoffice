import React from 'react'
import { FolderList } from './FolderList.jsx'
import { MessageList } from './MessageList.jsx'
import { ReadingPane } from './ReadingPane.jsx'
import { ComposeModal } from './ComposeModal.jsx'
import { AccountSetupModal } from './AccountSetupModal.jsx'
import { useMailStore } from '../core/mail-store.js'

/**
 * 3-Pane Mail View for ZMail.
 */
export function MailView() {
  const { setAccountModalOpen } = useMailStore()

  return (
    <div className="flex flex-1 overflow-hidden" data-testid="zmail-view">
      <FolderList onOpenAccountSetup={() => setAccountModalOpen(true)} />
      <MessageList />
      <ReadingPane />

      <ComposeModal />
      <AccountSetupModal />
    </div>
  )
}
