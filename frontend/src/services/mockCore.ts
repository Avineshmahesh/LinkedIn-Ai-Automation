// Shared helpers for simulating a real network boundary: artificial latency
// and an occasional failure, so every async action in the UI has a genuine
// loading state and a genuine (recoverable) error state to design for.

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface SimulateOptions {
  minMs?: number
  maxMs?: number
  failRate?: number
  failMessage?: string
}

export class MockServiceError extends Error {}

export async function simulate<T>(
  resolve: () => T,
  options: SimulateOptions = {},
): Promise<T> {
  const { minMs = 900, maxMs = 1900, failRate = 0, failMessage = 'The request failed. Please try again.' } = options
  await delay(randomBetween(minMs, maxMs))
  if (failRate > 0 && Math.random() < failRate) {
    throw new MockServiceError(failMessage)
  }
  return resolve()
}
