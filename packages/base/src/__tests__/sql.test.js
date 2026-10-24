import { describe, it, expect } from 'vitest'
import { executeSqlQuery } from '../core/sql-console-engine.js'
import { createBase } from '../core/base-model.js'

describe('ZBase SQL Console Engine', () => {
  const base = createBase()
  const tables = base.tables

  it('rejects empty queries with informative error', () => {
    const res = executeSqlQuery('', tables)
    expect(res.success).toBe(false)
    expect(res.error).toContain('Empty query')
  })

  it('rejects unsupported syntax', () => {
    const res = executeSqlQuery('INSERT INTO Projects VALUES (1, 2)', tables)
    expect(res.success).toBe(false)
    expect(res.error).toContain('Syntax error')
  })

  it('returns error when table is not found', () => {
    const res = executeSqlQuery('SELECT * FROM NonExistentTable', tables)
    expect(res.success).toBe(false)
    expect(res.error).toContain('not found')
  })

  it('executes SELECT * FROM Projects', () => {
    const res = executeSqlQuery('SELECT * FROM Projects', tables)
    expect(res.success).toBe(true)
    expect(res.columns).toContain('Project Name')
    expect(res.columns).toContain('Budget ($)')
    expect(res.rowCount).toBe(3)
  })

  it('executes projection with specific columns', () => {
    const res = executeSqlQuery('SELECT "Project Name", Status FROM Projects', tables)
    expect(res.success).toBe(true)
    expect(res.columns).toEqual(['Project Name', 'Status'])
    expect(res.rows.length).toBe(3)
    expect(res.rows[0]['Project Name']).toBeDefined()
  })

  it('filters with WHERE clause', () => {
    const res = executeSqlQuery("SELECT * FROM Projects WHERE Status = 'Active'", tables)
    expect(res.success).toBe(true)
    expect(res.rowCount).toBe(2)
  })

  it('filters with numeric comparisons in WHERE clause', () => {
    const res = executeSqlQuery('SELECT * FROM Projects WHERE "Budget ($)" > 15000', tables)
    expect(res.success).toBe(true)
    expect(res.rowCount).toBe(2)
  })

  it('filters with LIKE operator in WHERE clause', () => {
    const res = executeSqlQuery("SELECT * FROM Projects WHERE \"Project Name\" LIKE '%SQLite%'", tables)
    expect(res.success).toBe(true)
    expect(res.rowCount).toBe(1)
    expect(res.rows[0]['Project Name']).toContain('Offline SQLite')
  })

  it('applies LIMIT clause', () => {
    const res = executeSqlQuery('SELECT * FROM Projects LIMIT 1', tables)
    expect(res.success).toBe(true)
    expect(res.rowCount).toBe(1)
  })

  it('applies ORDER BY clause', () => {
    const res = executeSqlQuery('SELECT * FROM Projects ORDER BY "Budget ($)" DESC', tables)
    expect(res.success).toBe(true)
    expect(res.rows[0]['Budget ($)']).toBe(25000)
    expect(res.rows[2]['Budget ($)']).toBe(12000)
  })
})
