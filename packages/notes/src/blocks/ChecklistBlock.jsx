/**
 * ZNotes checklist block — interactive to-do list with checkboxes.
 */

import React, { useState, useCallback, useMemo } from 'react'
import { Plus, X } from 'lucide-react'

/**
 * Checklist block with editable items and checkboxes.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function ChecklistBlock({ block, isActive, onUpdate }) {
  const items = useMemo(() => {
    try {
      const data = JSON.parse(block.content)
      return Array.isArray(data.items) ? data.items : []
    } catch {
      return []
    }
  }, [block.content])

  const updateItems = useCallback((newItems) => {
    onUpdate({ content: JSON.stringify({ items: newItems }) })
  }, [onUpdate])

  const toggleItem = useCallback((index) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item,
    )
    updateItems(next)
  }, [items, updateItems])

  const updateItemText = useCallback((index, text) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, text } : item,
    )
    updateItems(next)
  }, [items, updateItems])

  const addItem = useCallback(() => {
    updateItems([...items, { text: '', checked: false }])
  }, [items, updateItems])

  const removeItem = useCallback((index) => {
    updateItems(items.filter((_, i) => i !== index))
  }, [items, updateItems])

  const completed = items.filter((i) => i.checked).length
  const total = items.length

  return (
    <div className="px-3 py-2" data-testid="checklist-block">
      {/* Progress bar */}
      {total > 0 && (
        <div className="mb-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-400">
            {completed}/{total}
          </span>
        </div>
      )}

      {/* Items */}
      {items.map((item, idx) => (
        <div key={idx} className="group flex items-center gap-2 py-0.5">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleItem(idx)}
            className="h-3.5 w-3.5 shrink-0 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
          />
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItemText(idx, e.target.value)}
            placeholder="To-do item..."
            className={`flex-1 bg-transparent text-xs outline-none ${
              item.checked
                ? 'text-neutral-400 line-through dark:text-neutral-600'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
            readOnly={!isActive}
          />
          {isActive && (
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="hidden text-neutral-400 hover:text-red-500 group-hover:block"
            >
              <X size={10} />
            </button>
          )}
        </div>
      ))}

      {isActive && (
        <button
          type="button"
          onClick={addItem}
          className="mt-1 flex items-center gap-1 text-[10px] text-neutral-400 hover:text-violet-600"
        >
          <Plus size={10} /> Add item
        </button>
      )}
    </div>
  )
}
