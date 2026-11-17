/**
 * Zoffice AI Assistant Constants & Default Configurations
 * Strict offline-first: Disabled by default, zero telemetry.
 * @module ai-constants
 */

export const AI_PROVIDERS = {
  OLLAMA: 'ollama',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
}

export const PROVIDER_OPTIONS = [
  {
    id: 'ollama',
    label: 'Local Ollama (Offline)',
    defaultEndpoint: 'http://localhost:11434',
    defaultModel: 'llama3',
  },
  {
    id: 'openai',
    label: 'OpenAI-Compatible Endpoint',
    defaultEndpoint: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    defaultEndpoint: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-haiku-20241022',
  },
]

export const DEFAULT_AI_CONFIG = {
  enabled: false,
  provider: 'ollama',
  endpoint: 'http://localhost:11434',
  apiKey: '',
  model: 'llama3',
}

export const REWRITE_TONES = [
  {
    id: 'professional',
    label: 'Professional / Formal',
    prompt: 'Rewrite the following text to sound highly professional, formal, and articulate.',
  },
  {
    id: 'concise',
    label: 'Concise / Punchy',
    prompt: 'Rewrite the following text to be concise, direct, and eliminate all filler words.',
  },
  {
    id: 'casual',
    label: 'Friendly / Casual',
    prompt: 'Rewrite the following text in a warm, approachable, and conversational tone.',
  },
  {
    id: 'expanded',
    label: 'Detailed / Elaborate',
    prompt: 'Expand on the following text with richer context and clear explanatory details.',
  },
]

export const TRANSLATE_LANGUAGES = [
  { id: 'es', label: 'Spanish (Español)' },
  { id: 'fr', label: 'French (Français)' },
  { id: 'de', label: 'German (Deutsch)' },
  { id: 'hi', label: 'Hindi (हिन्दी)' },
  { id: 'ur', label: 'Urdu (اردو)' },
]
