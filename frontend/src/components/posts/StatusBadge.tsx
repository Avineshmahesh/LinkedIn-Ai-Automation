import type { PostStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'

const CONFIG: Record<PostStatus, { label: string; variant: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' }> = {
  DRAFT: { label: 'Draft', variant: 'neutral' },
  SCHEDULED: { label: 'Scheduled', variant: 'accent' },
  PROCESSING: { label: 'Processing', variant: 'warning' },
  PUBLISHED: { label: 'Published', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'danger' },
  CANCELLED: { label: 'Cancelled', variant: 'neutral' },
}

export function StatusBadge({ status }: { status: PostStatus }) {
  const { label, variant } = CONFIG[status]
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  )
}
