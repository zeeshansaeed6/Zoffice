/**
 * @zoffice/draw — Modern offline-first vector diagramming and flowchart suite for Zoffice.
 * @module @zoffice/draw
 */

export { ZDraw } from './ZDraw.jsx'
export { useDrawStore } from './core/draw-store.js'
export {
  createDiagram,
  createShape,
  createConnector,
  createLayer,
  getAnchorCoords,
  generateId,
} from './core/draw-model.js'
export {
  TOOLS,
  SHAPE_CATEGORIES,
  ROUTING_MODES,
  ANCHORS,
  ARROW_TYPES,
  SHAPE_LIBRARY,
  COLOR_PALETTES,
} from './core/constants.js'
export {
  routeConnectorPath,
  calculateOrthogonalPath,
  getConnectorLabelPosition,
} from './core/connector-router.js'
export {
  alignShapes,
  distributeShapes,
  bringToFront,
  sendToBack,
  groupShapes,
  ungroupShapes,
} from './core/align-distribute.js'
export { exportDiagramToSvg } from './core/svg-exporter.js'
export { getDrawRibbonConfig } from './ribbon-config.jsx'
