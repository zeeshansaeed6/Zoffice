import React, { useState } from 'react'
import { Dialog } from '@zoffice/ui'
import { Search, Replace, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Find and Replace Dialog for ZWriter.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {import('@tiptap/react').Editor} props.editor
 */
export function FindReplaceDialog({ isOpen, onClose, editor }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [replaceTerm, setReplaceTerm] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [matchCount, setMatchCount] = useState(0)

  const handleFind = () => {
    if (!editor || !searchTerm) return
    const text = editor.getText()
    try {
      const flags = matchCase ? 'g' : 'gi'
      const regex = useRegex
        ? new RegExp(searchTerm, flags)
        : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
      const matches = text.match(regex)
      setMatchCount(matches ? matches.length : 0)
    } catch {
      setMatchCount(0)
    }
  }

  const handleReplaceAll = () => {
    if (!editor || !searchTerm) return
    const currentHtml = editor.getHTML()
    try {
      const flags = matchCase ? 'g' : 'gi'
      const regex = useRegex
        ? new RegExp(searchTerm, flags)
        : new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
      const updatedHtml = currentHtml.replace(regex, replaceTerm)
      editor.commands.setContent(updatedHtml)
      setMatchCount(0)
    } catch (err) {
      console.error('[FindReplace] Replace error:', err)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Find and Replace"
      size="md"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {matchCount > 0 ? `${matchCount} matches found` : ''}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFind}
              className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Find
            </button>
            <button
              type="button"
              onClick={handleReplaceAll}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none"
            >
              Replace All
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Find Input */}
        <div>
          <label
            htmlFor="writer-find-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Find what:
          </label>
          <div className="relative">
            <input
              id="writer-find-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter search text..."
              className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Replace Input */}
        <div>
          <label
            htmlFor="writer-replace-input"
            className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Replace with:
          </label>
          <input
            id="writer-replace-input"
            type="text"
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            placeholder="Enter replacement text..."
            className="w-full rounded border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        {/* Options */}
        <div className="flex gap-4 pt-1">
          <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded border-neutral-300 text-blue-600"
            />
            Match case
          </label>
          <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              className="rounded border-neutral-300 text-blue-600"
            />
            Use Regular Expressions
          </label>
        </div>
      </div>
    </Dialog>
  )
}
