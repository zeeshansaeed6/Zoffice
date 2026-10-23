import { useEditor } from '@tiptap/react'
import { useState, useCallback, useEffect } from 'react'
import { getWriterExtensions } from './editor-schema.js'

/**
 * Custom hook to initialize and manage a ZWriter TipTap editor instance.
 *
 * @param {Object} options
 * @param {string} [options.initialContent='']
 * @param {(content: string) => void} [options.onChange]
 * @param {() => void} [options.onSelectionUpdate]
 * @returns {{
 *   editor: import('@tiptap/react').Editor | null,
 *   wordCount: number,
 *   characterCount: number,
 *   activeMarks: Record<string, any>
 * }}
 */
export function useWriterEditor({ initialContent = '', onChange, onSelectionUpdate } = {}) {
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [activeMarks, setActiveMarks] = useState({})

  const updateMetrics = useCallback((editorInstance) => {
    if (!editorInstance) return
    const text = editorInstance.getText()
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    setWordCount(words)
    setCharacterCount(text.length)

    // Compute active formatting state for ribbon syncing
    setActiveMarks({
      bold: editorInstance.isActive('bold'),
      italic: editorInstance.isActive('italic'),
      underline: editorInstance.isActive('underline'),
      strike: editorInstance.isActive('strike'),
      subscript: editorInstance.isActive('subscript'),
      superscript: editorInstance.isActive('superscript'),
      align: editorInstance.isActive({ textAlign: 'center' })
        ? 'center'
        : editorInstance.isActive({ textAlign: 'right' })
          ? 'right'
          : editorInstance.isActive({ textAlign: 'justify' })
            ? 'justify'
            : 'left',
      bulletList: editorInstance.isActive('bulletList'),
      orderedList: editorInstance.isActive('orderedList'),
      heading1: editorInstance.isActive('heading', { level: 1 }),
      heading2: editorInstance.isActive('heading', { level: 2 }),
      heading3: editorInstance.isActive('heading', { level: 3 }),
      codeBlock: editorInstance.isActive('codeBlock'),
      blockquote: editorInstance.isActive('blockquote'),
      color: editorInstance.getAttributes('textStyle').color || null,
      highlight: editorInstance.getAttributes('highlight').color || null,
      fontFamily: editorInstance.getAttributes('textStyle').fontFamily || 'Inter',
      fontSize: editorInstance.getAttributes('textStyle').fontSize || '16px',
    })
  }, [])

  const editor = useEditor({
    extensions: getWriterExtensions(),
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'outline-none min-h-[600px] font-sans leading-relaxed text-neutral-900 dark:text-neutral-100 selection:bg-blue-200 dark:selection:bg-blue-800',
        'aria-label': 'Document editor',
        'data-testid': 'document-editor-canvas',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      updateMetrics(currentEditor)
      if (onChange) {
        onChange(currentEditor.getHTML())
      }
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      updateMetrics(currentEditor)
      if (onSelectionUpdate) {
        onSelectionUpdate(currentEditor)
      }
    },
  })

  useEffect(() => {
    if (editor) {
      updateMetrics(editor)
    }
  }, [editor, updateMetrics])

  return {
    editor,
    wordCount,
    characterCount,
    activeMarks,
  }
}
