import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import data from '../data/tools.json'
import { GAMES } from './GamesPage'

const { tools, categories } = data

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function firstLetter(title) {
  const c = (title || '').trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

export default function AllToolsPage() {
  const [query, setQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  const catList = useMemo(() => Object.entries(categories || {}), [])

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter(t => {
      const matchCat = selectedCat === 'all' || (t.cats || []).includes(selectedCat)
      const matchQuery = !q || t.title.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, selectedCat])

  const groups = useMemo(() => {
    const list = [...filteredTools]
      .map(t => ({ ...t, href: t.href || `/${t.slug}/` }))
      .sort((a, b) => a.title.localeCompare(b.title))
    const map = new Map()
    for (const t of list) {
      const k = firstLetter(t.title)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(t)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredTools])

  const letterLinks = groups.map(([l]) => l)

  return (
    <>
      <Helmet>
        <title>All Tools A–Z — {tools.length}+ Free Online Calculators &amp; Utilities | UpTools</title>
        <meta
          name="description"
          content={`Browse all ${tools.length}+ free UpTools calculators, converters, AI writing utilities, finance & tax estimators, developer tools, and ${GAMES.length} browser games in one A to Z index.`}
        />
        <link rel="canonical" href="https://www.uptools.in/all-tools/" />
        <meta property="og:title" content={`All Tools A–Z — ${tools.length}+ Free Online Tools | UpTools`} />
        <meta
          property="og:description"
          content="Every free UpTools calculator, converter, image/PDF utility, AI tool, and browser game in one alphabetical directory."
        />
        <meta property="og:url" content="https://www.uptools.in/all-tools/" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-white transition-colors no-underline text-slate-400">Home</Link>
        <span className="text-slate-600">›</span>
        <span className="text-slate-200 font-medium">All Tools A–Z</span>
      </nav>

      {/* Hero Header */}
      <section className="glass p-6 sm:p-9 mb-6 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)' }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 mb-3">
            <span>🗂️</span> Complete Alphabetical Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight m-0 mb-2.5">
            All UpTools Free Online Tools (A to Z)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed mb-5 m-0">
            Explore every free calculator, converter, tax &amp; finance estimator, developer formatter, AI assistant, cybersecurity lab guide, and browser game on UpTools — {tools.length} tools and {GAMES.length} games, all running directly in your browser with zero sign-up.
          </p>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Filter ${tools.length} tools by name or keyword…`}
                className="w-full bg-navy-950/90 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 outline-none"
              />
            </div>
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              aria-label="Filter by category"
              className="bg-navy-950/90 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400 [color-scheme:dark]"
            >
              {catList.map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* A-Z Jump Bar */}
          <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5">
            {LETTERS.filter(l => letterLinks.includes(l)).map(l => (
              <a
                key={l}
                href={`#${l}`}
                className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-bold text-slate-200 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition no-underline"
              >
                {l}
              </a>
            ))}
            {letterLinks.includes('#') && (
              <a
                href="#num"
                className="px-2.5 h-8 grid place-items-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-bold text-slate-200 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition no-underline"
              >
                0–9
              </a>
            )}
          </nav>
        </div>
      </section>

      {/* Alphabetical Sections */}
      <div className="space-y-6">
        {groups.map(([letter, items]) => (
          <section
            key={letter}
            id={letter === '#' ? 'num' : letter}
            className="glass p-5 sm:p-6 scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-white m-0 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/35 flex items-center justify-center text-sm text-indigo-300">
                  {letter === '#' ? '0–9' : letter}
                </span>
                <span>Tools Starting with {letter === '#' ? '0–9' : letter}</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400">
                {items.length} {items.length === 1 ? 'tool' : 'tools'}
              </span>
            </div>

            <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {items.map(t => (
                <li key={t.slug}>
                  <Link
                    to={t.href}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-indigo-500/30 transition-all no-underline group h-full"
                  >
                    <span className="text-base shrink-0 mt-0.5">{t.icon || '🔧'}</span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                        {t.title}
                      </div>
                      {t.desc && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 m-0 mt-0.5">
                          {t.desc}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
