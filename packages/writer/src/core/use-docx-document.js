import { useState, useEffect, useCallback } from 'react'
import { parseDocxToHtml, serializeDocxToBase64 } from '../docx/index.js'

/**
 * Owns the page setup and preserved .docx parts: loads base64 .docx initial
 * content into the editor and serializes the editor back on save.
 *
 * @param {Object} params
 * @param {import('@tiptap/react').Editor | null} params.editor
 * @param {string} params.initialContent - HTML or base64 .docx
 * @param {(content?: string) => void} [params.onSave]
 */
export function useDocxDocument({ editor, initialContent, onSave }) {
  const [pageSetup, setPageSetup] = useState({ pageSize: 'a4', margins: 'normal' })
  const [preservedFiles, setPreservedFiles] = useState(null)

  useEffect(() => {
    if (!editor || !initialContent || initialContent.startsWith('<')) return
    parseDocxToHtml(initialContent)
      .then(({ html, pageSetup: parsedSetup, preservedFiles: files }) => {
        if (html) editor.commands.setContent(html)
        if (parsedSetup) setPageSetup(parsedSetup)
        if (files) setPreservedFiles(files)
      })
      .catch((err) => {
        console.error('[ZWriter] Failed to parse initial docx:', err)
      })
  }, [editor, initialContent])

  const handleSave = useCallback(async () => {
    if (!editor) return
    const docxBase64 = await serializeDocxToBase64(editor.getJSON(), { pageSetup, preservedFiles })
    if (onSave) onSave(docxBase64)
  }, [editor, onSave, pageSetup, preservedFiles])

  return { pageSetup, setPageSetup, handleSave }
}
