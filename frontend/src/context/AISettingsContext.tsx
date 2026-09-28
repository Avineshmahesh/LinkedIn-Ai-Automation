import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AISettings } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { DEFAULT_AI_SETTINGS } from '@/data/mockData'
import { useToast } from './ToastContext'

interface AISettingsContextValue {
  settings: AISettings
  updateSettings: (partial: Partial<AISettings>) => void
  saveSettings: (partial: Partial<AISettings>) => Promise<void>
  saving: boolean
}

const AISettingsContext = createContext<AISettingsContextValue | null>(null)

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AISettings>(() =>
    readStorage(STORAGE_KEYS.aiSettings, DEFAULT_AI_SETTINGS),
  )
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  function updateSettings(partial: Partial<AISettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      writeStorage(STORAGE_KEYS.aiSettings, next)
      return next
    })
  }

  async function saveSettings(partial: Partial<AISettings>) {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    updateSettings(partial)
    setSaving(false)
    showToast('success', 'AI settings saved.')
  }

  return (
    <AISettingsContext.Provider value={{ settings, updateSettings, saveSettings, saving }}>
      {children}
    </AISettingsContext.Provider>
  )
}

export function useAISettings() {
  const ctx = useContext(AISettingsContext)
  if (!ctx) throw new Error('useAISettings must be used within AISettingsProvider')
  return ctx
}
