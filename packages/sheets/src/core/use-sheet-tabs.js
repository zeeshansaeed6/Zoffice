import { useCallback, useMemo } from 'react'
import { createSheet } from './sheet-model.js'

/**
 * Add, select, rename and delete worksheet tabs on top of useWorkbook's update().
 * @param {(fn: (wb: Object) => Object, opts?: Object) => void} update
 */
export function useSheetTabs(update) {
  const addSheet = useCallback(
    () =>
      update((wb) => {
        const sheet = createSheet(`sheet_${Date.now()}`, `Sheet${wb.sheets.length + 1}`)
        return { ...wb, activeSheetId: sheet.id, sheets: [...wb.sheets, sheet] }
      }),
    [update],
  )
  const selectSheet = useCallback(
    (sheetId) =>
      update((wb) => ({ ...wb, activeSheetId: sheetId }), { recalc: false, history: false }),
    [update],
  )
  const renameSheet = useCallback(
    (sheetId, name) =>
      update((wb) => ({
        ...wb,
        sheets: wb.sheets.map((s) => (s.id === sheetId ? { ...s, name } : s)),
      })),
    [update],
  )
  const deleteSheet = useCallback(
    () =>
      update((wb) => {
        if (wb.sheets.length < 2) return wb
        const sheets = wb.sheets.filter((s) => s.id !== wb.activeSheetId)
        return { ...wb, sheets, activeSheetId: sheets[0].id }
      }),
    [update],
  )
  return useMemo(
    () => ({ addSheet, selectSheet, renameSheet, deleteSheet }),
    [addSheet, selectSheet, renameSheet, deleteSheet],
  )
}
