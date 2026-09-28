import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, Search, Moon, Sun, LogOut, User as UserIcon, X } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/context/NotificationContext'
import { usePosts } from '@/context/PostsContext'
import { useTemplates } from '@/context/TemplatesContext'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { formatRelativeTime } from '@/utils/format'
import { cn } from '@/utils/cn'

const STATUS_ROUTE: Record<string, string> = {
  DRAFT: '/drafts',
  SCHEDULED: '/scheduled',
  PROCESSING: '/scheduled',
  PUBLISHED: '/published',
  FAILED: '/failed',
  CANCELLED: '/scheduled',
}

export function Header({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { posts } = usePosts()
  const { templates } = useTemplates()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const searchWrapRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return { posts: [], templates: [] }
    const q = query.toLowerCase()
    return {
      posts: posts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)).slice(0, 5),
      templates: templates.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 3),
    }
  }, [query, posts, templates])

  const [searchFocused, setSearchFocused] = useState(false)
  const showResults = query.trim().length > 0 && searchFocused

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-200 bg-white/80 px-4 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/80 sm:px-6">
      <button
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div ref={searchWrapRef} className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          placeholder="Search posts, drafts, templates\u2026"
          className="w-full rounded-lg border border-ink-200 bg-ink-50 py-2 pl-9 pr-8 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:focus:bg-ink-900"
          aria-label="Search"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {showResults && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-96 overflow-y-auto rounded-xl border border-ink-200 bg-white p-2 shadow-pop dark:border-ink-700 dark:bg-ink-800">
            {results.posts.length === 0 && results.templates.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-ink-400">No results for "{query}"</p>
            )}
            {results.posts.length > 0 && (
              <div className="mb-1">
                <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">Posts</p>
                {results.posts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setQuery('')
                      navigate(STATUS_ROUTE[p.status] || '/drafts')
                    }}
                    className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-ink-100 dark:hover:bg-ink-700"
                  >
                    <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{p.title}</span>
                    <span className="text-xs text-ink-400">{p.status.toLowerCase()}</span>
                  </button>
                ))}
              </div>
            )}
            {results.templates.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">Templates</p>
                {results.templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setQuery('')
                      navigate('/templates')
                    }}
                    className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-ink-100 dark:hover:bg-ink-700"
                  >
                    <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{t.name}</span>
                    <span className="text-xs text-ink-400">{t.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
        </button>

        <Dropdown
          align="right"
          trigger={
            <button
              className="relative rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          }
        >
          {(close) => (
            <div className="w-80 max-w-[90vw]">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-sm font-semibold text-ink-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-ink-400">You're all caught up.</p>
                )}
                {notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id)
                      close()
                    }}
                    className={cn(
                      'flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left hover:bg-ink-100 dark:hover:bg-ink-700',
                      !n.read && 'bg-accent-50/60 dark:bg-accent-500/5',
                    )}
                  >
                    <div className="flex w-full items-center gap-2">
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />}
                      <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{n.title}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-ink-400">{formatRelativeTime(n.createdAt)}</span>
                    </div>
                    <span className="line-clamp-2 pl-3.5 text-xs text-ink-500 dark:text-ink-400">{n.message}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Dropdown>

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-ink-100 dark:hover:bg-ink-800">
              <Avatar name={user.name} size="sm" />
              <span className="hidden text-sm font-medium text-ink-700 dark:text-ink-200 sm:inline">
                {user.name.split(' ')[0]}
              </span>
            </button>
          }
        >
          {(close) => (
            <div className="w-52">
              <div className="border-b border-ink-100 px-2.5 py-2 dark:border-ink-700">
                <p className="text-sm font-medium text-ink-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-ink-400">{user.email}</p>
              </div>
              <div className="pt-1">
                <DropdownItem
                  icon={<UserIcon className="h-4 w-4" />}
                  onClick={() => {
                    navigate('/settings/account')
                    close()
                  }}
                >
                  Account settings
                </DropdownItem>
                <DropdownItem
                  danger
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={() => {
                    logout()
                    navigate('/')
                    close()
                  }}
                >
                  Sign out
                </DropdownItem>
              </div>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  )
}
