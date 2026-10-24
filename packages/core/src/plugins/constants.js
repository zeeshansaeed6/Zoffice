/**
 * Plugin system constants and permission definitions.
 * @module constants
 */

export const PLUGIN_PERMISSIONS = {
  DOC_READ: 'active-document:read',
  DOC_WRITE: 'active-document:write',
  UI_RIBBON: 'ui:ribbon',
  UI_SIDEBAR: 'ui:sidebar',
  UI_MENU: 'ui:menu',
  FILE_HANDLER: 'file-format:handler',
  STORAGE: 'storage:local',
}

export const PERMISSION_DESCRIPTIONS = {
  [PLUGIN_PERMISSIONS.DOC_READ]: 'Read the text and structure of the currently open document',
  [PLUGIN_PERMISSIONS.DOC_WRITE]: 'Modify or update the content of the currently open document',
  [PLUGIN_PERMISSIONS.UI_RIBBON]: 'Add custom action buttons and dropdowns to the Ribbon toolbar',
  [PLUGIN_PERMISSIONS.UI_SIDEBAR]: 'Add custom interactive inspection panels to the sidebar',
  [PLUGIN_PERMISSIONS.UI_MENU]: 'Add items to the application header and context menus',
  [PLUGIN_PERMISSIONS.FILE_HANDLER]: 'Register custom import or export file format parsers',
  [PLUGIN_PERMISSIONS.STORAGE]: 'Persist plugin configuration and state in local offline storage',
}

export const ALLOWED_PERMISSIONS = Object.values(PLUGIN_PERMISSIONS)
