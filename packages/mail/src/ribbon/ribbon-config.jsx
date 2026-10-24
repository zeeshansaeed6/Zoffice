/**
 * Creates data-driven ribbon configuration for ZMail & ZCalendar.
 * Assembles modular ribbon tabs across Mail, Calendar, and Contacts.
 * @module ribbon-config
 */

import { getMailTabs } from './ribbon-mail.jsx'
import { getCalendarTabs } from './ribbon-calendar.jsx'
import { getContactTabs } from './ribbon-contacts.jsx'

/**
 * Creates data-driven ribbon configuration for ZMail & ZCalendar.
 *
 * @param {Object} [actions={}]
 * @param {'mail' | 'calendar' | 'contacts'} [activeSection='mail']
 * @returns {any}
 */
export function getMailRibbonConfig(actions = {}, activeSection = 'mail') {
  const commonRibbon = {
    appId: 'mail',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    onUndo: actions.onUndo,
    onRedo: actions.onRedo,
    canUndo: actions.canUndo,
    canRedo: actions.canRedo,
    canSave: actions.canSave !== false,
  }

  if (activeSection === 'calendar') {
    return {
      ...commonRibbon,
      tabs: getCalendarTabs(actions),
    }
  }

  if (activeSection === 'contacts') {
    return {
      ...commonRibbon,
      tabs: getContactTabs(actions),
    }
  }

  // Default: Mail Ribbon
  return {
    ...commonRibbon,
    tabs: getMailTabs(actions),
  }
}
