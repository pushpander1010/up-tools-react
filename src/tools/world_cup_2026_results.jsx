import ToolLayout from '../components/ToolLayout'
import { Link } from 'react-router-dom'

export default function world_cup_2026_results() {
  const relatedTools = [
    { label: 'Discipline Table', href: '/fifa-world-cup-discipline/', icon: '📋' },
    { label: 'Golden Boot', href: '/fifa-world-cup-golden-boot/', icon: '⚽' },
    { label: 'Red Cards', href: '/fifa-world-cup-red-cards/', icon: '🟥' },
    { label: 'Fair Play', href: '/fifa-world-cup-fair-play/', icon: '🤝' },
    { label: 'Schedule', href: '/fifa-world-cup-schedule/', icon: '📅' },
    { label: 'Venues', href: '/fifa-world-cup-venues/', icon: '🏟️' },
  ]

  const faqs = [
    { q: 'Who won the 2026 World Cup?', a: 'Spain won the 2026 World Cup, beating Argentina 1-0 in the final on July 19, 2026 at MetLife Stadium.' },
    { q: 'Who was the 2026 Golden Boot winner?', a: 'Kylian Mbappé finished as the 2026 Golden Boot winner with 10 goals.' },
    { q: 'Where was the 2026 final played?', a: 'The final was held at MetLife Stadium in East Rutherford, New Jersey on July 19, 2026.' },
  ]

  return (
    <ToolLayout
      title="World Cup 2026 Results"
      desc="World Cup 2026 final results: champion, runner-up, Golden Boot winner, and full standings. Spain lifted the trophy — complete recap by UpTools."
      icon="🏆" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="world-cup-2026-results"
      faq={faqs}
      howItWorks={[
        "Spain defeated Argentina 1–0 in the final on July 19, 2026.",
        "Kylian Mbappé won the Golden Boot with 10 goals.",
        "Browse related tools for discipline, fair play, and more.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "World Cup 2026 Results", "applicationCategory": "SportsApplication",
        url: "https://www.uptools.in/world-cup-2026-results/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Champion Card */}
        <div className="rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Champion</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🏆</span>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Spain</h3>
              <p className="text-sm text-slate-400 mt-1">
                Won the 2026 World Cup, defeating <strong className="text-white">Argentina 1-0</strong> in the final on <strong className="text-white">July 19, 2026</strong> at MetLife Stadium.
              </p>
            </div>
          </div>
        </div>

        {/* Golden Boot */}
        <div className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Top Scorer</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚽</span>
            <div>
              <h3 className="text-lg font-extrabold text-white">Golden Boot: Kylian Mbappé</h3>
              <p className="text-sm text-slate-400 mt-1">
                <strong className="text-white">10 goals</strong> — the tournament's leading scorer.
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.04] p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">More from the 2026 Tournament</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedTools.map(tool => (
              <Link key={tool.label} to={tool.href}
                className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.06] border border-white/8 text-sm text-slate-300 font-medium hover:text-white hover:bg-white/[0.1] transition-all">
                <span>{tool.icon}</span>
                <span>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: '48', l: 'Teams' },
            { n: '16', l: 'Venues' },
            { n: '3', l: 'Host Countries' },
          ].map(s => (
            <div key={s.l} className="p-4 rounded-2xl bg-white/[0.06] border border-white/8 text-center">
              <div className="text-2xl font-extrabold text-indigo-400">{s.n}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
