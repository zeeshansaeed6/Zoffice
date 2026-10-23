import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * @typedef {Object} DropdownItem
 * @property {string} id
 * @property {string} label
 * @property {React.ReactNode} [icon]
 * @property {() => void} [onClick]
 * @property {boolean} [active]
 * @property {boolean} [divider]
 */

/**
 * @param {Object} props
 * @param {string} [props.label]
 * @param {React.ReactNode} [props.icon]
 * @param {DropdownItem[]} props.items
 * @param {'large' | 'small'} [props.size='small']
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export function RibbonDropdown({
  label,
  icon,
  items = [],
  size = 'small',
  disabled = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const isLarge = size === 'large'

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center justify-center rounded border border-transparent text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          isLarge ? 'h-[58px] min-w-[50px] flex-col gap-1 px-2 py-1' : 'h-6 flex-row gap-1 px-1.5'
        } ${
          disabled
            ? 'cursor-not-allowed opacity-40'
            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
        }`}
      >
        {icon && <span>{icon}</span>}
        {label && <span className="truncate">{label}</span>}
        <ChevronDown size={12} className="opacity-70" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {items.map((item, idx) => {
            if (item.divider) {
              return (
                <div
                  key={`div-${idx}`}
                  className="my-1 border-t border-neutral-200 dark:border-neutral-700"
                />
              )
            }
            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => {
                  setOpen(false)
                  if (item.onClick) item.onClick()
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-blue-50 dark:hover:bg-neutral-700 ${
                  item.active
                    ? 'font-medium text-blue-600 dark:text-blue-400'
                    : 'text-neutral-700 dark:text-neutral-200'
                }`}
              >
                {item.icon && <span className="text-sm">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
