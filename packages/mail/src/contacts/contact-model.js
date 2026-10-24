/**
 * ZMail Contacts Data Models — factory functions for contacts.
 * @module contact-model
 */

import { generateId } from '../core/mail-model.js'

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [organization]
 * @property {string} [notes]
 * @property {string} [avatarColor]
 * @property {number} createdAt
 * @property {number} updatedAt
 */

const AVATAR_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#16a34a',
  '#0891b2',
  '#4f46e5',
  '#d97706',
]

/**
 * Create a new address book contact.
 * @param {Partial<Contact>} [overrides={}]
 * @returns {Contact}
 */
export function createContact(overrides = {}) {
  const now = Date.now()
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

  return {
    id: overrides.id || generateId('cnt'),
    name: overrides.name || 'New Contact',
    email: overrides.email || '',
    phone: overrides.phone || '',
    organization: overrides.organization || '',
    notes: overrides.notes || '',
    avatarColor: overrides.avatarColor || randomColor,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
  }
}
