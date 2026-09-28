import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'
import { useAISettings } from '@/context/AISettingsContext'
import { TONES, AUDIENCES, POST_LENGTHS, IMAGE_STYLES, CTA_OPTIONS, toOptions } from '@/data/options'
import type { AISettings } from '@/types'

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{label}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent-500' : 'bg-ink-200 dark:bg-ink-700'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  )
}

export default function AISettingsPage() {
  const { settings, updateSettings, saveSettings, saving } = useAISettings()
  const [local, setLocal] = useState<AISettings>(settings)

  function set<K extends keyof AISettings>(key: K, value: AISettings[K]) {
    setLocal((prev) => ({ ...prev, [key]: value }))
    updateSettings({ [key]: value } as Partial<AISettings>)
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-base font-semibold text-ink-900 dark:text-white">AI preferences</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Default tone"
          value={local.defaultTone}
          onChange={(e) => set('defaultTone', e.target.value as AISettings['defaultTone'])}
          options={toOptions(TONES)}
        />
        <Select
          label="Default audience"
          value={local.defaultAudience}
          onChange={(e) => set('defaultAudience', e.target.value as AISettings['defaultAudience'])}
          options={toOptions(AUDIENCES)}
        />
        <Select
          label="Default content length"
          value={local.defaultLength}
          onChange={(e) => set('defaultLength', e.target.value as AISettings['defaultLength'])}
          options={toOptions(POST_LENGTHS)}
        />
        <Select
          label="Default image style"
          value={local.defaultImageStyle}
          onChange={(e) => set('defaultImageStyle', e.target.value as AISettings['defaultImageStyle'])}
          options={toOptions(IMAGE_STYLES)}
        />
        <Select
          label="Default CTA"
          value={local.defaultCTA}
          onChange={(e) => set('defaultCTA', e.target.value as AISettings['defaultCTA'])}
          options={toOptions(CTA_OPTIONS)}
          className="col-span-2"
        />
      </div>

      <div className="mt-2 divide-y divide-ink-100 dark:divide-ink-800">
        <Toggle
          checked={local.autoHashtags}
          onChange={(v) => set('autoHashtags', v)}
          label="Auto hashtags"
          description="Automatically suggest hashtags when content is generated."
        />
        <Toggle
          checked={local.autoImageGeneration}
          onChange={(v) => set('autoImageGeneration', v)}
          label="Auto image generation"
          description="Automatically generate an image alongside new posts."
        />
      </div>

      <Button className="mt-5" onClick={() => saveSettings(local)} loading={saving}>
        Save changes
      </Button>
    </Card>
  )
}
