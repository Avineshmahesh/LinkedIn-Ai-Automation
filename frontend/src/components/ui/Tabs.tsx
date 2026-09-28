import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Tab {
  value: string
  label: string
  icon?: ReactNode
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg bg-ink-100 p-1 dark:bg-ink-800',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            value === tab.value
              ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-700 dark:text-white'
              : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100',
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

