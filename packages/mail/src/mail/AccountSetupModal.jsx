import React, { useState } from 'react'
import { X, Server, Lock, Check } from 'lucide-react'
import { useMailStore } from '../core/mail-store.js'
import { PROVIDER_PRESETS } from '../core/constants.js'
import { persistAccount } from '../core/mail-bridge.js'

/**
 * Account configuration modal for IMAP/SMTP account setup.
 */
export function AccountSetupModal() {
  const { isAccountModalOpen, setAccountModalOpen, addAccount } = useMailStore()
  const [preset, setPreset] = useState('gmail')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [imapHost, setImapHost] = useState('imap.gmail.com')
  const [imapPort, setImapPort] = useState(993)
  const [imapSecure, setImapSecure] = useState(true)
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com')
  const [smtpPort, setSmtpPort] = useState(465)
  const [smtpSecure, setSmtpSecure] = useState(true)

  if (!isAccountModalOpen) return null

  const handlePresetChange = (presetId) => {
    setPreset(presetId)
    const p = PROVIDER_PRESETS.find((item) => item.id === presetId)
    if (p) {
      setImapHost(p.imapHost)
      setImapPort(p.imapPort)
      setImapSecure(p.imapSecure)
      setSmtpHost(p.smtpHost)
      setSmtpPort(p.smtpPort)
      setSmtpSecure(p.smtpSecure)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    const newAcc = addAccount({
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      imapHost,
      imapPort: Number(imapPort),
      imapSecure,
      smtpHost,
      smtpPort: Number(smtpPort),
      smtpSecure,
      username: email.trim(),
    })

    // Persist securely to backend SQLite + safeStorage
    await persistAccount(newAcc, password)
    setAccountModalOpen(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-setup-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-blue-600 dark:text-blue-400" />
            <h2
              id="account-setup-title"
              className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Add Email Account
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAccountModalOpen(false)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          {/* Preset Buttons */}
          <div>
            <label className="mb-1.5 block font-medium text-neutral-700 dark:text-neutral-300">
              Account Provider
            </label>
            <div className="flex gap-2">
              {PROVIDER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetChange(p.id)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-left font-medium transition-colors ${
                    preset === p.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Password or App Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2 text-xs text-neutral-900 outline-none focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
              <Lock size={12} className="absolute right-3 top-3 text-neutral-400" />
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Passwords are encrypted using Electron safeStorage before local persistence.
            </p>
          </div>

          {/* Server Config */}
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              Server Settings
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] text-neutral-500">IMAP Server</label>
                <input
                  type="text"
                  value={imapHost}
                  onChange={(e) => setImapHost(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500">Port</label>
                <input
                  type="number"
                  value={imapPort}
                  onChange={(e) => setImapPort(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] text-neutral-500">SMTP Server</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-500">Port</label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full rounded border border-neutral-300 bg-white p-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-2 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setAccountModalOpen(false)}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Check size={14} /> Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
