import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between p-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-ink-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  )
}
