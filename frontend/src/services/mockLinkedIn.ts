// Mock LinkedIn connection + publishing service.
//
// Swap surface for a real backend:
//   connectLinkedIn()    -> LinkedIn OAuth redirect + POST /api/linkedin/connect
//   disconnectLinkedIn() -> POST /api/linkedin/disconnect
//   publishPost()        -> POST /api/linkedin/posts

import type { FailureReason, LinkedInAccount, LinkedInPost } from '@/types'
import { simulate } from './mockCore'

export async function connectLinkedIn(name: string, headline: string): Promise<LinkedInAccount> {
  return simulate(
    () => ({
      connected: true,
      name,
      headline,
      connectedAt: new Date().toISOString(),
    }),
    { minMs: 1200, maxMs: 2200, failRate: 0.05, failMessage: 'LinkedIn authorization failed. Please try again.' },
  )
}

export async function disconnectLinkedIn(): Promise<void> {
  return simulate(() => undefined, { minMs: 500, maxMs: 900 })
}

const FAILURE_POOL: Array<{ reason: FailureReason; message: string }> = [
  { reason: 'NETWORK_ERROR', message: 'Request to LinkedIn timed out before a response was received.' },
  { reason: 'PUBLISHING_ERROR', message: 'LinkedIn rejected the post: media could not be processed.' },
  { reason: 'AUTH_ERROR', message: 'LinkedIn access token expired. Reconnect your account to continue publishing.' },
]

export interface PublishResult {
  success: boolean
  publishedAt?: string
  error?: { reason: FailureReason; message: string }
}

export async function publishPost(_post: LinkedInPost): Promise<PublishResult> {
  return simulate(
    () => {
      const fails = Math.random() < 0.12
      if (fails) {
        const error = FAILURE_POOL[Math.floor(Math.random() * FAILURE_POOL.length)]
        return { success: false, error }
      }
      return { success: true, publishedAt: new Date().toISOString() }
    },
    { minMs: 1400, maxMs: 2400 },
  )
}
