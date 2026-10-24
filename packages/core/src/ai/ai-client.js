/**
 * Zoffice AI Client
 * Dispatches prompts to user-configured LLM endpoints.
 * Strictly opt-in: throws if disabled or unconfigured.
 * @module ai-client
 */

import { AI_PROVIDERS } from './ai-constants.js'

/**
 * @typedef {Object} AiConfig
 * @property {boolean} enabled
 * @property {'ollama' | 'openai' | 'anthropic'} provider
 * @property {string} endpoint
 * @property {string} apiKey
 * @property {string} model
 */

/**
 * Sends a system + user prompt to the configured AI provider.
 *
 * @param {AiConfig} config
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>} Cleaned string response from the model
 */
export async function sendAiPrompt(config, systemPrompt, userPrompt) {
  if (!config || !config.enabled) {
    throw new Error('AI Assistant is disabled. Configure your provider and enable it in Settings.')
  }

  const provider = config.provider || AI_PROVIDERS.OLLAMA
  const endpoint = (config.endpoint || '').replace(/\/+$/, '')
  const model = config.model || (provider === AI_PROVIDERS.OLLAMA ? 'llama3' : 'gpt-4o-mini')

  if (provider === AI_PROVIDERS.OLLAMA) {
    return callOllama(endpoint || 'http://localhost:11434', model, systemPrompt, userPrompt)
  }

  if (provider === AI_PROVIDERS.OPENAI) {
    if (!config.apiKey) {
      throw new Error('API Key is required for OpenAI-compatible providers.')
    }
    return callOpenAi(endpoint || 'https://api.openai.com/v1', model, config.apiKey, systemPrompt, userPrompt)
  }

  if (provider === AI_PROVIDERS.ANTHROPIC) {
    if (!config.apiKey) {
      throw new Error('API Key is required for Anthropic Claude.')
    }
    return callAnthropic(endpoint || 'https://api.anthropic.com/v1', model, config.apiKey, systemPrompt, userPrompt)
  }

  throw new Error(`Unsupported AI provider: ${provider}`)
}

/**
 * Call Ollama generate endpoint.
 */
async function callOllama(endpoint, model, systemPrompt, userPrompt) {
  const url = `${endpoint}/api/generate`
  const prompt = `${systemPrompt}\n\nTask:\n${userPrompt}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(`Ollama request failed (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  return (data.response || '').trim()
}

/**
 * Call OpenAI-compatible chat completions endpoint.
 */
async function callOpenAi(endpoint, model, apiKey, systemPrompt, userPrompt) {
  const url = `${endpoint}/chat/completions`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(`OpenAI request failed (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  return (data.choices?.[0]?.message?.content || '').trim()
}

/**
 * Call Anthropic messages API.
 */
async function callAnthropic(endpoint, model, apiKey, systemPrompt, userPrompt) {
  const url = `${endpoint}/messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-haiku-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(`Anthropic request failed (${res.status}): ${errorText}`)
  }

  const data = await res.json()
  const textBlock = data.content?.find((c) => c.type === 'text')
  return (textBlock?.text || '').trim()
}
