import React, { useEffect, useMemo } from 'react'
import { Ribbon, StatusBar, StatusBarSlot } from '@zoffice/ui'
import { FileText, Eye, PieChart, Settings } from 'lucide-react'
import { getFormsRibbonConfig } from './ribbon-config.jsx'
import { FORM_TABS } from './core/constants.js'
import { useFormStore } from './core/form-store.js'
import { FormBuilder } from './builder/FormBuilder.jsx'
import { FormPreview } from './preview/FormPreview.jsx'
import { ResponsesView } from './responses/ResponsesView.jsx'
import { exportResponsesToCsv } from './core/export-csv.js'

/**
 * ZForms Desktop Application Component.
 *
 * @param {Object} props
 * @param {string} props.id - Tab document ID
 * @param {string} [props.title='ZForms'] - Tab title
 * @param {string} [props.initialContent=''] - Stored state JSON
 * @param {(content: string) => void} [props.onChange]
 * @param {(content?: string) => void} [props.onSave]
 */
export function ZForms({
  id: _id,
  title: _title = 'ZForms',
  initialContent: _initialContent = '',
  onChange,
  onSave,
}) {
  const {
    form,
    activeTab,
    responses,
    initForm,
    setActiveTab,
    setThemeColor,
    addQuestion,
    addSection,
    setEmbedModalOpen,
    setFormSettings,
  } = useFormStore()

  // Initialize on mount
  useEffect(() => {
    initForm()
  }, [initForm])

  // Sync state changes with parent document tab
  useEffect(() => {
    if (onChange && form.questions.length > 0) {
      onChange(JSON.stringify({ form, responses }))
    }
  }, [form, responses, onChange])

  const ribbonActions = useMemo(() => {
    const handleSave = () => {
      if (onSave) {
        onSave(JSON.stringify({ form, responses }, null, 2))
      }
    }

    const handleExportCsv = () => {
      const csv = exportResponsesToCsv(form, responses)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.title.replace(/\s+/g, '_')}_responses.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return {
      onSave: handleSave,
      canSave: true,
      onAddQuestion: () => addQuestion(),
      onAddSection: () => addSection(),
      onSetTab: (tab) => setActiveTab(tab),
      onSetThemeColor: (color) => setThemeColor(color),
      onExportCsv: handleExportCsv,
      onOpenEmbed: () => setEmbedModalOpen(true),
    }
  }, [
    onSave,
    form,
    responses,
    addQuestion,
    addSection,
    setActiveTab,
    setThemeColor,
    setEmbedModalOpen,
  ])

  const ribbonConfig = useMemo(
    () => getFormsRibbonConfig(ribbonActions, activeTab),
    [ribbonActions, activeTab],
  )

  return (
    <div
      data-testid="zforms-app"
      className="flex h-full w-full flex-col bg-neutral-100 dark:bg-neutral-950"
    >
      <Ribbon config={ribbonConfig} />

      {/* Top Form Navigation Switcher */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-testid="tab-builder"
            onClick={() => setActiveTab(FORM_TABS.BUILDER)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === FORM_TABS.BUILDER
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <FileText size={15} />
            <span>Questions</span>
          </button>

          <button
            type="button"
            data-testid="tab-responses"
            onClick={() => setActiveTab(FORM_TABS.RESPONSES)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === FORM_TABS.RESPONSES
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <PieChart size={15} />
            <span>Responses</span>
            {responses.length > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {responses.length}
              </span>
            )}
          </button>

          <button
            type="button"
            data-testid="tab-settings"
            onClick={() => setActiveTab(FORM_TABS.SETTINGS)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition ${
              activeTab === FORM_TABS.SETTINGS
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </div>

        <button
          type="button"
          data-testid="btn-preview"
          onClick={() =>
            setActiveTab(activeTab === FORM_TABS.PREVIEW ? FORM_TABS.BUILDER : FORM_TABS.PREVIEW)
          }
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
            activeTab === FORM_TABS.PREVIEW
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
              : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
          }`}
        >
          <Eye size={14} />
          <span>{activeTab === FORM_TABS.PREVIEW ? 'Exit Preview' : 'Preview'}</span>
        </button>
      </div>

      {/* Main Workspace Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === FORM_TABS.BUILDER && <FormBuilder />}
        {activeTab === FORM_TABS.PREVIEW && <FormPreview />}
        {activeTab === FORM_TABS.RESPONSES && <ResponsesView />}
        {activeTab === FORM_TABS.SETTINGS && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Form Settings
              </h2>
              <div className="mt-4 space-y-4 text-xs">
                <label className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Accept Responses
                  </span>
                  <input
                    type="checkbox"
                    checked={form.acceptResponses}
                    onChange={(e) => setFormSettings({ acceptResponses: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Allow Multiple Submissions
                  </span>
                  <input
                    type="checkbox"
                    checked={form.allowMultiple}
                    onChange={(e) => setFormSettings({ allowMultiple: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        leftContent={
          <>
            <StatusBarSlot>{form.questions.length} questions</StatusBarSlot>
            <StatusBarSlot>{form.sections.length} sections</StatusBarSlot>
            <StatusBarSlot>{responses.length} responses</StatusBarSlot>
            <StatusBarSlot>Connected (Offline-First SQLite)</StatusBarSlot>
          </>
        }
        centerContent="Ready"
      />
    </div>
  )
}
