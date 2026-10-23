import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  PageOrientation,
  ExternalHyperlink,
} from 'docx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_DIR = path.resolve(__dirname, '../test-fixtures')
const SAMPLE_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC'

async function generateAll() {
  if (!fs.existsSync(FIXTURES_DIR)) fs.mkdirSync(FIXTURES_DIR, { recursive: true })
  const realDir = path.join(FIXTURES_DIR, 'real')
  if (!fs.existsSync(realDir)) {
    fs.mkdirSync(realDir, { recursive: true })
    fs.writeFileSync(path.join(realDir, '.gitkeep'), '')
  }

  // 1. Colored & Fonted Text
  const doc1 = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Standard Text. ', font: 'Inter', size: 24 }),
              new TextRun({
                text: 'Bold Red Text. ',
                bold: true,
                color: 'DC2626',
                font: 'Carlito',
                size: 28,
              }),
              new TextRun({
                text: 'Italic Blue Text. ',
                italics: true,
                color: '2563EB',
                font: 'Georgia',
                size: 22,
              }),
              new TextRun({
                text: 'Underlined Green Text. ',
                underline: {},
                color: '16A34A',
                size: 24,
              }),
              new TextRun({
                text: 'Strike Purple Text. ',
                strike: true,
                color: '9333EA',
                size: 24,
              }),
              new TextRun({ text: 'Subscript', subScript: true, size: 18 }),
              new TextRun({ text: ' and ' }),
              new TextRun({ text: 'Superscript.', superScript: true, size: 18 }),
            ],
          }),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-colored-font.docx'),
    await Packer.toBuffer(doc1),
  )

  // 2. Multi-Level Lists
  const doc2 = new Document({
    numbering: {
      config: [
        {
          reference: 'test-numbered-list',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT },
            { level: 1, format: 'decimal', text: '%1.%2.', alignment: AlignmentType.LEFT },
          ],
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({ text: 'Bulleted List Items:', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ bullet: { level: 0 }, text: 'Level 0 Bullet Item' }),
          new Paragraph({ bullet: { level: 1 }, text: 'Level 1 Nested Bullet Item' }),
          new Paragraph({ bullet: { level: 2 }, text: 'Level 2 Deep Bullet Item' }),
          new Paragraph({ text: 'Numbered List Items:', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            numbering: { reference: 'test-numbered-list', level: 0 },
            text: 'First item',
          }),
          new Paragraph({
            numbering: { reference: 'test-numbered-list', level: 1 },
            text: 'First sub-item',
          }),
          new Paragraph({
            numbering: { reference: 'test-numbered-list', level: 0 },
            text: 'Second item',
          }),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-multilevel-lists.docx'),
    await Packer.toBuffer(doc2),
  )

  // 3. Merged-Cell Table with Cell Shading & Borders
  const doc3 = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Table with Merged Cells and Shading:',
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    shading: { fill: 'E2E8F0' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Spanned Header (2 Cols)', bold: true })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'FEF08A' },
                    children: [new Paragraph('Yellow Shaded Cell')],
                  }),
                  new TableCell({ children: [new Paragraph('Standard Cell 2')] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-merged-table.docx'),
    await Packer.toBuffer(doc3),
  )

  // 4. Embedded Image and Hyperlink
  const doc4 = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Embedded Image and Link Document',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: Buffer.from(SAMPLE_PNG_BASE64, 'base64'),
                transformation: { width: 120, height: 80 },
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun('Visit the official website: '),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: 'Zoffice Open Source Suite',
                    style: 'Hyperlink',
                    color: '2563EB',
                    underline: {},
                  }),
                ],
                link: 'https://zoffice.app',
              }),
            ],
          }),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-embedded-image.docx'),
    await Packer.toBuffer(doc4),
  )

  // 5. Custom Page Margins and Landscape Orientation
  const doc5 = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { orientation: PageOrientation.LANDSCAPE, width: 15840, height: 12240 },
            margin: { top: 2160, bottom: 2160, left: 1800, right: 1800 },
          },
        },
        children: [
          new Paragraph({
            text: 'Landscape Document with 1.5in Margins',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph('This section demonstrates non-default margins and orientation retention.'),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-custom-margins.docx'),
    await Packer.toBuffer(doc5),
  )

  // 6. Custom Headings, Spacing, and Paragraph Formatting
  const doc6 = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Grand Executive Title',
                font: 'Carlito',
                size: 40,
                bold: true,
                color: '0F172A',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({ text: 'Heading 1: Market Outlook', color: '1E3A8A', bold: true }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 60 },
            children: [new TextRun({ text: 'Heading 2: Key Strategic Vectors', color: '1D4ED8' })],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360 },
            children: [
              new TextRun(
                'This paragraph verifies justified alignment and 1.5 line spacing roundtrip retention.',
              ),
            ],
          }),
        ],
      },
    ],
  })
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'fidelity-custom-headings.docx'),
    await Packer.toBuffer(doc6),
  )

  console.info('Successfully generated 6 fidelity docx fixtures in test-fixtures/')
}

generateAll().catch(console.error)
