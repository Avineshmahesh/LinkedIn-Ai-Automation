import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { ToastMessage } from '@/types'
import { generateId } from '@/utils/id'
import { ToastViewport } from '@/components/ui/Toast'

interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (variant: ToastMessage['variant'], message: string) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (variant: ToastMessage['variant'], message: string) => {
      const id = generateId('toast')
      setToasts((prev) => [...prev, { id, variant, message }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
