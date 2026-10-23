import React, { useRef, useEffect } from 'react'

/**
 * TextElement renders an inline editable rich text block for slide canvases.
 *
 * @param {Object} props
 * @param {Object} props.element
 * @param {boolean} props.isSelected
 * @param {(newText: string) => void} props.onTextChange
 */
export function TextElement({ element, isSelected, onTextChange }) {
  const editorRef = useRef(null)
  const { properties = {} } = element
  const {
    text = '',
    fontSize = 24,
    fontFamily = 'Inter, sans-serif',
    bold = false,
    italic = false,
    underline = false,
    color = '#1e293b',
    align = 'left',
    fill = 'transparent',
    wordArt = null, // 'glow' | 'outline' | 'shadow' | 'gradient'
  } = properties

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerText !== text) {
      editorRef.current.innerText = text
    }
  }, [text])

  // WordArt style effects
  const getWordArtStyle = () => {
    switch (wordArt) {
      case 'glow':
        return { textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)' }
      case 'outline':
        return {
          WebkitTextStroke: '1px #1d4ed8',
          color: '#ffffff',
          fontWeight: '900',
        }
      case 'shadow':
        return { textShadow: '3px 3px 6px rgba(0, 0, 0, 0.35)' }
      case 'gradient':
        return {
          backgroundImage: 'linear-gradient(135deg, #2563eb, #9333ea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
        }
      default:
        return {}
    }
  }

  return (
    <div
      className="h-full w-full overflow-hidden p-1 outline-none"
      style={{
        backgroundColor: fill,
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        color,
        textAlign: align,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        ...getWordArtStyle(),
      }}
    >
      <div
        ref={editorRef}
        contentEditable={isSelected}
        suppressContentEditableWarning
        className="h-full w-full outline-none"
        onBlur={(e) => {
          if (onTextChange) {
            onTextChange(e.currentTarget.innerText)
          }
        }}
      />
    </div>
  )
}
