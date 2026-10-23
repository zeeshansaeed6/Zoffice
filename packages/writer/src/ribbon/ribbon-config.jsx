import { getHomeRibbonGroups } from './ribbon-groups.jsx'
import { getInsertRibbonGroups } from './ribbon-insert.jsx'

/**
 * Creates data-driven ribbon configuration for ZWriter.
 * @param {Object} [actions]
 * @returns {any}
 */
export function getWriterRibbonConfig(actions = {}) {
  const marks = actions.activeMarks || {}

  return {
    appId: 'writer',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    onUndo: actions.onUndo,
    onRedo: actions.onRedo,
    canUndo: actions.canUndo,
    canRedo: actions.canRedo,
    canSave: actions.canSave !== false,
    tabs: [
      {
        id: 'home',
        label: 'Home',
        groups: getHomeRibbonGroups(actions, marks),
      },
      {
        id: 'insert',
        label: 'Insert',
        groups: getInsertRibbonGroups(actions),
      },
    ],
  }
}
