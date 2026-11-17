/**
 * Zoffice AI Assistant High-Level Service
 * Domain-specific prompts for ZWriter, ZSheets, and ZSlides.
 * @module ai-service
 */

import { sendAiPrompt } from './ai-client.js'
import { DEFAULT_AI_CONFIG, REWRITE_TONES } from './ai-constants.js'
import { getSetting, setSetting } from '../settings.js'

let inMemoryConfig = { ...DEFAULT_AI_CONFIG }

/**
 * Loads the user AI configuration.
 * @returns {Promise<import('./ai-client.js').AiConfig>}
 */
export async function loadAiConfig() {
  try {
    const saved = await getSetting('ai.config')
    if (saved && typeof saved === 'object') {
      inMemoryConfig = { ...DEFAULT_AI_CONFIG, ...saved }
      return inMemoryConfig
    }
    if (typeof localStorage !== 'undefined') {
      const ls = localStorage.getItem('zoffice_ai_config')
      if (ls) {
        inMemoryConfig = { ...DEFAULT_AI_CONFIG, ...JSON.parse(ls) }
        return inMemoryConfig
      }
    }
  } catch {
    // Return default or memory fallback
  }
  return inMemoryConfig
}

/**
 * Persists the user AI configuration.
 * @param {import('./ai-client.js').AiConfig} config
 * @returns {Promise<boolean>}
 */
export async function saveAiConfig(config) {
  inMemoryConfig = { ...config }
  try {
    await setSetting('ai.config', inMemoryConfig)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('zoffice_ai_config', JSON.stringify(inMemoryConfig))
    }
    return true
  } catch {
    return false
  }
}

/**
 * Rewrite selected text with specified tone (ZWriter).
 * @param {string} text
 * @param {string} toneId
 * @param {import('./ai-client.js').AiConfig} [overrideConfig]
 * @returns {Promise<string>}
 */
export async function rewriteText(text, toneId = 'professional', overrideConfig) {
  const config = overrideConfig || (await loadAiConfig())
  const tone = REWRITE_TONES.find((t) => t.id === toneId) || REWRITE_TONES[0]

  const systemPrompt = `You are a professional writing editor in ZWriter. ${tone.prompt} Output ONLY the rewritten text without conversational filler, intros, or markdown quotes.`
  return sendAiPrompt(config, systemPrompt, text)
}

/**
 * Summarize selected text or document (ZWriter).
 * @param {string} text
 * @param {'bullets' | 'executive' | 'brief'} style
 * @param {import('./ai-client.js').AiConfig} [overrideConfig]
 * @returns {Promise<string>}
 */
export async function summarizeText(text, style = 'bullets', overrideConfig) {
  const config = overrideConfig || (await loadAiConfig())
  const styleInstruction =
    style === 'bullets'
      ? 'Summarize the core takeaways as 3 to 5 concise bullet points.'
      : style === 'executive'
        ? 'Provide an executive summary paragraph followed by critical findings.'
        : 'Summarize the text in 1 or 2 punchy sentences.'

  const systemPrompt = `You are an executive summary assistant in ZWriter. ${styleInstruction} Output ONLY the summary text.`
  return sendAiPrompt(config, systemPrompt, text)
}

/**
 * Translate text to target language (ZWriter).
 * @param {string} text
 * @param {string} targetLang - e.g. "Spanish", "French", "German", "Hindi", "Urdu"
 * @param {import('./ai-client.js').AiConfig} [overrideConfig]
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang = 'Spanish', overrideConfig) {
  const config = overrideConfig || (await loadAiConfig())
  const systemPrompt = `You are a professional literary and technical translator. Translate the given text accurately and naturally into ${targetLang}. Preserve formatting and output ONLY the translation.`
  return sendAiPrompt(config, systemPrompt, text)
}

/**
 * Generate formula assistance for spreadsheets (ZSheets).
 * @param {string} prompt - User request (e.g. "Sum column B where column A is 'Hardware'")
 * @param {string[]} [columnContext=[]] - Known column headers or range context
 * @param {import('./ai-client.js').AiConfig} [overrideConfig]
 * @returns {Promise<{ formula: string, explanation: string }>}
 */
export async function generateFormulaHelp(prompt, columnContext = [], overrideConfig) {
  const config = overrideConfig || (await loadAiConfig())
  const contextStr =
    columnContext.length > 0 ? `Available columns/context: ${columnContext.join(', ')}` : ''

  const systemPrompt = `You are a formula expert in ZSheets spreadsheet software.
${contextStr}
Respond in valid JSON only with two keys:
"formula": The exact formula starting with '=' (e.g. "=SUMIF(A:A, \\"Hardware\\", B:B)")
"explanation": A clear, single-sentence explanation of what the formula does and how arguments work.
Output raw JSON only without markdown code blocks.`

  const raw = await sendAiPrompt(config, systemPrompt, prompt)
  try {
    const cleaned = raw
      .replace(/^```json/i, '')
      .replace(/```$/i, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    return {
      formula: parsed.formula || '=SUM()',
      explanation: parsed.explanation || 'Formula calculation',
    }
  } catch {
    return {
      formula: raw.startsWith('=') ? raw : `=${raw}`,
      explanation: 'Generated formula from query.',
    }
  }
}

/**
 * Generate presentation outline structure (ZSlides).
 * @param {string} topic - Slide deck topic
 * @param {number} [slideCount=4] - Target number of slides
 * @param {import('./ai-client.js').AiConfig} [overrideConfig]
 * @returns {Promise<Array<{ title: string, bullets: string[], layout?: string }>>}
 */
export async function generateSlideOutline(topic, slideCount = 4, overrideConfig) {
  const config = overrideConfig || (await loadAiConfig())
  const systemPrompt = `You are an expert presentation designer in ZSlides.
Generate a structured slide deck outline for ${slideCount} slides on the given topic.
Return raw JSON only formatted as an array of slide objects:
[
  { "title": "Slide Title", "bullets": ["Key bullet 1", "Key bullet 2", "Key bullet 3"], "layout": "title_and_content" }
]
Do not wrap in markdown quotes. Valid JSON only.`

  const raw = await sendAiPrompt(config, systemPrompt, topic)
  try {
    const cleaned = raw
      .replace(/^```json/i, '')
      .replace(/```$/i, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Fallback parsing
  }

  return [
    {
      title: topic,
      bullets: ['Introduction to topic', 'Key market trends', 'Implementation plan'],
    },
  ]
}
