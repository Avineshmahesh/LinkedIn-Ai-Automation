import { useState, type KeyboardEvent } from 'react'
import { RefreshCw, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import * as mockAI from '@/services/mockAI'

const MAX_HASHTAGS = 10

export function HashtagGenerator({
  value,
  onChange,
  topic,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  topic: string
}) {
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState('')

  async function regenerate() {
    setLoading(true)
    try {
      const tags = await mockAI.generateHashtags(topic || 'software engineering', 5)
      onChange(Array.from(new Set([...tags])).slice(0, MAX_HASHTAGS))
    } finally {
      setLoading(false)
    }
  }

  function addTag() {
    const clean = draft.trim().replace(/^#/, '').replace(/\s+/g, '')
    if (!clean || value.includes(clean) || value.length >= MAX_HASHTAGS) {
      setDraft('')
      return
    }
    onChange([...value, clean])
    setDraft('')
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Suggested hashtags</p>
        <span className="text-xs text-ink-400">
          {value.length} / {MAX_HASHTAGS} hashtags
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-accent-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 hover:bg-accent-100 dark:hover:bg-accent-500/20"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {value.length === 0 && !loading && (
          <p className="text-sm text-ink-400">No hashtags yet \u2014 generate some or add your own.</p>
        )}
        {loading && <span className="text-sm text-ink-400">Generating hashtags\u2026</span>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a hashtag"
          disabled={value.length >= MAX_HASHTAGS}
          className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900"
        />
        <Button variant="outline" size="sm" onClick={addTag} disabled={value.length >= MAX_HASHTAGS}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="sm" onClick={regenerate} loading={loading}>
          <RefreshCw className="h-3.5 w-3.5" /> Regenerate
        </Button>
      </div>
    </div>
  )
}
