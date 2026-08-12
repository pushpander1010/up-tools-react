import { Link } from 'react-router-dom'
import data from '../data/tools.json'

const { tools } = data

// Rank candidate tools by relevance to the current tool:
//   +4 per shared tag, +2 if same category, +1 per shared title word (len>=4)
// This surfaces genuinely related tools (better internal links for SEO + UX)
// instead of arbitrary same-category neighbors.
function score(current, candidate) {
  let s = 0
  const curTags = new Set((current?.tags || []).map(t => t.toLowerCase()))
  for (const tag of (candidate?.tags || [])) {
    if (curTags.has(tag.toLowerCase())) s += 4
  }
  if (current?.cats?.some(c => candidate?.cats?.includes(c))) s += 2
  const curWords = new Set((current?.title || '').toLowerCase().split(/\W+/).filter(w => w.length >= 4))
  for (const w of (candidate?.title || '').toLowerCase().split(/\W+/)) {
    if (curWords.has(w)) s += 1
  }
  return s
}

export default function RelatedTools({ currentSlug, category, limit = 8 }) {
  const current = tools.find(t => t.slug === currentSlug)

  const scored = tools
    .filter(t => t.slug !== currentSlug)
    .map(t => ({ t, s: score(current, t) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)

  let related = scored.slice(0, limit).map(x => x.t)

  // Fallback: if nothing scored (rare), use same-category tools in catalog order.
  if (related.length === 0) {
    related = tools.filter(t => t.slug !== currentSlug && t.cats?.includes(category)).slice(0, limit)
  }

  if (related.length === 0) return null

  return (
    <section className="glass p-5 mt-6" style={{ contentVisibility: "auto", containIntrinsicSize: "0 200px" }}>
      <h3 className="text-sm font-semibold text-white mb-3">Related Tools</h3>
      <div className="flex flex-wrap gap-2">
        {related.map(t => (
          <Link key={t.slug} to={t.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/4 border border-white/8 text-slate-400 hover:text-white hover:border-brand/40 transition-all no-underline">
            {t.icon} {t.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
