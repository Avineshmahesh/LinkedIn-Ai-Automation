import type { Audience, CTAOption, ContentType, ImageStyle, PostLength, Tone } from '@/types'

export const CONTENT_TYPES: ContentType[] = [
  'Educational',
  'Personal Experience',
  'Tutorial',
  'Career',
  'Opinion',
  'Case Study',
  'Story',
  'Question',
  'Industry Insight',
  'Product Update',
]

export const TONES: Tone[] = [
  'Professional',
  'Casual',
  'Friendly',
  'Technical',
  'Storytelling',
  'Inspirational',
  'Educational',
]

export const AUDIENCES: Audience[] = [
  'Developers',
  'Software Engineers',
  'Recruiters',
  'Founders',
  'Students',
  'Tech Professionals',
  'General Audience',
]

export const POST_LENGTHS: PostLength[] = ['Short', 'Medium', 'Long']

export const CTA_OPTIONS: CTAOption[] = [
  'Ask a Question',
  'Encourage Comments',
  'Visit Website',
  'Follow Me',
  'No CTA',
]

export const IMAGE_STYLES: ImageStyle[] = [
  'Modern',
  'Minimal',
  'Professional',
  '3D',
  'Illustration',
  'Technology',
  'Abstract',
]

export function toOptions(values: string[]) {
  return values.map((v) => ({ label: v, value: v }))
}
