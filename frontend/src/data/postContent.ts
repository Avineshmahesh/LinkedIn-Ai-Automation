import type { ContentType, Tone } from '@/types'

export interface ContentSeed {
  title: string
  topic: string
  contentType: ContentType
  tone: Tone
  body: string
  hashtags: string[]
}

// A bank of realistic, developer-focused LinkedIn post drafts used to seed
// the demo. Each entry stands in for what the AI generation service would
// return for a given topic/tone/content-type combination.
export const CONTENT_SEEDS: ContentSeed[] = [
  {
    title: 'The React re-render I didn\u2019t expect',
    topic: 'React performance optimization',
    contentType: 'Educational',
    tone: 'Technical',
    body: `Spent yesterday afternoon chasing a re-render bug that turned out to be a single inline object prop.

Every time the parent re-rendered, it passed a brand-new { } to a memoized child \u2014 so React.memo() never had a chance to bail out.

The fix was almost embarrassingly small: hoist the object out of the render, or wrap it in useMemo.

Three things I now check first when a "memoized" component still re-renders on every keystroke:
\u2192 Are props being recreated on every render (objects, arrays, inline functions)?
\u2192 Is context value changing identity even when the data hasn't changed?
\u2192 Is a parent's state update broader than it needs to be?

Performance work in React is rarely about big algorithms. It's usually about identity.`,
    hashtags: ['ReactJS', 'JavaScript', 'WebDevelopment', 'FrontendDevelopment', 'PerformanceTuning'],
  },
  {
    title: 'What junior devs get wrong about Git',
    topic: 'Git workflow for teams',
    contentType: 'Career',
    tone: 'Friendly',
    body: `The Git mistake I see most often from newer engineers isn't a bad command \u2014 it's working on main for three days before opening a PR.

By the time you push, the diff is 40 files and nobody can review it properly.

What's worked well for my teams:
\u2192 Branch per task, not per feature
\u2192 Commit early, commit often, rewrite history before you push if it's messy
\u2192 Open the PR as a draft on day one so teammates can see direction early

Small, frequent PRs aren't a process obsession. They're what makes code review actually useful instead of a formality.`,
    hashtags: ['Git', 'SoftwareEngineering', 'CodeReview', 'DeveloperTips'],
  },
  {
    title: 'Docker for local dev, six months in',
    topic: 'Docker for local development',
    contentType: 'Case Study',
    tone: 'Professional',
    body: `Six months ago we moved our local dev environment into Docker Compose. Here's the honest scorecard.

What improved:
\u2022 New hires are productive on day one, not day three
\u2022 "Works on my machine" bugs dropped to almost zero
\u2022 Our staging config finally matches local

What got harder:
\u2022 Hot reload needed real tuning to stay fast
\u2022 Debugging inside containers has a learning curve
\u2022 M1/M2 vs Intel image differences bit us twice

Net positive, but I wouldn't sell it as free. Budget a real sprint to get the developer experience right before you roll it out to the whole team.`,
    hashtags: ['Docker', 'DevOps', 'SoftwareEngineering', 'DeveloperExperience'],
  },
  {
    title: 'REST endpoints I regret naming',
    topic: 'REST API design',
    contentType: 'Opinion',
    tone: 'Casual',
    body: `Looking back at an API I designed three years ago and wincing at some of these endpoint names.

/getUserData \u2190 verbs in the URL, redundant "get"
/user_info \u2190 inconsistent casing with the rest of the API
/updateUserProfileInfo \u2190 just... a lot

What I'd do differently now:
\u2192 Nouns, not verbs: GET /users/:id
\u2192 Consistent casing across every resource
\u2192 Let HTTP methods carry the verb, not the path

API design is one of those skills where the cost of a bad decision doesn't show up for a year \u2014 right when fixing it means a breaking change for every consumer.`,
    hashtags: ['RESTAPIs', 'BackendDevelopment', 'APIDesign', 'SoftwareEngineering'],
  },
  {
    title: 'MongoDB indexing saved our p95',
    topic: 'MongoDB performance',
    contentType: 'Tutorial',
    tone: 'Technical',
    body: `Our p95 API latency was sitting at 1.8s on a query that should have taken milliseconds. The culprit: a collection scan on 2M+ documents with zero indexes on the filter fields.

Quick walkthrough of the fix:
1. Ran .explain("executionStats") to confirm COLLSCAN was happening
2. Added a compound index matching the actual query shape (filter fields first, sort field last)
3. Verified with explain() again \u2014 IXSCAN, and examined docs dropped by 99%
4. p95 latency: 1.8s \u2192 40ms

The lesson that keeps repeating in my career: measure before you optimize, and check your database's query plan before you touch application code.`,
    hashtags: ['MongoDB', 'Database', 'BackendDevelopment', 'PerformanceTuning'],
  },
  {
    title: 'Why I stopped using useEffect for this',
    topic: 'React performance optimization',
    contentType: 'Opinion',
    tone: 'Technical',
    body: `Used to reach for useEffect any time I needed to "sync" one piece of state from another. Turns out most of those were unnecessary re-renders in disguise.

If you can compute a value during render, do that instead of storing it in state and syncing it with an effect. Derived state doesn't need an effect \u2014 it needs a variable.

useEffect earns its keep for actual side effects: subscriptions, DOM APIs, fetching. Not for keeping two pieces of state in agreement with each other.

Small mental model shift, meaningfully fewer bugs.`,
    hashtags: ['ReactJS', 'JavaScript', 'WebDevelopment', 'FrontendDevelopment'],
  },
  {
    title: 'The interview question I ask every candidate',
    topic: 'Technical interviewing',
    contentType: 'Career',
    tone: 'Storytelling',
    body: `There's one question I ask in almost every interview I run, regardless of the role:

"Tell me about a time you were wrong about a technical decision, and how you found out."

I'm not looking for a specific answer. I'm looking for whether someone can talk about being wrong without getting defensive \u2014 and whether they changed anything afterward.

The engineers who grow fastest aren't the ones who are right the most. They're the ones who update quickly when they're not.`,
    hashtags: ['CareerAdvice', 'TechInterviews', 'SoftwareEngineering', 'Hiring'],
  },
  {
    title: 'TypeScript generics finally clicked',
    topic: 'TypeScript generics',
    contentType: 'Educational',
    tone: 'Educational',
    body: `Generics didn't click for me until I stopped thinking of <T> as "any type" and started thinking of it as "a placeholder that keeps a relationship."

function firstItem<T>(list: T[]): T {
  return list[0]
}

The useful part isn't that this works with any array \u2014 it's that TypeScript now knows the return type matches whatever went in. string[] in, string out. No casting, no any.

Once I started reading generics as "preserve this relationship" instead of "accept anything," a lot of library type signatures stopped looking like alphabet soup.`,
    hashtags: ['TypeScript', 'JavaScript', 'WebDevelopment', 'Programming'],
  },
  {
    title: 'Shipping our first AI feature: what broke',
    topic: 'AI in production',
    contentType: 'Case Study',
    tone: 'Professional',
    body: `We shipped our first LLM-powered feature last quarter. Here's what actually broke in production \u2014 not the demo-day version.

1. Latency variance. P50 was fine, P99 was brutal. Streaming responses fixed the perceived wait more than any prompt change did.
2. Cost surprised finance, not engineering. We hadn't modeled retry storms during an upstream outage.
3. "Good enough" outputs are a moving target. What looked great in week one felt stale by week four \u2014 users calibrate fast.

None of this is a reason not to ship AI features. It's a reason to instrument them like any other critical path from day one.`,
    hashtags: ['AI', 'SoftwareEngineering', 'ProductDevelopment', 'MachineLearning'],
  },
  {
    title: 'A question for backend engineers',
    topic: 'API versioning strategy',
    contentType: 'Question',
    tone: 'Casual',
    body: `Genuine question for anyone who's maintained a public API for 3+ years:

How are you handling versioning? URL path (/v2/...), headers, or something else?

We're about to make this decision and every option has trade-offs. URL versioning is simple but leads to duplicated routes. Header versioning is cleaner but harder to test in a browser and easy for consumers to miss.

What's worked for your team, and what would you avoid doing again?`,
    hashtags: ['RESTAPIs', 'BackendDevelopment', 'SoftwareEngineering'],
  },
  {
    title: 'Two years into remote-first engineering',
    topic: 'Remote engineering culture',
    contentType: 'Personal Experience',
    tone: 'Storytelling',
    body: `Two years ago I joined a fully remote engineering team after seven years of in-office work. A few honest observations from the other side.

Async written communication is a skill, not a default. It took months to stop writing Slack messages like a chat and start writing them like documentation someone will read in six months.

Meetings got better, not worse, once we treated "could be an async doc" as the default question before scheduling anything.

The thing I miss least: hallway interruptions. The thing I miss most: the five minutes after standup where half the good ideas actually happened.`,
    hashtags: ['RemoteWork', 'SoftwareEngineering', 'EngineeringCulture', 'CareerAdvice'],
  },
  {
    title: 'Node.js memory leak, solved',
    topic: 'Node.js debugging',
    contentType: 'Tutorial',
    tone: 'Technical',
    body: `Our Node service was getting OOM-killed every 6 hours in production. Here's how we tracked it down.

1. Took heap snapshots at t=0 and t=4h using --inspect and Chrome DevTools
2. Diffed the snapshots \u2014 found thousands of retained EventEmitter listeners
3. Traced it to a websocket handler that added a listener on every reconnect and never removed the old one
4. Fixed with a single .removeAllListeners() before re-subscribing

Memory leaks in Node are almost always something being referenced longer than it should be. Heap snapshots turn "it's slow and I don't know why" into an actual, traceable diff.`,
    hashtags: ['NodeJS', 'JavaScript', 'BackendDevelopment', 'Debugging'],
  },
  {
    title: 'The best refactor is the one you don\u2019t do',
    topic: 'Software Engineering',
    contentType: 'Opinion',
    tone: 'Professional',
    body: `Pushed back on a "let's refactor this module" proposal this week, and I want to explain why \u2014 because it wasn't laziness.

The module in question works, is covered by tests, and nobody has touched it in eight months. The proposed refactor was about elegance, not about a bug or a blocked feature.

Not every improvement is worth the risk of touching stable code. I'd rather spend that engineering time on the parts of the codebase that are actually slowing the team down today.

Refactoring is a tool for solving a problem, not a default activity.`,
    hashtags: ['SoftwareEngineering', 'CodeQuality', 'EngineeringLeadership'],
  },
  {
    title: 'From bootcamp to senior: what actually mattered',
    topic: 'Career growth in tech',
    contentType: 'Story',
    tone: 'Inspirational',
    body: `Five years ago I finished a coding bootcamp with a portfolio of to-do apps and a lot of imposter syndrome. Today I lead a team of six engineers.

What actually moved the needle, roughly in order:
\u2192 Reading other people's code more than writing my own for the first year
\u2192 Asking "why" about decisions in the existing codebase before proposing changes
\u2192 Writing things down \u2014 design docs, postmortems, decision records \u2014 long before anyone asked me to
\u2192 Getting comfortable being the least experienced person in a room, repeatedly

None of this was about learning a new framework faster than everyone else. It was about becoming someone whose judgment other engineers trusted.`,
    hashtags: ['CareerAdvice', 'SoftwareEngineering', 'TechCareers', 'Bootcamp'],
  },
  {
    title: 'Our new onboarding flow, in numbers',
    topic: 'Product Update',
    contentType: 'Product Update',
    tone: 'Professional',
    body: `We rebuilt our product's onboarding flow this quarter and wanted to share the results, warts and all.

Before: 9 steps, 34% completion rate, average time-to-value of 12 minutes.
After: 4 steps, 61% completion rate, average time-to-value of 3 minutes.

The biggest lever wasn't visual design \u2014 it was deleting steps entirely. We moved two "required" fields to optional and made a third one inferable from data we already had.

Sometimes the highest-leverage engineering work is subtraction.`,
    hashtags: ['ProductDevelopment', 'UX', 'Onboarding', 'SoftwareEngineering'],
  },
  {
    title: 'Async/await still surprises people',
    topic: 'JavaScript async patterns',
    contentType: 'Educational',
    tone: 'Educational',
    body: `Still see this pattern in code review fairly often:

items.forEach(async (item) => {
  await processItem(item)
})

forEach doesn't wait for the async callbacks \u2014 it fires them all and moves on immediately. If you need the items processed in order, use a for...of loop. If order doesn't matter but you want them all to finish, use Promise.all with map.

Small syntax, easy to miss, and it's caused more production bugs on my teams than almost any other JS gotcha.`,
    hashtags: ['JavaScript', 'WebDevelopment', 'Programming', 'DeveloperTips'],
  },
  {
    title: 'What I look for in a system design answer',
    topic: 'System design interviews',
    contentType: 'Career',
    tone: 'Professional',
    body: `Interviewed candidates for a senior backend role this week. A pattern in what separates strong system design answers from average ones:

Average answers jump straight to architecture \u2014 "we'll use Kafka and Redis and shard the database."

Strong answers start with numbers: how many users, what's the read/write ratio, what's an acceptable latency, what happens if this component goes down.

The architecture almost always follows naturally once the constraints are clear. Technology choices made before constraints are usually just what the candidate used at their last job.`,
    hashtags: ['SystemDesign', 'TechInterviews', 'SoftwareEngineering', 'BackendDevelopment'],
  },
  {
    title: 'CSS Grid replaced 200 lines of flexbox',
    topic: 'Web Development',
    contentType: 'Tutorial',
    tone: 'Technical',
    body: `Rebuilt our dashboard layout with CSS Grid this week and deleted about 200 lines of nested flexbox and magic-number margins.

The part that made the difference: grid-template-areas. Naming regions of the layout ("sidebar", "header", "main") made the CSS read like a floor plan instead of a sequence of flex-direction flips.

.dashboard {
  display: grid;
  grid-template-areas: "sidebar header" "sidebar main";
  grid-template-columns: 240px 1fr;
}

Flexbox is still the right tool for one-dimensional layouts. But for anything with real rows and columns, Grid has been a genuine quality-of-life upgrade.`,
    hashtags: ['CSS', 'WebDevelopment', 'FrontendDevelopment', 'DeveloperTips'],
  },
  {
    title: 'Postmortem: the deploy that took down checkout',
    topic: 'Incident response',
    contentType: 'Case Study',
    tone: 'Professional',
    body: `Sharing a lightly-redacted version of a postmortem from a checkout outage we had last month, because I found these useful early in my career and don't see enough of them publicly.

What happened: a config change meant for staging shipped to production via a shared deploy pipeline. Checkout was degraded for 17 minutes.

Root cause: environment-specific config lived in the same repo as application code with no automated check that staging values couldn't reach prod.

What we changed: environment configs now require a second approval from someone outside the authoring team, and we added a CI check that fails the build if staging-only flags are detected in a prod deploy.

Blameless postmortems only work if the fix targets the system, not the person who clicked deploy.`,
    hashtags: ['SoftwareEngineering', 'DevOps', 'Incident Response', 'EngineeringCulture'],
  },
  {
    title: 'Why our team writes design docs before code',
    topic: 'Engineering process',
    contentType: 'Industry Insight',
    tone: 'Professional',
    body: `We made design docs mandatory for anything touching more than two services, six months ago. Adoption was slow at first \u2014 nobody loves writing prose before code.

What changed our minds on enforcing it: the docs aren't really for the author. They're for the three engineers who'll ask "wait, why did we do it this way?" eight months from now, and for the reviewer who catches a flawed assumption before it's 2,000 lines of code.

The format doesn't need to be fancy. Problem, constraints, options considered, decision, and what we're explicitly not solving for. Twenty minutes of writing has saved us from at least two expensive rewrites this year alone.`,
    hashtags: ['SoftwareEngineering', 'EngineeringCulture', 'TechnicalWriting', 'ProductDevelopment'],
  },
]

export const TOPIC_POOL: string[] = [
  'React performance optimization',
  'JavaScript closures explained',
  'TypeScript utility types',
  'Node.js event loop',
  'MongoDB aggregation pipelines',
  'REST vs GraphQL',
  'Docker multi-stage builds',
  'Git branching strategies',
  'AI code review tools',
  'Software engineering career growth',
  'Remote pair programming',
  'Web accessibility basics',
  'CSS container queries',
  'CI/CD pipeline design',
  'Technical debt management',
]
