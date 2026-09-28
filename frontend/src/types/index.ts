// ---------------------------------------------------------------------------
// Core domain types for Postform.
// These are intentionally shaped to map 1:1 onto a future backend schema so
// that mock services can be swapped for real API calls without changes to
// the components or pages that consume them.
// ---------------------------------------------------------------------------

export type PostStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'CANCELLED'

export type ContentType =
  | 'Educational'
  | 'Personal Experience'
  | 'Tutorial'
  | 'Career'
  | 'Opinion'
  | 'Case Study'
  | 'Story'
  | 'Question'
  | 'Industry Insight'
  | 'Product Update'

export type Tone =
  | 'Professional'
  | 'Casual'
  | 'Friendly'
  | 'Technical'
  | 'Storytelling'
  | 'Inspirational'
  | 'Educational'

export type Audience =
  | 'Developers'
  | 'Software Engineers'
  | 'Recruiters'
  | 'Founders'
  | 'Students'
  | 'Tech Professionals'
  | 'General Audience'

export type PostLength = 'Short' | 'Medium' | 'Long'

export type CTAOption =
  | 'Ask a Question'
  | 'Encourage Comments'
  | 'Visit Website'
  | 'Follow Me'
  | 'No CTA'

export type ImageStyle =
  | 'Modern'
  | 'Minimal'
  | 'Professional'
  | '3D'
  | 'Illustration'
  | 'Technology'
  | 'Abstract'

export type AspectRatio = '1:1' | '4:5' | '16:9'

export type FailureReason =
  | 'AUTH_ERROR'
  | 'NETWORK_ERROR'
  | 'PUBLISHING_ERROR'
  | 'UNKNOWN_ERROR'

export interface PostAnalytics {
  likes: number
  comments: number
  reposts: number
  impressions: number
  engagementRate: number
}

export interface GeneratedImage {
  id: string
  url: string
  style: ImageStyle
  aspectRatio: AspectRatio
  prompt?: string
}

export interface PostGenerationMeta {
  topic: string
  contentType: ContentType
  tone: Tone
  audience: Audience
  length: PostLength
  cta: CTAOption
}

export interface LinkedInPost {
  id: string
  title: string
  content: string
  image?: GeneratedImage
  status: PostStatus
  hashtags: string[]
  meta?: PostGenerationMeta
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  error?: {
    reason: FailureReason
    message: string
  }
  analytics?: PostAnalytics
}

export interface User {
  id: string
  name: string
  email: string
  title: string
  avatarUrl?: string
  timezone: string
}

export interface LinkedInAccount {
  connected: boolean
  name?: string
  headline?: string
  avatarUrl?: string
  connectedAt?: string
}

export interface AISettings {
  defaultTone: Tone
  defaultAudience: Audience
  defaultLength: PostLength
  defaultImageStyle: ImageStyle
  autoHashtags: boolean
  autoImageGeneration: boolean
  defaultCTA: CTAOption
}

export interface PostTemplate {
  id: string
  name: string
  description: string
  example: string
  contentType: ContentType
  tone: Tone
  defaultHashtags: string[]
  isCustom?: boolean
}

export type NotificationType =
  | 'POST_PUBLISHED'
  | 'POST_FAILED'
  | 'POST_SCHEDULED'
  | 'AI_GENERATION_COMPLETE'
  | 'LINKEDIN_DISCONNECTED'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
}

export interface DashboardStats {
  totalPosts: number
  totalPostsChange: number
  scheduled: number
  scheduledChange: number
  published: number
  publishedChange: number
  drafts: number
  draftsChange: number
  failed: number
  failedChange: number
}

export interface AnalyticsPoint {
  date: string
  posts: number
  likes: number
  comments: number
  reposts: number
  impressions: number
}

export type ThemeMode = 'light' | 'dark'

export interface ToastMessage {
  id: string
  variant: 'success' | 'error' | 'info'
  message: string
}
