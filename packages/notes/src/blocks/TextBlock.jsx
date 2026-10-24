/**
 * ZNotes text block — rich text editing with contentEditable.
 */

import React, { useRef, useEffect, useCallback } from 'react'

/**
 * Editable text block.
 * @param {Object} props
 * @param {import('../core/notebook-model.js').Block} props.block
 * @param {boolean} props.isActive
 * @param {(updates: Object) => void} props.onUpdate
 */
export function TextBlock({ block, isActive, onUpdate }) {
  const ref = useRef(null)
  const lastContent = useRef(block.content)

  useEffect(() => {
    if (ref.current && block.content !== lastContent.current) {
      ref.current.textContent = block.content
      lastContent.current = block.content
    }
  }, [block.content])

  useEffect(() => {
    if (ref.current && !ref.current.textContent && block.content) {
      ref.current.textContent = block.content
    }
  }, [block.content])

  const handleInput = useCallback(() => {
    const text = ref.current?.textContent || ''
    lastContent.current = text
    onUpdate({ content: text })
  }, [onUpdate])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  }, [])

  return (
    <div
      ref={ref}
      contentEditable={isActive}
      suppressContentEditableWarning
      className={`min-h-[24px] w-full px-3 py-2 text-sm text-neutral-800 outline-none dark:text-neutral-200 ${
        isActive ? 'bg-white dark:bg-neutral-800' : 'bg-transparent'
      }`}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-testid="text-block"
    />
  )
}
