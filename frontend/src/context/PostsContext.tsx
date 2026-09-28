import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { LinkedInPost, PostStatus } from '@/types'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/services/storage'
import { generateSeedPosts } from '@/data/mockData'
import { generateId } from '@/utils/id'
import * as mockLinkedIn from '@/services/mockLinkedIn'
import { deletePostRequest } from '@/services/mockPosts'
import { useToast } from './ToastContext'
import { useNotifications } from './NotificationContext'
import { formatDateTime } from '@/utils/format'

interface PostsContextValue {
  posts: LinkedInPost[]
  getPost: (id: string) => LinkedInPost | undefined
  createDraft: (data: Partial<LinkedInPost>) => LinkedInPost
  updatePost: (id: string, partial: Partial<LinkedInPost>) => void
  deletePost: (id: string) => Promise<void>
  duplicatePost: (id: string) => LinkedInPost
  schedulePost: (id: string, isoDate: string, patchData?: Partial<LinkedInPost>) => Promise<void>
  cancelScheduledPost: (id: string) => Promise<void>
  reschedulePost: (id: string, isoDate: string) => Promise<void>
  publishNow: (id: string, patchData?: Partial<LinkedInPost>) => Promise<{ success: boolean }>
  retryPost: (id: string) => Promise<{ success: boolean }>
  pendingIds: Set<string>
}

const PostsContext = createContext<PostsContextValue | null>(null)

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<LinkedInPost[]>(() => readStorage(STORAGE_KEYS.posts, generateSeedPosts()))
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const { showToast } = useToast()
  const { addNotification } = useNotifications()

  // Keep a ref mirroring the latest posts so synchronous readers (getPost,
  // duplicatePost) always see up-to-date data even across renders, while all
  // writes below use the functional setState form so that two mutations
  // fired back-to-back in the same event handler (e.g. "save my edits" then
  // "schedule this post") both apply in order instead of one clobbering the
  // other via a stale closure.
  const postsRef = useRef(posts)
  postsRef.current = posts

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posts, posts)
  }, [posts])

  function patch(id: string, partial: Partial<LinkedInPost>) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial, updatedAt: new Date().toISOString() } : p)),
    )
  }

  function setPending(id: string, isPending: boolean) {
    setPendingIds((prev) => {
      const next = new Set(prev)
      if (isPending) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function getPost(id: string) {
    return postsRef.current.find((p) => p.id === id)
  }

  function createDraft(data: Partial<LinkedInPost>): LinkedInPost {
    const now = new Date().toISOString()
    const draft: LinkedInPost = {
      id: generateId('post'),
      title: data.title || 'Untitled post',
      content: data.content || '',
      image: data.image,
      status: 'DRAFT',
      hashtags: data.hashtags || [],
      meta: data.meta,
      createdAt: now,
      updatedAt: now,
    }
    setPosts((prev) => [draft, ...prev])
    return draft
  }

  function updatePost(id: string, partial: Partial<LinkedInPost>) {
    patch(id, partial)
  }

  async function deletePost(id: string) {
    setPending(id, true)
    try {
      await deletePostRequest()
      setPosts((prev) => prev.filter((p) => p.id !== id))
      showToast('info', 'Post deleted.')
    } finally {
      setPending(id, false)
    }
  }

  function duplicatePost(id: string): LinkedInPost {
    const source = getPost(id)
    if (!source) throw new Error('Post not found')
    const now = new Date().toISOString()
    const copy: LinkedInPost = {
      ...source,
      id: generateId('post'),
      title: `${source.title} (copy)`,
      status: 'DRAFT',
      scheduledAt: undefined,
      publishedAt: undefined,
      analytics: undefined,
      error: undefined,
      createdAt: now,
      updatedAt: now,
    }
    setPosts((prev) => [copy, ...prev])
    showToast('success', 'Post duplicated to drafts.')
    return copy
  }

  async function schedulePost(id: string, isoDate: string, patchData?: Partial<LinkedInPost>) {
    setPending(id, true)
    try {
      const { scheduleJob } = await import('@/services/mockScheduler')
      const result = await scheduleJob(isoDate)
      patch(id, { ...patchData, status: 'SCHEDULED' as PostStatus, scheduledAt: result.scheduledAt })
      showToast('success', 'Post scheduled successfully.')
      addNotification(
        'POST_SCHEDULED',
        'Post scheduled',
        `Scheduled for ${formatDateTime(result.scheduledAt)}.`,
      )
    } catch {
      showToast('error', 'Could not schedule the post. Please try again.')
    } finally {
      setPending(id, false)
    }
  }

  async function reschedulePost(id: string, isoDate: string) {
    await schedulePost(id, isoDate)
  }

  async function cancelScheduledPost(id: string) {
    setPending(id, true)
    try {
      const { cancelJob } = await import('@/services/mockScheduler')
      await cancelJob()
      patch(id, { status: 'CANCELLED' as PostStatus })
      showToast('info', 'Scheduled post cancelled.')
    } finally {
      setPending(id, false)
    }
  }

  async function publishNow(id: string, patchData?: Partial<LinkedInPost>): Promise<{ success: boolean }> {
    const existing = getPost(id)
    if (!existing) return { success: false }
    const post = { ...existing, ...patchData }
    setPending(id, true)
    patch(id, { ...patchData, status: 'PROCESSING' as PostStatus })
    try {
      const result = await mockLinkedIn.publishPost(post)
      if (result.success) {
        patch(id, {
          status: 'PUBLISHED' as PostStatus,
          publishedAt: result.publishedAt,
          error: undefined,
        })
        showToast('success', 'Post published successfully.')
        addNotification('POST_PUBLISHED', 'Post published', `"${post.title}" is now live on LinkedIn.`)
        return { success: true }
      }
      patch(id, { status: 'FAILED' as PostStatus, error: result.error })
      showToast('error', 'Failed to publish post.')
      addNotification('POST_FAILED', 'Post failed to publish', result.error?.message || 'Unknown error.')
      return { success: false }
    } catch {
      patch(id, {
        status: 'FAILED' as PostStatus,
        error: { reason: 'UNKNOWN_ERROR', message: 'An unexpected error occurred.' },
      })
      showToast('error', 'Failed to publish post.')
      return { success: false }
    } finally {
      setPending(id, false)
    }
  }

  async function retryPost(id: string) {
    return publishNow(id)
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        getPost,
        createDraft,
        updatePost,
        deletePost,
        duplicatePost,
        schedulePost,
        cancelScheduledPost,
        reschedulePost,
        publishNow,
        retryPost,
        pendingIds,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePosts must be used within PostsProvider')
  return ctx
}
