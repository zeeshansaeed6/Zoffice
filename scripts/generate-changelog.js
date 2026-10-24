#!/usr/bin/env node
/**
 * Conventional Changelog Generator for Zoffice.
 * Parses git commit history and generates categorized markdown changelogs.
 */

import { execSync } from 'child_process'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const CATEGORY_MAP = {
  feat: 'Features & Enhancements',
  fix: 'Bug Fixes',
  perf: 'Performance Optimizations',
  a11y: 'Accessibility Improvements',
  docs: 'Documentation',
  refactor: 'Refactoring & Code Quality',
  chore: 'Maintenance & Infrastructure',
}

/**
 * Parses raw git log string into structured commit entries.
 * @param {string} rawLog
 */
function parseCommits(rawLog) {
  const lines = rawLog.split('\n').filter(Boolean)
  const commits = []

  for (const line of lines) {
    const [hash, subject, author, date] = line.split('|')
    if (!hash || !subject) continue

    const match = subject.match(/^([a-z0-9_-]+)(?:\(([^)]+)\))?:\s*(.+)$/i)
    if (match) {
      const type = match[1].toLowerCase()
      const scope = match[2] || ''
      const description = match[3]

      commits.push({
        hash: hash.slice(0, 7),
        fullHash: hash,
        type,
        scope,
        description,
        author,
        date,
      })
    } else {
      commits.push({
        hash: hash.slice(0, 7),
        fullHash: hash,
        type: 'chore',
        scope: '',
        description: subject,
        author,
        date,
      })
    }
  }

  return commits
}

/**
 * Formats structured commits into grouped markdown.
 * @param {string} version
 * @param {Array<any>} commits
 */
function formatChangelog(version, commits) {
  const dateStr = new Date().toISOString().split('T')[0]
  const groups = {}

  for (const commit of commits) {
    const cat = CATEGORY_MAP[commit.type] || 'Other Improvements'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(commit)
  }

  let md = `## [${version}] - ${dateStr}\n\n`

  for (const [category, items] of Object.entries(groups)) {
    md += `### ${category}\n\n`
    for (const item of items) {
      const scopePrefix = item.scope ? `**${item.scope}**: ` : ''
      md += `- ${scopePrefix}${item.description} (\`${item.hash}\`)\n`
    }
    md += '\n'
  }

  return md
}

function run() {
  const version = process.argv[2] || 'v1.0.0'
  const changelogPath = resolve(process.cwd(), 'CHANGELOG.md')

  try {
    const rawLog = execSync('git log -n 100 --pretty=format:"%H|%s|%an|%ad" --date=short', {
      encoding: 'utf-8',
    })

    const commits = parseCommits(rawLog)
    const newSection = formatChangelog(version, commits)

    let existingContent = ''
    if (existsSync(changelogPath)) {
      existingContent = readFileSync(changelogPath, 'utf-8')
      // Prepend before previous versions if file exists
      if (existingContent.startsWith('# Changelog\n\n')) {
        const body = existingContent.slice('# Changelog\n\n'.length)
        writeFileSync(changelogPath, `# Changelog\n\n${newSection}\n---\n\n${body}`)
      } else {
        writeFileSync(changelogPath, `# Changelog\n\n${newSection}\n---\n\n${existingContent}`)
      }
    } else {
      writeFileSync(changelogPath, `# Changelog\n\nAll notable changes to Zoffice are documented in this file.\n\n${newSection}`)
    }

    console.info(`Successfully generated CHANGELOG.md for ${version} (${commits.length} commits processed)`)
  } catch (err) {
    console.error('Failed to generate changelog:', err.message)
    process.exit(1)
  }
}

run()
