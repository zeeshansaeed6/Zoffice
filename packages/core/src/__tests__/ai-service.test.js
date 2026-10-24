import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sendAiPrompt,
  rewriteText,
  summarizeText,
  translateText,
  generateFormulaHelp,
  generateSlideOutline,
  loadAiConfig,
  saveAiConfig,
  DEFAULT_AI_CONFIG,
} from '../ai/index.js'

describe('AI Assistant Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('is disabled by default and rejects calls with clear error', async () => {
    const config = { ...DEFAULT_AI_CONFIG, enabled: false }
    await expect(sendAiPrompt(config, 'system', 'user')).rejects.toThrow(
      /AI Assistant is disabled/i,
    )
  })

  it('rejects OpenAI calls without API key', async () => {
    const config = {
      enabled: true,
      provider: 'openai',
      endpoint: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o-mini',
    }
    await expect(sendAiPrompt(config, 'system', 'user')).rejects.toThrow(
      /API Key is required for OpenAI/i,
    )
  })

  it('rejects Anthropic calls without API key', async () => {
    const config = {
      enabled: true,
      provider: 'anthropic',
      endpoint: 'https://api.anthropic.com/v1',
      apiKey: '',
      model: 'claude-3-5-haiku-20241022',
    }
    await expect(sendAiPrompt(config, 'system', 'user')).rejects.toThrow(
      /API Key is required for Anthropic/i,
    )
  })

  it('calls local Ollama endpoint when enabled', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'Offline AI response' }),
    })

    const result = await sendAiPrompt(config, 'System prompt', 'User prompt')
    expect(result).toBe('Offline AI response')
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:11434/api/generate',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('executes rewriteText with specified tone', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'Rewritten formal text.' }),
    })

    const rewritten = await rewriteText('hey guys check this out', 'professional', config)
    expect(rewritten).toBe('Rewritten formal text.')
  })

  it('executes summarizeText with bullet points', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: '• Point 1\n• Point 2\n• Point 3' }),
    })

    const summary = await summarizeText('A long text about office suite...', 'bullets', config)
    expect(summary).toContain('• Point 1')
  })

  it('executes translateText for target language', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ response: 'Hola Mundo' }),
    })

    const translation = await translateText('Hello World', 'Spanish', config)
    expect(translation).toBe('Hola Mundo')
  })

  it('generates formula help for ZSheets', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          formula: '=SUMIF(A:A, "Hardware", B:B)',
          explanation: 'Sums all values in column B where column A equals Hardware.',
        }),
      }),
    })

    const res = await generateFormulaHelp('Sum sales of Hardware', ['A: Category', 'B: Sales'], config)
    expect(res.formula).toBe('=SUMIF(A:A, "Hardware", B:B)')
    expect(res.explanation).toContain('Sums all values')
  })

  it('generates slide outline for ZSlides', async () => {
    const config = {
      enabled: true,
      provider: 'ollama',
      endpoint: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3',
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: JSON.stringify([
          { title: 'Slide 1: Intro', bullets: ['Bullet A', 'Bullet B'] },
          { title: 'Slide 2: Analysis', bullets: ['Data point 1'] },
        ]),
      }),
    })

    const slides = await generateSlideOutline('Quantum Computing', 2, config)
    expect(slides.length).toBe(2)
    expect(slides[0].title).toBe('Slide 1: Intro')
  })

  it('saves and loads AI configuration', async () => {
    const customConfig = {
      enabled: true,
      provider: 'openai',
      endpoint: 'https://custom.endpoint.com/v1',
      apiKey: 'sk-test-secret',
      model: 'gpt-4o',
    }

    const saved = await saveAiConfig(customConfig)
    expect(saved).toBe(true)

    const loaded = await loadAiConfig()
    expect(loaded.enabled).toBe(true)
    expect(loaded.provider).toBe('openai')
    expect(loaded.apiKey).toBe('sk-test-secret')
  })
})
