import React from 'react'
import { UserPlus, Edit3, Trash2, Download, Upload } from 'lucide-react'

/**
 * Returns tabs configuration for Contacts view.
 * @param {Object} actions
 * @returns {any[]}
 */
export function getContactTabs(actions = {}) {
  return [
    {
      id: 'contacts-home',
      label: 'Home',
      groups: [
        {
          id: 'cnt-new',
          label: 'New',
          controls: [
            {
              id: 'btn-new-contact',
              type: 'button',
              label: 'New Contact',
              size: 'large',
              icon: <UserPlus size={18} />,
              onClick: actions.onNewContact,
            },
          ],
        },
        {
          id: 'cnt-actions',
          label: 'Manage',
          controls: [
            {
              id: 'btn-edit-contact',
              type: 'button',
              label: 'Edit',
              icon: <Edit3 size={14} />,
              onClick: actions.onEditContact,
            },
            {
              id: 'btn-delete-contact',
              type: 'button',
              label: 'Delete',
              icon: <Trash2 size={14} />,
              onClick: actions.onDeleteContact,
            },
          ],
        },
        {
          id: 'cnt-io',
          label: 'vCard Import / Export',
          controls: [
            {
              id: 'btn-export-vcf',
              type: 'button',
              label: 'Export .VCF',
              icon: <Download size={14} />,
              onClick: actions.onExportVcard,
            },
            {
              id: 'btn-import-vcf',
              type: 'button',
              label: 'Import .VCF',
              icon: <Upload size={14} />,
              onClick: actions.onImportVcard,
            },
          ],
        },
      ],
    },
  ]
}
