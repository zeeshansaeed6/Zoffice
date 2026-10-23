import { createSlideElement, createTextElement } from './slide-model.js'
import { ELEMENT_TYPES, SHAPE_TYPES } from './slide-constants.js'

/**
 * Creates default text box element.
 * @returns {Object}
 */
export function createDefaultTextBox() {
  return createTextElement({
    x: 280,
    y: 200,
    width: 400,
    height: 100,
    text: 'Click to add text',
    fontSize: 24,
  })
}

/**
 * Creates default shape element.
 * @param {string} [shapeType=SHAPE_TYPES.RECTANGLE]
 * @returns {Object}
 */
export function createDefaultShape(shapeType = SHAPE_TYPES.RECTANGLE) {
  return createSlideElement({
    type: ELEMENT_TYPES.SHAPE,
    x: 350,
    y: 200,
    width: 200,
    height: 120,
    properties: {
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      strokeWidth: 2,
      shapeType,
    },
  })
}

/**
 * Creates default table element.
 * @returns {Object}
 */
export function createDefaultTable() {
  return createSlideElement({
    type: ELEMENT_TYPES.TABLE,
    x: 180,
    y: 120,
    width: 600,
    height: 250,
    properties: {
      rows: 4,
      cols: 3,
      data: [
        ['Product', 'Region', 'Revenue'],
        ['ZWriter', 'Global', '$45,000'],
        ['ZSheets', 'Global', '$62,000'],
        ['ZSlides', 'Global', '$38,000'],
      ],
      headerBg: '#2563eb',
      headerColor: '#ffffff',
    },
  })
}

/**
 * Creates default chart element.
 * @returns {Object}
 */
export function createDefaultChart() {
  return createSlideElement({
    type: ELEMENT_TYPES.CHART,
    x: 230,
    y: 100,
    width: 500,
    height: 320,
    properties: {
      chartType: 'bar',
      title: 'Quarterly Growth',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Adoption Rate',
          data: [25, 48, 86, 142],
          backgroundColor: '#3b82f6',
        },
      ],
    },
  })
}

/**
 * Creates default picture element.
 * @returns {Object}
 */
export function createDefaultPicture() {
  const placeholderSvg =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260"><rect width="400" height="260" fill="%23e2e8f0"/><circle cx="200" cy="130" r="50" fill="%2394a3b8"/><text x="200" y="210" font-family="sans-serif" font-size="16" fill="%23475569" text-anchor="middle">Zoffice Image</text></svg>'
  return createSlideElement({
    type: ELEMENT_TYPES.IMAGE,
    x: 280,
    y: 140,
    width: 400,
    height: 260,
    properties: {
      src: placeholderSvg,
      alt: 'Sample slide image',
      borderRadius: 8,
    },
  })
}
