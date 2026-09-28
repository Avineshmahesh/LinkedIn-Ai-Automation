import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import {
  Sparkles,
  RefreshCw,
  Wand2,
  Scissors,
  Maximize2,
  Briefcase,
  MessageSquareHeart,
  Save,
  CalendarClock,
  Send,
  Hash,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { PostPreview } from '@/components/posts/PostPreview'
import { HashtagGenerator } from '@/components/ai/HashtagGenerator'
import { ImageGenerator } from '@/components/ai/ImageGenerator'
import { ScheduleModal } from '@/components/scheduler/ScheduleModal'
import { usePosts } from '@/context/PostsContext'
import { useAISettings } from '@/context/AISettingsContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import * as mockAI from '@/services/mockAI'
import type { Audience, CTAOption, ContentType, GeneratedImage, LinkedInPost, PostGenerationMeta, PostLength, PostTemplate, Tone } from '@/types'
import { CONTENT_TYPES, TONES, AUDIENCES, POST_LENGTHS, CTA_OPTIONS, toOptions } from '@/data/options'
import { wordCount } from '@/utils/format'

type GenStatus = 'idle' | 'loading' | 'success' | 'error'

export default function CreatePost() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const { getPost, createDraft, updatePost, schedulePost, publishNow } = usePosts()
  const { settings } = useAISettings()
  const { user } = useAuth()
  const { showToast } = useToast()

  const existingPost = editId ? getPost(editId) : undefined
  const navState = location.state as { template?: PostTemplate; duplicateFrom?: LinkedInPost } | null
  const templateFromNav = navState?.template
  const duplicateFrom = navState?.duplicateFrom
  const prefill = existingPost || duplicateFrom

  const [topic, setTopic] = useState(prefill?.meta?.topic || '')
  const [contentType, setContentType] = useState<ContentType>(
    prefill?.meta?.contentType || templateFromNav?.contentType || 'Educational',
  )
  const [tone, setTone] = useState<Tone>(prefill?.meta?.tone || templateFromNav?.tone || settings.defaultTone)
  const [audience, setAudience] = useState<Audience>(prefill?.meta?.audience || settings.defaultAudience)
  const [length, setLength] = useState<PostLength>(prefill?.meta?.length || settings.defaultLength)
  const [cta, setCta] = useState<CTAOption>(prefill?.meta?.cta || settings.defaultCTA)

  const [genStatus, setGenStatus] = useState<GenStatus>(prefill || templateFromNav ? 'success' : 'idle')
  const [title, setTitle] = useState(prefill?.title || templateFromNav?.name || '')
  const [content, setContent] = useState(prefill?.content || templateFromNav?.example || '')
  const [hashtags, setHashtags] = useState<string[]>(prefill?.hashtags || templateFromNav?.defaultHashtags || [])
  const [image, setImage] = useState<GeneratedImage | undefined>(prefill?.image)
  const [reviseLoading, setReviseLoading] = useState<string | null>(null)

  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [savingAction, setSavingAction] = useState<'draft' | 'schedule' | 'publish' | null>(null)

  useEffect(() => {
    document.title = existingPost ? `Edit \u00b7 ${existingPost.title}` : 'Create Post \u00b7 Postform'
  }, [existingPost])

  const meta: PostGenerationMeta = { topic, contentType, tone, audience, length, cta }

  async function handleGenerate() {
    if (!topic.trim()) {
      showToast('error', 'Please enter a topic to generate content.')
      return
    }
    setGenStatus('loading')
    try {
      const result = await mockAI.generatePostContent(meta)
      setTitle(result.title)
      setContent(result.content)
      if (settings.autoHashtags) {
        setHashtags(result.hashtags)
      }
      setGenStatus('success')
      showToast('success', 'Post generated successfully.')
    } catch {
      setGenStatus('error')
    }
  }

  async function handleRegenerate() {
    setReviseLoading('regenerate')
    try {
      const result = await mockAI.generatePostContent(meta, title)
      setTitle(result.title)
      setContent(result.content)
      if (settings.autoHashtags) setHashtags(result.hashtags)
      showToast('success', 'Content regenerated.')
    } catch {
      showToast('error', 'Could not regenerate content. Please try again.')
    } finally {
      setReviseLoading(null)
    }
  }

  async function handleRevise(mode: 'improve' | 'shorten' | 'expand' | 'professional' | 'engaging') {
    setReviseLoading(mode)
    try {
      const revised = await mockAI.reviseContent(content, mode)
      setContent(revised)
    } catch {
      showToast('error', 'Could not revise the content. Please try again.')
    } finally {
      setReviseLoading(null)
    }
  }

  function currentPostData() {
    return { title: title || topic || 'Untitled post', content, hashtags, image, meta }
  }

  async function handleSaveDraft() {
    setSavingAction('draft')
    try {
      if (existingPost) {
        updatePost(existingPost.id, currentPostData())
        showToast('success', 'Draft saved successfully.')
      } else {
        createDraft(currentPostData())
        showToast('success', 'Draft saved successfully.')
      }
      navigate('/drafts')
    } finally {
      setSavingAction(null)
    }
  }

  async function handleScheduleConfirm(iso: string) {
    setSavingAction('schedule')
    try {
      const post = existingPost || createDraft(currentPostData())
      await schedulePost(post.id, iso, existingPost ? currentPostData() : undefined)
      setScheduleOpen(false)
      navigate('/scheduled')
    } finally {
      setSavingAction(null)
    }
  }

  async function handlePublishNow() {
    setSavingAction('publish')
    try {
      const post = existingPost || createDraft(currentPostData())
      const result = await publishNow(post.id, existingPost ? currentPostData() : undefined)
      setScheduleOpen(false)
      navigate(result.success ? '/published' : '/failed')
    } finally {
      setSavingAction(null)
    }
  }

  const charCount = content.length
  const wc = useMemo(() => wordCount(content), [content])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">
          {existingPost ? 'Edit post' : 'Create LinkedIn Post'}
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Describe an idea, let AI draft it, then fine-tune before you schedule.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* Content creation column */}
        <div className="space-y-5">
          <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-white">
              <Sparkles className="h-4 w-4 text-accent-500" /> Content creation
            </h2>

            <div className="space-y-4">
              <Input
                label="Topic"
                placeholder="e.g. React performance optimization"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Content type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  options={toOptions(CONTENT_TYPES)}
                />
                <Select
                  label="Tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  options={toOptions(TONES)}
                />
                <Select
                  label="Target audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Audience)}
                  options={toOptions(AUDIENCES)}
                />
                <Select
                  label="Post length"
                  value={length}
                  onChange={(e) => setLength(e.target.value as PostLength)}
                  options={toOptions(POST_LENGTHS)}
                />
                <Select
                  label="Language"
                  value="English"
                  onChange={() => {}}
                  options={[{ label: 'English', value: 'English' }]}
                  disabled
                />
                <Select
                  label="Call to action"
                  value={cta}
                  onChange={(e) => setCta(e.target.value as CTAOption)}
                  options={toOptions(CTA_OPTIONS)}
                />
              </div>

              <Button className="w-full" size="lg" onClick={handleGenerate} loading={genStatus === 'loading'}>
                <Wand2 className="h-4 w-4" /> Generate with AI
              </Button>
            </div>
          </div>

          {genStatus === 'loading' && (
            <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
              <p className="mb-3 text-sm font-medium text-ink-700 dark:text-ink-200">
                Generating your LinkedIn post\u2026
              </p>
              <p className="mb-4 text-xs text-ink-400">AI is crafting your content.</p>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          )}

          {genStatus === 'error' && (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-5 text-center dark:border-danger-500/20 dark:bg-danger-500/5">
              <p className="text-sm font-semibold text-danger-600">Something went wrong.</p>
              <p className="mt-1 text-sm text-danger-500">Please try again.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleGenerate}>
                Try Again
              </Button>
            </div>
          )}

          {genStatus === 'success' && (
            <>
              <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-ink-900 dark:text-white">Generated content</h2>
                  <div className="flex items-center gap-3 text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      <Type className="h-3 w-3" /> {charCount} chars \u00b7 {wc} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {hashtags.length}
                    </span>
                  </div>
                </div>

                <Input
                  label="Post title (internal reference)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-3"
                />

                <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} />

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Button variant="outline" size="sm" onClick={handleRegenerate} loading={reviseLoading === 'regenerate'}>
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRevise('improve')} loading={reviseLoading === 'improve'}>
                    <Sparkles className="h-3.5 w-3.5" /> Improve
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRevise('shorten')} loading={reviseLoading === 'shorten'}>
                    <Scissors className="h-3.5 w-3.5" /> Shorten
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRevise('expand')} loading={reviseLoading === 'expand'}>
                    <Maximize2 className="h-3.5 w-3.5" /> Expand
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRevise('professional')} loading={reviseLoading === 'professional'}>
                    <Briefcase className="h-3.5 w-3.5" /> More professional
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleRevise('engaging')} loading={reviseLoading === 'engaging'}>
                    <MessageSquareHeart className="h-3.5 w-3.5" /> More engaging
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
                <HashtagGenerator value={hashtags} onChange={setHashtags} topic={topic} />
              </div>

              <div className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
                <h2 className="mb-3 text-sm font-semibold text-ink-900 dark:text-white">AI image</h2>
                <ImageGenerator value={image} onChange={setImage} seedText={topic || title} defaultStyle={settings.defaultImageStyle} />
              </div>
            </>
          )}
        </div>

        {/* Preview column */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white">LinkedIn preview</h2>
          <PostPreview
            authorName={user.name}
            authorTitle={user.title}
            content={content}
            hashtags={hashtags}
            imageUrl={image?.url}
            imageAspect={image?.aspectRatio}
          />

          {genStatus === 'success' && (
            <div className="flex flex-col gap-2 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={handleSaveDraft} loading={savingAction === 'draft'}>
                <Save className="h-4 w-4" /> Save draft
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setScheduleOpen(true)}>
                <CalendarClock className="h-4 w-4" /> Schedule
              </Button>
              <Button className="flex-1" onClick={handlePublishNow} loading={savingAction === 'publish'}>
                <Send className="h-4 w-4" /> Publish now
              </Button>
            </div>
          )}
        </div>
      </div>

      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={handleScheduleConfirm}
        onPublishNow={handlePublishNow}
        loading={savingAction === 'schedule' || savingAction === 'publish'}
      />
    </div>
  )
}
