import { useState, useEffect, useCallback, useRef } from 'react'
import { createWorkbook } from './sheet-model.js'
import { recalcWorkbook } from './recalc.js'
import { xlsxToWorkbook, workbookToXlsxBase64 } from './xlsx-io.js'
import { csvToWorkbook } from './csv-io.js'

const MAX_HISTORY = 100
const looksLikeXlsx = (text) => /^(data:.*?;base64,)?UEsDB/.test(text.trim())

function parseJsonWorkbook(content) {
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content
    return parsed?.sheets ? parsed : null
  } catch {
    return null
  }
}

/**
 * Loads workbook content that is not our own JSON (.xlsx base64 or CSV text).
 * @param {string} content
 * @returns {Promise<Object|null>}
 */
async function loadExternalContent(content) {
  if (looksLikeXlsx(content)) return xlsxToWorkbook(content)
  return content.includes(',') || content.includes('\n') ? csvToWorkbook(content) : null
}

/**
 * Owns the ZSheets workbook: recalculation, undo/redo history, loading of
 * .xlsx/CSV content, and change notifications to the host.
 *
 * @param {Object} params
 * @param {string} [params.initialContent]
 * @param {(content: string) => void} [params.onChange] - receives workbook JSON
 */
export function useWorkbook({ initialContent, onChange }) {
  const [state, setState] = useState(() => {
    const json = initialContent ? parseJsonWorkbook(initialContent) : null
    return {
      workbook: recalcWorkbook(json || createWorkbook('Sheet1')),
      past: [],
      future: [],
    }
  })
  const [loadError, setLoadError] = useState(null)
  const loaded = useRef(false)

  // Load .xlsx / CSV content once on mount
  useEffect(() => {
    if (loaded.current || !initialContent || parseJsonWorkbook(initialContent)) return
    loaded.current = true
    loadExternalContent(initialContent)
      .then((wb) => {
        if (wb) setState({ workbook: recalcWorkbook(wb), past: [], future: [] })
      })
      .catch((err) => {
        console.error('[ZSheets] Failed to load spreadsheet:', err)
        setLoadError(err.message)
      })
  }, [initialContent])

  useEffect(() => {
    if (onChange) onChange(JSON.stringify(state.workbook))
  }, [state.workbook, onChange])

  /**
   * Applies a pure workbook transform.
   * @param {(wb: Object) => Object} fn
   * @param {{ recalc?: boolean, history?: boolean }} [opts]
   */
  const update = useCallback((fn, { recalc = true, history = true } = {}) => {
    setState((s) => {
      const next = recalc ? recalcWorkbook(fn(s.workbook)) : fn(s.workbook)
      if (!history) return { ...s, workbook: next }
      return { workbook: next, past: [...s.past.slice(-(MAX_HISTORY - 1)), s.workbook], future: [] }
    })
  }, [])

  const undo = useCallback(() => {
    setState((s) =>
      s.past.length
        ? { workbook: s.past.at(-1), past: s.past.slice(0, -1), future: [s.workbook, ...s.future] }
        : s,
    )
  }, [])

  const redo = useCallback(() => {
    setState((s) =>
      s.future.length
        ? { workbook: s.future[0], past: [...s.past, s.workbook], future: s.future.slice(1) }
        : s,
    )
  }, [])

  const exportXlsx = useCallback(() => workbookToXlsxBase64(state.workbook), [state.workbook])

  return {
    workbook: state.workbook,
    update,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    exportXlsx,
    loadError,
  }
}
