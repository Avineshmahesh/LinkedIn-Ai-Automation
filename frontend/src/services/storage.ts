// Thin wrapper around localStorage so the rest of the app never touches
// window.localStorage directly. Fails soft (returns fallback) if storage is
// unavailable or the payload can't be parsed.

const NAMESPACE = 'postform'

function key(name: string): string {
  return `${NAMESPACE}:${name}`
}

export function readStorage<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key(name))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(name: string, value: T): void {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value))
  } catch {
    // Storage full or unavailable (private browsing, etc). Silently ignore -
    // the app continues to work in-memory for the session.
  }
}

export function clearStorage(name: string): void {
  try {
    window.localStorage.removeItem(key(name))
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  auth: 'auth',
  posts: 'posts',
  templates: 'templates',
  notifications: 'notifications',
  aiSettings: 'ai-settings',
  linkedin: 'linkedin',
  analytics: 'analytics',
  theme: 'theme',
  seeded: 'seeded-v1',
} as const
