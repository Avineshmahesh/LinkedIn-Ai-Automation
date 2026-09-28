import type { ReactNode } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/utils/cn'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 px-6 py-16 text-center dark:border-ink-700',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Loading\u2026', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
  className,
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-200 bg-danger-50 px-6 py-10 text-center dark:border-danger-500/20 dark:bg-danger-500/5',
        className,
      )}
    >
      <AlertCircle className="h-6 w-6 text-danger-500" />
      <div>
        <h3 className="font-semibold text-ink-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
