import React from 'react'
import { Save, Undo, Redo, Moon, Sun } from 'lucide-react'
import { IconButton } from '../common/IconButton.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'

/**
 * @param {Object} props
 * @param {() => void} [props.onSave]
 * @param {() => void} [props.onUndo]
 * @param {() => void} [props.onRedo]
 * @param {boolean} [props.canUndo=false]
 * @param {boolean} [props.canRedo=false]
 * @param {boolean} [props.canSave=true]
 * @param {React.ReactNode} [props.extraActions]
 */
export function QuickAccessToolbar({
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  canSave = true,
  extraActions,
}) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div
      data-testid="quick-access-toolbar"
      className="flex h-8 items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-2 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <IconButton
        icon={<Save size={15} />}
        label="Save (Ctrl+S)"
        disabled={!canSave}
        onClick={onSave}
        size="sm"
      />
      <IconButton
        icon={<Undo size={15} />}
        label="Undo (Ctrl+Z)"
        disabled={!canUndo}
        onClick={onUndo}
        size="sm"
      />
      <IconButton
        icon={<Redo size={15} />}
        label="Redo (Ctrl+Y)"
        disabled={!canRedo}
        onClick={onRedo}
        size="sm"
      />
      <div className="mx-1 h-3.5 w-px bg-neutral-300 dark:bg-neutral-700" />
      {extraActions}
      <IconButton
        icon={resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        label={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        onClick={toggleTheme}
        size="sm"
      />
    </div>
  )
}
