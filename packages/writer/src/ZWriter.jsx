import React, { useState, useEffect, useCallback } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getWriterRibbonConfig } from './ribbon/ribbon-config.jsx'
import { PaperCanvas } from './page-layout/PaperCanvas.jsx'
import { useWriterEditor } from './core/use-writer-editor.js'
import { FindReplaceDialog } from './dialogs/FindReplaceDialog.jsx'
import { parseDocxToHtml, serializeDocxToBase64 } from './docx/index.js'
import * as actions from './ribbon/home-actions.js'
import * as insertActions from './ribbon/insert-actions.js'
import { WriterInsertDialogs } from './dialogs/WriterInsertDialogs.jsx'

/**
 * ZWriter Desktop Word Processing Component.
 *
 * @param {Object} props
 * @param {string} props.id - Document tab ID
 * @param {string} [props.title='Untitled Document'] - Document display title
 * @param {string} [props.initialContent=''] - Raw HTML or base64 .docx binary
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZWriter({
  id: _id,
  title: _title = 'Untitled Document',
  initialContent = '',
  onChange,
  onSave,
}) {
  const [zoom, setZoom] = useState(100)
  const [pageCount, setPageCount] = useState(1)
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [isFormatPainting, setIsFormatPainting] = useState(false)
  const [pageSetup, setPageSetup] = useState({ pageSize: 'a4', margins: 'normal' })
  const [preservedFiles, setPreservedFiles] = useState(null)

  // Insert Dialog states
  const [showTablePicker, setShowTablePicker] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showHyperlinkDialog, setShowHyperlinkDialog] = useState(false)
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [showEquationDialog, setShowEquationDialog] = useState(false)
  const [showSymbolDialog, setShowSymbolDialog] = useState(false)

  const handleEditorChange = useCallback(
    async (html) => {
      if (onChange) {
        onChange(html)
      }
    },
    [onChange],
  )

  const handleSelectionUpdate = useCallback((editorInstance) => {
    if (actions.isFormatPainterActive() && editorInstance) {
      actions.applyFormatting(editorInstance)
      setIsFormatPainting(false)
    }
  }, [])

  const { editor, wordCount, characterCount, activeMarks } = useWriterEditor({
    initialContent: initialContent && initialContent.startsWith('<') ? initialContent : '',
    onChange: handleEditorChange,
    onSelectionUpdate: handleSelectionUpdate,
  })

  // Load and decode base64 .docx if passed as initial content
  useEffect(() => {
    if (!editor || !initialContent) return
    if (!initialContent.startsWith('<')) {
      parseDocxToHtml(initialContent)
        .then(({ html, pageSetup: parsedSetup, preservedFiles: files }) => {
          if (html && editor) {
            editor.commands.setContent(html)
          }
          if (parsedSetup) {
            setPageSetup(parsedSetup)
          }
          if (files) {
            setPreservedFiles(files)
          }
        })
        .catch((err) => {
          console.error('[ZWriter] Failed to parse initial docx:', err)
        })
    }
  }, [editor, initialContent])

  const handleSave = useCallback(async () => {
    if (!editor) return
    const docxBase64 = await serializeDocxToBase64(editor.getJSON(), {
      pageSetup,
      preservedFiles,
    })
    if (onSave) {
      onSave(docxBase64)
    }
  }, [editor, onSave, pageSetup, preservedFiles])

  const handleFormatPainter = () => {
    if (!editor) return
    if (isFormatPainting) {
      actions.cancelFormatPainter()
      setIsFormatPainting(false)
    } else {
      actions.copyFormatting(editor)
      setIsFormatPainting(true)
    }
  }

  const ribbonConfig = getWriterRibbonConfig({
    activeMarks,
    isFormatPainting,
    onSave: handleSave,
    canSave: true,
    onUndo: () => editor?.chain().focus().undo().run(),
    onRedo: () => editor?.chain().focus().redo().run(),
    canUndo: editor?.can().undo() || false,
    canRedo: editor?.can().redo() || false,

    // Clipboard
    onPaste: () => {
      navigator.clipboard?.readText?.().then((text) => {
        if (text && editor) editor.commands.insertContent(text)
      })
    },
    onCut: () => {
      document.execCommand('cut')
    },
    onCopy: () => {
      document.execCommand('copy')
    },
    onFormatPainter: handleFormatPainter,

    // Font
    setFontFamily: (font) => actions.setFontFamily(editor, font),
    setFontSize: (size) => actions.setFontSize(editor, size),
    onGrowFont: () => actions.growFontSize(editor),
    onShrinkFont: () => actions.shrinkFontSize(editor),
    onClearFormatting: () => actions.clearFormatting(editor),
    toggleBold: () => actions.toggleBold(editor),
    toggleItalic: () => actions.toggleItalic(editor),
    toggleUnderline: () => actions.toggleUnderline(editor),
    toggleStrike: () => actions.toggleStrike(editor),
    toggleSubscript: () => actions.toggleSubscript(editor),
    toggleSuperscript: () => actions.toggleSuperscript(editor),
    setTextColor: (color) => actions.setTextColor(editor, color),
    setHighlightColor: (color) => actions.setHighlightColor(editor, color),

    // Paragraph
    toggleBulletList: () => actions.toggleBulletList(editor),
    toggleOrderedList: () => actions.toggleOrderedList(editor),
    setLineSpacing: (spacing) => actions.setLineSpacing(editor, spacing),
    setTextAlign: (align) => actions.setTextAlign(editor, align),

    // Styles
    setStyle: (style) => actions.setDocumentStyle(editor, style),

    // Editing
    onFindReplace: () => setShowFindReplace(true),
    onSelectAll: () => actions.selectAll(editor),

    // Insert
    onInsertPageBreak: () => insertActions.insertPageBreak(editor),
    onOpenTablePicker: () => setShowTablePicker(true),
    onAddRowAbove: () => insertActions.addRowAbove(editor),
    onAddRowBelow: () => insertActions.addRowBelow(editor),
    onDeleteRow: () => insertActions.deleteRow(editor),
    onAddColumnLeft: () => insertActions.addColumnLeft(editor),
    onAddColumnRight: () => insertActions.addColumnRight(editor),
    onDeleteColumn: () => insertActions.deleteColumn(editor),
    onMergeCells: () => insertActions.mergeCells(editor),
    onSplitCell: () => insertActions.splitCell(editor),
    onDeleteTable: () => insertActions.deleteTable(editor),
    onOpenImageDialog: () => setShowImageDialog(true),
    onInsertHorizontalRule: () => insertActions.insertHorizontalRule(editor),
    onOpenHyperlinkDialog: () => setShowHyperlinkDialog(true),
    onOpenBookmarkDialog: () => setShowBookmarkDialog(true),
    onInsertDateTime: (format) => insertActions.insertDateTime(editor, format),
    onOpenEquationDialog: () => setShowEquationDialog(true),
    onOpenSymbolDialog: () => setShowSymbolDialog(true),
  })

  return (
    <div
      data-testid="zwriter-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Paper-style document canvas */}
      <PaperCanvas
        editor={editor}
        zoom={zoom}
        pageSize={pageSetup.pageSize || 'a4'}
        margins={
          typeof pageSetup.margins === 'string'
            ? pageSetup.margins
            : pageSetup.margins?.top <= 48
              ? 'narrow'
              : 'normal'
        }
        onPageCountChange={setPageCount}
      />

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>
              Page {pageCount} of {pageCount}
            </StatusBarSlot>
            <StatusBarSlot>{wordCount} words</StatusBarSlot>
            <StatusBarSlot>{characterCount} characters</StatusBarSlot>
            <StatusBarSlot>English (US)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />

      {/* Find and Replace Modal */}
      {showFindReplace && (
        <FindReplaceDialog
          isOpen={showFindReplace}
          onClose={() => setShowFindReplace(false)}
          editor={editor}
        />
      )}

      {/* Insert Tab Modals */}
      <WriterInsertDialogs
        editor={editor}
        dialogs={{
          showTablePicker,
          setShowTablePicker,
          showImageDialog,
          setShowImageDialog,
          showHyperlinkDialog,
          setShowHyperlinkDialog,
          showBookmarkDialog,
          setShowBookmarkDialog,
          showEquationDialog,
          setShowEquationDialog,
          showSymbolDialog,
          setShowSymbolDialog,
        }}
      />
    </div>
  )
}
