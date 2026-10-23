/**
 * Dimensions, aspect ratios, and default styling constants for ZSlides.
 */

export const SLIDE_RATIOS = {
  WIDESCREEN: '16:9',
  STANDARD: '4:3',
}

// Coordinate space resolution: 960 x 540 for 16:9, 960 x 720 for 4:3
export const SLIDE_DIMENSIONS = {
  [SLIDE_RATIOS.WIDESCREEN]: { width: 960, height: 540 },
  [SLIDE_RATIOS.STANDARD]: { width: 960, height: 720 },
}

export const ELEMENT_TYPES = {
  TEXT: 'text',
  SHAPE: 'shape',
  IMAGE: 'image',
  TABLE: 'table',
  CHART: 'chart',
  CONNECTOR: 'connector',
}

export const SHAPE_TYPES = {
  RECTANGLE: 'rect',
  ROUNDED_RECTANGLE: 'rounded_rect',
  ELLIPSE: 'ellipse',
  TRIANGLE: 'triangle',
  RIGHT_ARROW: 'right_arrow',
  LEFT_ARROW: 'left_arrow',
  STAR_5: 'star_5',
  SPEECH_BUBBLE: 'speech_bubble',
  LINE: 'line',
}

export const DEFAULT_THEME_ID = 'modern_clean'

export const HANDLE_DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
