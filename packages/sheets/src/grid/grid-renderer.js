import { ROW_HEADER_WIDTH, COL_HEADER_HEIGHT, THEME_COLORS } from '../core/grid-constants.js'
import { colIndexToLabel, getColWidth, getRowHeight, getCell } from '../core/sheet-model.js'
import { getVisibleRange, getRangeRect, getCellRect } from './grid-viewport.js'
import { getFillHandleRect } from './grid-selection.js'

/**
 * Main rendering loop for the spreadsheet canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} state
 * @param {number} state.width - Canvas logical width
 * @param {number} state.height - Canvas logical height
 * @param {number} state.scrollX
 * @param {number} state.scrollY
 * @param {Object} state.sheet
 * @param {{ row: number, col: number }} state.activeCell
 * @param {{ startRow: number, startCol: number, endRow: number, endCol: number }} state.selectedRange
 * @param {string} [state.themeMode='light']
 * @param {Object} [state.resizeIndicator] - Optional { type: 'col'|'row', pos: number }
 */
export function renderGrid(ctx, state) {
  const {
    width,
    height,
    scrollX,
    scrollY,
    sheet,
    activeCell,
    selectedRange,
    themeMode = 'light',
  } = state
  const colors = THEME_COLORS[themeMode] || THEME_COLORS.light

  // 1. Clear background
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)

  const range = getVisibleRange({ scrollX, scrollY, width, height, sheet })

  // 2. Draw Cells & Gridlines
  renderCellsAndGrid(ctx, { range, scrollX, scrollY, sheet, colors, width, height })

  // 3. Draw Selection Range & Active Cell
  if (selectedRange) {
    renderSelection(ctx, { selectedRange, activeCell, scrollX, scrollY, sheet, colors })
  }

  // 4. Draw Column Headers (Top)
  renderColumnHeaders(ctx, { range, scrollX, sheet, selectedRange, colors, width })

  // 5. Draw Row Headers (Left)
  renderRowHeaders(ctx, { range, scrollY, sheet, selectedRange, colors, height })

  // 6. Draw Top-Left Corner Box
  renderCorner(ctx, colors)

  // 7. Draw Resize Guide Line (if dragging)
  if (state.resizeIndicator) {
    ctx.strokeStyle = colors.resizeGuide
    ctx.lineWidth = 1.5
    ctx.beginPath()
    if (state.resizeIndicator.type === 'col') {
      ctx.moveTo(state.resizeIndicator.pos, 0)
      ctx.lineTo(state.resizeIndicator.pos, height)
    } else {
      ctx.moveTo(0, state.resizeIndicator.pos)
      ctx.lineTo(width, state.resizeIndicator.pos)
    }
    ctx.stroke()
  }
}

function renderCellsAndGrid(ctx, { range, scrollX, scrollY, sheet, colors, width, height }) {
  ctx.save()
  // Clip to grid content area
  ctx.beginPath()
  ctx.rect(
    ROW_HEADER_WIDTH,
    COL_HEADER_HEIGHT,
    width - ROW_HEADER_WIDTH,
    height - COL_HEADER_HEIGHT,
  )
  ctx.clip()

  // Calculate column X positions
  let curX = ROW_HEADER_WIDTH - scrollX
  for (let c = 0; c < range.startCol; c++) {
    curX += getColWidth(sheet, c)
  }

  // Draw cells row by row
  for (let c = range.startCol; c <= range.endCol; c++) {
    const colW = getColWidth(sheet, c)
    let curY = COL_HEADER_HEIGHT - scrollY
    for (let r = 0; r < range.startRow; r++) {
      curY += getRowHeight(sheet, r)
    }

    for (let r = range.startRow; r <= range.endRow; r++) {
      const rowH = getRowHeight(sheet, r)

      // Gridline border
      ctx.strokeStyle = colors.gridline
      ctx.lineWidth = 1
      ctx.strokeRect(curX + 0.5, curY + 0.5, colW, rowH)

      // Cell Content
      const cell = getCell(sheet, r, c)
      if (cell && (cell.value !== undefined || cell.raw !== undefined)) {
        renderCellContent(ctx, cell, curX, curY, colW, rowH, colors)
      }

      curY += rowH
    }
    curX += colW
  }

  ctx.restore()
}

function renderCellContent(ctx, cell, x, y, width, height, colors) {
  const text =
    cell.display !== undefined ? String(cell.display) : String(cell.value ?? cell.raw ?? '')
  if (!text) return

  ctx.save()
  ctx.beginPath()
  ctx.rect(x + 1, y + 1, width - 2, height - 2)
  ctx.clip()

  // Background color if formatted
  if (cell.style?.bgColor) {
    ctx.fillStyle = cell.style.bgColor
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2)
  }

  // Text font
  const fontSize = cell.style?.fontSize || 12
  const isBold = cell.style?.bold ? 'bold' : 'normal'
  const isItalic = cell.style?.italic ? 'italic' : 'normal'
  ctx.font = `${isItalic} ${isBold} ${fontSize}px Inter, sans-serif`
  ctx.fillStyle = cell.style?.textColor || colors.text
  ctx.textBaseline = 'middle'

  const isNumeric = !isNaN(Number(text)) && text.trim() !== ''
  const align = cell.style?.align || (isNumeric ? 'right' : 'left')

  let textX = x + 6
  if (align === 'right') {
    textX = x + width - 6
    ctx.textAlign = 'right'
  } else if (align === 'center') {
    textX = x + width / 2
    ctx.textAlign = 'center'
  } else {
    ctx.textAlign = 'left'
  }

  ctx.fillText(text, textX, y + height / 2)
  ctx.restore()
}

function renderSelection(ctx, { selectedRange, activeCell, scrollX, scrollY, sheet, colors }) {
  const rect = getRangeRect({ range: selectedRange, scrollX, scrollY, sheet })

  // Fill area
  ctx.fillStyle = colors.selectionFill
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height)

  // Border
  ctx.strokeStyle = colors.selectionBorder
  ctx.lineWidth = 2
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

  // Active cell border if inside multi-cell range
  if (
    selectedRange.startRow !== selectedRange.endRow ||
    selectedRange.startCol !== selectedRange.endCol
  ) {
    const activeRect = getCellRect({
      row: activeCell.row,
      col: activeCell.col,
      scrollX,
      scrollY,
      sheet,
    })
    ctx.strokeStyle = colors.activeCellBorder
    ctx.lineWidth = 1
    ctx.strokeRect(activeRect.x, activeRect.y, activeRect.width, activeRect.height)
  }

  // Fill handle
  const handle = getFillHandleRect(rect)
  ctx.fillStyle = colors.fillHandle
  ctx.fillRect(handle.x, handle.y, handle.width, handle.height)
}

function renderColumnHeaders(ctx, { range, scrollX, sheet, selectedRange, colors, width }) {
  ctx.save()
  // Background
  ctx.fillStyle = colors.headerBg
  ctx.fillRect(ROW_HEADER_WIDTH, 0, width - ROW_HEADER_WIDTH, COL_HEADER_HEIGHT)

  // Bottom line
  ctx.strokeStyle = colors.headerBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(ROW_HEADER_WIDTH, COL_HEADER_HEIGHT - 0.5)
  ctx.lineTo(width, COL_HEADER_HEIGHT - 0.5)
  ctx.stroke()

  let curX = ROW_HEADER_WIDTH - scrollX
  for (let c = 0; c < range.startCol; c++) {
    curX += getColWidth(sheet, c)
  }

  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let c = range.startCol; c <= range.endCol; c++) {
    const colW = getColWidth(sheet, c)
    const isSelected = selectedRange && c >= selectedRange.startCol && c <= selectedRange.endCol

    if (isSelected) {
      ctx.fillStyle = colors.headerActive
      ctx.fillRect(curX, 0, colW, COL_HEADER_HEIGHT - 1)
      ctx.fillStyle = colors.headerActiveText
      ctx.font = 'bold 11px Inter, sans-serif'
    } else {
      ctx.fillStyle = colors.headerText
      ctx.font = '11px Inter, sans-serif'
    }

    ctx.fillText(colIndexToLabel(c), curX + colW / 2, COL_HEADER_HEIGHT / 2)

    // Separator line
    ctx.strokeStyle = colors.headerBorder
    ctx.beginPath()
    ctx.moveTo(curX + colW - 0.5, 0)
    ctx.lineTo(curX + colW - 0.5, COL_HEADER_HEIGHT)
    ctx.stroke()

    curX += colW
  }
  ctx.restore()
}

function renderRowHeaders(ctx, { range, scrollY, sheet, selectedRange, colors, height }) {
  ctx.save()
  // Background
  ctx.fillStyle = colors.headerBg
  ctx.fillRect(0, COL_HEADER_HEIGHT, ROW_HEADER_WIDTH, height - COL_HEADER_HEIGHT)

  // Right border
  ctx.strokeStyle = colors.headerBorder
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(ROW_HEADER_WIDTH - 0.5, COL_HEADER_HEIGHT)
  ctx.lineTo(ROW_HEADER_WIDTH - 0.5, height)
  ctx.stroke()

  let curY = COL_HEADER_HEIGHT - scrollY
  for (let r = 0; r < range.startRow; r++) {
    curY += getRowHeight(sheet, r)
  }

  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let r = range.startRow; r <= range.endRow; r++) {
    const rowH = getRowHeight(sheet, r)
    const isSelected = selectedRange && r >= selectedRange.startRow && r <= selectedRange.endRow

    if (isSelected) {
      ctx.fillStyle = colors.headerActive
      ctx.fillRect(0, curY, ROW_HEADER_WIDTH - 1, rowH)
      ctx.fillStyle = colors.headerActiveText
      ctx.font = 'bold 11px Inter, sans-serif'
    } else {
      ctx.fillStyle = colors.headerText
      ctx.font = '11px Inter, sans-serif'
    }

    ctx.fillText(String(r + 1), ROW_HEADER_WIDTH / 2, curY + rowH / 2)

    // Separator line
    ctx.strokeStyle = colors.headerBorder
    ctx.beginPath()
    ctx.moveTo(0, curY + rowH - 0.5)
    ctx.lineTo(ROW_HEADER_WIDTH, curY + rowH - 0.5)
    ctx.stroke()

    curY += rowH
  }
  ctx.restore()
}

function renderCorner(ctx, colors) {
  ctx.fillStyle = colors.headerBg
  ctx.fillRect(0, 0, ROW_HEADER_WIDTH, COL_HEADER_HEIGHT)
  ctx.strokeStyle = colors.headerBorder
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, ROW_HEADER_WIDTH - 1, COL_HEADER_HEIGHT - 1)
}
