import { useState } from 'react'
import { User as UserIcon, Moon, Sun } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'

const TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'Australia/Sydney',
]

export default function AccountSettings() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { showToast } = useToast()

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [timezone, setTimezone] = useState(user.timezone)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateUser({ name, email, timezone })
      showToast('success', 'Account settings saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
            <UserIcon className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-base font-semibold text-ink-900 dark:text-white">Profile</h2>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <Avatar name={name || user.name} size="lg" />
          <div>
            <p className="text-sm font-medium text-ink-800 dark:text-ink-100">Profile image</p>
            <p className="text-xs text-ink-400">Generated from your initials in this demo.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={TIMEZONES.map((tz) => ({ label: tz, value: tz }))}
            className="sm:col-span-2"
          />
        </div>

        <Button className="mt-5" onClick={handleSave} loading={saving}>
          Save changes
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-ink-900 dark:text-white">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                : 'border-ink-200 text-ink-500 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800'
            }`}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                : 'border-ink-200 text-ink-500 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-400 dark:hover:bg-ink-800'
            }`}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </Card>
    </div>
  )
}
