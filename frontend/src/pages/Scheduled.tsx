import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Pencil, XCircle, Eye, PenSquare } from 'lucide-react'
import type { LinkedInPost } from '@/types'
import { PostCard } from '@/components/posts/PostCard'
import { PostListToolbar } from '@/components/posts/PostListToolbar'
import { StatusBadge } from '@/components/posts/StatusBadge'
import { PostPreview } from '@/components/posts/PostPreview'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ScheduleModal } from '@/components/scheduler/ScheduleModal'
import { Modal } from '@/components/ui/Modal'
import { Calendar } from '@/components/scheduler/Calendar'
import { usePosts } from '@/context/PostsContext'
import { useAuth } from '@/context/AuthContext'
import { formatDateTime } from '@/utils/format'

export default function Scheduled() {
  const { posts, cancelScheduledPost, reschedulePost, pendingIds } = usePosts()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<'list' | 'calendar'>('list')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [previewPost, setPreviewPost] = useState<LinkedInPost | null>(null)

  const scheduled = useMemo(() => {
    let list = posts.filter((p) => p.status === 'SCHEDULED' || p.status === 'PROCESSING' || p.status === 'CANCELLED')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => (a.scheduledAt || '').localeCompare(b.scheduledAt || ''))
  }, [posts, search])

  const rescheduleTarget = rescheduleId ? posts.find((p) => p.id === rescheduleId) : undefined

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Scheduled posts</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">{scheduled.length} upcoming</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            tabs={[
              { value: 'list', label: 'List' },
              { value: 'calendar', label: 'Calendar' },
            ]}
            value={tab}
            onChange={(v) => setTab(v as 'list' | 'calendar')}
          />
          <Button onClick={() => navigate('/create')}>
            <PenSquare className="h-4 w-4" /> New post
          </Button>
        </div>
      </div>

      {tab === 'list' ? (
        <>
          <PostListToolbar
            search={search}
            onSearchChange={setSearch}
            view={view}
            onViewChange={setView}
            placeholder="Search scheduled posts\u2026"
          />

          {scheduled.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="h-5 w-5" />}
              title="Nothing scheduled yet."
              description="Schedule a post from Create or from your drafts."
            />
          ) : (
            <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
              {scheduled.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  view={view}
                  metaLine={post.scheduledAt ? formatDateTime(post.scheduledAt) : undefined}
                  actions={
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setPreviewPost(post)}>
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/create?edit=${post.id}`)}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      {post.status !== 'CANCELLED' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setRescheduleId(post.id)}>
                            <CalendarClock className="h-3.5 w-3.5" /> Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelId(post.id)}
                            className="text-danger-500 hover:bg-danger-50"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Cancel
                          </Button>
                        </>
                      )}
                    </>
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <Calendar posts={scheduled} onSelectPost={setPreviewPost} />
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel scheduled post?"
        description="This post will no longer be published automatically. You can reschedule it later."
        confirmLabel="Cancel post"
        loading={!!cancelId && pendingIds.has(cancelId)}
        onCancel={() => setCancelId(null)}
        onConfirm={async () => {
          if (cancelId) await cancelScheduledPost(cancelId)
          setCancelId(null)
        }}
      />

      <ScheduleModal
        open={!!rescheduleId}
        title="Reschedule post"
        onClose={() => setRescheduleId(null)}
        loading={!!rescheduleId && pendingIds.has(rescheduleId)}
        initialDate={rescheduleTarget?.scheduledAt?.slice(0, 10)}
        initialTime={rescheduleTarget?.scheduledAt?.slice(11, 16)}
        onConfirm={async (iso) => {
          if (rescheduleId) await reschedulePost(rescheduleId, iso)
          setRescheduleId(null)
        }}
      />

      <Modal open={!!previewPost} onClose={() => setPreviewPost(null)} title={previewPost?.title} size="sm">
        {previewPost && (
          <div className="space-y-3">
            <PostPreview
              authorName={user.name}
              authorTitle={user.title}
              content={previewPost.content}
              hashtags={previewPost.hashtags}
              imageUrl={previewPost.image?.url}
              imageAspect={previewPost.image?.aspectRatio}
            />
            <div className="flex items-center justify-between text-xs text-ink-400">
              <StatusBadge status={previewPost.status} />
              {previewPost.scheduledAt && <span>{formatDateTime(previewPost.scheduledAt)}</span>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
