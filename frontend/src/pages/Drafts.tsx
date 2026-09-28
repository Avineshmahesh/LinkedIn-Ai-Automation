import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Pencil, Copy, Trash2, CalendarClock, PenSquare } from 'lucide-react'
import { PostCard } from '@/components/posts/PostCard'
import { PostListToolbar } from '@/components/posts/PostListToolbar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { ScheduleModal } from '@/components/scheduler/ScheduleModal'
import { usePosts } from '@/context/PostsContext'
import { formatDate } from '@/utils/format'

type SortKey = 'updated' | 'created' | 'title'

export default function Drafts() {
  const { posts, deletePost, duplicatePost, schedulePost, pendingIds } = usePosts()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('updated')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [scheduleId, setScheduleId] = useState<string | null>(null)

  const drafts = useMemo(() => {
    let list = posts.filter((p) => p.status === 'DRAFT')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
    }
    list = [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'created') return b.createdAt.localeCompare(a.createdAt)
      return b.updatedAt.localeCompare(a.updatedAt)
    })
    return list
  }, [posts, search, sort])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Drafts</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">{drafts.length} draft{drafts.length === 1 ? '' : 's'}</p>
        </div>
        <Button onClick={() => navigate('/create')}>
          <PenSquare className="h-4 w-4" /> New post
        </Button>
      </div>

      <PostListToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={(v) => setSort(v as SortKey)}
        sortOptions={[
          { label: 'Last edited', value: 'updated' },
          { label: 'Created date', value: 'created' },
          { label: 'Title A\u2013Z', value: 'title' },
        ]}
        view={view}
        onViewChange={setView}
        placeholder="Search drafts\u2026"
      />

      {drafts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No drafts yet."
          description="Create your first AI-powered LinkedIn post."
          action={
            <Button onClick={() => navigate('/create')}>
              <PenSquare className="h-4 w-4" /> Create a post
            </Button>
          }
        />
      ) : (
        <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
          {drafts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              view={view}
              metaLine={`Edited ${formatDate(post.updatedAt)}`}
              actions={
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/create?edit=${post.id}`)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => duplicatePost(post.id)}>
                    <Copy className="h-3.5 w-3.5" /> Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setScheduleId(post.id)}>
                    <CalendarClock className="h-3.5 w-3.5" /> Schedule
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(post.id)} className="text-danger-500 hover:bg-danger-50">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete draft?"
        description="This draft will be permanently removed. This can't be undone."
        confirmLabel="Delete"
        loading={!!deleteId && pendingIds.has(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deletePost(deleteId)
          setDeleteId(null)
        }}
      />

      <ScheduleModal
        open={!!scheduleId}
        onClose={() => setScheduleId(null)}
        loading={!!scheduleId && pendingIds.has(scheduleId)}
        onConfirm={async (iso) => {
          if (scheduleId) await schedulePost(scheduleId, iso)
          setScheduleId(null)
        }}
      />
    </div>
  )
}
