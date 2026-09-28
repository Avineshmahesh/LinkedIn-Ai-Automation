import { CheckCircle2 } from 'lucide-react'
import { LinkedInMark } from '@/components/icons/LinkedInMark'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useLinkedIn } from '@/context/LinkedInContext'
import { formatDate } from '@/utils/format'

export default function LinkedInSettings() {
  const { account, connecting, connect, disconnect } = useLinkedIn()

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
          <LinkedInMark className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-base font-semibold text-ink-900 dark:text-white">LinkedIn account</h2>
      </div>

      {account.connected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-500/20 dark:bg-success-500/5">
            <Avatar name={account.name || 'User'} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-success-500" /> Connected
              </p>
              <p className="mt-0.5 truncate font-medium text-ink-800 dark:text-ink-100">{account.name}</p>
              <p className="truncate text-sm text-ink-500 dark:text-ink-400">{account.headline}</p>
              {account.connectedAt && (
                <p className="mt-1 text-xs text-ink-400">Connected on {formatDate(account.connectedAt)}</p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={disconnect} loading={connecting}>
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-dashed border-ink-300 p-6 text-center dark:border-ink-700">
            <p className="font-medium text-ink-700 dark:text-ink-200">LinkedIn not connected.</p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Connect your LinkedIn account to publish automatically.
            </p>
          </div>
          <Button onClick={connect} loading={connecting}>
            <LinkedInMark className="h-4 w-4" /> Connect LinkedIn
          </Button>
        </div>
      )}
    </Card>
  )
}
