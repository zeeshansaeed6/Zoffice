import { describe, it, expect } from 'vitest'
import {
  evaluateFormula,
  resolveLookupValue,
  computeRollupValue,
} from '../core/formula-engine.js'
import { createField, createRecord, createTable } from '../core/base-model.js'
import { FIELD_TYPES, ROLLUP_OPERATIONS } from '../core/constants.js'

describe('ZBase Formula Engine', () => {
  const fBudget = createField('Budget', FIELD_TYPES.NUMBER)
  const fTax = createField('Tax', FIELD_TYPES.NUMBER)
  const fName = createField('Name', FIELD_TYPES.TEXT)
  const fields = [fBudget, fTax, fName]

  it('evaluates basic arithmetic expressions', () => {
    const record = createRecord({ [fBudget.id]: 1000, [fTax.id]: 150 })
    const result = evaluateFormula('{Budget} + {Tax}', record, fields)
    expect(result).toBe(1150)
  })

  it('evaluates multiplication and division', () => {
    const record = createRecord({ [fBudget.id]: 200 })
    const result = evaluateFormula('{Budget} * 1.5', record, fields)
    expect(result).toBe(300)
  })

  it('evaluates string concatenation with ampersand', () => {
    const record = createRecord({ [fName.id]: 'Alpha', [fBudget.id]: 500 })
    const result = evaluateFormula('{Name} & " - $" & {Budget}', record, fields)
    expect(result).toBe('Alpha - $500')
  })

  it('returns empty string on empty formula', () => {
    const record = createRecord({})
    expect(evaluateFormula('', record, fields)).toBe('')
  })

  it('resolves lookup value from linked record', () => {
    const userRoleField = createField('Role', FIELD_TYPES.TEXT)
    const userTable = createTable('Users', {
      id: 'tbl-users',
      fields: [userRoleField],
      records: [createRecord({ [userRoleField.id]: 'Lead Developer' }, { id: 'rec-u1' })],
    })

    const linkField = createField('AssignedUser', FIELD_TYPES.LINK, {
      linkedTableId: userTable.id,
    })
    const lookupField = createField('UserRole', FIELD_TYPES.LOOKUP, {
      linkedTableId: userTable.id,
      lookupFieldId: userRoleField.id,
    })

    const taskRecord = createRecord({ [linkField.id]: 'rec-u1' })
    const resolved = resolveLookupValue(taskRecord, lookupField, linkField, userTable)
    expect(resolved).toBe('Lead Developer')
  })

  it('computes rollup values across multiple linked records', () => {
    const amountFieldId = 'fld-amount'
    const records = [
      createRecord({ [amountFieldId]: 10 }),
      createRecord({ [amountFieldId]: 20 }),
      createRecord({ [amountFieldId]: 30 }),
    ]

    expect(computeRollupValue(records, amountFieldId, ROLLUP_OPERATIONS.SUM)).toBe(60)
    expect(computeRollupValue(records, amountFieldId, ROLLUP_OPERATIONS.AVERAGE)).toBe(20)
    expect(computeRollupValue(records, amountFieldId, ROLLUP_OPERATIONS.COUNT)).toBe(3)
    expect(computeRollupValue(records, amountFieldId, ROLLUP_OPERATIONS.MIN)).toBe(10)
    expect(computeRollupValue(records, amountFieldId, ROLLUP_OPERATIONS.MAX)).toBe(30)
  })
})
