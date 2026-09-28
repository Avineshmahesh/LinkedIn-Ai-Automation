import type { ReactNode } from 'react'
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SortOption {
  label: string
  value: string
}

export function PostListToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  sortOptions,
  view,
  onViewChange,
  extra,
  placeholder = 'Search posts\u2026',
}: {
  search: string
  onSearchChange: (value: string) => void
  sort?: string
  onSortChange?: (value: string) => void
  sortOptions?: SortOption[]
  view?: 'grid' | 'list'
  onViewChange?: (view: 'grid' | 'list') => void
  extra?: ReactNode
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-ink-700 dark:bg-ink-900"
        />
      </div>

      {extra}

      {sortOptions && onSortChange && (
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {view && onViewChange && (
        <div className="flex items-center gap-0.5 rounded-lg border border-ink-200 p-0.5 dark:border-ink-700">
          <button
            onClick={() => onViewChange('grid')}
            className={cn(
              'rounded-md p-1.5',
              view === 'grid' ? 'bg-ink-100 text-ink-900 dark:bg-ink-700 dark:text-white' : 'text-ink-400',
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'rounded-md p-1.5',
              view === 'list' ? 'bg-ink-100 text-ink-900 dark:bg-ink-700 dark:text-white' : 'text-ink-400',
            )}
            aria-label="List view"
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
