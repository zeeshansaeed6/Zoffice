import { describe, it, expect } from 'vitest'
import { exportDiagramToSvg } from '../core/svg-exporter.js'
import { createDiagram, createShape, createConnector } from '../core/draw-model.js'

describe('SVG Exporter', () => {
  it('exports diagram to valid standalone SVG markup', () => {
    const s1 = createShape({ id: 's1', type: 'rect', text: 'Server Alpha' })
    const s2 = createShape({ id: 's2', type: 'fc-decision', x: 300, y: 100, text: 'Health OK?' })
    const c1 = createConnector('s1', 's2', { text: 'Heartbeat' })

    const diag = createDiagram({
      title: 'Infrastructure Health',
      shapes: [s1, s2],
      connectors: [c1],
    })

    const svg = exportDiagramToSvg(diag)
    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('Server Alpha')
    expect(svg).toContain('Health OK?')
    expect(svg).toContain('Heartbeat')
    expect(svg).toContain('marker-end="url(#arrow)"')
    expect(svg).toContain('</svg>')
  })
})
