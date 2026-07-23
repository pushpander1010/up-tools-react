import ToolLayout from '../components/ToolLayout'

export default function fifa_world_cup_fair_play() {
  return (
    <ToolLayout
      title="FIFA World Cup 2026 Fair Play"
      desc="Which teams played the cleanest — and who's in the running for the Fair Play Award. Tied to the full discipline table."
      icon="🤝" iconBg="rgba(34,197,94,0.08)"
      category="fifa" slug="fifa-world-cup-fair-play"
      faq={[
        { q: "What is the FIFA Fair Play Award?", a: "It's given to the team with the best disciplinary record (fewest cards, positive play) plus advancement in the tournament." },
        { q: "How is fair play calculated?", a: "FIFA scores teams on yellow/red cards (points deducted per card), plus advancement and match results. Fewer cards = higher fair-play score." },
        { q: "Which team won fair play in 2026?", a: "Check the FIFA Discipline Tracker for the final fair-play standings once the tournament concludes." },
      ]}
      howItWorks={[
        "Points deducted per yellow card and heavy penalty per red.",
        "Teams advance further = bonus fair-play points.",
        "Fewest cards + best conduct = highest score.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Fair Play",
        url: "https://www.uptools.in/fifa-world-cup-fair-play/",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">How Fair Play is Scored</h2>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">🟨</span>
              Points deducted per <strong className="text-white">yellow card</strong> and heavy penalty per <strong className="text-red-400">red</strong>.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5">🏆</span>
              Teams advance further = bonus fair-play points.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">📊</span>
              Fewest cards + best conduct = highest score.
            </li>
          </ul>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">Full Standings</h2>
          <p className="text-xs text-slate-500 mb-3">
            Our <a href="/fifa-world-cup-discipline/" className="text-indigo-400 hover:underline">FIFA Discipline Tracker</a> ranks every team by total cards — the backbone of the fair-play race.
          </p>
          <a href="/fifa-world-cup-discipline/"
            className="inline-block px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">
            Open Discipline Table →
          </a>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[
              ['Discipline Table', '/fifa-world-cup-discipline/'],
              ['Red Cards', '/fifa-world-cup-red-cards/'],
              ['2026 Results', '/fifa-world-cup-predictions/'],
            ].map(([label, href]) => (
              <a key={label} href={href}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
