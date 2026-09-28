import { initials } from '@/utils/format'
import { cn } from '@/utils/cn'

export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-14 w-14 text-base',
  }[size]

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 font-semibold text-white',
        sizeClasses,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}
