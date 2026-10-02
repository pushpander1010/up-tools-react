import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import learning from '../data/learning.json'

const TRACK_META = {
  dsa: { color: '#6366f1', href: '/learning/dsa' },
  ai: { color: '#22c55e', href: '/learning/ai' },
}

export default function LearningPage() {
  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.uptools.in/' },
      { '@type': 'ListItem', position: 2, name: 'Learning', item: 'https://www.uptools.in/learning/' },
    ],
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'UpTools Learning Tracks',
    numberOfItems: learning.tracks.length,
    itemListElement: learning.tracks.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `https://www.uptools.in/learning/${t.slug}/`,
    })),
  }

  return (
    <>
      <Helmet>
        <title>Learning — DSA & AI Guides with Animations | UpTools</title>
        <meta name="description" content="Learn DSA and AI on UpTools — algorithms explained with step-by-step animations, practice questions and interview prep tips. Start with Quickselect." />
        <link rel="canonical" href="https://www.uptools.in/learning/" />
        <meta property="og:title" content="Learning — DSA & AI Guides with Animations | UpTools" />
        <meta property="og:description" content="Algorithms explained with animations, practice questions and interview tips. DSA live now, AI track coming soon." />
        <meta property="og:url" content="https://www.uptools.in/learning/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta property="og:image" content="https://www.uptools.in/assets/og/default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Learning — DSA & AI Guides with Animations | UpTools" />
        <meta name="twitter:description" content="Algorithms explained with animations, practice questions and interview tips." />
        <meta name="keywords" content="learn DSA online, algorithms with animation, quickselect explained, AI guides, interview preparation" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbsSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-slate-700">›</span>
        <span className="text-slate-300 font-medium">Learning</span>
      </nav>

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(17,24,39,0.4))' }}>
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 border border-brand/30 text-indigo-300 mb-4">
            <span>🎓</span> UpTools Learning
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight m-0 mb-3">
            Learn by watching, not memorizing
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Every topic is explained with live animations, followed by practice questions
            and interview tips. Pick a track below — more tracks coming soon.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {learning.tracks.map(t => {
          const meta = TRACK_META[t.slug] || { color: '#6366f1', href: `/learning/${t.slug}` }
          return (
            <Link key={t.slug} to={meta.href}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 no-underline hover:border-white/15 hover:bg-white/[0.04] transition-all group">
              <div className="text-4xl mb-3">{t.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white m-0">{t.title}</h2>
                {t.status === 'live'
                  ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30">LIVE</span>
                  : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">SOON</span>}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{t.desc}</p>
              <span className="text-sm font-semibold text-indigo-300 group-hover:gap-3 gap-2 inline-flex items-center transition-all">
                {t.status === 'live' ? 'Start learning →' : 'View roadmap →'}
              </span>
              <div className="h-1 rounded-full mt-4" style={{ background: `${meta.color}33` }}>
                <div className="h-1 rounded-full" style={{ width: t.status === 'live' ? '100%' : '25%', background: meta.color }} />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mt-6">
        <h2 className="text-base font-bold text-white mb-2">How each lesson works</h2>
        <ol className="text-sm text-slate-400 leading-relaxed space-y-1.5 list-decimal pl-5 m-0">
          <li><span className="text-slate-200 font-medium">Watch the animation</span> — see the algorithm move step by step, at your own speed.</li>
          <li><span className="text-slate-200 font-medium">Read the short explanation</span> — what it does, why it works, and its complexity.</li>
          <li><span className="text-slate-200 font-medium">Solve practice questions</span> — hand-picked problems with answers.</li>
          <li><span className="text-slate-200 font-medium">Read interview tips</span> — how to explain it when asked in an interview.</li>
        </ol>
      </div>
    </>
  )
}
