import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Tooltip({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-xs text-white shadow-pop dark:bg-ink-700',
            className,
          )}
        >
          {label}
        </span>
      )}
    </span>
  )
}
