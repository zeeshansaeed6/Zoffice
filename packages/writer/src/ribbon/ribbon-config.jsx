import { getHomeRibbonGroups } from './ribbon-groups.jsx'
import { getInsertRibbonGroups } from './ribbon-insert.jsx'
import {
  getLayoutRibbonGroups,
  getReferencesRibbonGroups,
  getReviewRibbonGroups,
  getViewRibbonGroups,
} from './ribbon-pages.jsx'

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
      { id: 'layout', label: 'Layout', groups: getLayoutRibbonGroups(actions) },
      { id: 'references', label: 'References', groups: getReferencesRibbonGroups(actions) },
      { id: 'review', label: 'Review', groups: getReviewRibbonGroups(actions) },
      { id: 'view', label: 'View', groups: getViewRibbonGroups(actions) },
    ],
  }
}
