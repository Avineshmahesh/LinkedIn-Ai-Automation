import { Globe2, ThumbsUp, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'

interface PostPreviewProps {
  authorName: string
  authorTitle: string
  content: string
  hashtags: string[]
  imageUrl?: string
  imageAspect?: '1:1' | '4:5' | '16:9'
  timestamp?: string
  className?: string
}

const ASPECT_CLASS: Record<string, string> = {
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
  '16:9': 'aspect-video',
}

export function PostPreview({
  authorName,
  authorTitle,
  content,
  hashtags,
  imageUrl,
  imageAspect = '1:1',
  timestamp = 'Now',
  className,
}: PostPreviewProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900',
        className,
      )}
    >
      <div className="flex items-start gap-2.5 p-4 pb-3">
        <Avatar name={authorName || 'Your Name'} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
            {authorName || 'Your Name'}
          </p>
          <p className="truncate text-xs text-ink-500 dark:text-ink-400">{authorTitle || 'Your headline'}</p>
          <p className="flex items-center gap-1 text-xs text-ink-400">
            {timestamp} <span aria-hidden>\u00b7</span> <Globe2 className="h-3 w-3" />
          </p>
        </div>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-ink-400" />
      </div>

      <div className="px-4 pb-3">
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-ink-800 dark:text-ink-100">
          {content || 'Your generated post will appear here as you write it.'}
        </p>
        {hashtags.length > 0 && (
          <p className="mt-2 flex flex-wrap gap-x-1.5 text-[14px] font-medium text-accent-600 dark:text-accent-400">
            {hashtags.map((tag) => (
              <span key={tag}>#{tag.replace(/^#/, '')}</span>
            ))}
          </p>
        )}
      </div>

      {imageUrl && (
        <div className={cn('w-full overflow-hidden bg-ink-100 dark:bg-ink-800', ASPECT_CLASS[imageAspect])}>
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-ink-100 px-2 py-1 dark:border-ink-800">
        {[
          { icon: ThumbsUp, label: 'Like' },
          { icon: MessageCircle, label: 'Comment' },
          { icon: Repeat2, label: 'Repost' },
          { icon: Send, label: 'Send' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
