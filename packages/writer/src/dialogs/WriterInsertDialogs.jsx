import React from 'react'
import { TablePickerDialog } from './TablePickerDialog.jsx'
import { ImageInsertDialog } from './ImageInsertDialog.jsx'
import { HyperlinkDialog } from './HyperlinkDialog.jsx'
import { BookmarkDialog } from './BookmarkDialog.jsx'
import { EquationDialog } from './EquationDialog.jsx'
import { SymbolDialog } from './SymbolDialog.jsx'
import * as insertActions from '../ribbon/insert-actions.js'

/**
 * Container component for all ZWriter Insert Tab dialog modals.
 *
 * @param {Object} props
 * @param {import('@tiptap/react').Editor} props.editor
 * @param {Object} props.dialogs - State flags and setters for modals
 */
export function WriterInsertDialogs({ editor, dialogs }) {
  if (!editor) return null

  return (
    <>
      {dialogs.showTablePicker && (
        <TablePickerDialog
          isOpen={dialogs.showTablePicker}
          onClose={() => dialogs.setShowTablePicker(false)}
          onInsert={(rows, cols, withHeader) =>
            insertActions.insertTable(editor, rows, cols, withHeader)
          }
        />
      )}

      {dialogs.showImageDialog && (
        <ImageInsertDialog
          isOpen={dialogs.showImageDialog}
          onClose={() => dialogs.setShowImageDialog(false)}
          onInsert={(options) => insertActions.insertImage(editor, options)}
        />
      )}

      {dialogs.showHyperlinkDialog && (
        <HyperlinkDialog
          isOpen={dialogs.showHyperlinkDialog}
          onClose={() => dialogs.setShowHyperlinkDialog(false)}
          editor={editor}
          onSave={(url, text) => insertActions.setHyperlink(editor, url, text)}
          onRemove={() => insertActions.removeHyperlink(editor)}
        />
      )}

      {dialogs.showBookmarkDialog && (
        <BookmarkDialog
          isOpen={dialogs.showBookmarkDialog}
          onClose={() => dialogs.setShowBookmarkDialog(false)}
          onInsert={(name) => insertActions.insertBookmark(editor, name)}
        />
      )}

      {dialogs.showEquationDialog && (
        <EquationDialog
          isOpen={dialogs.showEquationDialog}
          onClose={() => dialogs.setShowEquationDialog(false)}
          onInsert={(latex) => insertActions.insertMathEquation(editor, latex)}
        />
      )}

      {dialogs.showSymbolDialog && (
        <SymbolDialog
          isOpen={dialogs.showSymbolDialog}
          onClose={() => dialogs.setShowSymbolDialog(false)}
          onInsert={(symbol) => insertActions.insertSymbol(editor, symbol)}
        />
      )}
    </>
  )
}
