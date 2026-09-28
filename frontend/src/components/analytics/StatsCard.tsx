import type { ComponentType } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'

interface StatsCardProps {
  label: string
  value: string | number
  change?: number
  icon?: ComponentType<{ className?: string }>
  accent?: string
}

export function StatsCard({ label, value, change, icon: Icon, accent }: StatsCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">{label}</p>
        {Icon && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              accent || 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400',
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">{value}</p>
      {change !== undefined && (
        <p
          className={cn(
            'mt-1.5 flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-success-600 dark:text-success-500' : 'text-danger-500',
          )}
        >
          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {formatPercent(change)} this month
        </p>
      )}
    </Card>
  )
}
