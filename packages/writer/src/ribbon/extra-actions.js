import { exportPdf } from '@zoffice/core'
import { PAGE_MARGINS } from '../page-layout/page-utils.js'
import * as reviewActions from './review-actions.js'

/**
 * Builds the ribbon actions for the Layout, References, Review, View tabs,
 * the Home indent/case controls and Insert > Header & Footer.
 *
 * @param {Object} ctx
 * @param {import('@tiptap/react').Editor | null} ctx.editor
 * @param {string} ctx.title
 * @param {Object} ctx.state - { spellcheck, commentsOpen }
 * @param {Object} ctx.setters - { setPageSetup, setZoom, setSpellcheck, setReviewDialog, setShowComments }
 * @returns {Record<string, any>}
 */
export function buildExtraRibbonActions({ editor, title, state, setters }) {
  const { setPageSetup, setZoom, setSpellcheck, setReviewDialog, setShowComments } = setters
  const patchSetup = (patch) => setPageSetup((prev) => ({ ...prev, ...patch }))

  return {
    // Home
    onIncreaseIndent: () => reviewActions.increaseIndent(editor),
    onDecreaseIndent: () => reviewActions.decreaseIndent(editor),
    onChangeCase: (mode) => reviewActions.changeCase(editor, mode),

    // Insert
    onOpenHeaderFooter: () => setReviewDialog('headerFooter'),

    // Layout
    onSetMargins: (preset) => patchSetup({ margins: { ...PAGE_MARGINS[preset] } }),
    onSetOrientation: (orientation) => patchSetup({ orientation }),
    onSetPageSize: (pageSize) => patchSetup({ pageSize }),
    onSetColumns: (columns) => patchSetup({ columns }),

    // References
    onInsertToc: () => reviewActions.insertTableOfContents(editor),
    onInsertFootnote: () => setReviewDialog('footnote'),

    // Review
    onOpenWordCount: () => setReviewDialog('wordCount'),
    spellcheck: state.spellcheck,
    onToggleSpellcheck: () => setSpellcheck((v) => !v),
    onNewComment: () => setReviewDialog('comment'),
    commentsOpen: state.commentsOpen,
    onToggleComments: () => setShowComments((v) => !v),

    // View
    onZoomIn: () => setZoom((z) => Math.min(200, z + 10)),
    onZoomOut: () => setZoom((z) => Math.max(50, z - 10)),
    onZoomReset: () => setZoom(100),
    onPrint: () => window.print(),
    onExportPdf: () => exportPdf(title),
  }
}
