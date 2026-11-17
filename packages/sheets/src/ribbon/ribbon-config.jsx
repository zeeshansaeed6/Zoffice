import { getHomeGroups } from './ribbon-home.jsx'
import { getInsertGroups, getFormulaGroups, getDataGroups, getViewGroups } from './ribbon-tools.jsx'

/**
 * Creates data-driven ribbon configuration for ZSheets.
 * @param {Object} [actions]
 * @returns {import('@zoffice/ui').RibbonConfig}
 */
export function getSheetsRibbonConfig(actions = {}) {
  return {
    appId: 'sheets',
    fileMenuLabel: 'File',
    onFileMenuClick: actions.onFileMenuClick,
    onSave: actions.onSave,
    onUndo: actions.onUndo,
    onRedo: actions.onRedo,
    canUndo: actions.canUndo,
    canRedo: actions.canRedo,
    canSave: actions.canSave,
    tabs: [
      { id: 'home', label: 'Home', groups: getHomeGroups(actions) },
      { id: 'insert', label: 'Insert', groups: getInsertGroups(actions) },
      { id: 'formulas', label: 'Formulas', groups: getFormulaGroups(actions) },
      { id: 'data', label: 'Data', groups: getDataGroups(actions) },
      { id: 'view', label: 'View', groups: getViewGroups(actions) },
    ],
  }
}
