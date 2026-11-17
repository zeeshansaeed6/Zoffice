import {
  Paragraph,
  TextRun,
  AlignmentType,
  PageOrientation,
  Header,
  Footer,
  PageNumber,
} from 'docx'

export function buildSectionPageProperties(pageSetup) {
  if (!pageSetup) return {}

  const isLandscape = pageSetup.orientation === 'landscape'
  const isLetter = pageSetup.pageSize === 'letter'
  const widthTwips = isLetter ? 12240 : 11906
  const heightTwips = isLetter ? 15840 : 16838

  const margins = pageSetup.margins || {}
  const marginOpts = {
    top: Math.round(((margins.top || 96) / 96) * 1440),
    bottom: Math.round(((margins.bottom || 96) / 96) * 1440),
    left: Math.round(((margins.left || 96) / 96) * 1440),
    right: Math.round(((margins.right || 96) / 96) * 1440),
  }

  return {
    ...(pageSetup.columns > 1 ? { column: { count: pageSetup.columns, space: 708 } } : {}),
    page: {
      size: {
        width: isLandscape ? heightTwips : widthTwips,
        height: isLandscape ? widthTwips : heightTwips,
        orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
      },
      margin: marginOpts,
    },
  }
}

export function buildHeaderFooter(pageSetup = {}) {
  const result = {}
  if (pageSetup.header) {
    result.headers = {
      default: new Header({
        children: [new Paragraph({ children: [new TextRun(pageSetup.header)] })],
      }),
    }
  }
  if (pageSetup.footer || pageSetup.pageNumbers) {
    const runs = []
    if (pageSetup.footer)
      runs.push(new TextRun(`${pageSetup.footer}${pageSetup.pageNumbers ? '   ' : ''}`))
    if (pageSetup.pageNumbers) runs.push(new TextRun({ children: ['Page ', PageNumber.CURRENT] }))
    result.footers = {
      default: new Footer({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: runs })],
      }),
    }
  }
  return result
}
