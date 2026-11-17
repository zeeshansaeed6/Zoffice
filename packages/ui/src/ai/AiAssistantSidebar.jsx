import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  X,
  Settings,
  Send,
  Copy,
  Check,
  CornerDownLeft,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  loadAiConfig,
  saveAiConfig,
  rewriteText,
  summarizeText,
  translateText,
  generateFormulaHelp,
  generateSlideOutline,
  REWRITE_TONES,
  TRANSLATE_LANGUAGES,
  PROVIDER_OPTIONS,
} from '@zoffice/core'

/**
 * Zoffice AI Assistant Sidebar
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {'writer' | 'sheets' | 'slides'} props.appId
 * @param {string} [props.selectedText='']
 * @param {(content: any) => void} [props.onInsert]
 */
export function AiAssistantSidebar({
  isOpen,
  onClose,
  appId = 'writer',
  selectedText = '',
  onInsert,
}) {
  const [config, setConfig] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Form states
  const [promptInput, setPromptInput] = useState('')
  const [tone, setTone] = useState('professional')
  const [summaryStyle, setSummaryStyle] = useState('bullets')
  const [targetLang, setTargetLang] = useState('Spanish')
  const [slideCount, setSlideCount] = useState(4)
  const [activeWriterTab, setActiveWriterTab] = useState('rewrite')
  const [output, setOutput] = useState(null)

  useEffect(() => {
    loadAiConfig().then((cfg) => {
      setConfig(cfg)
      if (!cfg.enabled) setShowSettings(true)
    })
  }, [])

  useEffect(() => {
    if (selectedText) {
      setPromptInput(selectedText)
    }
  }, [selectedText])

  if (!isOpen) return null

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    await saveAiConfig(config)
    setShowSettings(false)
    setError('')
  }

  const handleExecute = async () => {
    if (!promptInput.trim()) return
    setLoading(true)
    setError('')
    setOutput(null)

    try {
      if (appId === 'writer') {
        let res = ''
        if (activeWriterTab === 'rewrite') {
          res = await rewriteText(promptInput, tone, config)
        } else if (activeWriterTab === 'summarize') {
          res = await summarizeText(promptInput, summaryStyle, config)
        } else {
          res = await translateText(promptInput, targetLang, config)
        }
        setOutput({ type: 'text', content: res })
      } else if (appId === 'sheets') {
        const res = await generateFormulaHelp(promptInput, [], config)
        setOutput({ type: 'formula', formula: res.formula, explanation: res.explanation })
      } else if (appId === 'slides') {
        const res = await generateSlideOutline(promptInput, slideCount, config)
        setOutput({ type: 'slides', slides: res })
      }
    } catch (err) {
      setError(err.message || 'AI request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside
      aria-label="AI Assistant"
      className="flex h-full w-80 shrink-0 flex-col border-l border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-white">
            <Sparkles size={14} />
          </div>
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="AI Settings"
            className={`rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 ${
              showSettings ? 'bg-neutral-100 dark:bg-neutral-800' : ''
            }`}
          >
            <Settings size={15} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Assistant"
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings ? (
        <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-4 text-xs">
          <div className="mb-3 flex items-center justify-between rounded-lg bg-neutral-50 p-2.5 dark:bg-neutral-800/60">
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                Enable Assistant
              </p>
              <p className="text-[10px] text-neutral-500">Off by default &bull; Zero telemetry</p>
            </div>
            <input
              type="checkbox"
              checked={config?.enabled || false}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>

          <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
            Provider
          </label>
          <select
            value={config?.provider || 'ollama'}
            onChange={(e) => {
              const opt = PROVIDER_OPTIONS.find((p) => p.id === e.target.value)
              setConfig({
                ...config,
                provider: e.target.value,
                endpoint: opt?.defaultEndpoint || '',
                model: opt?.defaultModel || '',
              })
            }}
            className="mb-3 w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            {PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
            Endpoint URL
          </label>
          <input
            type="text"
            value={config?.endpoint || ''}
            onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
            className="mb-3 w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />

          <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
            API Key {config?.provider === 'ollama' ? '(Optional)' : '(Required)'}
          </label>
          <input
            type="password"
            value={config?.apiKey || ''}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder={config?.provider === 'ollama' ? 'None needed' : 'sk-...'}
            className="mb-3 w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />

          <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
            Model Name
          </label>
          <input
            type="text"
            value={config?.model || ''}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
            className="mb-4 w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />

          <button
            type="submit"
            className="w-full rounded bg-purple-600 py-1.5 font-semibold text-white hover:bg-purple-700"
          >
            Save AI Settings
          </button>
        </form>
      ) : (
        /* Assistant Workspace */
        <div className="flex flex-1 flex-col overflow-y-auto p-4 text-xs">
          {!config?.enabled && (
            <div className="mb-3 rounded-lg border border-purple-200 bg-purple-50 p-2.5 dark:border-purple-900/50 dark:bg-purple-950/30">
              <div className="flex items-center gap-1.5 font-semibold text-purple-900 dark:text-purple-300">
                <ShieldCheck size={14} /> AI is Currently Disabled
              </div>
              <p className="mt-1 text-[11px] text-purple-700 dark:text-purple-400">
                Click Settings above to configure a local Ollama or cloud provider.
              </p>
            </div>
          )}

          {/* Action Selectors for Writer */}
          {appId === 'writer' && (
            <div className="mb-3">
              <div className="mb-2 flex rounded bg-neutral-100 p-0.5 dark:bg-neutral-800">
                {['rewrite', 'summarize', 'translate'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveWriterTab(tab)}
                    className={`flex-1 rounded py-1 text-[11px] font-semibold capitalize ${
                      activeWriterTab === tab
                        ? 'bg-white text-purple-700 shadow-sm dark:bg-neutral-700 dark:text-purple-300'
                        : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeWriterTab === 'rewrite' && (
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {REWRITE_TONES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}

              {activeWriterTab === 'summarize' && (
                <select
                  value={summaryStyle}
                  onChange={(e) => setSummaryStyle(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="bullets">Key Bullet Points</option>
                  <option value="executive">Executive Summary</option>
                  <option value="brief">1-Sentence TL;DR</option>
                </select>
              )}

              {activeWriterTab === 'translate' && (
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {TRANSLATE_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.label}>
                      {l.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Prompt input */}
          <label className="mb-1 block font-medium text-neutral-600 dark:text-neutral-400">
            {appId === 'sheets'
              ? 'Formula Query (e.g. "Sum column B where A is East"):'
              : appId === 'slides'
                ? 'Presentation Topic:'
                : 'Text to process:'}
          </label>
          <textarea
            rows={appId === 'sheets' ? 3 : 4}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder={
              appId === 'sheets'
                ? 'Describe what you want to calculate...'
                : appId === 'slides'
                  ? 'Enter topic or audience...'
                  : 'Type or paste text...'
            }
            className="mb-2 w-full resize-none rounded-lg border border-neutral-300 bg-white p-2 text-xs text-neutral-900 focus:border-purple-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />

          {appId === 'slides' && (
            <div className="mb-3 flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Slide count:</span>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="rounded border border-neutral-300 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                {[3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} slides
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleExecute}
            disabled={loading || !config?.enabled || !promptInput.trim()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 py-2 font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {loading ? 'Processing...' : 'Generate with AI'}
          </button>

          {/* Error Banner */}
          {error && (
            <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 p-2 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p className="text-[11px] leading-tight">{error}</p>
            </div>
          )}

          {/* Output Display */}
          {output && (
            <div className="mt-4 flex flex-1 flex-col rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Result</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      output.type === 'formula'
                        ? output.formula
                        : output.type === 'slides'
                          ? JSON.stringify(output.slides, null, 2)
                          : output.content,
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                {output.type === 'formula' ? (
                  <div>
                    <div className="rounded bg-white p-2 font-bold text-blue-600 dark:bg-neutral-900 dark:text-blue-400">
                      {output.formula}
                    </div>
                    <p className="mt-1 font-sans text-xs text-neutral-500">{output.explanation}</p>
                  </div>
                ) : output.type === 'slides' ? (
                  <div className="space-y-2">
                    {output.slides.map((s, idx) => (
                      <div key={idx} className="rounded bg-white p-2 dark:bg-neutral-900">
                        <strong className="block text-purple-600 dark:text-purple-400">
                          {s.title}
                        </strong>
                        <ul className="mt-1 list-disc pl-4 text-[10px]">
                          {s.bullets?.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap font-sans">{output.content}</p>
                )}
              </div>

              {onInsert && (
                <button
                  type="button"
                  onClick={() => onInsert(output)}
                  className="mt-3 flex items-center justify-center gap-1 rounded bg-neutral-200 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                >
                  <CornerDownLeft size={13} />
                  Insert into Document
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
