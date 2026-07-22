import { useState, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ToolCard from '../components/ToolCard'
import InfiniteCarousel from '../components/InfiniteCarousel'
import data from '../data/tools.json'

const { tools, categories } = data

const gameChips = [
  { href: '/games/snake/', label: '🐍 Snake' }, { href: '/games/2048/', label: '🔢 2048' },
  { href: '/games/tetris/', label: '🧱 Tetris' }, { href: '/games/pac-man/', label: '👾 Pac-Man' },
  { href: '/games/typing-speed/', label: '⌨️ Typing Test' }, { href: '/games/hangman/', label: '🪢 Hangman' },
  { href: '/games/quiz-trivia/', label: '🧠 Quiz' }, { href: '/games/tic-tac-toe/', label: '⭕ Tic-Tac-Toe' },
  { href: '/games/memory-match/', label: '🃏 Memory' }, { href: '/games/flappy-bird/', label: '🐦 Flappy Bird' },
]

const featuredSlugs = [
  'timezone-converter', 'salary-converter', 'invoice-calculator',
  'ai-blog-generator', 'ai-linkedin-headline-generator', 'ai-youtube-script',
  'ai-travel-planner', 'rawcv-resume-builder', 'currency-converter',
  'password-generator', 'json-formatter', 'gst-calculator',
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCats, setActiveCats] = useState(new Set())
  const gridRef = useRef(null)

  const catList = useMemo(() => Object.entries(categories).filter(([k]) => k !== 'all'), [])

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc?.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCats.size === 0 || t.cats?.some(c => activeCats.has(c))
      return matchSearch && matchCat
    })
  }, [search, activeCats])

  const featuredTools = useMemo(() => tools.filter(t => featuredSlugs.includes(t.slug)), [])

  const toggleCat = useCallback((cat) => {
    setActiveCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat); else next.add(cat)
      return next
    })
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    if (e.target.value.length > 0) {
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  return (
    <>
      <Helmet>
        <title>UpTools - Free Online Games, Calculators & AI Tools</title>
        <meta name="description" content="Free, privacy-first hub of 300+ tools and 30+ browser games: calculators, converters, AI writers, social tools, and instant mini-games. No sign-ups required." />
      </Helmet>

      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(17,24,39,0.3))' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)' }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }} />

        <div className="relative flex flex-col sm:flex-row items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-5">
              <img src="/assets/logo/uptools-logo.svg" alt="UpTools" className="w-16 h-16 rounded-2xl shadow-2xl shadow-brand/30" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text leading-tight m-0">Games & Tools</h1>
                <p className="text-slate-400 text-sm mt-1">All in one place.</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">
              Your hub for <span className="text-white font-semibold">free online games</span> and
              <span className="text-white font-semibold"> everyday tools</span> — calculators, converters,
              AI helpers and 24+ instant mini-games. No sign-ups, no bloat.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/games" className="glow-btn text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2">🎮 Play Games</Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">⚡ Loads fast</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">🔒 Privacy-first</span>
            </div>
          </div>
          <div className="flex gap-8 shrink-0">
            {[{ v: '300+', l: 'Tools' }, { v: '24+', l: 'Games' }, { v: '0', l: 'Sign-ups' }].map(s => (
              <div key={s.l} className="text-center"><div className="text-3xl font-extrabold gradient-text">{s.v}</div><div className="text-xs text-slate-500 mt-1 font-medium">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Games Rail */}
      <div className="glass rounded-3xl p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div><h2 className="text-lg font-bold text-white m-0">🎮 Free Mini Games</h2><p className="text-xs text-slate-500 mt-0.5">Instant browser games — click and play.</p></div>
          <Link to="/games" className="glow-btn text-xs py-1.5 px-4 rounded-xl no-underline">Play all 24+ →</Link>
        </div>
        <InfiniteCarousel gap={8}>
          {gameChips.map(g => (
            <a key={g.href} href={g.href}
              className="flex-none px-4 py-2 rounded-full text-xs font-semibold bg-white/4 border border-white/6 text-slate-300 hover:border-brand/40 hover:text-white hover:bg-brand/10 transition-all no-underline whitespace-nowrap">
              {g.label}
            </a>
          ))}
        </InfiniteCarousel>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-slate-500 text-lg">🔎</span>
          <input type="search" value={search} onChange={handleSearch}
            placeholder="Search 300+ tools (tax, gst, currency, json)…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500" />
          {search && (
            <button onClick={() => { setSearch(''); gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/8 text-slate-400 hover:text-white transition-all cursor-pointer">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
        {catList.map(([key, cat]) => (
          <button key={key} onClick={() => toggleCat(key)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeCats.has(key) ? 'bg-brand/15 border-brand/40 text-white' : 'border-white/6 text-slate-400 hover:bg-brand/10 hover:border-brand/30 hover:text-white'
            }`} style={{ background: activeCats.has(key) ? undefined : 'rgba(255,255,255,0.02)' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Featured — Infinite Carousel */}
      {featuredTools.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white m-0">🔥 Featured</h2>
            <span className="text-xs text-slate-500">{featuredTools.length} tools</span>
          </div>
          <InfiniteCarousel gap={12}>
            {featuredTools.map(tool => (
              <div key={tool.slug} className="flex-none w-[280px]">
                <ToolCard tool={tool} categories={categories} />
              </div>
            ))}
          </InfiniteCarousel>
        </div>
      )}

      {/* All Tools Grid */}
      <div ref={gridRef} className="scroll-mt-20">
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
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔍</div>
            <p className="text-sm text-slate-500 font-medium">No tools match your search. Try different keywords.</p>
          </div>
        )}
      </div>
    </>
  )
}
