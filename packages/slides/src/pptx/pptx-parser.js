import JSZip from 'jszip'
import { DOMParser } from 'xmldom'
import { createSlide, createTextElement, createSlideElement } from '../core/slide-model.js'
import {
  SLIDE_RATIOS,
  SLIDE_DIMENSIONS,
  ELEMENT_TYPES,
  SHAPE_TYPES,
} from '../core/slide-constants.js'

/**
 * Parses an OOXML EMU measurement into pixels.
 * 1 inch = 914400 EMUs, standard slide width is 10 inches = 960px -> 1px = 9525 EMUs.
 *
 * @param {string|number} emu
 * @returns {number} pixels
 */
function emuToPx(emu) {
  const val = Number(emu) || 0
  return Math.round(val / 9525)
}

/**
 * Parses a single slide XML document and extracts shapes and text elements.
 *
 * @param {string} xmlString
 * @param {number} slideIndex
 * @returns {Object} Slide model
 */
function parseSlideXml(xmlString, slideIndex) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const elements = []
  const shapeNodes = doc.getElementsByTagName('p:sp')

  for (let i = 0; i < shapeNodes.length; i++) {
    const sp = shapeNodes[i]

    // Transform position & size
    const xfrm = sp.getElementsByTagName('a:xfrm')[0]
    let x = 100
    let y = 100
    let width = 200
    let height = 100
    let rotation = 0

    if (xfrm) {
      const off = xfrm.getElementsByTagName('a:off')[0]
      const ext = xfrm.getElementsByTagName('a:ext')[0]
      if (off) {
        x = emuToPx(off.getAttribute('x'))
        y = emuToPx(off.getAttribute('y'))
      }
      if (ext) {
        width = Math.max(20, emuToPx(ext.getAttribute('cx')))
        height = Math.max(20, emuToPx(ext.getAttribute('cy')))
      }
      if (xfrm.getAttribute('rot')) {
        rotation = Math.round(Number(xfrm.getAttribute('rot')) / 60000)
      }
    }

    // Text content
    const txBody = sp.getElementsByTagName('p:txBody')[0]
    if (txBody) {
      const textRuns = []
      const rNodes = txBody.getElementsByTagName('a:r')
      for (let j = 0; j < rNodes.length; j++) {
        const t = rNodes[j].getElementsByTagName('a:t')[0]
        if (t && t.textContent) {
          textRuns.push(t.textContent)
        }
      }

      // Also check fallback paragraphs without runs
      if (textRuns.length === 0) {
        const tNodes = txBody.getElementsByTagName('a:t')
        for (let j = 0; j < tNodes.length; j++) {
          if (tNodes[j].textContent) textRuns.push(tNodes[j].textContent)
        }
      }

      const fullText = textRuns.join('')
      if (fullText.trim()) {
        elements.push(
          createTextElement({
            x,
            y,
            width,
            height,
            rotation,
            text: fullText,
          }),
        )
        continue
      }
    }

    // Otherwise standard shape
    elements.push(
      createSlideElement({
        type: ELEMENT_TYPES.SHAPE,
        x,
        y,
        width,
        height,
        rotation,
        properties: {
          shapeType: SHAPE_TYPES.RECTANGLE,
          fill: '#3b82f6',
        },
      }),
    )
  }

  return createSlide({
    id: `slide_${slideIndex + 1}`,
    elements,
  })
}

/**
 * Parses a .pptx file ArrayBuffer or Buffer into a ZSlides presentation deck.
 *
 * @param {ArrayBuffer|Buffer|Uint8Array} data
 * @returns {Promise<Object>} Presentation deck model
 */
export async function readPptx(data) {
  const zip = await JSZip.loadAsync(data)

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10)
      const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10)
      return numA - numB
    })

  const slides = []
  for (let idx = 0; idx < slideFiles.length; idx++) {
    const xml = await zip.files[slideFiles[idx]].async('text')
    const slide = parseSlideXml(xml, idx)
    slides.push(slide)
  }

  // Fallback if no slides found
  if (slides.length === 0) {
    slides.push(createSlide({ id: 'slide_1' }))
  }

  return {
    aspectRatio: SLIDE_RATIOS.WIDESCREEN,
    dimensions: SLIDE_DIMENSIONS[SLIDE_RATIOS.WIDESCREEN],
    themeId: 'modern_clean',
    activeSlideId: slides[0].id,
    slides,
  }
}

export { readPptx as parsePptxFile }
