/**
 * ZMail vCard (RFC 6350) — import and export .vcf address book files.
 * @module vcard
 */

import { createContact } from './contact-model.js'

/**
 * Export contacts to a .vcf vCard 3.0 string.
 * @param {import('./contact-model.js').Contact[]} contacts
 * @returns {string}
 */
export function exportToVcard(contacts = []) {
  const cards = []

  for (const c of contacts) {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${c.name || 'Unnamed'}`]
    if (c.email) lines.push(`EMAIL;TYPE=INTERNET:${c.email}`)
    if (c.phone) lines.push(`TEL;TYPE=CELL:${c.phone}`)
    if (c.organization) lines.push(`ORG:${c.organization}`)
    if (c.notes) lines.push(`NOTE:${c.notes.replace(/\n/g, '\\n')}`)
    lines.push('END:VCARD')
    cards.push(lines.join('\r\n'))
  }

  return cards.join('\r\n')
}

/**
 * Parse a .vcf vCard file string into contact objects.
 * @param {string} vcfContent
 * @returns {import('./contact-model.js').Contact[]}
 */
export function parseVcard(vcfContent = '') {
  if (!vcfContent.includes('BEGIN:VCARD')) return []

  const contacts = []
  const cardBlocks = vcfContent.split('BEGIN:VCARD').slice(1)

  for (const block of cardBlocks) {
    const lines = block.split(/\r?\n/)
    let name = 'Imported Contact'
    let email = ''
    let phone = ''
    let organization = ''
    let notes = ''

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (line.startsWith('FN:') || line.startsWith('FN;')) {
        name = line.split(':')[1]?.trim() || name
      } else if (line.startsWith('EMAIL') && line.includes(':')) {
        email = line.split(':')[1]?.trim() || ''
      } else if (line.startsWith('TEL') && line.includes(':')) {
        phone = line.split(':')[1]?.trim() || ''
      } else if (line.startsWith('ORG:')) {
        organization = line.slice(4).trim()
      } else if (line.startsWith('NOTE:')) {
        notes = line.slice(5).replace(/\\n/g, '\n').trim()
      }
    }

    // Skip empty dummy blocks
    if (!email && !phone && (!name || name === 'Imported Contact')) {
      continue
    }

    contacts.push(
      createContact({
        name,
        email,
        phone,
        organization,
        notes,
      }),
    )
  }

  return contacts
}
