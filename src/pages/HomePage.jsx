import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ToolCard from '../components/ToolCard'
import { getSavedSlugs } from '../lib/savedTools'
import InfiniteCarousel from '../components/InfiniteCarousel'
import FAQ from '../components/FAQ'
import { categoryColor } from '../lib/categoryColors'
import data from '../data/tools.json'
import { GAMES } from './GamesPage'

const { tools, categories } = data
const GAME_COUNT = GAMES.length

const QUICK_POPULAR_LINKS = [
  { to: '/income-tax-tool/', label: '₹ Income Tax Calculator' },
  { to: '/gst-calculator/', label: '🧮 GST Calculator' },
  { to: '/emi-calculator/', label: '🏦 EMI Calculator' },
  { to: '/sip-calculator/', label: '📈 SIP Calculator' },
  { to: '/gold-rate-india/', label: '🥇 Gold Rate India' },
  { to: '/indian-stock-market-live/', label: '📊 Live Nifty & Stocks' },
  { to: '/currency-converter/', label: '💱 Currency Converter' },
  { to: '/json-formatter/', label: '{ } JSON Formatter' },
  { to: '/password-generator/', label: '🔑 Password Generator' },
]

const gameChips = [
  { href: '/games/snake/', label: '🐍 Snake' },
  { href: '/games/2048/', label: '🔢 2048' },
  { href: '/games/tetris/', label: '🧱 Tetris' },
  { href: '/games/wordle/', label: '🔤 Wordle' },
  { href: '/games/chess/', label: '♟️ Chess' },
  { href: '/games/pac-man/', label: '👾 Pac-Man' },
  { href: '/games/sudoku/', label: '🔢 Sudoku' },
  { href: '/games/typing-speed/', label: '⌨️ Typing Test' },
  { href: '/games/hangman/', label: '🪢 Hangman' },
  { href: '/games/quiz-trivia/', label: '🧠 Trivia Quiz' },
  { href: '/games/tic-tac-toe/', label: '⭕ Tic-Tac-Toe' },
  { href: '/games/flappy-bird/', label: '🐦 Flappy Bird' },
]

const featuredSlugs = [
  'income-tax-tool',
  'gst-calculator',
  'emi-calculator',
  'sip-calculator',
  'gold-rate-india',
  'indian-stock-market-live',
  'currency-converter',
  'ctc-salary-calculator',
  'ppf-calculator',
  'fd-calculator',
  'json-formatter',
  'password-generator',
  'qr-generator',
  'rawcv-resume-builder',
  'ai-blog-generator',
  'bmi-calculator',
]

const HOME_FAQS = [
  {
    q: 'What is UpTools and are all tools genuinely free?',
    a: 'UpTools (uptools.in) is a privacy-first online platform offering 570+ free calculators, financial & tax estimators, converters, AI writing utilities, developer tools, interactive AI/DSA courses, and 50 browser games. Every tool is 100% free with no sign-up, paywall, or usage cap.',
  },
  {
    q: 'Are the Indian Finance & Tax calculators updated for 2026 rules?',
    a: 'Yes. Our Income Tax Calculator, GST Calculator (0%, 5%, 12%, 18%, 28% CGST/SGST/IGST), CTC to In-Hand Salary Calculator, EMI, SIP, PPF, EPF, and TDS calculators use current Indian slabs, standard deductions, and compounding formulas, alongside live market feeds for Gold Rates, Mutual Fund NAVs, and Nifty 50 stocks.',
  },
  {
    q: 'Is my data private when I use calculators or developer utilities?',
    a: 'Yes. Over 98% of tools on UpTools run entirely inside your web browser using client-side JavaScript and the Web Crypto API. Your salary figures, tax details, JSON payloads, and passwords never leave your device.',
  },
  {
    q: 'Can I use UpTools on mobile phones and tablets without installing an app?',
    a: 'Absolutely. Every calculator, converter, learning simulator, and arcade game is responsive, touch-friendly, and runs directly in mobile Chrome, Safari, Edge, or Firefox with zero downloads.',
  },
]

export default function HomePage() {
  const [search, setSearch] = useState(() => {
    if (typeof window === 'undefined') return ''
    const q = new URLSearchParams(window.location.search).get('q')
    return q ? q.slice(0, 80) : ''
  })
  const [activeCats, setActiveCats] = useState(new Set())
  const [visibleCount, setVisibleCount] = useState(48)
  const [savedSlugs, setSavedSlugs] = useState(() => getSavedSlugs())
  const searchInputRef = useRef(null)
  const resultsRef = useRef(null)
  const allToolsRef = useRef(null)

  useEffect(() => {
    const syncSaved = () => setSavedSlugs(getSavedSlugs())
    window.addEventListener('ut:saved-changed', syncSaved)
    return () => window.removeEventListener('ut:saved-changed', syncSaved)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('focus') === '1') {
      searchInputRef.current?.focus()
    }
  }, [])

  const toggleSaveTool = useCallback((slug) => {
    try {
      const next = getSavedSlugs()
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      localStorage.setItem('uptools-saved-tools', JSON.stringify([...next]))
      setSavedSlugs(new Set(next))
    } catch {}
  }, [])

  const catCounts = useMemo(() => {
    const counts = {}
    for (const t of tools) {
      for (const c of (t.cats || [])) {
        counts[c] = (counts[c] || 0) + 1
      }
    }
    return counts
  }, [])

  const catList = useMemo(() => Object.entries(categories).filter(([k]) => k !== 'all'), [])

  const isFiltering = search.length > 0 || activeCats.size > 0

  useEffect(() => {
    if (search) setVisibleCount(600)
  }, [search])

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const q = search.toLowerCase().trim()
      const words = q ? q.split(/\s+/) : []
      const title = t.title.toLowerCase()
      const desc = (t.desc || '').toLowerCase()
      const tags = (t.tags || []).join(' ').toLowerCase()
      const matchSearch = !q || words.every(w => title.includes(w) || desc.includes(w) || tags.includes(w))
      const matchCat = activeCats.size === 0 || t.cats?.some(c => activeCats.has(c))
      return matchSearch && matchCat
    })
  }, [search, activeCats])

  const featuredTools = useMemo(() => {
    const bySlug = new Map(tools.map(t => [t.slug, t]))
    return featuredSlugs.map(s => bySlug.get(s)).filter(Boolean)
  }, [])

  const savedToolsList = useMemo(
    () => tools.filter(t => savedSlugs.has(t.slug)),
    [savedSlugs]
  )

  const toggleCat = useCallback((cat) => {
    setActiveCats(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
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
        <title>UpTools — 570+ Free Online Calculators, AI Tools, Converters &amp; Games</title>
        <meta
          name="description"
          content="570+ free online calculators (Income Tax, GST, EMI, SIP, Gold Rate), converters, AI writing tools, developer utilities, and 50 browser games. Instant, privacy-first, no sign-up."
        />
        <link rel="canonical" href="https://www.uptools.in/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:title" content="UpTools — 570+ Free Online Calculators, AI Tools, Converters & Games" />
        <meta
          property="og:description"
          content="570+ free online tools: Income Tax, GST, EMI, SIP calculators, live gold & stock rates, AI tools, developer utilities, and 50 browser games."
        />
        <meta property="og:url" content="https://www.uptools.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UpTools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UpTools — 570+ Free Online Tools & 50 Browser Games" />
        <meta name="twitter:description" content="Calculators, converters, AI tools, and browser games. 100% free, no sign-up." />
      </Helmet>

      {/* ─── HERO COMMAND CENTER ─── */}
      <section
        className="glass relative mb-6 overflow-hidden p-6 sm:p-10"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 75, 0.78) 0%, rgba(13, 20, 38, 0.92) 60%, rgba(16, 28, 52, 0.85) 100%)',
        }}
      >
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-35"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.45), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent 70%)' }}
        />

        <div className="relative">
          {/* Top Trust Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{tools.length}+ Free Browser Utilities · {GAME_COUNT} Instant Games · 100% Client-Side</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>🔒 No Sign-Up</span>
              <span>·</span>
              <span>⚡ Instant Results</span>
              <span>·</span>
              <Link to="/all-tools/" className="text-indigo-300 hover:text-white font-semibold no-underline">
                Browse A–Z Index →
              </Link>
            </div>
          </div>

          {/* Main Heading & Value Proposition */}
          <div className="max-w-3xl mb-6">
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold gradient-text leading-[1.15] tracking-tight m-0 mb-3">
              Free Online Calculators, AI Tools, Converters &amp; Browser Games
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed m-0">
              Your fast, privacy-first toolkit for everyday work — calculate <strong className="text-white font-semibold">Income Tax, GST, EMI &amp; SIP</strong>, check <strong className="text-white font-semibold">live Gold &amp; Nifty 50 rates</strong>, format JSON, generate secure passwords, learn <strong className="text-white font-semibold">AI &amp; DSA with animations</strong>, or play {GAME_COUNT} instant games in your browser.
            </p>
          </div>

          {/* Integrated Command Search Bar */}
          <div className="mb-4">
            <div
              className="flex items-center gap-3 rounded-2xl px-4 sm:px-5 py-3.5 transition-all duration-200 focus-within:border-indigo-400/60 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.18),0_12px_32px_rgba(0,0,0,0.35)]"
              style={{
                background: 'rgba(6, 10, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={searchInputRef}
                id="global-tool-search"
                type="search"
                aria-label="Search all free tools and calculators"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Search ${tools.length}+ tools (e.g. income tax, gst, sip, json, qr, resume, gold rate)…`}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm sm:text-base placeholder:text-slate-400"
              />
              {isFiltering ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
                >
                  Clear ✕
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md text-xs font-mono bg-white/[0.06] text-slate-400 border border-white/10">
                  Press /
                </kbd>
              )}
            </div>
          </div>

          {/* Quick Popular Tool Pills (Crawlable Internal Links) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Popular:
            </span>
            {QUICK_POPULAR_LINKS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] hover:bg-indigo-500/20 border border-white/[0.09] hover:border-indigo-400/40 text-slate-200 hover:text-white transition-all whitespace-nowrap no-underline shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4 CORE HUB CARDS (Bento Navigation) ─── */}
      <section aria-label="Explore UpTools Hubs" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {[
          {
            to: '/income-tax-tool/',
            badge: 'FINANCE & TAX SUITE',
            badgeColor: '#10b981',
            icon: '💰',
            title: 'Tax, GST & Live Markets',
            desc: 'Income Tax FY 2026-27, GST, EMI, SIP, Gold Rates & Live Nifty 50.',
          },
          {
            to: '/learning/',
            badge: 'INTERACTIVE ACADEMY',
            badgeColor: '#6366f1',
            icon: '🎓',
            title: 'Learn AI & DSA Visually',
            desc: '18 plain-English guides with live step-by-step interactive animations.',
          },
          {
            to: '/games/',
            badge: `${GAME_COUNT} BROWSER GAMES`,
            badgeColor: '#f59e0b',
            icon: '🕹️',
            title: 'Instant Arcade & Puzzles',
            desc: 'Snake, Tetris, 2048, Wordle, Chess & Sudoku — click and play.',
          },
          {
            to: '/stranger-chat/',
            badge: 'LIVE LOUNGE · 18+',
            badgeColor: '#f43f5e',
            icon: '💬',
            title: 'Anonymous Stranger Chat',
            desc: 'Instant 1-on-1 text & voice rooms with end-to-end privacy.',
          },
        ].map(hub => (
          <Link
            key={hub.to}
            to={hub.to}
            className="glass p-5 no-underline group relative overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div
              className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-80"
              style={{ background: `linear-gradient(90deg, transparent, ${hub.badgeColor}, transparent)` }}
            />
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className="text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    background: `${hub.badgeColor}18`,
                    color: hub.badgeColor,
                    border: `1px solid ${hub.badgeColor}38`,
                  }}
                >
                  {hub.badge}
                </span>
                <span className="text-xl">{hub.icon}</span>
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors m-0 mb-1">
                {hub.title} →
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                {hub.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ─── SAVED TOOLS (if user starred any) ─── */}
      {savedToolsList.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-white m-0 flex items-center gap-2">
              <span className="text-amber-400">★</span> Your Saved Tools
            </h2>
            <span className="text-xs text-slate-400">{savedToolsList.length} bookmarked</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {savedToolsList.map(tool => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                categories={categories}
                savedSet={savedSlugs}
                onToggleSave={toggleSaveTool}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── CATEGORY FILTER PILLS ─── */}
      <section aria-label="Filter tools by category" className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 m-0">
            Filter by Category
          </h2>
          {activeCats.size > 0 && (
            <button
              type="button"
              onClick={() => setActiveCats(new Set())}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer bg-transparent border-none"
            >
              Reset category filter ({activeCats.size})
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCats(new Set())}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeCats.size === 0 ? 'text-white shadow-md bg-indigo-600 border-indigo-500' : 'text-slate-300 hover:text-white border-white/15 bg-white/[0.03]'
            }`}
          >
            <span className="w-2 h-2 rounded-full shrink-0 bg-white" />
            <span>All Tools</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCats.size === 0 ? 'bg-black/25 text-white' : 'bg-white/[0.06] text-slate-400'}`}>
              {tools.length}
            </span>
          </button>
          {catList.map(([key, cat]) => {
            const c = categoryColor(key)
            const active = activeCats.has(key)
            const count = catCounts[key] || 0
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleCat(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  active ? 'text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
                style={
                  active
                    ? { background: c, borderColor: c }
                    : { borderColor: `${c}45`, background: 'rgba(255,255,255,0.03)' }
                }
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: active ? '#fff' : c }} />
                <span>{cat.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-black/25 text-white' : 'bg-white/[0.06] text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ─── SEARCH / FILTER RESULTS ─── */}
      {isFiltering && (
        <section ref={resultsRef} className="scroll-mt-20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-white m-0">
              🔍 Matching Tools
              {search && <span className="text-sm font-normal text-slate-400 ml-2">for &ldquo;{search}&rdquo;</span>}
            </h2>
            <span className="text-xs text-slate-400">{filteredTools.length} tools found</span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredTools.slice(0, 96).map(tool => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  categories={categories}
                  savedSet={savedSlugs}
                  onToggleSave={toggleSaveTool}
                />
              ))}
            </div>
          ) : (
            <div className="glass text-center py-12 px-6">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm text-slate-300 font-semibold mb-1">No tools match &ldquo;{search}&rdquo;</p>
              <p className="text-xs text-slate-400 mb-4">Try a broader keyword like tax, gst, pdf, image, json, or ai.</p>
              <button type="button" onClick={clearFilters} className="glow-btn text-xs px-4 py-2 rounded-xl">
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─── MOST POPULAR & FLAGSHIP TOOLS ─── */}
      {!isFiltering && featuredTools.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">
                ⭐ Most Popular Calculators &amp; Utilities
              </h2>
              <p className="text-xs text-slate-400 m-0 mt-0.5">
                Frequently used finance, tax, developer, and AI tools
              </p>
            </div>
            <Link to="/all-tools/" className="text-xs font-semibold text-indigo-300 hover:text-white no-underline">
              View all {tools.length} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {featuredTools.map(tool => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                categories={categories}
                savedSet={savedSlugs}
                onToggleSave={toggleSaveTool}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── FREE MINI GAMES RAIL ─── */}
      <section className="glass p-5 sm:p-6 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white m-0">
              🎮 Free Instant Browser Games
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Play classic arcade, word, board, and puzzle games with zero downloads
            </p>
          </div>
          <Link to="/games/" className="glow-btn text-xs py-2 px-4 rounded-xl no-underline">
            Play all {GAME_COUNT} games →
          </Link>
        </div>
        <InfiniteCarousel gap={8}>
          {gameChips.map(g => (
            <Link
              key={g.href}
              to={g.href}
              className="flex-none px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-200 hover:border-indigo-500/40 hover:text-white hover:bg-indigo-500/15 transition-all no-underline whitespace-nowrap"
            >
              {g.label}
            </Link>
          ))}
        </InfiniteCarousel>
      </section>

      {/* ─── ALL TOOLS DIRECTORY (Initial 48 + Show More) ─── */}
      <section ref={allToolsRef} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white m-0">
              🧰 All Free Online Tools
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Browse the complete catalog of {tools.length} browser-based utilities
            </p>
          </div>
          <Link to="/all-tools/" className="text-xs font-semibold text-indigo-300 hover:text-white no-underline">
            Alphabetical A–Z Index →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {tools.slice(0, visibleCount).map(tool => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              categories={categories}
              savedSet={savedSlugs}
              onToggleSave={toggleSaveTool}
            />
          ))}
        </div>
        {visibleCount < tools.length && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <button
              type="button"
              onClick={() => setVisibleCount(c => c + 96)}
              className="glow-btn text-sm px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Show More Tools ({tools.length - visibleCount} remaining)
            </button>
            <Link
              to="/all-tools/"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-colors no-underline"
            >
              Open Full A–Z Directory →
            </Link>
          </div>
        )}
      </section>

      {/* ─── SEO TOPICAL OVERVIEW & FAQ ─── */}
      <section className="glass p-6 sm:p-8 mb-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white m-0 mb-3">
          Why Millions Choose UpTools for Daily Calculations &amp; Web Utilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-sm font-bold text-white m-0 mb-1.5">🇮🇳 India &amp; Global Finance Suite</h3>
            <p className="m-0 text-slate-400">
              Compare Old vs New Tax Regimes, split CGST/SGST and IGST accurately, project SIP &amp; PPF wealth, check live 24K/22K Gold Rates across Indian cities, and track Nifty 50 &amp; Sensex movers in real time.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-sm font-bold text-white m-0 mb-1.5">💻 Developer, Security &amp; AI Powerhouse</h3>
            <p className="m-0 text-slate-400">
              Format and validate JSON, test regular expressions, generate Web Crypto passwords &amp; UUIDs, build ATS-ready resumes, generate SEO blog outlines with AI, and explore 70+ ethical cybersecurity &amp; OSINT lab guides.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h3 className="text-sm font-bold text-white m-0 mb-1.5">🔒 100% Privacy-First &amp; Lightning Fast</h3>
            <p className="m-0 text-slate-400">
              No registrations, no email walls, and no server storage of your personal inputs. Calculations happen locally on your phone or laptop so pages load in milliseconds even on mobile networks.
            </p>
          </div>
        </div>
      </section>

      <FAQ questions={HOME_FAQS} title="UpTools Platform" />
    </>
  )
}
