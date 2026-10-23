import fs from 'fs'
import path from 'path'
import { readDocxPackage } from '../packages/writer/src/docx/ooxml-package.js'
import { parseDocxToHtml } from '../packages/writer/src/docx/docx-parser.js'
import { parseXml } from '../packages/writer/src/docx/xml-utils.js'

/**
 * Analyzes a document.xml string and returns feature flags.
 * @param {string} xmlString
 * @param {Map<string, any>} media
 * @returns {Record<string, boolean|number|string>}
 */
function analyzeDocumentXml(xmlString, media) {
  const doc = parseXml(xmlString)
  const xml = xmlString

  const hasBold = /<w:b(\s|\/|>)/i.test(xml)
  const hasItalic = /<w:i(\s|\/|>)/i.test(xml)
  const hasUnderline = /<w:u\s+[^>]*w:val="(?!none)/i.test(xml)
  const hasStrike = /<w:strike(\s|\/|>)/i.test(xml)
  const hasSubscript = /<w:vertAlign\s+[^>]*w:val="subscript"/i.test(xml)
  const hasSuperscript = /<w:vertAlign\s+[^>]*w:val="superscript"/i.test(xml)
  const hasColors = /<w:color\s+[^>]*w:val="(?!auto)[a-f0-9]{6}"/i.test(xml)
  const hasHighlight = /<w:highlight\s+[^>]*w:val="(?!none)/i.test(xml)
  const hasFontFamily = /<w:rFonts\s+[^>]*w:(ascii|hAnsi)="([^"]+)"/i.test(xml)
  const hasFontSize = /<w:sz\s+[^>]*w:val="\d+"/i.test(xml)

  const hasHeadings = /<w:pStyle\s+[^>]*w:val="heading\d?"/i.test(xml)
  const hasAlignment = /<w:jc\s+[^>]*w:val="(center|right|both|justify)"/i.test(xml)
  const hasLineSpacing = /<w:spacing\s+[^>]*w:line="\d+"/i.test(xml)
  const hasLists = /<w:numPr/i.test(xml)

  const tblMatches = doc.getElementsByTagNameNS('*', 'tbl')
  const hasTables = tblMatches.length > 0
  const hasMergedCells = /<w:gridSpan|<w:vMerge/i.test(xml)
  const hasCellShading = /<w:shd\s+[^>]*w:fill="(?!auto)[a-f0-9]{6}"/i.test(xml)

  const hasImages = (media && media.size > 0) || /<w:drawing|<a:blip/i.test(xml)
  const hasHyperlinks = /<w:hyperlink/i.test(xml)

  const hasPageMargins = /<w:pgMar/i.test(xml)
  const hasOrientation = /<w:pgSz\s+[^>]*w:orient="landscape"/i.test(xml)

  return {
    bold: hasBold,
    italic: hasItalic,
    underline: hasUnderline,
    strike: hasStrike,
    subscript: hasSubscript,
    superscript: hasSuperscript,
    colors: hasColors,
    highlight: hasHighlight,
    fontFamily: hasFontFamily,
    fontSize: hasFontSize,
    headings: hasHeadings,
    alignment: hasAlignment,
    lineSpacing: hasLineSpacing,
    lists: hasLists,
    tables: hasTables,
    mergedCells: hasMergedCells,
    cellShading: hasCellShading,
    images: hasImages,
    hyperlinks: hasHyperlinks,
    pageMargins: hasPageMargins,
    landscape: hasOrientation,
  }
}

/**
 * Analyzes parsed HTML output to verify which features were preserved.
 * @param {string} html
 * @param {any} pageSetup
 * @returns {Record<string, boolean>}
 */
function analyzeHtmlOutput(html, pageSetup) {
  return {
    bold: /<strong>|<b>/i.test(html),
    italic: /<em>|<i>/i.test(html),
    underline: /<u>|text-decoration:\s*underline/i.test(html),
    strike: /<s>|<del>|<strike>|line-through/i.test(html),
    subscript: /<sub>/i.test(html),
    superscript: /<sup>/i.test(html),
    colors: /color:\s*#[a-f0-9]{6}/i.test(html),
    highlight: /background-color:/i.test(html),
    fontFamily: /font-family:/i.test(html),
    fontSize: /font-size:/i.test(html),
    headings: /<h[1-6]/i.test(html),
    alignment: /text-align:\s*(center|right|justify)/i.test(html),
    lineSpacing: /line-height:/i.test(html),
    lists: /<ul|<ol|<li>/i.test(html),
    tables: /<table/i.test(html),
    mergedCells: /colspan=/i.test(html),
    cellShading: /background-color:\s*#[a-f0-9]{6}/i.test(html),
    images: /<img\s+src="data:image/i.test(html),
    hyperlinks: /<a\s+href=/i.test(html),
    pageMargins: Boolean(pageSetup?.margins),
    landscape: pageSetup?.orientation === 'landscape',
  }
}

async function runReport() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: pnpm docx:report <path-to-docx-file>')
    process.exit(1)
  }

  const absolutePath = path.resolve(process.cwd(), filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`)
    process.exit(1)
  }

  console.info(`\n======================================================`)
  console.info(`       ZOFFICE .DOCX FIDELITY REPORT`)
  console.info(`======================================================`)
  console.info(`File: ${path.basename(absolutePath)}`)
  console.info(`Path: ${absolutePath}\n`)

  const buffer = fs.readFileSync(absolutePath)
  const pkg = await readDocxPackage(buffer)
  const src = analyzeDocumentXml(pkg.documentXml, pkg.media)

  const parsed = await parseDocxToHtml(buffer)
  const out = analyzeHtmlOutput(parsed.html, parsed.pageSetup)

  const featureList = [
    { key: 'fontFamily', label: 'Run: Font Family' },
    { key: 'fontSize', label: 'Run: Font Size' },
    { key: 'bold', label: 'Run: Bold' },
    { key: 'italic', label: 'Run: Italic' },
    { key: 'underline', label: 'Run: Underline' },
    { key: 'strike', label: 'Run: Strikethrough' },
    { key: 'subscript', label: 'Run: Subscript' },
    { key: 'superscript', label: 'Run: Superscript' },
    { key: 'colors', label: 'Run: Text Color' },
    { key: 'highlight', label: 'Run: Background Highlight' },
    { key: 'headings', label: 'Paragraph: Headings (H1-H6, Title)' },
    { key: 'alignment', label: 'Paragraph: Alignment' },
    { key: 'lineSpacing', label: 'Paragraph: Line Spacing' },
    { key: 'lists', label: 'Lists: Bullets & Numbering' },
    { key: 'tables', label: 'Tables: Grid Structure' },
    { key: 'mergedCells', label: 'Tables: Colspan / Merged Cells' },
    { key: 'cellShading', label: 'Tables: Cell Shading / Fill' },
    { key: 'images', label: 'Media: Embedded Inline Images' },
    { key: 'hyperlinks', label: 'Links: External Hyperlinks' },
    { key: 'pageMargins', label: 'Page Setup: Margins' },
    { key: 'landscape', label: 'Page Setup: Orientation' },
  ]

  let testedCount = 0
  let preservedCount = 0

  console.info(`Feature                          Source      Parsed      Status`)
  console.info(`------------------------------------------------------------------`)

  for (const f of featureList) {
    const presentInSrc = src[f.key]
    const presentInOut = out[f.key]

    let status = 'N/A'
    if (presentInSrc) {
      testedCount++
      if (presentInOut) {
        status = '✓ PRESERVED'
        preservedCount++
      } else {
        status = '✗ DROPPED'
      }
    }

    const srcStr = presentInSrc ? 'YES' : ' - '
    const outStr = presentInOut ? 'YES' : ' - '
    console.info(`${f.label.padEnd(32)} ${srcStr.padEnd(11)} ${outStr.padEnd(11)} ${status}`)
  }

  const score = testedCount > 0 ? Math.round((preservedCount / testedCount) * 100) : 100
  console.info(`------------------------------------------------------------------`)
  console.info(
    `Fidelity Score: ${score}% (${preservedCount}/${testedCount} active features preserved)`,
  )
  console.info(
    `Auxiliary Parts Preserved: ${pkg.preservedFiles.size} parts (headers/footers/settings)`,
  )
  console.info(`======================================================\n`)
}

runReport().catch((err) => {
  console.error('[docx:report] Error:', err)
  process.exit(1)
})
