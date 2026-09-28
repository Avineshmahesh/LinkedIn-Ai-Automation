import { NavLink } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight, Sparkles } from 'lucide-react'
import { NAV_ITEMS, SETTINGS_ITEM } from './navigation'
import { cn } from '@/utils/cn'

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
}: {
  collapsed: boolean
  onToggleCollapsed?: () => void
  onNavigate?: () => void
}) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900',
        collapsed ? 'w-[72px]' : 'w-64',
        'transition-[width] duration-200',
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        {!collapsed && (
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink-900 dark:text-white">
            Postform
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-ink-200 px-3 py-3 dark:border-ink-800">
        <NavLink
          to={SETTINGS_ITEM.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100',
            )
          }
          title={collapsed ? SETTINGS_ITEM.label : undefined}
        >
          <SETTINGS_ITEM.icon className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>{SETTINGS_ITEM.label}</span>}
        </NavLink>

        {onToggleCollapsed && (
          <button
            onClick={onToggleCollapsed}
            className={cn(
              'hidden w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-100 lg:flex',
              collapsed && 'justify-center px-0',
            )}
          >
            {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </aside>
  )
}
