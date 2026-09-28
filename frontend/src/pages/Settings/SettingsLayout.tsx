import { NavLink, Outlet } from 'react-router-dom'
import { Sparkles, User } from 'lucide-react'
import { LinkedInMark } from '@/components/icons/LinkedInMark'
import { cn } from '@/utils/cn'

const TABS = [
  { to: '/settings/account', label: 'Account', icon: User },
  { to: '/settings/linkedin', label: 'LinkedIn', icon: LinkedInMark },
  { to: '/settings/ai', label: 'AI', icon: Sparkles },
]

export default function SettingsLayout() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Settings</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage your account, LinkedIn connection, and AI preferences</p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-ink-200 dark:border-ink-800">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                  : 'border-transparent text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100',
              )
            }
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="max-w-2xl">
        <Outlet />
      </div>
    </div>
  )
}
