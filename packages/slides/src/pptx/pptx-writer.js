import PptxGenJS from 'pptxgenjs'
import { ELEMENT_TYPES, SHAPE_TYPES, SLIDE_RATIOS } from '../core/slide-constants.js'

/**
 * Maps ZSlides shape types to PptxGenJS shape names.
 *
 * @param {string} shapeType
 * @param {PptxGenJS} pptx
 * @returns {any}
 */
function mapShapeType(shapeType, pptx) {
  switch (shapeType) {
    case SHAPE_TYPES.ROUNDED_RECTANGLE:
      return pptx.ShapeType.roundRect
    case SHAPE_TYPES.ELLIPSE:
      return pptx.ShapeType.ellipse
    case SHAPE_TYPES.TRIANGLE:
      return pptx.ShapeType.triangle
    case SHAPE_TYPES.RIGHT_ARROW:
      return pptx.ShapeType.rightArrow
    case SHAPE_TYPES.STAR_5:
      return pptx.ShapeType.star5
    case SHAPE_TYPES.RECTANGLE:
    default:
      return pptx.ShapeType.rect
  }
}

/**
 * Serializes a ZSlides presentation deck into a .pptx ArrayBuffer or base64.
 *
 * @param {Object} deck - Presentation deck model
 * @param {'arraybuffer'|'base64'|'nodebuffer'} [outputType='arraybuffer']
 * @returns {Promise<ArrayBuffer|string>}
 */
export async function writePptx(deck, outputType = 'arraybuffer') {
  const pptx = new PptxGenJS()

  // Slide layout aspect ratio
  if (deck.aspectRatio === SLIDE_RATIOS.STANDARD) {
    pptx.layout = 'LAYOUT_4x3'
  } else {
    pptx.layout = 'LAYOUT_16x9'
  }

  const slideW = deck.dimensions?.width || 960
  const slideH = deck.dimensions?.height || 540

  // 16:9 standard in PptxGenJS is 10 x 5.625 inches; 4:3 is 10 x 7.5 inches
  const pWidth = 10
  const pHeight = deck.aspectRatio === SLIDE_RATIOS.STANDARD ? 7.5 : 5.625

  for (const slideModel of deck.slides) {
    const slide = pptx.addSlide()

    // Background color
    if (slideModel.background?.color) {
      slide.background = { color: slideModel.background.color.replace('#', '') }
    }

    // Notes
    if (slideModel.notes) {
      slide.addNotes(slideModel.notes)
    }

    for (const elem of slideModel.elements) {
      // Convert pixel coordinates (0..960, 0..540) to inches
      const x = (elem.x / slideW) * pWidth
      const y = (elem.y / slideH) * pHeight
      const w = (elem.width / slideW) * pWidth
      const h = (elem.height / slideH) * pHeight

      if (elem.type === ELEMENT_TYPES.TEXT) {
        const textProps = elem.properties || {}
        slide.addText(textProps.text || '', {
          x,
          y,
          w,
          h,
          fontSize: Math.round((textProps.fontSize || 20) * 0.75), // Convert px to pt
          fontFace: (textProps.fontFamily || 'Inter').split(',')[0].trim(),
          color: (textProps.color || '#000000').replace('#', ''),
          bold: !!textProps.bold,
          italic: !!textProps.italic,
          underline: !!textProps.underline,
          align: textProps.align || 'left',
          valign: 'top',
          rotate: elem.rotation || 0,
        })
      } else if (elem.type === ELEMENT_TYPES.SHAPE) {
        const shapeProps = elem.properties || {}
        const shapeType = mapShapeType(shapeProps.shapeType, pptx)

        slide.addShape(shapeType, {
          x,
          y,
          w,
          h,
          fill: { color: (shapeProps.fill || '#3b82f6').replace('#', '') },
          line: {
            color: (shapeProps.stroke || '#1d4ed8').replace('#', ''),
            width: shapeProps.strokeWidth || 0,
          },
          rotate: elem.rotation || 0,
        })
      }
    }
  }

  return await pptx.write({ outputType })
}
