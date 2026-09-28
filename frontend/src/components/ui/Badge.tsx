import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300',
  success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500',
  danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500',
  outline: 'border border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300',
}

export function Badge({
  children,
  variant = 'neutral',
  className,
  dot,
}: {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
