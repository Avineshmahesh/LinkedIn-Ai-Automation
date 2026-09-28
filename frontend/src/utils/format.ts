export function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return `${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} · ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMs = then - now
  const diffMin = Math.round(diffMs / 60000)

  const abs = Math.abs(diffMin)
  if (abs < 1) return 'just now'
  if (abs < 60) return diffMin > 0 ? `in ${abs}m` : `${abs}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (Math.abs(diffHr) < 24) return diffMin > 0 ? `in ${Math.abs(diffHr)}h` : `${Math.abs(diffHr)}h ago`
  const diffDay = Math.round(diffHr / 24)
  return diffMin > 0 ? `in ${Math.abs(diffDay)}d` : `${Math.abs(diffDay)}d ago`
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n}%`
}

export function wordCount(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
