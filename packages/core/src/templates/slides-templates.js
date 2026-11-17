/**
 * Zoffice ZSlides Templates
 * Original presentation slide deck templates with layouts, typography, and content.
 * @module slides-templates
 */

/**
 * Creates a text slide element.
 */
function textElem(id, text, x, y, width, height, fontSize, bold = false, color = '#1e293b') {
  return {
    id,
    type: 'text',
    x,
    y,
    width,
    height,
    rotation: 0,
    properties: {
      text,
      fontSize,
      fontFamily: 'Inter, sans-serif',
      color,
      bold,
      italic: false,
      underline: false,
      align: 'left',
      fill: 'transparent',
      strokeWidth: 0,
    },
  }
}

/**
 * Builds a slide deck object.
 */
function buildDeck(slidesData) {
  const slides = slidesData.map((s, idx) => ({
    id: `slide_${idx + 1}`,
    layout: s.layout || 'title_and_content',
    background: { type: 'solid', color: s.bg || '#ffffff' },
    notes: s.notes || '',
    transition: { type: 'none', duration: 0.5 },
    elements: s.elements,
  }))

  return {
    aspectRatio: '16:9',
    dimensions: { width: 960, height: 540 },
    themeId: 'theme_modern_blue',
    activeSlideId: slides[0]?.id || 'slide_1',
    slides,
  }
}

export const SLIDES_TEMPLATES = [
  {
    id: 'pitch-deck-startup',
    title: 'Startup Investment Pitch Deck',
    description:
      '5-slide narrative: Title & Mission, Problem, Solution & Technology, Market, and The Ask.',
    appId: 'slides',
    category: 'presentations',
    icon: 'Presentation',
    content: JSON.stringify(
      buildDeck([
        {
          layout: 'title',
          bg: '#0f172a',
          elements: [
            textElem('t1', 'NEXUS COMPUTING', 80, 160, 800, 70, 48, true, '#ffffff'),
            textElem(
              's1',
              'The Sovereign Offline Enterprise Workstation',
              80,
              250,
              800,
              40,
              22,
              false,
              '#94a3b8',
            ),
            textElem(
              'a1',
              'Presented by Founder & Team &bull; Series Seed',
              80,
              440,
              800,
              30,
              14,
              false,
              '#64748b',
            ),
          ],
        },
        {
          elements: [
            textElem('t2', '1. The Problem: Cloud Hostage & Fragility', 60, 50, 840, 50, 28, true),
            textElem(
              'b2',
              'Enterprise teams lose billions annually to SaaS subscription fatigue, unexpected API lockouts, and compliance breaches. When connectivity drops, modern knowledge work grinds to an abrupt halt.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('t3', '2. The Solution: High-Fidelity Local Tools', 60, 50, 840, 50, 28, true),
            textElem(
              'b3',
              'A complete zero-telemetry office suite that runs entirely on client silicon. Open standards, native docx/xlsx/pptx fidelity, and instant sub-2-second startup with zero external server dependencies.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('t4', '3. Market Size & Regulatory Tailwinds', 60, 50, 840, 50, 28, true),
            textElem(
              'b4',
              'Over 40% of global defense, healthcare, and financial institutions face stringent sovereignty mandates. The total addressable privacy software market exceeds $32B globally by 2030.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('t5', '4. The Ask & Roadmap', 60, 50, 840, 50, 28, true),
            textElem(
              'b5',
              'Raising $2.5M Seed to expand the engineering core, finalize cross-platform hardware acceleration, and scale open developer ecosystem plugins.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
      ]),
    ),
  },
  {
    id: 'showcase-project',
    title: 'Modern Project Showcase',
    description: 'Clean architectural overview, key milestones, and metrics presentation.',
    appId: 'slides',
    category: 'presentations',
    icon: 'Tv',
    content: JSON.stringify(
      buildDeck([
        {
          layout: 'title',
          elements: [
            textElem(
              'ps_t1',
              'Project Horizon Architecture',
              80,
              160,
              800,
              70,
              44,
              true,
              '#1d4ed8',
            ),
            textElem(
              'ps_s1',
              'Next-Generation Monorepo & UI Design System',
              80,
              250,
              800,
              40,
              20,
              false,
              '#64748b',
            ),
          ],
        },
        {
          elements: [
            textElem('ps_t2', 'Key Design Pillars', 60, 50, 840, 50, 28, true),
            textElem(
              'ps_b2',
              '1. Offline Autonomy: All state stored in embedded SQLite and JSON.\n2. Modular Packages: 10 decoupled apps sharing a common UI shell.\n3. Zero TypeScript: 100% clean, standardized ES2022+ JavaScript.',
              60,
              130,
              840,
              200,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('ps_t3', 'Verification & Test Coverage', 60, 50, 840, 50, 28, true),
            textElem(
              'ps_b3',
              'Over 280 unit tests across 54 suites executing in under 20 seconds. 100% clean ESLint pass with zero warnings.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
      ]),
    ),
  },
  {
    id: 'qbr-executive',
    title: 'Quarterly Business Review (QBR)',
    description:
      'Executive QBR review with financial performance, target OKRs, and strategic wins.',
    appId: 'slides',
    category: 'presentations',
    icon: 'BarChart',
    content: JSON.stringify(
      buildDeck([
        {
          layout: 'title',
          bg: '#1e293b',
          elements: [
            textElem(
              'qbr_t1',
              'Q3 Executive Business Review',
              80,
              160,
              800,
              70,
              44,
              true,
              '#ffffff',
            ),
            textElem(
              'qbr_s1',
              'Strategic Performance, Revenue & Operational Metrics',
              80,
              250,
              800,
              40,
              20,
              false,
              '#cbd5e1',
            ),
          ],
        },
        {
          elements: [
            textElem('qbr_t2', 'Financial Performance Highlights', 60, 50, 840, 50, 28, true),
            textElem(
              'qbr_b2',
              'Net ARR grew by 38% quarter-over-quarter. Gross margin held resilient at 84%, driven by zero cloud hosting overhead.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('qbr_t3', 'Upcoming Q4 Priorities', 60, 50, 840, 50, 28, true),
            textElem(
              'qbr_b3',
              'Expand multi-language localization to 6 global languages. Formalize certified binary signing for Windows and macOS distributions.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
      ]),
    ),
  },
  {
    id: 'workshop-lecture',
    title: 'Educational Workshop Lecture',
    description: 'Teaching deck structure with course objectives, core concepts, and exercises.',
    appId: 'slides',
    category: 'presentations',
    icon: 'BookOpen',
    content: JSON.stringify(
      buildDeck([
        {
          layout: 'title',
          elements: [
            textElem(
              'ws_t1',
              'Modern JavaScript Engineering',
              80,
              160,
              800,
              70,
              42,
              true,
              '#0f172a',
            ),
            textElem(
              'ws_s1',
              'Building High-Scale Desktop Applications without Toolchain Bloat',
              80,
              250,
              800,
              40,
              20,
              false,
              '#475569',
            ),
          ],
        },
        {
          elements: [
            textElem('ws_t2', 'Learning Objectives', 60, 50, 840, 50, 28, true),
            textElem(
              'ws_b2',
              '&bull; Master ES Modules and JSDoc for robust type safety.\n&bull; Understand sandboxed script evaluation using iframe/isolated scopes.\n&bull; Design deterministic state containers with Zustand.',
              60,
              130,
              840,
              200,
              18,
            ),
          ],
        },
        {
          elements: [
            textElem('ws_t3', 'Interactive Lab Exercise', 60, 50, 840, 50, 28, true),
            textElem(
              'ws_b3',
              'Build a custom plugin in under 50 lines of JavaScript that inspects active spreadsheet cells and calculates running moving averages.',
              60,
              130,
              840,
              180,
              18,
            ),
          ],
        },
      ]),
    ),
  },
]
