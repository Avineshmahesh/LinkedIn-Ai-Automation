// Mock posts CRUD service.
//
// Swap surface for a real backend:
//   getPosts()     -> GET /api/posts
//   deletePost()   -> DELETE /api/posts/:id
//   retryPost()    -> POST /api/posts/:id/retry
//
// Persistence in this demo lives in localStorage (see services/storage.ts)
// and is orchestrated by PostsContext; this file only simulates the network
// boundary so callers can await it like a real request.

import type { LinkedInPost } from '@/types'
import { simulate } from './mockCore'
import { publishPost } from './mockLinkedIn'

export async function fetchPosts(seed: LinkedInPost[]): Promise<LinkedInPost[]> {
  return simulate(() => seed, { minMs: 400, maxMs: 900 })
}

export async function deletePostRequest(): Promise<void> {
  return simulate(() => undefined, { minMs: 400, maxMs: 800 })
}

export async function retryPostRequest(post: LinkedInPost) {
  return publishPost(post)
}
