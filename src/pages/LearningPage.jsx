import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import learning from '../data/learning.json'

const TRACK_META = {
  dsa: { color: '#6366f1', href: '/learning/dsa' },
  ai: { color: '#22c55e', href: '/learning/ai' },
}

const STEPS = [
  { n: '1', icon: '👀', title: 'Watch it move', desc: 'Live animation shows each step at your speed.' },
  { n: '2', icon: '📖', title: 'Read the idea', desc: 'Short plain-English explanation, zero jargon.' },
  { n: '3', icon: '✏️', title: 'Try questions', desc: 'Hand-picked practice with answers.' },
  { n: '4', icon: '💼', title: 'Nail interviews', desc: 'Tips on explaining it when asked.' },
]

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

  const totalLessons = (learning.ai || []).length + (learning.dsa || []).length

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

      {/* Simple hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎓</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white m-0 mb-2">
          Learn by watching 👀
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          No memorizing. Every topic moves in front of you, then you practice.
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">{learning.tracks.length} tracks</span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">{totalLessons} lessons</span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300">100% free</span>
        </div>
      </div>

      {/* Rich track cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {learning.tracks.map(t => {
          const meta = TRACK_META[t.slug] || { color: '#6366f1', href: `/learning/${t.slug}` }
          const count = t.slug === 'ai' ? (learning.ai || []).length : t.slug === 'dsa' ? (learning.dsa || []).length : 0
          const live = t.status === 'live'
          return (
            <Link key={t.slug} to={meta.href}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 no-underline hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group block relative overflow-hidden"
              onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color + '55'; e.currentTarget.style.boxShadow = `0 16px 48px -12px ${meta.color}44` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-rotate-6 transition-transform"
                  style={{ background: meta.color + '1f' }}>{t.icon}</div>
                {live
                  ? <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-green-500/15 text-green-300 border border-green-500/30 animate-pulse">● LIVE</span>
                  : <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">SOON</span>}
              </div>
              <h2 className="text-xl font-black text-white m-0 mb-1">{t.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">{t.desc}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                <span>📚 {count} lesson{count === 1 ? '' : 's'}</span>
                <span>⏱ ~5 min each</span>
                <span>🌱 Beginner friendly</span>
              </div>
              <span className="inline-block text-sm font-black text-white py-2.5 px-6 rounded-full"
                style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}aa)` }}>
                {live ? 'Start learning →' : 'View roadmap →'}
              </span>
            </Link>
          )
        })}
      </div>

      {/* How it works — 4 simple steps */}
      <h2 className="text-base font-black text-white mt-8 mb-3">How each lesson works ✨</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map(s => (
          <div key={s.n} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="w-11 h-11 mx-auto rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xl font-black text-indigo-300 mb-2">{s.icon}</div>
            <div className="text-sm font-bold text-white">{s.n}. {s.title}</div>
            <div className="text-xs text-slate-400 mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}
