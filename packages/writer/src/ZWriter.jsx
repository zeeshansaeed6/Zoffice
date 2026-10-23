import React, { useState } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { getWriterRibbonConfig } from './ribbon-config.js'

/**
 * ZWriter Word Processing Component.
 *
 * @param {Object} props
 * @param {string} props.id - Document tab ID
 * @param {string} [props.title] - Document title
 * @param {string} [props.initialContent='']
 * @param {(content: string) => void} [props.onChange]
 * @param {() => void} [props.onSave]
 */
export function ZWriter({ title = 'Untitled Document', initialContent = '', onChange, onSave }) {
  const [content, setContent] = useState(initialContent)
  const [zoom, setZoom] = useState(100)
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [align, setAlign] = useState('left')

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  const handleTextChange = (e) => {
    const val = e.target.value
    setContent(val)
    if (onChange) onChange(val)
  }

  const ribbonConfig = getWriterRibbonConfig({
    bold,
    italic,
    underline,
    align,
    toggleBold: () => setBold(!bold),
    toggleItalic: () => setItalic(!italic),
    toggleUnderline: () => setUnderline(!underline),
    setAlign,
    onSave,
    canSave: true,
  })

  return (
    <div
      data-testid="zwriter-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Document Workspace / Canvas */}
      <div className="flex flex-1 justify-center overflow-auto p-8">
        <div
          className="relative min-h-[842px] w-[595px] origin-top border border-neutral-200 bg-white p-12 shadow-md transition-transform dark:border-neutral-800 dark:bg-neutral-900"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <h1 className="mb-4 text-xl font-bold text-neutral-800 dark:text-neutral-100">{title}</h1>
          <textarea
            aria-label="Document editor"
            value={content}
            onChange={handleTextChange}
            placeholder="Type your text here..."
            className={`h-[680px] w-full resize-none border-none bg-transparent font-sans leading-relaxed text-neutral-800 outline-none dark:text-neutral-200 ${
              bold ? 'font-bold' : ''
            } ${italic ? 'italic' : ''} ${underline ? 'underline' : ''} text-${align}`}
          />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>Page 1 of 1</StatusBarSlot>
            <StatusBarSlot>{wordCount} words</StatusBarSlot>
            <StatusBarSlot>English (US)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
        zoom={zoom}
        onZoomChange={setZoom}
      />
    </div>
  )
}
