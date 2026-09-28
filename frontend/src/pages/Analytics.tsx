import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Eye, ThumbsUp, MessageCircle, TrendingUp } from 'lucide-react'
import { ChartCard } from '@/components/analytics/ChartCard'
import { StatsCard } from '@/components/analytics/StatsCard'
import { usePosts } from '@/context/PostsContext'
import { useAnalyticsData } from '@/context/AnalyticsContext'
import { formatDate, formatNumber } from '@/utils/format'

const CHART_TICK = { fontSize: 11 }
type SortKey = 'likes' | 'comments' | 'reposts' | 'impressions' | 'engagementRate'

export default function Analytics() {
  const { posts } = usePosts()
  const { series } = useAnalyticsData()
  const [sortKey, setSortKey] = useState<SortKey>('impressions')

  const chartData = useMemo(
    () => series.map((p) => ({ date: p.date.slice(5), posts: p.posts, likes: p.likes, comments: p.comments, reposts: p.reposts, impressions: p.impressions })),
    [series],
  )

  const totals = useMemo(() => {
    return series.reduce(
      (acc, p) => ({
        impressions: acc.impressions + p.impressions,
        likes: acc.likes + p.likes,
        comments: acc.comments + p.comments,
      }),
      { impressions: 0, likes: 0, comments: 0 },
    )
  }, [series])

  const publishedWithAnalytics = useMemo(
    () =>
      posts
        .filter((p) => p.status === 'PUBLISHED' && p.analytics)
        .sort((a, b) => (b.analytics![sortKey] as number) - (a.analytics![sortKey] as number)),
    [posts, sortKey],
  )

  const avgEngagement = publishedWithAnalytics.length
    ? (
        publishedWithAnalytics.reduce((sum, p) => sum + (p.analytics?.engagementRate || 0), 0) /
        publishedWithAnalytics.length
      ).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Last 30 days of publishing performance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Impressions" value={formatNumber(totals.impressions)} icon={Eye} />
        <StatsCard label="Likes" value={formatNumber(totals.likes)} icon={ThumbsUp} />
        <StatsCard label="Comments" value={formatNumber(totals.comments)} icon={MessageCircle} />
        <StatsCard label="Avg. engagement rate" value={`${avgEngagement}%`} icon={TrendingUp} />
      </div>

      <ChartCard title="Posts published" subtitle="Last 30 days">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-ink-100 dark:stroke-ink-800" vertical={false} />
            <XAxis dataKey="date" tick={CHART_TICK} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E4E7EC' }} />
            <Line type="monotone" dataKey="posts" name="Posts" stroke="#4A55FF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Engagement breakdown" subtitle="Likes, comments, reposts \u2014 last 30 days">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-ink-100 dark:stroke-ink-800" vertical={false} />
            <XAxis dataKey="date" tick={CHART_TICK} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E4E7EC' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="likes" name="Likes" fill="#4A55FF" radius={[3, 3, 0, 0]} />
            <Bar dataKey="comments" name="Comments" fill="#14B87F" radius={[3, 3, 0, 0]} />
            <Bar dataKey="reposts" name="Reposts" fill="#E39A17" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Content performance" subtitle="Published posts ranked by selected metric">
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400 dark:border-ink-800">
                <th className="px-5 py-2">Post</th>
                {(['likes', 'comments', 'reposts', 'impressions', 'engagementRate'] as SortKey[]).map((key) => (
                  <th key={key} className="px-3 py-2">
                    <button
                      onClick={() => setSortKey(key)}
                      className={`hover:text-ink-700 dark:hover:text-ink-200 ${sortKey === key ? 'text-accent-600 dark:text-accent-400' : ''}`}
                    >
                      {key === 'engagementRate' ? 'Eng. rate' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {publishedWithAnalytics.map((post) => (
                <tr key={post.id} className="border-b border-ink-50 last:border-0 dark:border-ink-800/60">
                  <td className="max-w-[220px] truncate px-5 py-2.5 font-medium text-ink-800 dark:text-ink-100">
                    {post.title}
                    <span className="block text-xs font-normal text-ink-400">
                      {post.publishedAt ? formatDate(post.publishedAt) : ''}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-600 dark:text-ink-300">{formatNumber(post.analytics!.likes)}</td>
                  <td className="px-3 py-2.5 text-ink-600 dark:text-ink-300">{formatNumber(post.analytics!.comments)}</td>
                  <td className="px-3 py-2.5 text-ink-600 dark:text-ink-300">{formatNumber(post.analytics!.reposts)}</td>
                  <td className="px-3 py-2.5 text-ink-600 dark:text-ink-300">{formatNumber(post.analytics!.impressions)}</td>
                  <td className="px-3 py-2.5 font-medium text-success-600 dark:text-success-500">
                    {post.analytics!.engagementRate}%
                  </td>
                </tr>
              ))}
              {publishedWithAnalytics.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-ink-400">
                    No published posts with analytics yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
