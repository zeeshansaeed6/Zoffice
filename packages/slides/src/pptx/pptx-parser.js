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

const ALIGNMENTS = { l: 'left', ctr: 'center', r: 'right', just: 'justify' }

/**
 * Reads the first run's formatting (size, face, colour, bold/italic/underline) and
 * paragraph alignment from a text body. Inverse of the writer's addText options.
 *
 * @param {Element} txBody
 * @returns {Object} text element options
 */
function parseTextFormat(txBody) {
  const options = {}
  const rPr = txBody.getElementsByTagName('a:rPr')[0]
  if (rPr) {
    const size = Number(rPr.getAttribute('sz'))
    if (size) options.fontSize = Math.round(size / 100 / 0.75) // pt -> px
    if (rPr.getAttribute('b') === '1') options.bold = true
    if (rPr.getAttribute('i') === '1') options.italic = true
    const underline = rPr.getAttribute('u')
    if (underline && underline !== 'none') options.underline = true
    const color = rPr.getElementsByTagName('a:srgbClr')[0]?.getAttribute('val')
    if (color) options.color = `#${color.toLowerCase()}`
    const face = rPr.getElementsByTagName('a:latin')[0]?.getAttribute('typeface')
    if (face) options.fontFamily = `${face}, sans-serif`
  }
  const algn = txBody.getElementsByTagName('a:pPr')[0]?.getAttribute('algn')
  if (ALIGNMENTS[algn]) options.align = ALIGNMENTS[algn]
  return options
}

/** Reads a solid slide background colour (p:bg) as #rrggbb, if present. */
function parseBackground(doc) {
  const bg = doc.getElementsByTagName('p:bg')[0]
  const color = bg?.getElementsByTagName('a:srgbClr')[0]?.getAttribute('val')
  return color ? `#${color.toLowerCase()}` : undefined
}

/**
 * Extracts the speaker notes text from a notesSlide part (body placeholder).
 * @param {string} xmlString
 * @returns {string}
 */
function parseNotesXml(xmlString) {
  const doc = new DOMParser().parseFromString(xmlString, 'application/xml')
  const shapes = doc.getElementsByTagName('p:sp')
  for (let i = 0; i < shapes.length; i++) {
    const ph = shapes[i].getElementsByTagName('p:ph')[0]
    if (ph && ph.getAttribute('type') === 'body') {
      return Array.from(shapes[i].getElementsByTagName('a:p'))
        .map((p) =>
          Array.from(p.getElementsByTagName('a:t'))
            .map((t) => t.textContent)
            .join(''),
        )
        .join('\n')
        .trim()
    }
  }
  return ''
}

/**
 * Parses a single slide XML document and extracts shapes and text elements.
 *
 * @param {string} xmlString
 * @param {number} slideIndex
 * @returns {Object} Slide model
 */
function parseSlideXml(xmlString, slideIndex, notes = '') {
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
            ...parseTextFormat(txBody),
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
    notes,
    ...(parseBackground(doc) ? { background: parseBackground(doc) } : {}),
  })
}

/** Finds and parses the notes slide related to a slide part, if any. */
async function readSlideNotes(zip, slidePath) {
  const relsPath = slidePath.replace('slides/', 'slides/_rels/') + '.rels'
  const rels = zip.file(relsPath)
  if (!rels) return ''
  const match = (await rels.async('text')).match(/Target="[^"]*notesSlides\/(notesSlide\d+\.xml)"/)
  const notes = match && zip.file(`ppt/notesSlides/${match[1]}`)
  return notes ? parseNotesXml(await notes.async('text')) : ''
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
    const slide = parseSlideXml(xml, idx, await readSlideNotes(zip, slideFiles[idx]))
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
