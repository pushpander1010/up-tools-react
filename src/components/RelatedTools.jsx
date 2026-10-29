import { Link } from 'react-router-dom'
import data from '../data/tools.json'
import { GAMES } from '../pages/GamesPage'

const { tools } = data

function normSlug(s) {
  return (s || '').replace(/^\/+|\/+$/g, '')
}

function score(current, candidate) {
  let s = 0
  const curTags = new Set((current?.tags || []).map(t => t.toLowerCase()))
  for (const tag of (candidate?.tags || [])) {
    if (curTags.has(tag.toLowerCase())) s += 4
  }
  const curCats = (current?.cats || []).filter(c => c !== 'all')
  const candCats = (candidate?.cats || []).filter(c => c !== 'all')
  if (curCats.some(c => candCats.includes(c))) s += 5
  const curWords = new Set((current?.title || '').toLowerCase().split(/\W+/).filter(w => w.length >= 4))
  for (const w of (candidate?.title || '').toLowerCase().split(/\W+/)) {
    if (curWords.has(w)) s += 1
  }
  const sec = (x) => {
    const sl = normSlug(x?.slug || '')
    return sl.includes('/') ? sl.split('/')[0] : ''
  }
  if (sec(candidate) && sec(candidate) !== sec(current)) s -= 6
  return s
}

export default function RelatedTools({ currentSlug, category, limit = 8 }) {
  const cleanSlug = normSlug(currentSlug)
  const isGame = cleanSlug.startsWith('games/') || cleanSlug.startsWith('games-')

  if (isGame) {
    const gameShort = cleanSlug.replace(/^games[/-]/, '')
    const curGame = GAMES.find(g => g.slug === gameShort)
    const sameCat = GAMES.filter(g => g.slug !== gameShort && curGame && g.cat === curGame.cat)
    const otherCat = GAMES.filter(g => g.slug !== gameShort && (!curGame || g.cat !== curGame.cat))
    const relatedGames = [...sameCat, ...otherCat].slice(0, limit)

    return (
      <section
        className="glass p-6 sm:p-7 mt-6"
        style={{ containIntrinsicSize: '0 260px', contentVisibility: 'auto' }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-sm shrink-0">
              🕹️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white m-0">
                More Free Browser Games
              </h2>
              <p className="text-xs text-slate-400 m-0 mt-0.5">
                Instant play in your browser — no downloads or sign-up
              </p>
            </div>
          </div>
          <Link
            to="/games/"
            className="text-xs font-semibold text-indigo-300 hover:text-white no-underline transition-colors"
          >
            View all {GAMES.length} games →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {relatedGames.map(g => (
            <Link
              key={g.slug}
              to={`/games/${g.slug}/`}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all no-underline group"
            >
              <span className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                {g.icon}
              </span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {g.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 m-0 mt-0.5 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  const current = tools.find(t => normSlug(t.slug) === cleanSlug || normSlug(t.href) === cleanSlug)

  const scored = tools
    .filter(t => normSlug(t.slug) !== cleanSlug && normSlug(t.href) !== cleanSlug)
    .map(t => ({ t, s: score(current, t) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)

  let related = scored.slice(0, limit).map(x => x.t)

  if (related.length === 0) {
    related = tools
      .filter(t => normSlug(t.slug) !== cleanSlug && t.cats?.includes(category))
      .slice(0, limit)
  }
  if (related.length === 0) {
    related = tools.filter(t => normSlug(t.slug) !== cleanSlug).slice(0, limit)
  }

  return (
    <section
      className="glass p-6 sm:p-7 mt-6"
      style={{ containIntrinsicSize: '0 260px', contentVisibility: 'auto' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm shrink-0">
            🧭
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white m-0">
              Related Tools &amp; Calculators
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Explore similar free utilities on UpTools
            </p>
          </div>
        </div>
        <Link
          to="/all-tools/"
          className="text-xs font-semibold text-indigo-300 hover:text-white no-underline transition-colors"
        >
          Browse all 570+ tools A–Z →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {related.map(t => (
          <Link
            key={t.slug}
            to={t.href || `/${t.slug}/`}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all no-underline group"
          >
            <span className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
              {t.icon}
            </span>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                {t.title}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 m-0 mt-0.5 leading-relaxed">
                {t.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
