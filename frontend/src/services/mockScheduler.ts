// Mock scheduling service.
//
// Swap surface for a real backend:
//   schedulePost()   -> POST /api/scheduler/jobs
//   cancelSchedule()  -> DELETE /api/scheduler/jobs/:id
//   reschedule()      -> PATCH /api/scheduler/jobs/:id
//
// In production this would enqueue a BullMQ job for a worker to pick up at
// the scheduled time. Here we simply validate and echo back an ISO string.

import { simulate } from './mockCore'

export function combineDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString()
}

export function isFuture(iso: string): boolean {
  return new Date(iso).getTime() > Date.now()
}

export async function scheduleJob(iso: string): Promise<{ scheduledAt: string }> {
  return simulate(
    () => ({ scheduledAt: iso }),
    { minMs: 600, maxMs: 1100, failRate: 0.03, failMessage: 'Could not schedule the post. Please try again.' },
  )
}

export async function cancelJob(): Promise<void> {
  return simulate(() => undefined, { minMs: 400, maxMs: 800 })
}
