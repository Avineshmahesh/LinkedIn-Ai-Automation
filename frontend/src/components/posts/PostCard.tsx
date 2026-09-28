import { ImageIcon, Hash } from 'lucide-react'
import type { LinkedInPost } from '@/types'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from './StatusBadge'
import { formatDate } from '@/utils/format'
import { cn } from '@/utils/cn'

interface PostCardProps {
  post: LinkedInPost
  view: 'grid' | 'list'
  actions?: React.ReactNode
  onClick?: () => void
  metaLine?: string
}

export function PostCard({ post, view, actions, onClick, metaLine }: PostCardProps) {
  const isGrid = view === 'grid'

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group overflow-hidden transition-shadow hover:shadow-card',
        onClick && 'cursor-pointer',
        isGrid ? 'flex flex-col' : 'flex flex-col sm:flex-row',
      )}
    >
      <div
        className={cn(
          'shrink-0 overflow-hidden bg-ink-100 dark:bg-ink-800',
          isGrid ? 'aspect-[16/9] w-full' : 'aspect-[16/9] w-full sm:aspect-square sm:w-40',
        )}
      >
        {post.image ? (
          <img src={post.image.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-300 dark:text-ink-600">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-ink-900 dark:text-white">{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-ink-500 dark:text-ink-400">{post.content}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
          <span>{metaLine || formatDate(post.updatedAt)}</span>
          {post.hashtags.length > 0 && (
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {post.hashtags.length}
            </span>
          )}
        </div>
        {actions && (
          <div className="mt-1 flex items-center gap-1.5 border-t border-ink-100 pt-2.5 dark:border-ink-800">
            {actions}
          </div>
        )}
      </div>
    </Card>
  )
}
