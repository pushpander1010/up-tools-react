import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ToolCard from '../components/ToolCard'
import data from '../data/tools.json'

const { tools, categories } = data

const gameChips = [
  { href: '/games/snake/', label: '🐍 Snake' },
  { href: '/games/2048/', label: '🔢 2048' },
  { href: '/games/tetris/', label: '🧱 Tetris' },
  { href: '/games/pac-man/', label: '👾 Pac-Man' },
  { href: '/games/typing-speed/', label: '⌨️ Typing Test' },
  { href: '/games/hangman/', label: '🪢 Hangman' },
  { href: '/games/quiz-trivia/', label: '🧠 Quiz' },
  { href: '/games/tic-tac-toe/', label: '⭕ Tic-Tac-Toe' },
  { href: '/games/memory-match/', label: '🃏 Memory' },
  { href: '/games/flappy-bird/', label: '🐦 Flappy Bird' },
]

const featured = [
  'timezone-converter', 'salary-converter', 'invoice-calculator',
  'ai-blog-generator', 'ai-linkedin-headline-generator', 'ai-youtube-script',
  'ai-travel-planner', 'rawcv-resume-builder',
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCats, setActiveCats] = useState(new Set())
  const [activeTag, setActiveTag] = useState(null)

  const catList = useMemo(() => Object.entries(categories).filter(([k]) => k !== 'all'), [])

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc?.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCats.size === 0 || t.cats?.some(c => activeCats.has(c))
      const matchTag = !activeTag || t.tags?.includes(activeTag)
      return matchSearch && matchCat && matchTag
    })
  }, [search, activeCats, activeTag])

  const featuredTools = useMemo(() =>
    tools.filter(t => featured.includes(t.slug)),
    []
  )

  const toggleCat = useCallback((cat) => {
    setActiveCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  return (
    <>
      <Helmet>
        <title>UpTools - Free Online Games, Calculators & AI Tools</title>
        <meta name="description" content="Free, privacy-first hub of 300+ tools and 30+ browser games: calculators, converters, AI writers, social tools, and instant mini-games. No sign-ups required." />
      </Helmet>

      {/* Hero */}
      <section className="glass p-7 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.1)' }} />
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <img src="/assets/logo/uptools-logo.svg" alt="UpTools" className="w-14 h-14 rounded-2xl shadow-2xl shadow-brand/30 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text leading-tight m-0">
                  Games & Tools
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">All in one place.</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-5">
              Your hub for <span className="text-white font-medium">free online games</span> and{' '}
              <span className="text-white font-medium">everyday tools</span> — calculators, converters,
              AI helpers and 24+ instant mini-games. No sign-ups, no bloat.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/games" className="glow-btn text-sm inline-flex items-center gap-2 no-underline">🎮 Play Games</Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-slate-300">⚡ Loads fast</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-slate-300">🔒 Privacy-first</span>
            </div>
          </div>
          <div className="flex gap-6 sm:gap-8 pt-2 shrink-0">
            <div className="text-center"><div className="text-3xl font-extrabold gradient-text">300+</div><div className="text-xs text-slate-500 mt-1 font-medium">Tools</div></div>
            <div className="text-center"><div className="text-3xl font-extrabold gradient-text">24+</div><div className="text-xs text-slate-500 mt-1 font-medium">Games</div></div>
            <div className="text-center"><div className="text-3xl font-extrabold gradient-text">0</div><div className="text-xs text-slate-500 mt-1 font-medium">Sign-ups</div></div>
          </div>
        </div>
      </section>

      {/* Games Rail */}
      <section className="glass p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-lg font-bold text-white m-0">🎮 Free Mini Games</h2>
            <p className="text-xs text-slate-500 mt-0.5">Instant browser games — click and play.</p>
          </div>
          <Link to="/games" className="glow-btn text-xs py-1.5 px-4 rounded-xl no-underline">Play all 24+ →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {gameChips.map(g => (
            <Link key={g.href} to={g.href}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-white/4 border border-white/6 text-slate-300 hover:border-brand/40 hover:text-white hover:bg-brand/10 transition-all hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-lg hover:shadow-brand/15 no-underline">
              {g.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-slate-500 text-lg">🔎</span>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search 300+ tools (tax, gst, currency, json)…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500"
          />
          {search && (
            <button onClick={() => setSearch('')} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all cursor-pointer">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
        {catList.map(([key, cat]) => (
          <button key={key}
            onClick={() => toggleCat(key)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all cursor-pointer ${
              activeCats.has(key)
                ? 'bg-brand/15 border-brand/40 text-white'
                : 'border-white/6 text-slate-400 hover:bg-brand/10 hover:border-brand/30 hover:text-white'
            }`}
            style={{ background: activeCats.has(key) ? undefined : 'rgba(255,255,255,0.02)' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featuredTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">🔥 Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {featuredTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} categories={categories} />
            ))}
          </div>
        </section>
      )}

      {/* All Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white m-0">🧰 All Tools</h2>
          <span className="text-xs text-slate-500">{filteredTools.length} tools</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredTools.map(tool => (
            <ToolCard key={tool.slug} tool={tool} categories={categories} />
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="text-center py-16 text-slate-500">No tools match your search.</div>
        )}
      </section>
    </>
  )
}
