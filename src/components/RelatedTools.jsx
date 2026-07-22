import { Link } from 'react-router-dom'
import data from '../data/tools.json'

const { tools, categories } = data

export default function RelatedTools({ currentSlug, category, limit = 6 }) {
  const related = tools
    .filter(t => t.slug !== currentSlug && t.cats?.includes(category))
    .slice(0, limit)

  if (related.length === 0) return null

  return (
    <section className="glass p-5 mt-6">
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
