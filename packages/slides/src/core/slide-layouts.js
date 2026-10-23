import { createTextElement } from './slide-model.js'

export const LAYOUT_TYPES = {
  TITLE: 'title',
  TITLE_AND_CONTENT: 'title_and_content',
  SECTION_HEADER: 'section_header',
  TWO_CONTENT: 'two_content',
  COMPARISON: 'comparison',
  TITLE_ONLY: 'title_only',
  BLANK: 'blank',
}

/**
 * Creates default elements for a given slide layout.
 *
 * @param {string} layoutType
 * @param {Object} [dimensions={ width: 960, height: 540 }]
 * @returns {Array<Object>}
 */
export function createElementsForLayout(layoutType, dimensions = { width: 960, height: 540 }) {
  const { width } = dimensions

  switch (layoutType) {
    case LAYOUT_TYPES.TITLE:
      return [
        createTextElement({
          x: 80,
          y: 160,
          width: width - 160,
          height: 100,
          text: 'Presentation Title',
          fontSize: 44,
          bold: true,
          align: 'center',
        }),
        createTextElement({
          x: 180,
          y: 280,
          width: width - 360,
          height: 60,
          text: 'Subtitle or Author Name',
          fontSize: 22,
          color: '#64748b',
          align: 'center',
        }),
      ]

    case LAYOUT_TYPES.TITLE_AND_CONTENT:
      return [
        createTextElement({
          x: 60,
          y: 40,
          width: width - 120,
          height: 60,
          text: 'Slide Title',
          fontSize: 36,
          bold: true,
        }),
        createTextElement({
          x: 60,
          y: 120,
          width: width - 120,
          height: 360,
          text: '• First key takeaway\n• Second supporting point\n• Additional discussion topic',
          fontSize: 20,
        }),
      ]

    case LAYOUT_TYPES.SECTION_HEADER:
      return [
        createTextElement({
          x: 80,
          y: 200,
          width: width - 160,
          height: 80,
          text: 'Section Title',
          fontSize: 40,
          bold: true,
        }),
        createTextElement({
          x: 80,
          y: 290,
          width: width - 160,
          height: 60,
          text: 'Brief section overview description',
          fontSize: 20,
          color: '#64748b',
        }),
      ]

    case LAYOUT_TYPES.TWO_CONTENT: {
      const colW = (width - 160) / 2
      return [
        createTextElement({
          x: 60,
          y: 40,
          width: width - 120,
          height: 60,
          text: 'Two Content Layout',
          fontSize: 36,
          bold: true,
        }),
        createTextElement({
          x: 60,
          y: 120,
          width: colW,
          height: 360,
          text: '• Left column point A\n• Left column point B',
          fontSize: 18,
        }),
        createTextElement({
          x: 60 + colW + 40,
          y: 120,
          width: colW,
          height: 360,
          text: '• Right column point A\n• Right column point B',
          fontSize: 18,
        }),
      ]
    }

    case LAYOUT_TYPES.COMPARISON: {
      const colW = (width - 160) / 2
      return [
        createTextElement({
          x: 60,
          y: 30,
          width: width - 120,
          height: 50,
          text: 'Comparison Layout',
          fontSize: 36,
          bold: true,
        }),
        createTextElement({
          x: 60,
          y: 95,
          width: colW,
          height: 40,
          text: 'Item A',
          fontSize: 22,
          bold: true,
        }),
        createTextElement({
          x: 60,
          y: 145,
          width: colW,
          height: 330,
          text: '• Advantages of A\n• Performance metrics',
          fontSize: 18,
        }),
        createTextElement({
          x: 60 + colW + 40,
          y: 95,
          width: colW,
          height: 40,
          text: 'Item B',
          fontSize: 22,
          bold: true,
        }),
        createTextElement({
          x: 60 + colW + 40,
          y: 145,
          width: colW,
          height: 330,
          text: '• Advantages of B\n• Performance metrics',
          fontSize: 18,
        }),
      ]
    }

    case LAYOUT_TYPES.TITLE_ONLY:
      return [
        createTextElement({
          x: 60,
          y: 40,
          width: width - 120,
          height: 60,
          text: 'Title Only Slide',
          fontSize: 36,
          bold: true,
        }),
      ]

    case LAYOUT_TYPES.BLANK:
    default:
      return []
  }
}
