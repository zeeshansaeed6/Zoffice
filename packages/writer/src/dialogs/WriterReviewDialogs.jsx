import React from 'react'
import { TextPromptDialog } from './TextPromptDialog.jsx'
import { HeaderFooterDialog } from './HeaderFooterDialog.jsx'
import { WordCountDialog } from './WordCountDialog.jsx'

/**
 * Hosts the header/footer, footnote, comment and word-count dialogs.
 *
 * @param {Object} props
 * @param {'headerFooter' | 'footnote' | 'comment' | 'wordCount' | null} props.dialog
 * @param {() => void} props.onClose
 * @param {import('@tiptap/react').Editor | null} props.editor
 * @param {Object} props.pageSetup
 * @param {(updater: (prev: Object) => Object) => void} props.setPageSetup
 * @param {() => void} props.onCommentAdded
 */
export function WriterReviewDialogs({
  dialog,
  onClose,
  editor,
  pageSetup,
  setPageSetup,
  onCommentAdded,
}) {
  return (
    <>
      {dialog === 'headerFooter' && (
        <HeaderFooterDialog
          isOpen
          onClose={onClose}
          value={pageSetup}
          onApply={(next) => setPageSetup((p) => ({ ...p, ...next }))}
        />
      )}
      <TextPromptDialog
        isOpen={dialog === 'footnote'}
        onClose={onClose}
        title="Insert Footnote"
        label="Footnote text"
        onSubmit={(text) => editor?.chain().focus().insertFootnote(text).run()}
      />
      <TextPromptDialog
        isOpen={dialog === 'comment'}
        onClose={onClose}
        title="New Comment"
        label="Comment (applies to the selected text)"
        onSubmit={(text) => {
          editor?.chain().focus().addComment(text).run()
          onCommentAdded()
        }}
      />
      <WordCountDialog isOpen={dialog === 'wordCount'} onClose={onClose} editor={editor} />
    </>
  )
}
