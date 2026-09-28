import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, RefreshCw, Pencil, Trash2, ShieldAlert, WifiOff, AlertTriangle, HelpCircle } from 'lucide-react'
import type { FailureReason } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { usePosts } from '@/context/PostsContext'
import { formatDate } from '@/utils/format'

const REASON_CONFIG: Record<FailureReason, { label: string; icon: typeof ShieldAlert; classes: string }> = {
  AUTH_ERROR: { label: 'Authentication Error', icon: ShieldAlert, classes: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10' },
  NETWORK_ERROR: { label: 'Network Error', icon: WifiOff, classes: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10' },
  PUBLISHING_ERROR: { label: 'Publishing Error', icon: AlertTriangle, classes: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10' },
  UNKNOWN_ERROR: { label: 'Unknown Error', icon: HelpCircle, classes: 'bg-ink-100 text-ink-600 dark:bg-ink-800' },
}

export default function Failed() {
  const { posts, retryPost, deletePost, pendingIds } = usePosts()
  const navigate = useNavigate()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const failed = useMemo(
    () => posts.filter((p) => p.status === 'FAILED').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [posts],
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Failed posts</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{failed.length} post{failed.length === 1 ? '' : 's'} need attention</p>
      </div>

      {failed.length === 0 ? (
        <EmptyState
          icon={<XCircle className="h-5 w-5" />}
          title="No failed posts."
          description="Anything that fails to publish will show up here so you can retry it."
        />
      ) : (
        <div className="space-y-3">
          {failed.map((post) => {
            const reason = post.error?.reason || 'UNKNOWN_ERROR'
            const config = REASON_CONFIG[reason]
            const isPending = pendingIds.has(post.id)
            return (
              <Card key={post.id} className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.classes}`}>
                      <config.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink-900 dark:text-white">{post.title}</h3>
                      <p className="mt-0.5 text-xs font-medium text-danger-500">{config.label}</p>
                      <p className="mt-1 max-w-xl text-sm text-ink-500 dark:text-ink-400">{post.error?.message}</p>
                      <p className="mt-1 text-xs text-ink-400">Failed {formatDate(post.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button size="sm" onClick={() => retryPost(post.id)} loading={isPending}>
                      <RefreshCw className="h-3.5 w-3.5" /> Retry
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/create?edit=${post.id}`)}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(post.id)} className="text-danger-500 hover:bg-danger-50">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete post?"
        description="This failed post will be permanently removed."
        confirmLabel="Delete"
        loading={!!deleteId && pendingIds.has(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) await deletePost(deleteId)
          setDeleteId(null)
        }}
      />
    </div>
  )
}
