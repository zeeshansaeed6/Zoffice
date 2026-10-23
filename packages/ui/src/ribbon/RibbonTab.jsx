import React from 'react'
import { RibbonGroup } from './RibbonGroup.jsx'
import { RibbonButton } from './RibbonButton.jsx'
import { RibbonToggle } from './RibbonToggle.jsx'
import { RibbonDropdown } from './RibbonDropdown.jsx'

/**
 * @typedef {Object} ControlDef
 * @property {string} id
 * @property {'button' | 'toggle' | 'dropdown' | 'custom'} type
 * @property {string} label
 * @property {React.ReactNode} [icon]
 * @property {'large' | 'small'} [size]
 * @property {boolean} [pressed]
 * @property {boolean} [disabled]
 * @property {string} [tooltip]
 * @property {any[]} [items]
 * @property {() => void} [onClick]
 * @property {(val: boolean) => void} [onToggle]
 * @property {React.ReactNode} [render]
 */

/**
 * @typedef {Object} GroupDef
 * @property {string} id
 * @property {string} label
 * @property {ControlDef[] | ControlDef[][]} controls
 * @property {() => void} [onDialogLaunch]
 */

/**
 * Renders a ribbon tab's groups from data configuration.
 *
 * @param {Object} props
 * @param {GroupDef[]} props.groups
 */
export function RibbonTab({ groups = [] }) {
  /**
   * @param {ControlDef} ctrl
   */
  function renderControl(ctrl) {
    if (ctrl.type === 'custom' && ctrl.render) {
      return <React.Fragment key={ctrl.id}>{ctrl.render}</React.Fragment>
    }
    if (ctrl.type === 'toggle') {
      return (
        <RibbonToggle
          key={ctrl.id}
          icon={ctrl.icon}
          label={ctrl.label}
          pressed={Boolean(ctrl.pressed)}
          onToggle={ctrl.onToggle || (() => {})}
          disabled={ctrl.disabled}
          tooltip={ctrl.tooltip}
        />
      )
    }
    if (ctrl.type === 'dropdown') {
      return (
        <RibbonDropdown
          key={ctrl.id}
          label={ctrl.label}
          icon={ctrl.icon}
          items={ctrl.items || []}
          size={ctrl.size || 'small'}
          disabled={ctrl.disabled}
        />
      )
    }
    return (
      <RibbonButton
        key={ctrl.id}
        icon={ctrl.icon}
        label={ctrl.label}
        size={ctrl.size || 'large'}
        onClick={ctrl.onClick}
        disabled={ctrl.disabled}
        active={ctrl.pressed}
        tooltip={ctrl.tooltip}
      />
    )
  }

  return (
    <div className="flex items-stretch overflow-x-auto px-2 py-1">
      {groups.map((group) => (
        <RibbonGroup key={group.id} label={group.label} onDialogLaunch={group.onDialogLaunch}>
          {group.controls.map((item, idx) => {
            if (Array.isArray(item)) {
              return (
                <div key={`col-${idx}`} className="flex flex-col justify-center gap-1">
                  {item.map(renderControl)}
                </div>
              )
            }
            return renderControl(item)
          })}
        </RibbonGroup>
      ))}
    </div>
  )
}
