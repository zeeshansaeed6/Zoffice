/**
 * ZDraw Constants — tools, shape definitions, routing modes, anchors, and themes.
 * @module constants
 */

export const TOOLS = {
  SELECT: 'select',
  PAN: 'pan',
  CONNECTOR: 'connector',
  TEXT: 'text',
  SHAPE: 'shape',
  FREEHAND: 'freehand',
}

export const SHAPE_CATEGORIES = {
  BASIC: 'basic',
  FLOWCHART: 'flowchart',
  UML: 'uml',
  ERD: 'erd',
  NETWORK: 'network',
  CUSTOM: 'custom',
}

export const ROUTING_MODES = {
  ORTHOGONAL: 'orthogonal',
  CURVED: 'curved',
  STRAIGHT: 'straight',
}

export const ANCHORS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  CENTER: 'center',
}

export const ARROW_TYPES = {
  NONE: 'none',
  ARROW: 'arrow',
  STEALTH: 'stealth',
  OPEN: 'open',
  DIAMOND: 'diamond',
  CIRCLE: 'circle',
}

export const SHAPE_LIBRARY = [
  // Basic
  { id: 'rect', name: 'Rectangle', category: SHAPE_CATEGORIES.BASIC, width: 120, height: 80 },
  {
    id: 'round-rect',
    name: 'Rounded Rectangle',
    category: SHAPE_CATEGORIES.BASIC,
    width: 120,
    height: 80,
  },
  {
    id: 'ellipse',
    name: 'Circle / Ellipse',
    category: SHAPE_CATEGORIES.BASIC,
    width: 100,
    height: 100,
  },
  { id: 'diamond', name: 'Diamond', category: SHAPE_CATEGORIES.BASIC, width: 110, height: 110 },
  { id: 'triangle', name: 'Triangle', category: SHAPE_CATEGORIES.BASIC, width: 110, height: 90 },
  { id: 'star', name: '5-Point Star', category: SHAPE_CATEGORIES.BASIC, width: 100, height: 100 },
  {
    id: 'cylinder',
    name: 'Cylinder / Storage',
    category: SHAPE_CATEGORIES.BASIC,
    width: 90,
    height: 110,
  },
  { id: 'hexagon', name: 'Hexagon', category: SHAPE_CATEGORIES.BASIC, width: 110, height: 90 },

  // Flowchart
  {
    id: 'fc-process',
    name: 'Process',
    category: SHAPE_CATEGORIES.FLOWCHART,
    width: 120,
    height: 70,
  },
  {
    id: 'fc-decision',
    name: 'Decision',
    category: SHAPE_CATEGORIES.FLOWCHART,
    width: 120,
    height: 100,
  },
  {
    id: 'fc-terminator',
    name: 'Start / End',
    category: SHAPE_CATEGORIES.FLOWCHART,
    width: 120,
    height: 60,
  },
  {
    id: 'fc-document',
    name: 'Document',
    category: SHAPE_CATEGORIES.FLOWCHART,
    width: 120,
    height: 80,
  },
  {
    id: 'fc-io',
    name: 'Data / Input-Output',
    category: SHAPE_CATEGORIES.FLOWCHART,
    width: 130,
    height: 70,
  },

  // UML
  { id: 'uml-class', name: 'Class Box', category: SHAPE_CATEGORIES.UML, width: 140, height: 100 },
  { id: 'uml-interface', name: 'Interface', category: SHAPE_CATEGORIES.UML, width: 80, height: 80 },
  { id: 'uml-package', name: 'Package', category: SHAPE_CATEGORIES.UML, width: 130, height: 90 },
  { id: 'uml-usecase', name: 'Use Case', category: SHAPE_CATEGORIES.UML, width: 130, height: 75 },
  { id: 'uml-actor', name: 'Actor', category: SHAPE_CATEGORIES.UML, width: 70, height: 110 },

  // ERD
  { id: 'erd-entity', name: 'Entity', category: SHAPE_CATEGORIES.ERD, width: 120, height: 70 },
  {
    id: 'erd-weak-entity',
    name: 'Weak Entity',
    category: SHAPE_CATEGORIES.ERD,
    width: 120,
    height: 70,
  },
  {
    id: 'erd-relationship',
    name: 'Relationship',
    category: SHAPE_CATEGORIES.ERD,
    width: 120,
    height: 90,
  },
  {
    id: 'erd-attribute',
    name: 'Attribute',
    category: SHAPE_CATEGORIES.ERD,
    width: 110,
    height: 60,
  },

  // Network
  {
    id: 'net-server',
    name: 'Server Host',
    category: SHAPE_CATEGORIES.NETWORK,
    width: 90,
    height: 100,
  },
  { id: 'net-router', name: 'Router', category: SHAPE_CATEGORIES.NETWORK, width: 90, height: 90 },
  { id: 'net-switch', name: 'Switch', category: SHAPE_CATEGORIES.NETWORK, width: 100, height: 60 },
  {
    id: 'net-cloud',
    name: 'Cloud Network',
    category: SHAPE_CATEGORIES.NETWORK,
    width: 130,
    height: 85,
  },
  {
    id: 'net-firewall',
    name: 'Firewall',
    category: SHAPE_CATEGORIES.NETWORK,
    width: 90,
    height: 100,
  },
  {
    id: 'net-database',
    name: 'Database Cluster',
    category: SHAPE_CATEGORIES.NETWORK,
    width: 80,
    height: 100,
  },
]

export const COLOR_PALETTES = [
  { name: 'Slate', fill: '#f8fafc', stroke: '#475569', text: '#0f172a' },
  { name: 'Blue', fill: '#eff6ff', stroke: '#2563eb', text: '#1e3a8a' },
  { name: 'Green', fill: '#f0fdf4', stroke: '#16a34a', text: '#14532d' },
  { name: 'Amber', fill: '#fffbeb', stroke: '#d97706', text: '#78350f' },
  { name: 'Purple', fill: '#faf5ff', stroke: '#9333ea', text: '#581c87' },
  { name: 'Rose', fill: '#fff1f2', stroke: '#e11d48', text: '#881337' },
]

export const DEFAULT_CANVAS_CONFIG = {
  width: 3200,
  height: 2400,
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  backgroundColor: '#ffffff',
}
