import { SHAPE_TYPES } from '../core/slide-constants.js'

/**
 * Returns the SVG path string for a given shape type and dimensions.
 *
 * @param {string} shapeType
 * @param {number} width
 * @param {number} height
 * @returns {string} SVG path data
 */
export function getShapePath(shapeType, width, height) {
  const w = Math.max(1, width)
  const h = Math.max(1, height)

  switch (shapeType) {
    case SHAPE_TYPES.TRIANGLE:
      return `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`

    case SHAPE_TYPES.RIGHT_ARROW: {
      const headW = Math.min(w * 0.4, 40)
      const stemH = h * 0.4
      const stemTop = (h - stemH) / 2
      const stemBottom = stemTop + stemH
      return `M 0 ${stemTop} L ${w - headW} ${stemTop} L ${w - headW} 0 L ${w} ${h / 2} L ${w - headW} ${h} L ${w - headW} ${stemBottom} L 0 ${stemBottom} Z`
    }

    case SHAPE_TYPES.LEFT_ARROW: {
      const headW = Math.min(w * 0.4, 40)
      const stemH = h * 0.4
      const stemTop = (h - stemH) / 2
      const stemBottom = stemTop + stemH
      return `M ${headW} ${stemTop} L ${w} ${stemTop} L ${w} ${stemBottom} L ${headW} ${stemBottom} L ${headW} ${h} L 0 ${h / 2} L ${headW} 0 Z`
    }

    case SHAPE_TYPES.STAR_5: {
      const cx = w / 2
      const cy = h / 2
      const outerR = Math.min(cx, cy)
      const innerR = outerR * 0.45
      const points = []
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        points.push(`${cx + r * Math.cos(angle)} ${cy + r * Math.sin(angle)}`)
      }
      return `M ${points.join(' L ')} Z`
    }

    case SHAPE_TYPES.SPEECH_BUBBLE: {
      const r = 8
      const tailW = 20
      const tailH = 15
      const bodyH = h - tailH
      return `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${bodyH - r} Q ${w} ${bodyH} ${w - r} ${bodyH} L ${tailW + 20} ${bodyH} L ${tailW / 2 + 10} ${h} L 20 ${bodyH} L ${r} ${bodyH} Q 0 ${bodyH} 0 ${bodyH - r} L 0 ${r} Q 0 0 ${r} 0 Z`
    }

    case SHAPE_TYPES.LINE:
      return `M 0 ${h / 2} L ${w} ${h / 2}`

    case SHAPE_TYPES.ELLIPSE:
    case SHAPE_TYPES.ROUNDED_RECTANGLE:
    case SHAPE_TYPES.RECTANGLE:
    default:
      return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`
  }
}
