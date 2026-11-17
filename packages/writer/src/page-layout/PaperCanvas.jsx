import React, { useRef, useEffect } from 'react'
import { EditorContent } from '@tiptap/react'
import { isRtlLocale } from '@zoffice/core'
import { collectFootnotes } from '../core/footnote-extension.js'
import { getPageMetrics, calculatePageCount } from './page-utils.js'

/**
 * Visual Paper Page Canvas hosting the TipTap editor.
 *
 * @param {Object} props
 * @param {import('@tiptap/react').Editor} props.editor
 * @param {number} [props.zoom=100]
 * @param {{pageSize?: string, orientation?: string, margins?: any, columns?: number}} [props.pageSetup]
 * @param {(pages: number) => void} [props.onPageCountChange]
 */
export function PaperCanvas({ editor, zoom = 100, pageSetup = {}, onPageCountChange }) {
  const containerRef = useRef(null)
  const isRtl = isRtlLocale()
  const { widthPx, heightPx, margins: marginConfig } = getPageMetrics(pageSetup)
  const columns = pageSetup.columns || 1
  const footnotes = editor?.isInitialized ? collectFootnotes(editor.state.doc) : []

  const editorHtml = editor?.isInitialized ? editor.getHTML() : ''
  const pageHeight = heightPx
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
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`relative origin-top rounded-sm border border-neutral-300 bg-white shadow-xl transition-transform dark:border-neutral-800 dark:bg-neutral-900 ${
          isRtl ? 'text-right' : 'text-left'
        }`}
        style={{
          width: `${widthPx}px`,
          minHeight: `${heightPx}px`,
          paddingTop: `${marginConfig.top}px`,
          paddingBottom: `${marginConfig.bottom}px`,
          paddingLeft: `${marginConfig.left}px`,
          paddingRight: `${marginConfig.right}px`,
          transform: `${zoom !== 100 ? `scale(${zoom / 100})` : 'none'}`,
        }}
      >
        {pageSetup.header && (
          <div
            data-testid="page-header"
            className="absolute inset-x-0 top-0 truncate px-12 pt-6 text-xs text-neutral-500"
          >
            {pageSetup.header}
          </div>
        )}
        <div style={columns > 1 ? { columnCount: columns, columnGap: '32px' } : undefined}>
          <EditorContent editor={editor} />
        </div>
        {footnotes.length > 0 && (
          <ol
            data-testid="footnotes-list"
            className="mt-6 list-decimal border-t border-neutral-300 pl-5 pt-2 text-xs text-neutral-600 dark:text-neutral-400"
          >
            {footnotes.map((n) => (
              <li key={n.number}>{n.text}</li>
            ))}
          </ol>
        )}
        {(pageSetup.footer || pageSetup.pageNumbers) && (
          <div
            data-testid="page-footer"
            className="absolute inset-x-0 bottom-0 flex justify-between px-12 pb-6 text-xs text-neutral-500"
          >
            <span>{pageSetup.footer}</span>
            {pageSetup.pageNumbers && <span>Page 1</span>}
          </div>
        )}
      </div>
    </div>
  )
}
