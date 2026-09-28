import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size]

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      style={{ animation: 'fade-in 0.15s ease-out' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-ink-200 bg-white p-6 shadow-pop dark:border-ink-800 dark:bg-ink-900 sm:rounded-2xl',
          sizeClass,
        )}
        style={{ animation: 'scale-in 0.18s ease-out' }}
      >
        {(title || description) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-ink-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="shrink-0 rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
