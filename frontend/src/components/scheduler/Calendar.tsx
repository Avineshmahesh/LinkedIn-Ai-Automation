import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LinkedInPost } from '@/types'
import { cn } from '@/utils/cn'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function Calendar({
  posts,
  onSelectPost,
}: {
  posts: LinkedInPost[]
  onSelectPost: (post: LinkedInPost) => void
}) {
  const [cursor, setCursor] = useState(() => new Date())

  const grid = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    // Monday-first index (0 = Monday ... 6 = Sunday)
    const startOffset = (firstOfMonth.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<{ date: Date; inMonth: boolean }> = []
    for (let i = 0; i < startOffset; i++) {
      cells.push({ date: new Date(year, month, i - startOffset + 1), inMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inMonth: true })
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const next = new Date(last)
      next.setDate(next.getDate() + 1)
      cells.push({ date: next, inMonth: false })
    }
    return cells
  }, [cursor])

  const postsByDay = useMemo(() => {
    const map = new Map<string, LinkedInPost[]>()
    for (const post of posts) {
      if (!post.scheduledAt) continue
      const key = post.scheduledAt.slice(0, 10)
      const list = map.get(key) || []
      list.push(post)
      map.set(key, list)
    }
    return map
  }, [posts])

  const today = new Date()
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="rounded-lg px-2 py-1 text-xs font-medium text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-ink-100 text-center text-xs font-medium text-ink-400 dark:bg-ink-800">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-white py-1.5 dark:bg-ink-900">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
        {grid.map(({ date, inMonth }, i) => {
          const key = date.toISOString().slice(0, 10)
          const dayPosts = postsByDay.get(key) || []
          return (
            <div
              key={i}
              className={cn(
                'min-h-[92px] bg-white p-1.5 dark:bg-ink-900',
                !inMonth && 'bg-ink-50 dark:bg-ink-950',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-5 w-5 items-center justify-center rounded-full text-xs',
                  isSameDay(date, today)
                    ? 'bg-accent-500 font-semibold text-white'
                    : inMonth
                      ? 'text-ink-600 dark:text-ink-300'
                      : 'text-ink-300 dark:text-ink-700',
                )}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayPosts.slice(0, 2).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="block w-full truncate rounded bg-accent-50 px-1.5 py-1 text-left text-[11px] font-medium text-accent-700 hover:bg-accent-100 dark:bg-accent-500/10 dark:text-accent-300 dark:hover:bg-accent-500/20"
                  >
                    {post.title}
                  </button>
                ))}
                {dayPosts.length > 2 && (
                  <p className="px-1.5 text-[10px] text-ink-400">+{dayPosts.length - 2} more</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
