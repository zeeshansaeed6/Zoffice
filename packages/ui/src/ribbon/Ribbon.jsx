import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { QuickAccessToolbar } from './QuickAccessToolbar.jsx'
import { RibbonTab } from './RibbonTab.jsx'
import { IconButton } from '../common/IconButton.jsx'

/**
 * @typedef {Object} RibbonTabConfig
 * @property {string} id
 * @property {string} label
 * @property {boolean} [contextual]
 * @property {string} [contextualColor]
 * @property {any[]} groups
 */

/**
 * @typedef {Object} RibbonConfig
 * @property {string} [appId]
 * @property {string} [fileMenuLabel]
 * @property {() => void} [onFileMenuClick]
 * @property {RibbonTabConfig[]} tabs
 * @property {() => void} [onSave]
 * @property {() => void} [onUndo]
 * @property {() => void} [onRedo]
 * @property {boolean} [canUndo]
 * @property {boolean} [canRedo]
 * @property {boolean} [canSave]
 */

/**
 * Data-driven Office-style Ribbon component.
 *
 * @param {Object} props
 * @param {RibbonConfig} props.config - JSON/object data describing tabs and buttons
 * @param {string} [props.activeTabId]
 * @param {(tabId: string) => void} [props.onTabChange]
 * @param {boolean} [props.defaultCollapsed=false]
 * @param {React.ReactNode} [props.extraHeaderContent]
 */
export function Ribbon({
  config,
  activeTabId,
  onTabChange,
  defaultCollapsed = false,
  extraHeaderContent,
}) {
  const [internalActiveTab, setInternalActiveTab] = useState(() => config.tabs[0]?.id || 'home')
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const activeId = activeTabId || internalActiveTab
  const currentTab = config.tabs.find((t) => t.id === activeId) || config.tabs[0]

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
    // Clicking tab when collapsed expands it
    if (collapsed) {
      setCollapsed(false)
    }
  }

  return (
    <div
      data-testid="ribbon"
      className="flex select-none flex-col border-b border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Quick Access Toolbar */}
      <QuickAccessToolbar
        onSave={config.onSave}
        onUndo={config.onUndo}
        onRedo={config.onRedo}
        canUndo={config.canUndo}
        canRedo={config.canRedo}
        canSave={config.canSave}
        extraActions={extraHeaderContent}
      />

      {/* Tab Strip */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-2 dark:border-neutral-800">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {config.fileMenuLabel && (
            <button
              type="button"
              onClick={config.onFileMenuClick}
              className="mr-1 rounded bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {config.fileMenuLabel}
            </button>
          )}

          {config.tabs.map((tab) => {
            const isActive = tab.id === activeId
            const isContextual = tab.contextual

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`relative border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                } ${
                  isContextual
                    ? 'bg-amber-50/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300'
                    : ''
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Collapse / Expand Toggle */}
        <div className="flex items-center">
          <IconButton
            icon={collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            label={collapsed ? 'Expand Ribbon' : 'Collapse Ribbon'}
            onClick={() => setCollapsed(!collapsed)}
            size="sm"
          />
        </div>
      </div>

      {/* Tab Content Panel */}
      {!collapsed && currentTab && (
        <div className="min-h-[88px] bg-neutral-50/70 dark:bg-neutral-900/60">
          <RibbonTab groups={currentTab.groups} />
        </div>
      )}
    </div>
  )
}
