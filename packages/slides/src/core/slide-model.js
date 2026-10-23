import {
  SLIDE_RATIOS,
  SLIDE_DIMENSIONS,
  ELEMENT_TYPES,
  SHAPE_TYPES,
  DEFAULT_THEME_ID,
} from './slide-constants.js'

/**
 * Creates a unique identifier.
 * @param {string} [prefix='elem']
 * @returns {string}
 */
export function createId(prefix = 'elem') {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`
}

/**
 * Creates a slide element.
 *
 * @param {Object} options
 * @param {string} options.type
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} [options.rotation=0]
 * @param {Object} [options.properties={}]
 * @returns {Object}
 */
export function createSlideElement({
  type = ELEMENT_TYPES.SHAPE,
  x = 100,
  y = 100,
  width = 200,
  height = 120,
  rotation = 0,
  properties = {},
}) {
  return {
    id: createId(type),
    type,
    x,
    y,
    width,
    height,
    rotation,
    properties: {
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      strokeWidth: 0,
      opacity: 1,
      shapeType: SHAPE_TYPES.RECTANGLE,
      ...properties,
    },
  }
}

/**
 * Creates a rich text element.
 *
 * @param {Object} options
 * @returns {Object}
 */
export function createTextElement(options = {}) {
  return createSlideElement({
    type: ELEMENT_TYPES.TEXT,
    width: options.width || 400,
    height: options.height || 100,
    x: options.x || 100,
    y: options.y || 100,
    properties: {
      text: options.text || 'Click to edit text',
      fontSize: options.fontSize || 24,
      fontFamily: options.fontFamily || 'Inter, sans-serif',
      color: options.color || '#1e293b',
      bold: options.bold || false,
      italic: options.italic || false,
      underline: options.underline || false,
      align: options.align || 'left',
      fill: 'transparent',
      strokeWidth: 0,
      ...options.properties,
    },
  })
}

/**
 * Creates a new slide data structure.
 *
 * @param {Object} [options]
 * @param {string} [options.id]
 * @param {string} [options.layout='title_and_content']
 * @param {Array<Object>} [options.elements=[]]
 * @returns {Object}
 */
export function createSlide({
  id = createId('slide'),
  layout = 'title_and_content',
  elements = [],
} = {}) {
  return {
    id,
    layout,
    background: { type: 'solid', color: '#ffffff' },
    notes: '',
    transition: { type: 'none', duration: 0.5 },
    elements,
  }
}

/**
 * Creates a new presentation deck data structure.
 *
 * @param {string} [ratio=SLIDE_RATIOS.WIDESCREEN]
 * @returns {Object}
 */
export function createPresentationDeck(ratio = SLIDE_RATIOS.WIDESCREEN) {
  const titleSlide = createSlide({
    layout: 'title',
    elements: [
      createTextElement({
        x: 80,
        y: 160,
        width: 800,
        height: 100,
        text: 'Presentation Title',
        fontSize: 44,
        bold: true,
        align: 'center',
      }),
      createTextElement({
        x: 180,
        y: 280,
        width: 600,
        height: 60,
        text: 'Subtitle or Author Name',
        fontSize: 22,
        color: '#64748b',
        align: 'center',
      }),
    ],
  })

  return {
    aspectRatio: ratio,
    dimensions: SLIDE_DIMENSIONS[ratio] || SLIDE_DIMENSIONS[SLIDE_RATIOS.WIDESCREEN],
    themeId: DEFAULT_THEME_ID,
    activeSlideId: titleSlide.id,
    slides: [titleSlide],
  }
}
