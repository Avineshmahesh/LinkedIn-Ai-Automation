import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, Copy, Sparkles, ThumbsUp, MessageCircle, Repeat2, TrendingUp } from 'lucide-react'
import type { LinkedInPost } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { Modal } from '@/components/ui/Modal'
import { PostPreview } from '@/components/posts/PostPreview'
import { PostListToolbar } from '@/components/posts/PostListToolbar'
import { usePosts } from '@/context/PostsContext'
import { useAuth } from '@/context/AuthContext'
import { formatDate, formatNumber } from '@/utils/format'

export default function Published() {
  const { posts, duplicatePost } = usePosts()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [previewPost, setPreviewPost] = useState<LinkedInPost | null>(null)

  const published = useMemo(() => {
    let list = posts.filter((p) => p.status === 'PUBLISHED')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
  }, [posts, search])

  function createSimilar(post: LinkedInPost) {
    navigate('/create', { state: { duplicateFrom: post } })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Published posts</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{published.length} live on LinkedIn</p>
      </div>

      <PostListToolbar search={search} onSearchChange={setSearch} placeholder="Search published posts\u2026" />

      {published.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Nothing published yet."
          description="Once you publish a post, it will show up here with its performance."
        />
      ) : (
        <div className="space-y-3">
          {published.map((post) => (
            <Card key={post.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
                {post.image ? (
                  <img src={post.image.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-ink-900 dark:text-white">{post.title}</h3>
                <p className="line-clamp-1 text-sm text-ink-500 dark:text-ink-400">{post.content}</p>
                <p className="mt-1 text-xs text-ink-400">Published {post.publishedAt ? formatDate(post.publishedAt) : ''}</p>
              </div>

              {post.analytics && (
                <div className="flex shrink-0 items-center gap-4 text-xs text-ink-500 dark:text-ink-400">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> {formatNumber(post.analytics.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> {formatNumber(post.analytics.comments)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Repeat2 className="h-3.5 w-3.5" /> {formatNumber(post.analytics.reposts)}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-success-600 dark:text-success-500">
                    <TrendingUp className="h-3.5 w-3.5" /> {post.analytics.engagementRate}%
                  </span>
                </div>
              )}

              <div className="flex shrink-0 gap-1.5">
                <Button variant="ghost" size="sm" onClick={() => setPreviewPost(post)}>
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                <Button variant="ghost" size="sm" onClick={() => duplicatePost(post.id)}>
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </Button>
                <Button variant="outline" size="sm" onClick={() => createSimilar(post)}>
                  <Sparkles className="h-3.5 w-3.5" /> Create similar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!previewPost} onClose={() => setPreviewPost(null)} title={previewPost?.title} size="sm">
        {previewPost && (
          <PostPreview
            authorName={user.name}
            authorTitle={user.title}
            content={previewPost.content}
            hashtags={previewPost.hashtags}
            imageUrl={previewPost.image?.url}
            imageAspect={previewPost.image?.aspectRatio}
            timestamp={previewPost.publishedAt ? formatDate(previewPost.publishedAt) : 'Now'}
          />
        )}
      </Modal>
    </div>
  )
}
