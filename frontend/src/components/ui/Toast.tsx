import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import type { ToastMessage } from '@/types'
import { cn } from '@/utils/cn'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'text-success-500',
  error: 'text-danger-500',
  info: 'text-accent-500',
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:right-4 sm:left-auto"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant]
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-pop dark:border-ink-700 dark:bg-ink-800',
              'animate-[toast-in_0.2s_ease-out]',
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', COLORS[toast.variant])} aria-hidden />
            <p className="flex-1 text-sm text-ink-700 dark:text-ink-200">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded p-0.5 text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
