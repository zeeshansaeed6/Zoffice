import { ipcRenderer } from 'electron'

/**
 * Validated preload bridge for ZForms.
 */
export const formsBridge = {
  getForms: () => ipcRenderer.invoke('forms:getForms'),
  getForm: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('forms:getForm', id)
  },
  saveForm: (form) => {
    if (!form || typeof form !== 'object' || typeof form.id !== 'string') {
      return Promise.reject(new TypeError('form must have string id'))
    }
    return ipcRenderer.invoke('forms:saveForm', form)
  },
  deleteForm: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('forms:deleteForm', id)
  },
  getResponses: (formId) => {
    if (typeof formId !== 'string') return Promise.reject(new TypeError('formId must be string'))
    return ipcRenderer.invoke('forms:getResponses', formId)
  },
  saveResponse: (resp) => {
    if (!resp || typeof resp !== 'object' || typeof resp.id !== 'string') {
      return Promise.reject(new TypeError('resp must have string id'))
    }
    return ipcRenderer.invoke('forms:saveResponse', resp)
  },
  deleteResponse: (id) => {
    if (typeof id !== 'string') return Promise.reject(new TypeError('id must be string'))
    return ipcRenderer.invoke('forms:deleteResponse', id)
  },
  clearResponses: (formId) => {
    if (typeof formId !== 'string') return Promise.reject(new TypeError('formId must be string'))
    return ipcRenderer.invoke('forms:clearResponses', formId)
  },
}
