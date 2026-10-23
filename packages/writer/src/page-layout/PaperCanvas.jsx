import React, { useRef, useEffect } from 'react'
import { EditorContent } from '@tiptap/react'
import { PAGE_SIZES, PAGE_MARGINS, calculatePageCount } from './page-utils.js'

/**
 * Visual Paper Page Canvas hosting the TipTap editor.
 *
 * @param {Object} props
 * @param {import('@tiptap/react').Editor} props.editor
 * @param {number} [props.zoom=100]
 * @param {'a4' | 'letter'} [props.pageSize='a4']
 * @param {'normal' | 'narrow' | 'moderate' | 'wide'} [props.margins='normal']
 * @param {(pages: number) => void} [props.onPageCountChange]
 */
export function PaperCanvas({
  editor,
  zoom = 100,
  pageSize = 'a4',
  margins = 'normal',
  onPageCountChange,
}) {
  const containerRef = useRef(null)
  const sizeConfig = PAGE_SIZES[pageSize] || PAGE_SIZES.a4
  const marginConfig = PAGE_MARGINS[margins] || PAGE_MARGINS.normal

  const editorHtml = editor?.getHTML()
  const pageHeight = sizeConfig.heightPx
  const totalMarginY = marginConfig.top + marginConfig.bottom

  // Calculate and update page count on scroll/content change
  useEffect(() => {
    if (!containerRef.current || !onPageCountChange) return
    const el = containerRef.current
    const scrollH = el.scrollHeight
    const count = calculatePageCount(scrollH, pageHeight, totalMarginY)
    onPageCountChange(count)
  }, [editorHtml, pageHeight, totalMarginY, onPageCountChange])

  return (
    <div
      data-testid="paper-canvas-viewport"
      className="flex flex-1 justify-center overflow-auto bg-neutral-200/70 p-8 dark:bg-neutral-950"
    >
      <div
        ref={containerRef}
        data-testid="paper-sheet"
        className="relative origin-top rounded-sm border border-neutral-300 bg-white shadow-xl transition-transform dark:border-neutral-800 dark:bg-neutral-900"
        style={{
          width: `${sizeConfig.widthPx}px`,
          minHeight: `${sizeConfig.heightPx}px`,
          paddingTop: `${marginConfig.top}px`,
          paddingBottom: `${marginConfig.bottom}px`,
          paddingLeft: `${marginConfig.left}px`,
          paddingRight: `${marginConfig.right}px`,
          transform: `scale(${zoom / 100})`,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
