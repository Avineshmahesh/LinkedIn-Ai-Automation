import { Link } from 'react-router-dom'
import {
  Sparkles,
  ImageIcon,
  CalendarClock,
  CalendarDays,
  Eye,
  BarChart3,
  FileText,
  Send,
  ArrowRight,
  Play,
} from 'lucide-react'
import { PostPreview } from '@/components/posts/PostPreview'
import { generateMockImage } from '@/utils/mockImage'

const FEATURES = [
  { icon: Sparkles, title: 'AI Content Generation', description: 'Turn a one-line topic into a polished, on-brand LinkedIn post in seconds.' },
  { icon: ImageIcon, title: 'AI Image Generation', description: 'Pair every post with a visual that matches your topic and tone.' },
  { icon: CalendarClock, title: 'LinkedIn Scheduling', description: 'Queue posts for the exact time your audience is most active.' },
  { icon: CalendarDays, title: 'Content Calendar', description: 'See everything you have scheduled at a glance, by day or by week.' },
  { icon: Eye, title: 'Post Preview', description: 'Preview exactly how your post will render before it goes live.' },
  { icon: BarChart3, title: 'Analytics', description: 'Track likes, comments, reposts and impressions over time.' },
  { icon: FileText, title: 'Draft Management', description: 'Save ideas as drafts and come back to polish them later.' },
  { icon: Send, title: 'Automatic Publishing', description: 'Set it once \u2014 Postform handles the rest at the scheduled time.' },
]

const STEPS = [
  { title: 'Enter your idea', description: 'Start with a topic, a headline, or a rough thought.' },
  { title: 'AI creates content', description: 'Get a full draft matched to your tone and audience.' },
  { title: 'Generate a visual', description: 'Add an AI-generated image that fits the post.' },
  { title: 'Schedule', description: 'Pick the best time for your audience, or publish now.' },
  { title: 'Automatically publish', description: 'Postform posts it to LinkedIn right on schedule.' },
]

const heroImage = generateMockImage('landing-hero', 'Technology', '1:1')

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/80 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-white">
              Postform
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-500 dark:text-ink-400 md:flex">
            <a href="#features" className="hover:text-ink-900 dark:hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-ink-900 dark:hover:text-white">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-lg bg-accent-500 px-4 text-sm font-medium text-white hover:bg-accent-600"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[520px] w-[520px] rounded-full bg-accent-400/20 blur-[120px]"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-xs font-medium text-ink-500 dark:border-ink-700 dark:text-ink-400">
              <Sparkles className="h-3 w-3 text-accent-500" /> AI-powered LinkedIn content
            </span>
            <h1 className="mt-5 text-balance font-display text-4xl font-semibold tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Create. Schedule. Publish.
              <br />
              Automatically.
            </h1>
            <p className="mt-5 max-w-lg text-balance text-lg text-ink-500 dark:text-ink-400">
              Postform uses AI to turn your ideas into polished LinkedIn posts, generate matching visuals,
              and publish them automatically \u2014 right on schedule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-sm font-semibold text-white shadow-soft hover:bg-accent-600"
              >
                Start Creating <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-ink-200 px-6 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
              >
                <Play className="h-4 w-4" /> View Demo
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink-400">
              <div>
                <p className="text-xl font-semibold text-ink-900 dark:text-white">12k+</p>
                <p>posts generated</p>
              </div>
              <div className="h-8 w-px bg-ink-200 dark:bg-ink-700" />
              <div>
                <p className="text-xl font-semibold text-ink-900 dark:text-white">4.8/5</p>
                <p>average rating</p>
              </div>
              <div className="h-8 w-px bg-ink-200 dark:bg-ink-700" />
              <div>
                <p className="text-xl font-semibold text-ink-900 dark:text-white">3 min</p>
                <p>idea to published post</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -left-6 -top-6 hidden w-56 rotate-[-6deg] rounded-xl border border-ink-200 bg-white p-3 shadow-pop dark:border-ink-700 dark:bg-ink-900 sm:block">
              <p className="text-[11px] font-medium text-ink-400">Generating with AI\u2026</p>
              <div className="mt-2 space-y-1.5">
                <div className="h-2 w-full rounded bg-ink-100 dark:bg-ink-800" />
                <div className="h-2 w-4/5 rounded bg-ink-100 dark:bg-ink-800" />
                <div className="h-2 w-3/5 rounded bg-accent-100 dark:bg-accent-500/20" />
              </div>
            </div>
            <PostPreview
              className="relative rotate-[1.5deg]"
              authorName="Avinesh M R"
              authorTitle="Software Developer"
              content={'Spent yesterday afternoon chasing a re-render bug that turned out to be a single inline object prop.\n\nThree things I now check first\u2026'}
              hashtags={['ReactJS', 'JavaScript', 'WebDevelopment']}
              imageUrl={heroImage}
              timestamp="2m"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-ink-100 bg-ink-50 py-20 dark:border-ink-800 dark:bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">
              Everything you need to stay consistent on LinkedIn
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">
              From first idea to published post \u2014 without the daily grind of writing, designing and posting.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500 dark:text-ink-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 dark:text-white">
              How it works
            </h2>
            <p className="mt-3 text-ink-500 dark:text-ink-400">Five steps between an idea and a published post.</p>
          </div>
          <div className="mt-12 space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-white dark:bg-accent-500">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">{step.title}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-100 py-20 dark:border-ink-800">
        <div className="mx-auto max-w-3xl rounded-2xl bg-ink-900 px-8 py-14 text-center dark:bg-ink-900">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Start creating your next LinkedIn post.
          </h2>
          <p className="mt-3 text-ink-300">No credit card required to try it out.</p>
          <Link
            to="/login"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 text-sm font-semibold text-white hover:bg-accent-600"
          >
            Start Creating <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink-100 py-8 text-center text-sm text-ink-400 dark:border-ink-800">
        \u00a9 {new Date().getFullYear()} Postform. All rights reserved.
      </footer>
    </div>
  )
}
