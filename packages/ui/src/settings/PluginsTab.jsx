import React, { useState, useEffect, useCallback } from 'react'
import { getSharedPluginEngine, PERMISSION_DESCRIPTIONS } from '@zoffice/core'
import { Puzzle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'

/**
 * Plugin Manager Tab for Settings Center.
 */
export function PluginsTab() {
  const engine = getSharedPluginEngine()
  const [plugins, setPlugins] = useState([])

  const refreshPlugins = useCallback(() => {
    setPlugins(engine.getPlugins())
  }, [engine])

  useEffect(() => {
    refreshPlugins()
  }, [refreshPlugins])

  const handleToggle = (id, currentlyEnabled) => {
    if (currentlyEnabled) {
      engine.disablePlugin(id)
    } else {
      engine.enablePlugin(id)
    }
    refreshPlugins()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Installed Plugins & Extensions
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Plugins run in an isolated JavaScript sandbox with explicit permission gating.
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {plugins.length} installed
        </span>
      </div>

      {plugins.length === 0 ? (
        <div className="py-12 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No plugins currently installed.
        </div>
      ) : (
        <div className="space-y-3">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 transition-colors dark:border-neutral-800 dark:bg-neutral-900/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Puzzle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {plugin.name}
                      </span>
                      <span className="text-xs text-neutral-400">v{plugin.version}</span>
                      <span className="text-xs text-neutral-400">• {plugin.author}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                      {plugin.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(plugin.id, plugin.enabled)}
                  className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition ${
                    plugin.enabled
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}
                >
                  {plugin.enabled ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      Disabled
                    </>
                  )}
                </button>
              </div>

              {plugin.permissions && plugin.permissions.length > 0 && (
                <div className="mt-1 border-t border-neutral-100 pt-2 dark:border-neutral-800/60">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                    <ShieldAlert className="h-3 w-3" />
                    Requested Sandbox Permissions:
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {plugin.permissions.map((perm) => (
                      <span
                        key={perm}
                        title={PERMISSION_DESCRIPTIONS[perm] || perm}
                        className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
