import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts'
import { FileText, CalendarClock, CheckCircle2, XCircle, TrendingUp, PenSquare } from 'lucide-react'
import { StatsCard } from '@/components/analytics/StatsCard'
import { ChartCard } from '@/components/analytics/ChartCard'
import { PostCard } from '@/components/posts/PostCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { usePosts } from '@/context/PostsContext'
import { useAnalyticsData } from '@/context/AnalyticsContext'
import { useLinkedIn } from '@/context/LinkedInContext'
import { computeDashboardStats } from '@/data/mockData'
import { formatDate } from '@/utils/format'

const CHART_TICK = { fontSize: 11 }

export default function Dashboard() {
  const { posts } = usePosts()
  const { series } = useAnalyticsData()
  const { account } = useLinkedIn()

  const stats = useMemo(() => computeDashboardStats(posts), [posts])

  const chartData = useMemo(
    () =>
      series.slice(-14).map((p) => ({
        date: p.date.slice(5),
        posts: p.posts,
        likes: p.likes,
        comments: p.comments,
        reposts: p.reposts,
      })),
    [series],
  )

  const recentPosts = useMemo(
    () => [...posts].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 4),
    [posts],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {account.connected ? `Connected as ${account.name}` : 'Connect LinkedIn to start publishing'}
          </p>
        </div>
        <Link to="/create">
          <Button>
            <PenSquare className="h-4 w-4" /> Create post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatsCard label="Total Posts" value={stats.totalPosts} change={stats.totalPostsChange} icon={TrendingUp} />
        <StatsCard label="Scheduled" value={stats.scheduled} change={stats.scheduledChange} icon={CalendarClock} />
        <StatsCard label="Published" value={stats.published} change={stats.publishedChange} icon={CheckCircle2} />
        <StatsCard label="Drafts" value={stats.drafts} change={stats.draftsChange} icon={FileText} />
        <StatsCard label="Failed" value={stats.failed} change={stats.failedChange} icon={XCircle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Posts published" subtitle="Last 14 days">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-ink-100 dark:stroke-ink-800" vertical={false} />
              <XAxis dataKey="date" tick={CHART_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E4E7EC' }} />
              <Line type="monotone" dataKey="posts" stroke="#4A55FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Engagement" subtitle="Likes, comments & reposts \u2014 last 14 days">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-ink-100 dark:stroke-ink-800" vertical={false} />
              <XAxis dataKey="date" tick={CHART_TICK} axisLine={false} tickLine={false} />
              <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E4E7EC' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="likes" fill="#4A55FF" radius={[3, 3, 0, 0]} />
              <Bar dataKey="comments" fill="#14B87F" radius={[3, 3, 0, 0]} />
              <Bar dataKey="reposts" fill="#E39A17" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900 dark:text-white">Recent activity</h2>
          <Link to="/drafts" className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400">
            View all
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <EmptyState title="No posts yet" description="Create your first AI-powered LinkedIn post to see it here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} view="grid" post={post} metaLine={formatDate(post.updatedAt)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
