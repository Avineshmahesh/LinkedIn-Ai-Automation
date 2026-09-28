// Mock AI text + image generation service.
//
// Swap surface for a real backend:
//   generatePostContent()  -> POST /api/ai/generate
//   regenerateContent()    -> POST /api/ai/generate  (regenerate=true)
//   reviseContent()        -> POST /api/ai/revise
//   generateHashtags()     -> POST /api/ai/hashtags
//   generateImage()        -> POST /api/ai/image
//
// Every function returns a Promise and simulates realistic latency (and a
// small chance of failure) via `simulate()`, so callers can be written
// exactly as they would be against a real API.

import type {
  AspectRatio,
  GeneratedImage,
  ImageStyle,
  PostGenerationMeta,
} from '@/types'
import { CONTENT_SEEDS } from '@/data/postContent'
import { generateMockImage } from '@/utils/mockImage'
import { generateId } from '@/utils/id'
import { simulate } from './mockCore'

export type ReviseMode = 'improve' | 'shorten' | 'expand' | 'professional' | 'engaging'

function scoreSeed(seed: (typeof CONTENT_SEEDS)[number], meta: PostGenerationMeta): number {
  const topicWords = meta.topic.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const seedText = (seed.topic + ' ' + seed.title).toLowerCase()
  let score = 0
  for (const word of topicWords) {
    if (seedText.includes(word)) score += 2
  }
  if (seed.contentType === meta.contentType) score += 3
  if (seed.tone === meta.tone) score += 1
  return score
}

function pickSeedForTopic(meta: PostGenerationMeta, exclude?: string) {
  const ranked = [...CONTENT_SEEDS]
    .filter((s) => s.title !== exclude)
    .sort((a, b) => scoreSeed(b, meta) - scoreSeed(a, meta))

  // Add a little variety among the top matches instead of always picking #1
  const topSlice = ranked.slice(0, 4)
  return topSlice[Math.floor(Math.random() * topSlice.length)] ?? ranked[0]
}

function adaptTone(body: string, tone: PostGenerationMeta['tone']): string {
  if (tone === 'Casual') {
    return body.replace(/\u2192/g, '\u2013')
  }
  return body
}

function adaptLength(body: string, length: PostGenerationMeta['length']): string {
  const paragraphs = body.split('\n\n')
  if (length === 'Short') {
    return paragraphs.slice(0, Math.max(1, Math.ceil(paragraphs.length * 0.4))).join('\n\n')
  }
  if (length === 'Long') {
    const extra =
      '\n\nIf you\u2019ve run into something similar, I\u2019d genuinely like to hear how you approached it \u2014 there\u2019s rarely one right answer here.'
    return body + extra
  }
  return body
}

function applyCTA(body: string, cta: PostGenerationMeta['cta']): string {
  const lines: Record<PostGenerationMeta['cta'], string | null> = {
    'Ask a Question': 'What\u2019s your take \u2014 agree, or has your experience been different?',
    'Encourage Comments': 'Curious how others have handled this. Drop your take below.',
    'Visit Website': 'More on how we approached this \u2014 link in the comments.',
    'Follow Me': 'Follow along if you want more posts like this one.',
    'No CTA': null,
  }
  const line = lines[cta]
  if (!line) return body
  if (body.includes(line)) return body
  return `${body}\n\n${line}`
}

export async function generatePostContent(
  meta: PostGenerationMeta,
  excludeTitle?: string,
): Promise<{ title: string; content: string; hashtags: string[] }> {
  return simulate(
    () => {
      const seed = pickSeedForTopic(meta, excludeTitle)
      let content = adaptTone(seed.body, meta.tone)
      content = adaptLength(content, meta.length)
      content = applyCTA(content, meta.cta)
      return {
        title: seed.title,
        content,
        hashtags: seed.hashtags.slice(0, 5),
      }
    },
    { minMs: 1400, maxMs: 2600, failRate: 0.06, failMessage: 'AI generation failed. Please try again.' },
  )
}

export async function reviseContent(content: string, mode: ReviseMode): Promise<string> {
  return simulate(
    () => {
      switch (mode) {
        case 'shorten': {
          const sentences = content.split(/(?<=[.!?])\s+/)
          return sentences.slice(0, Math.max(2, Math.ceil(sentences.length * 0.55))).join(' ')
        }
        case 'expand': {
          return `${content}\n\nA bit more context: this is the kind of thing that seems obvious in hindsight but wasn\u2019t at the time \u2014 which is usually why it\u2019s worth writing down.`
        }
        case 'professional': {
          return content
            .replace(/\bkind of\b/gi, 'somewhat')
            .replace(/\breally\b/gi, 'genuinely')
            .replace(/!/g, '.')
        }
        case 'engaging': {
          return `${content}\n\nWould love to hear if others have seen the same thing.`
        }
        case 'improve':
        default: {
          return content.replace(/\s+\n/g, '\n').trim()
        }
      }
    },
    { minMs: 900, maxMs: 1600, failRate: 0.04, failMessage: 'Could not revise the content. Please try again.' },
  )
}

const HASHTAG_POOL: Record<string, string[]> = {
  react: ['ReactJS', 'ReactDevelopment', 'FrontendDevelopment'],
  javascript: ['JavaScript', 'JSDeveloper', 'ECMAScript'],
  typescript: ['TypeScript', 'TypedJavaScript'],
  node: ['NodeJS', 'BackendDevelopment'],
  docker: ['Docker', 'Containers', 'DevOps'],
  git: ['Git', 'VersionControl'],
  mongodb: ['MongoDB', 'NoSQL', 'Database'],
  api: ['RESTAPIs', 'APIDesign', 'WebAPIs'],
  ai: ['AI', 'MachineLearning', 'ArtificialIntelligence'],
  career: ['CareerAdvice', 'TechCareers', 'CareerGrowth'],
  css: ['CSS', 'WebDesign'],
  interview: ['TechInterviews', 'Hiring', 'SoftwareEngineering'],
  default: ['SoftwareEngineering', 'WebDevelopment', 'Programming', 'TechCommunity'],
}

export async function generateHashtags(topic: string, count = 5): Promise<string[]> {
  return simulate(
    () => {
      const key = Object.keys(HASHTAG_POOL).find((k) => topic.toLowerCase().includes(k))
      const pool = [...(key ? HASHTAG_POOL[key] : []), ...HASHTAG_POOL.default]
      const unique = Array.from(new Set(pool))
      return unique.slice(0, count)
    },
    { minMs: 500, maxMs: 1000, failRate: 0.03 },
  )
}

export async function generateImage(
  prompt: string,
  style: ImageStyle,
  aspectRatio: AspectRatio,
): Promise<GeneratedImage> {
  return simulate(
    () => ({
      id: generateId('img'),
      url: generateMockImage(prompt + Date.now(), style, aspectRatio),
      style,
      aspectRatio,
      prompt: prompt || undefined,
    }),
    { minMs: 1600, maxMs: 2800, failRate: 0.05, failMessage: 'Image generation failed. Please try again.' },
  )
}
