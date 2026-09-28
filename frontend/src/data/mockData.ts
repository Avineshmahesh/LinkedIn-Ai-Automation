import type {
  AISettings,
  AnalyticsPoint,
  AppNotification,
  DashboardStats,
  LinkedInAccount,
  LinkedInPost,
  PostAnalytics,
  PostTemplate,
  User,
} from '@/types'
import { CONTENT_SEEDS } from './postContent'
import { generateMockImage } from '@/utils/mockImage'
import { generateId } from '@/utils/id'

const DAY = 24 * 60 * 60 * 1000

function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY).toISOString()
}

function daysFromNow(n: number, hour = 9, minute = 0): string {
  const d = new Date(Date.now() + n * DAY)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

function mockAnalytics(seed: number): PostAnalytics {
  const impressions = 1200 + ((seed * 733) % 9000)
  const likes = Math.round(impressions * (0.02 + ((seed % 7) / 100)))
  const comments = Math.round(likes * (0.08 + ((seed % 5) / 100)))
  const reposts = Math.round(likes * (0.04 + ((seed % 3) / 100)))
  const engagementRate = Number(
    (((likes + comments + reposts) / impressions) * 100).toFixed(1),
  )
  return { likes, comments, reposts, impressions, engagementRate }
}

export const DEFAULT_USER: User = {
  id: 'user_1',
  name: 'Avinesh M R',
  email: 'avinesh@postform.app',
  title: 'Software Developer',
  timezone: 'Asia/Kolkata',
}

export const DEFAULT_LINKEDIN_ACCOUNT: LinkedInAccount = {
  connected: true,
  name: 'Avinesh M R',
  headline: 'Software Developer · Building on the web',
  connectedAt: daysAgo(48),
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  defaultTone: 'Professional',
  defaultAudience: 'Developers',
  defaultLength: 'Medium',
  defaultImageStyle: 'Modern',
  autoHashtags: true,
  autoImageGeneration: false,
  defaultCTA: 'Encourage Comments',
}

const FAILURE_REASONS: LinkedInPost['error'][] = [
  {
    reason: 'AUTH_ERROR',
    message: 'LinkedIn access token expired. Reconnect your account to continue publishing.',
  },
  {
    reason: 'NETWORK_ERROR',
    message: 'Request to LinkedIn timed out before a response was received. This is usually transient.',
  },
  {
    reason: 'PUBLISHING_ERROR',
    message: 'LinkedIn rejected the post: image exceeds the 8MB size limit for feed media.',
  },
]

function buildPost(
  seedIndex: number,
  status: LinkedInPost['status'],
  dateOffset: number,
  withImage: boolean,
  analyticsSeed?: number,
  errorIndex?: number,
): LinkedInPost {
  const seed = pick(CONTENT_SEEDS, seedIndex)
  const id = generateId('post')
  const created = status === 'SCHEDULED' || dateOffset < 0 || status === 'PUBLISHED'
    ? daysAgo(Math.abs(dateOffset) + 2)
    : daysAgo(Math.abs(dateOffset))

  const image = withImage
    ? {
        id: generateId('img'),
        url: generateMockImage(seed.topic + seedIndex, 'Modern', '1:1'),
        style: 'Modern' as const,
        aspectRatio: '1:1' as const,
      }
    : undefined

  const post: LinkedInPost = {
    id,
    title: seed.title,
    content: seed.body,
    image,
    status,
    hashtags: seed.hashtags.slice(0, 4),
    meta: {
      topic: seed.topic,
      contentType: seed.contentType,
      tone: seed.tone,
      audience: 'Developers',
      length: 'Medium',
      cta: 'Encourage Comments',
    },
    createdAt: created,
    updatedAt: created,
  }

  if (status === 'SCHEDULED') {
    post.scheduledAt = daysFromNow(dateOffset, 9 + (seedIndex % 6), (seedIndex * 15) % 60)
  }
  if (status === 'PUBLISHED') {
    post.publishedAt = daysAgo(dateOffset)
    post.updatedAt = post.publishedAt
    if (analyticsSeed !== undefined) {
      post.analytics = mockAnalytics(analyticsSeed)
    }
  }
  if (status === 'FAILED' && errorIndex !== undefined) {
    post.error = FAILURE_REASONS[errorIndex % FAILURE_REASONS.length]
    post.updatedAt = daysAgo(dateOffset)
  }

  return post
}

export function generateSeedPosts(): LinkedInPost[] {
  const posts: LinkedInPost[] = []

  // 10 drafts
  for (let i = 0; i < 10; i++) {
    posts.push(buildPost(i, 'DRAFT', 1 + i, i % 3 === 0))
  }

  // 10 scheduled (future)
  for (let i = 0; i < 10; i++) {
    posts.push(buildPost(i + 10, 'SCHEDULED', 1 + i, true))
  }

  // 15 published (past, with analytics)
  for (let i = 0; i < 15; i++) {
    posts.push(buildPost(i + 3, 'PUBLISHED', 2 + i * 2, i % 2 === 0, i + 1))
  }

  // 3 failed
  for (let i = 0; i < 3; i++) {
    posts.push(buildPost(i + 7, 'FAILED', 1 + i, true, undefined, i))
  }

  return posts
}

export function generateSeedTemplates(): PostTemplate[] {
  const base: Array<[string, string, string]> = [
    ['Educational Post', 'Break down a concept your audience finds confusing.', CONTENT_SEEDS[0].body],
    ['Career Story', 'Share a personal milestone or lesson from your career path.', CONTENT_SEEDS[13].body],
    ['Technical Tutorial', 'Walk through a fix or workflow step by step.', CONTENT_SEEDS[11].body],
    ['Project Showcase', 'Introduce something you shipped and what it does.', CONTENT_SEEDS[14].body],
    ['Learning Update', 'Share something new you learned recently.', CONTENT_SEEDS[7].body],
    ['Industry Insight', 'Offer a perspective on a trend in your field.', CONTENT_SEEDS[19].body],
    ['Personal Story', 'Tell a story from your day-to-day work life.', CONTENT_SEEDS[10].body],
    ['Question Post', 'Ask your network a genuine, specific question.', CONTENT_SEEDS[9].body],
  ]

  return base.map(([name, description, example], i) => ({
    id: generateId('tmpl'),
    name,
    description,
    example,
    contentType: CONTENT_SEEDS[i * 2].contentType,
    tone: CONTENT_SEEDS[i * 2].tone,
    defaultHashtags: CONTENT_SEEDS[i * 2].hashtags.slice(0, 3),
  }))
}

export function generateSeedNotifications(): AppNotification[] {
  const items: Array<[AppNotification['type'], string, string, number, boolean]> = [
    ['POST_PUBLISHED', 'Post published', '"The React re-render I didn\u2019t expect" is now live on LinkedIn.', 0.2, false],
    ['AI_GENERATION_COMPLETE', 'AI generation complete', 'Your post about Docker for local development is ready to review.', 0.6, false],
    ['POST_SCHEDULED', 'Post scheduled', '"TypeScript generics finally clicked" was scheduled for tomorrow at 9:00 AM.', 1, false],
    ['POST_FAILED', 'Post failed to publish', 'LinkedIn rejected the post \u2014 image exceeds the 8MB size limit.', 1.5, true],
    ['POST_PUBLISHED', 'Post published', '"MongoDB indexing saved our p95" is now live on LinkedIn.', 2, true],
    ['LINKEDIN_DISCONNECTED', 'LinkedIn disconnected', 'Your LinkedIn connection needs to be re-authorized.', 3, true],
    ['AI_GENERATION_COMPLETE', 'AI generation complete', 'Hashtag suggestions for "Node.js memory leak, solved" are ready.', 4, true],
    ['POST_SCHEDULED', 'Post scheduled', '"CSS Grid replaced 200 lines of flexbox" was scheduled for Friday.', 5, true],
    ['POST_PUBLISHED', 'Post published', '"From bootcamp to senior" is now live on LinkedIn.', 6, true],
    ['POST_FAILED', 'Post failed to publish', 'LinkedIn access token expired. Reconnect your account.', 7, true],
  ]

  return items.map(([type, title, message, daysBack, read]) => ({
    id: generateId('notif'),
    type,
    title,
    message,
    createdAt: daysAgo(daysBack),
    read,
  }))
}

export function generateAnalyticsSeries(days = 30): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * DAY)
    const weekday = date.getDay()
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.5 : 1
    const wave = Math.sin(i / 4) * 0.5 + 1
    const posts = Math.round((Math.random() * 1.4 + 0.3) * weekendFactor)
    const impressions = Math.round((900 + Math.random() * 2600) * wave * weekendFactor)
    const likes = Math.round(impressions * (0.025 + Math.random() * 0.02))
    const comments = Math.round(likes * (0.1 + Math.random() * 0.08))
    const reposts = Math.round(likes * (0.05 + Math.random() * 0.05))

    points.push({
      date: date.toISOString().slice(0, 10),
      posts,
      likes,
      comments,
      reposts,
      impressions,
    })
  }
  return points
}

export function computeDashboardStats(posts: LinkedInPost[]): DashboardStats {
  const drafts = posts.filter((p) => p.status === 'DRAFT').length
  const scheduled = posts.filter((p) => p.status === 'SCHEDULED').length
  const published = posts.filter((p) => p.status === 'PUBLISHED').length
  const failed = posts.filter((p) => p.status === 'FAILED').length

  return {
    totalPosts: posts.length,
    totalPostsChange: 18,
    scheduled,
    scheduledChange: 9,
    published,
    publishedChange: 24,
    drafts,
    draftsChange: -6,
    failed,
    failedChange: -12,
  }
}
