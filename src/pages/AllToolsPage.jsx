import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import data from '../data/tools.json'
import { GAMES } from './GamesPage'

const { tools } = data

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function firstLetter(title) {
  const c = (title || '').trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

export default function AllToolsPage() {
  const groups = useMemo(() => {
    const list = [...tools]
      .map(t => ({ ...t, href: t.href || `/${t.slug}/` }))
      .sort((a, b) => a.title.localeCompare(b.title))
    const map = new Map()
    for (const t of list) {
      const k = firstLetter(t.title)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(t)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  const letterLinks = groups.map(([l]) => l)

  return (
    <>
      <Helmet>
        <title>All Tools A-Z - 570+ Free Online Tools | UpTools</title>
        <meta name="description" content="Browse every free UpTools tool A to Z: calculators, converters, image and PDF utilities, AI writing tools, finance, health, developer tools and browser games. No sign-up." />
        <link rel="canonical" href="https://www.uptools.in/all-tools/" />
        <meta property="og:title" content="All Tools A-Z - 570+ Free Online Tools | UpTools" />
        <meta property="og:description" content="Every free UpTools calculator, converter, image/PDF utility, AI tool and game in one alphabetical index." />
        <meta property="og:url" content="https://www.uptools.in/all-tools/" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          All UpTools, A to Z
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mb-6 max-w-3xl">
          Every free tool on UpTools in one alphabetical index — {tools.length} calculators, converters,
          image and PDF utilities, AI writers, finance and health tools, developer utilities and{' '}
          {GAMES.length} browser games. Everything runs in your browser, with no sign-up.
        </p>

        <nav aria-label="Jump to letter" className="flex flex-wrap gap-2 mb-8">
          {LETTERS.filter(l => letterLinks.includes(l)).map(l => (
            <a
              key={l}
              href={`#${l}`}
              className="w-8 h-8 grid place-items-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition"
            >
              {l}
            </a>
          ))}
          {letterLinks.includes('#') && (
            <a href="#num" className="px-2 h-8 grid place-items-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition">
              0-9
            </a>
          )}
        </nav>

        <div className="space-y-8">
          {groups.map(([letter, items]) => (
            <section key={letter} id={letter === '#' ? 'num' : letter} className="scroll-mt-24">
              <h2 className="text-lg font-bold text-white mb-3 border-b border-white/[0.08] pb-2">
                {letter === '#' ? '0-9' : letter}
                <span className="ml-2 text-xs font-normal text-slate-500">{items.length}</span>
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {items.map(t => (
                  <li key={t.slug}>
                    <Link
                      to={t.href}
                      className="text-sm text-slate-300 hover:text-indigo-300 transition no-underline"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-10">
          Looking for something else? <Link to="/" className="text-indigo-300 no-underline hover:underline">Search all tools</Link>{' '}
          · <Link to="/games/" className="text-indigo-300 no-underline hover:underline">Play games</Link>{' '}
          · <Link to="/blogs/" className="text-indigo-300 no-underline hover:underline">Read the blog</Link>
        </p>
      </div>
    </>
  )
}
