import { describe, it, expect } from 'vitest'
import { createContact } from '../contacts/contact-model.js'
import { exportToVcard, parseVcard } from '../contacts/vcard.js'

describe('ZMail Contacts & vCard Engine', () => {
  it('creates contact with defaults and custom fields', () => {
    const contact = createContact({
      name: 'Sarah Connor',
      email: 'sarah@skynet.resistance',
      phone: '+1 555 0199',
      organization: 'Cyberdyne Resistance',
      notes: 'Key contact for operations',
    })

    expect(contact.id).toMatch(/^cnt-/)
    expect(contact.name).toBe('Sarah Connor')
    expect(contact.email).toBe('sarah@skynet.resistance')
    expect(contact.phone).toBe('+1 555 0199')
    expect(contact.organization).toBe('Cyberdyne Resistance')
    expect(contact.notes).toBe('Key contact for operations')
    expect(contact.avatarColor).toMatch(/^#/)
  })

  it('exports contacts to RFC 6350 vCard format and parses back', () => {
    const contact1 = createContact({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      organization: 'Acme Corp',
      notes: 'Project manager',
    })

    const contact2 = createContact({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 987 654 3210',
      organization: 'Globex Inc',
      notes: 'Lead designer',
    })

    const vcf = exportToVcard([contact1, contact2])

    expect(vcf).toContain('BEGIN:VCARD')
    expect(vcf).toContain('VERSION:3.0')
    expect(vcf).toContain('FN:John Doe')
    expect(vcf).toContain('EMAIL;TYPE=INTERNET:john@example.com')
    expect(vcf).toContain('TEL;TYPE=CELL:+1 234 567 8900')
    expect(vcf).toContain('ORG:Acme Corp')
    expect(vcf).toContain('NOTE:Project manager')
    expect(vcf).toContain('FN:Jane Smith')
    expect(vcf).toContain('END:VCARD')

    const parsed = parseVcard(vcf)
    expect(parsed.length).toBe(2)

    const [p1, p2] = parsed
    expect(p1.name).toBe('John Doe')
    expect(p1.email).toBe('john@example.com')
    expect(p1.phone).toBe('+1 234 567 8900')
    expect(p1.organization).toBe('Acme Corp')
    expect(p1.notes).toBe('Project manager')

    expect(p2.name).toBe('Jane Smith')
    expect(p2.email).toBe('jane@example.com')
    expect(p2.phone).toBe('+1 987 654 3210')
    expect(p2.organization).toBe('Globex Inc')
  })

  it('handles empty or malformed vCard text gracefully', () => {
    expect(parseVcard('')).toEqual([])
    expect(parseVcard('SOME RANDOM TEXT')).toEqual([])
    expect(parseVcard('BEGIN:VCARD\nEND:VCARD')).toEqual([])
  })
})
