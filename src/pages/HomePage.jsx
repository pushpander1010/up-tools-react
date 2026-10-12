import { useState, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ToolCard from '../components/ToolCard'
import InfiniteCarousel from '../components/InfiniteCarousel'
import data from '../data/tools.json'
import { GAMES } from './GamesPage'

const { tools, categories } = data
const GAME_COUNT = GAMES.length

const gameChips = [
  { href: '/games/snake/', label: '🐍 Snake' }, { href: '/games/2048/', label: '🔢 2048' },
  { href: '/games/tetris/', label: '🧱 Tetris' }, { href: '/games/pac-man/', label: '👾 Pac-Man' },
  { href: '/games/typing-speed/', label: '⌨️ Typing Test' }, { href: '/games/hangman/', label: '🪢 Hangman' },
  { href: '/games/quiz-trivia/', label: '🧠 Quiz' }, { href: '/games/tic-tac-toe/', label: '⭕ Tic-Tac-Toe' },
  { href: '/games/memory-match/', label: '🃏 Memory' }, { href: '/games/flappy-bird/', label: '🐦 Flappy Bird' },
]

const featuredSlugs = [
  'stranger-chat',
  'timezone-converter', 'salary-converter', 'invoice-calculator',
  'ai-blog-generator', 'ai-linkedin-headline-generator', 'ai-youtube-script',
  'ai-travel-planner', 'rawcv-resume-builder', 'currency-converter',
  'password-generator', 'json-formatter', 'gst-calculator',
  'jee-percentile-predictor', 'flames-calculator', 'daily-horoscope',
  'gold-jewellery-price-calculator',
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCats, setActiveCats] = useState(new Set())
  const [visibleCount, setVisibleCount] = useState(48)
  const resultsRef = useRef(null)
  const allToolsRef = useRef(null)

  const catList = useMemo(() => Object.entries(categories).filter(([k]) => k !== 'all'), [])

  const isFiltering = search.length > 0 || activeCats.size > 0

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const q = search.toLowerCase().trim()
      const words = q ? q.split(/\s+/) : []
      const title = t.title.toLowerCase()
      const desc = (t.desc || '').toLowerCase()
      const matchSearch = !q || words.every(w => title.includes(w)) || words.filter(w => desc.includes(w)).length >= words.length
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

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') scrollToResults()
  }

  const clearFilters = () => {
    setSearch('')
    setActiveCats(new Set())
  }

  return (
    <>
      <Helmet>
        <title>UpTools - 500+ Free Online Tools, Calculators, Games & AI Tools</title>
        <meta name="description" content="Free online tools: 500+ calculators, converters, AI writers, dev tools, finance tools, health calculators, and 49 browser games. No sign-up required." />
        <link rel="canonical" href="https://www.uptools.in/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:title" content="UpTools - 500+ Free Online Tools, Calculators, Games & AI Tools" />
        <meta property="og:description" content="500+ free online tools: SIP, EMI, GST, income tax calculators, AI tools, and 49 browser games. No sign-up required." />
        <meta property="og:url" content="https://www.uptools.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UpTools - 500+ Free Online Tools & 49 Games" />
        <meta name="twitter:description" content="Calculators, converters, AI tools and browser games. Free, no sign-up." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "UpTools",
          "url": "https://www.uptools.in/",
          "description": "500+ free online tools, calculators, converters, AI tools and 49 browser games.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.uptools.in/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.06] p-8 sm:p-10"
        style={{ background: '#111c33' }}>
        <div className="relative flex flex-col sm:flex-row items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-5">
              <img src="/assets/logo/uptools-logo.svg" alt="UpTools" className="w-16 h-16 rounded-2xl shadow-2xl shadow-brand/30" width="64" height="64" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text leading-tight m-0">Games & Tools</h1>
                <p className="text-slate-400 text-sm mt-1">All in one place. Free forever.</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">
              Your friendly hub for <span className="text-white font-semibold">free online games</span> and
              <span className="text-white font-semibold"> everyday tools</span> — calculators, converters,
              AI helpers and {GAME_COUNT} instant mini-games. No sign-ups, no bloat. New here? Start with a stranger chat or a quick game below.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/stranger-chat" className="text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2 font-extrabold text-white" style={{ background: '#f43f5e' }}>Meet a stranger</Link>
              <Link to="/games" className="glow-btn text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2">Play Games</Link>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">Loads fast</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/8 text-slate-300">Privacy-first</span>
            </div>
          </div>
          <div className="flex gap-8 shrink-0">
            {[{ v: '500+', l: 'Tools' }, { v: `${GAME_COUNT}`, l: 'Games' }, { v: '0', l: 'Sign-ups' }].map(s => (
              <div key={s.l} className="text-center"><div className="text-3xl font-extrabold gradient-text">{s.v}</div><div className="text-xs text-slate-400 mt-1 font-medium">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Start here — 3 fun doors */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { to: '/stranger-chat', bg: '#f43f5e', tag: 'MOST LOVED · 18+', title: 'Meet a stranger', sub: 'Anonymous chat in 5 seconds' },
          { to: '/games', bg: '#6366f1', tag: `${GAME_COUNT} INSTANT GAMES`, title: 'Play something', sub: 'Snake, 2048, Tetris & more' },
          { to: '/ai-blog-generator/', bg: '#059669', tag: 'AI HELPERS', title: 'Ask the AI tools', sub: 'Writers, planners & ideas' },
        ].map(c => (
          <Link key={c.to} to={c.to} className="rounded-3xl p-5 no-underline block hover:brightness-110 transition-all" style={{ background: c.bg }}>
            <p className="text-[10px] font-black tracking-widest text-white/80 m-0">{c.tag}</p>
            <p className="text-lg font-black text-white m-0 mt-1">{c.title} →</p>
            <p className="text-xs text-white/85 m-0 mt-0.5">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Stranger Chat — warm invite banner */}
      <Link to="/stranger-chat" className="relative mb-6 overflow-hidden rounded-3xl border border-rose-500/25 no-underline block bg-[#1a1020] hover:border-rose-500/50 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0" style={{ background: '#f43f5e' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 12.5h5" /></svg>
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="inline-block text-[11px] font-bold text-rose-200 bg-rose-500/15 border border-rose-500/30 rounded-full px-3 py-1 mb-2">MOST LOVED · 18+ ONLY · NO SIGN-UP</div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white m-0 tracking-tight">Bored? Meet someone new in 5 seconds</h2>
            <p className="text-[13px] text-slate-300 mt-1 mb-4">Anonymous 1-1 chat, group rooms, voice notes and voice calls. End-to-end encrypted, nothing stored.</p>
            <span className="inline-block text-sm px-6 py-2.5 rounded-xl font-extrabold text-white" style={{ background: '#f43f5e' }}>Say hi to a stranger →</span>
          </div>
        </div>
      </Link>

      {/* Games Rail */}
      <div className="glass rounded-3xl p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div><h2 className="text-lg font-bold text-white m-0">Free Mini Games</h2><p className="text-xs text-slate-400 mt-0.5">Instant browser games — click and play.</p></div>
          <Link to="/games" className="glow-btn text-xs py-1.5 px-4 rounded-xl no-underline">Play all {GAME_COUNT} →</Link>
        </div>
        <InfiniteCarousel gap={8}>
          {gameChips.map(g => (
            <a key={g.href} href={g.href}
              className="flex-none px-4 py-2 rounded-full text-xs font-semibold bg-white/4 border border-white/8 text-slate-300 hover:border-brand/40 hover:text-white hover:bg-brand/10 transition-all no-underline whitespace-nowrap">
              {g.label}
            </a>
          ))}
        </InfiniteCarousel>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15),0_4px_20px_rgba(0,0,0,0.2)]"
          style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-slate-400 text-lg">🔎</span>
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Search 500+ tools (tax, gst, currency, json)…"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-400" />
          {isFiltering && (
            <button onClick={clearFilters}
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
              activeCats.has(key) ? 'bg-brand/15 border-brand/40 text-white' : 'border-white/8 text-slate-400 hover:bg-brand/10 hover:border-brand/30 hover:text-white'
            }`} style={{ background: activeCats.has(key) ? undefined : 'rgba(255,255,255,0.02)' }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Featured — Infinite Carousel */}
      {!isFiltering && featuredTools.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white m-0">Featured</h2>
            <span className="text-xs text-slate-400">{featuredTools.length} tools</span>
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

      {/* ─── SEARCH RESULTS (only when filtering) ─── */}
      {isFiltering && (
        <div ref={resultsRef} className="scroll-mt-20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white m-0">
              🔍 Search Results
              {search && <span className="text-sm font-normal text-slate-400 ml-2">"{search}"</span>}
            </h2>
            <span className="text-xs text-slate-400">{filteredTools.length} tools found</span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredTools.slice(0, 96).map(tool => (
                <ToolCard key={tool.slug} tool={tool} categories={categories} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
              <div className="text-4xl mb-3 opacity-20">🔍</div>
              <p className="text-sm text-slate-400 font-medium mb-2">No tools match "{search}"</p>
              <button onClick={clearFilters} className="glow-btn text-xs px-4 py-1.5 rounded-xl">Clear filters</button>
            </div>
          )}
        </div>
      )}

      {/* ─── ALL TOOLS (first 48 + show more — keeps initial DOM small for INP) ─── */}
      <div ref={allToolsRef}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white m-0">🧰 All Tools</h2>
          <span className="text-xs text-slate-400">{tools.length} tools</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tools.slice(0, visibleCount).map(tool => (
            <ToolCard key={tool.slug} tool={tool} categories={categories} />
          ))}
        </div>
        {visibleCount < tools.length && (
          <div className="text-center mt-6">
            <button onClick={() => setVisibleCount(c => c + 96)}
              className="glow-btn text-sm px-6 py-2.5 rounded-xl cursor-pointer">
              Show more tools ({tools.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </>
  )
}
