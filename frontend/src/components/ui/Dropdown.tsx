import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

interface DropdownProps {
  trigger: ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const updateCoords = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    setCoords({ top: rect.bottom + 6, left: align === 'right' ? rect.right : rect.left, width: rect.width })
  }, [align])

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (
        panelRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) {
        return
      }
      setOpen(false)
    }
    function onScroll() {
      updateCoords()
    }
    document.addEventListener('mousedown', onDocClick)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, updateCoords])

  function toggle() {
    if (!open) updateCoords()
    setOpen((v) => !v)
  }

  return (
    <>
      <div ref={triggerRef} onClick={toggle}>
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            className={cn(
              'fixed z-[95] min-w-[200px] rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop dark:border-ink-700 dark:bg-ink-800',
              className,
            )}
            style={{
              top: coords.top,
              left: align === 'right' ? undefined : coords.left,
              right: align === 'right' ? window.innerWidth - coords.left : undefined,
              animation: 'scale-in 0.12s ease-out',
            }}
          >
            {children(() => setOpen(false))}
          </div>,
          document.body,
        )}
    </>
  )
}

export function DropdownItem({
  children,
  onClick,
  danger,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  icon?: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
        danger
          ? 'text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10'
          : 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
