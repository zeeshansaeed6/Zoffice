/**
 * Export and print handouts utilities for ZSlides.
 */

import { SLIDE_DIMENSIONS, SLIDE_RATIOS } from './slide-constants.js'

/**
 * Generates an SVG representation of a single slide.
 *
 * @param {Object} slide
 * @param {Object} [dimensions]
 * @returns {string} SVG markup string
 */
export function exportSlideAsSvgString(
  slide,
  dimensions = SLIDE_DIMENSIONS[SLIDE_RATIOS.WIDESCREEN],
) {
  const { width = 960, height = 540 } = dimensions
  const bg =
    typeof slide.background === 'string' ? slide.background : slide.background?.color || '#ffffff'

  let content = ''
  for (const el of slide.elements || []) {
    const x = el.x ?? 0
    const y = el.y ?? 0
    const w = el.width ?? 100
    const h = el.height ?? 50
    const fill = el.properties?.fill || el.fill || '#e2e8f0'
    const stroke = el.properties?.stroke || el.stroke || '#94a3b8'
    const strokeWidth = el.properties?.strokeWidth ?? el.strokeWidth ?? 1
    const shapeType = el.properties?.shapeType || el.shapeType || 'rect'

    if (el.type === 'shape') {
      if (shapeType === 'ellipse') {
        const cx = x + w / 2
        const cy = y + h / 2
        content += `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      } else {
        content += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${shapeType === 'rounded_rect' ? 8 : 0}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
      }
    } else if (el.type === 'text') {
      const textColor = el.properties?.color || el.color || '#0f172a'
      const fontSize = el.properties?.fontSize || el.fontSize || 18
      const text = (el.properties?.text || el.text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      content += `<text x="${x + 8}" y="${y + fontSize + 4}" fill="${textColor}" font-size="${fontSize}" font-family="${el.properties?.fontFamily || el.fontFamily || 'Inter, sans-serif'}">${text}</text>`
    } else if (el.type === 'image') {
      content += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f1f5f9" stroke="#cbd5e1" stroke-dasharray="4" /><text x="${x + w / 2}" y="${y + h / 2}" fill="#64748b" font-size="14" text-anchor="middle">[Image]</text>`
    } else if (el.type === 'chart') {
      content += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f8fafc" stroke="#93c5fd" /><text x="${x + w / 2}" y="${y + h / 2}" fill="#3b82f6" font-size="14" text-anchor="middle">[Chart: ${el.properties?.chartType || el.chartType || 'bar'}]</text>`
    } else if (el.type === 'table') {
      content += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" stroke="#cbd5e1" /><text x="${x + w / 2}" y="${y + h / 2}" fill="#475569" font-size="14" text-anchor="middle">[Table]</text>`
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:${bg};border-radius:4px;">${content}</svg>`
}

/**
 * Generates print-ready HTML for slide handouts with multiple layout presets.
 *
 * @param {Object} options
 * @param {Array<Object>} options.slides
 * @param {number|string} [options.slidesPerPage=3]
 * @param {boolean} [options.includeNotes=false]
 * @param {boolean} [options.includeSlideNumbers=true]
 * @param {string} [options.title='Presentation Handouts']
 * @returns {string} Standalone HTML document ready for printing
 */
export function generateHandoutsHtml({
  slides = [],
  slidesPerPage = 3,
  includeSlideNumbers = true,
  title = 'Presentation Handouts',
}) {
  const isNotesLayout = slidesPerPage === 'notes'
  const countPerPage = isNotesLayout ? 1 : Number(slidesPerPage) || 3

  const pages = []
  for (let i = 0; i < slides.length; i += countPerPage) {
    pages.push(slides.slice(i, i + countPerPage))
  }

  const renderSlideItem = (slide, index) => {
    const slideNumber = index + 1
    const svg = exportSlideAsSvgString(slide)

    if (isNotesLayout) {
      return `
        <div class="notes-page-item">
          <div class="slide-header">
            ${includeSlideNumbers ? `<span class="slide-num">Slide ${slideNumber}</span>` : ''}
          </div>
          <div class="slide-preview aspect-16-9">${svg}</div>
          <div class="notes-container">
            <h4>Notes:</h4>
            <div class="notes-content">${slide.notes || '<em>No notes recorded for this slide.</em>'}</div>
          </div>
        </div>
      `
    }

    if (countPerPage === 3) {
      return `
        <div class="three-up-row">
          <div class="three-up-slide aspect-16-9">
            ${includeSlideNumbers ? `<div class="slide-tag">#${slideNumber}</div>` : ''}
            ${svg}
          </div>
          <div class="three-up-lines">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>
      `
    }

    return `
      <div class="grid-slide-item">
        ${includeSlideNumbers ? `<div class="slide-tag">Slide ${slideNumber}</div>` : ''}
        <div class="aspect-16-9 slide-frame">${svg}</div>
      </div>
    `
  }

  const renderPage = (pageSlides, pageIndex) => {
    const pageNum = pageIndex + 1
    const startIdx = pageIndex * countPerPage
    let gridClass = 'grid-3-up'
    if (isNotesLayout) gridClass = 'notes-layout'
    else if (countPerPage === 1) gridClass = 'grid-1-up'
    else if (countPerPage === 2) gridClass = 'grid-2-up'
    else if (countPerPage === 4) gridClass = 'grid-4-up'
    else if (countPerPage === 6) gridClass = 'grid-6-up'

    return `
      <div class="handout-page">
        <div class="page-header">
          <span class="doc-title">${title}</span>
          <span class="page-num">Page ${pageNum}</span>
        </div>
        <div class="page-body ${gridClass}">
          ${pageSlides.map((s, idx) => renderSlideItem(s, startIdx + idx)).join('')}
        </div>
      </div>
    `
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page { size: letter portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif; color: #1e293b; margin: 0; padding: 0; background: #f8fafc; }
    .handout-page { width: 210mm; min-height: 297mm; padding: 12mm; margin: 0 auto 10mm; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); page-break-after: always; break-after: page; display: flex; flex-direction: column; }
    .page-header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .page-body { flex: 1; display: flex; flex-direction: column; }
    .aspect-16-9 { position: relative; width: 100%; aspect-ratio: 16 / 9; }
    .slide-frame { border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; background: #fff; }
    .slide-tag { font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px; }
    .grid-1-up { justify-content: center; align-items: center; }
    .grid-1-up .grid-slide-item { width: 90%; }
    .grid-2-up { display: flex; flex-direction: column; gap: 24px; justify-content: space-around; }
    .grid-2-up .grid-slide-item { width: 85%; margin: 0 auto; }
    .grid-3-up { display: flex; flex-direction: column; gap: 16px; justify-content: space-between; }
    .three-up-row { display: flex; gap: 16px; align-items: center; }
    .three-up-slide { flex: 0 0 52%; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; position: relative; }
    .three-up-slide .slide-tag { position: absolute; top: 4px; left: 4px; background: rgba(0,0,0,0.6); color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 9px; }
    .three-up-lines { flex: 1; display: flex; flex-direction: column; gap: 14px; }
    .ruled-line { border-bottom: 1px solid #94a3b8; height: 1px; }
    .grid-4-up { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-content: start; }
    .grid-6-up { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-content: start; }
    .notes-layout .notes-page-item { display: flex; flex-direction: column; height: 100%; gap: 16px; }
    .notes-layout .slide-preview { flex: 0 0 auto; max-height: 120mm; border: 1px solid #cbd5e1; border-radius: 4px; overflow: hidden; }
    .notes-layout .notes-container { flex: 1; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; font-size: 13px; line-height: 1.6; }
    .notes-layout .notes-container h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #64748b; }
    @media print {
      body { background: transparent; }
      .handout-page { margin: 0; box-shadow: none; width: 100%; min-height: 100vh; page-break-after: always; break-after: page; }
    }
  </style>
</head>
<body>
  ${pages.map((p, i) => renderPage(p, i)).join('')}
  <script>
    window.addEventListener('load', () => {
      if (window.opener || window.name === 'zslides_handout_print') window.print();
    });
  </script>
</body>
</html>`
}

/**
 * Initiates handouts printing in a popup or new tab.
 *
 * @param {Object} options
 */
export function printHandouts(options) {
  const html = generateHandoutsHtml(options)
  if (typeof window === 'undefined') return html

  const printWindow = window.open('', 'zslides_handout_print', 'width=900,height=800')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  }
  return html
}

/**
 * Triggers browser download for a blob.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  if (typeof window === 'undefined' || !window.document) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
