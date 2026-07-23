import ToolLayout from '../components/ToolLayout'

export default function fifa_world_cup_red_cards() {
  return (
    <ToolLayout
      title="FIFA World Cup 2026 Red Cards"
      desc="Track every red card shown at the 2026 FIFA World Cup. Full list of sendings-off with match details."
      icon="🟥" iconBg="rgba(239,68,68,0.08)"
      category="fifa" slug="fifa-world-cup-red-cards"
      faq={[
        { q: "How many red cards were shown in the 2026 World Cup?", a: "A record number of red cards were shown across the tournament, with the opening match alone seeing 3 red cards — a World Cup record." },
        { q: "What happens after a red card?", a: "The player is sent off immediately and receives an automatic one-match suspension. Straight reds may be extended by FIFA's disciplinary committee." },
        { q: "Which match had the most red cards?", a: "Mexico vs South Africa (Opening Match) had 3 red cards — the most in any single World Cup match in history." },
      ]}
      howItWorks={[
        "Red cards are logged from official FIFA match reports.",
        "Both straight reds and second-yellow reds are tracked.",
        "Suspension info is based on FIFA's disciplinary regulations.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Red Cards",
        url: "https://www.uptools.in/fifa-world-cup-red-cards/",
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Notable Red Cards */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-3">🟥 Notable Red Cards</h2>
          <div className="space-y-3">
            {[
              { match: "Mexico vs South Africa", player: "Sphephelo Sithole", team: "🇿🇦 South Africa", minute: "90+8'", type: "Second Yellow", note: "Opening match — record 3 reds" },
              { match: "Mexico vs South Africa", player: "Themba Zwane", team: "🇿🇦 South Africa", minute: "90+8'", type: "Second Yellow", note: "Opening match — record 3 reds" },
              { match: "Mexico vs South Africa", player: "César Montes", team: "🇲🇽 Mexico", minute: "90+8'", type: "Straight Red", note: "Opening match — record 3 reds" },
            ].map((rc, i) => (
              <div key={i} className="bg-red-500/[0.06] border border-red-500/15 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-red-400">{rc.player}</span>
                  <span className="text-[10px] text-slate-500">{rc.minute}</span>
                </div>
                <div className="text-[11px] text-slate-400">{rc.team} · {rc.type}</div>
                <div className="text-[10px] text-slate-600 mt-1">{rc.match} — {rc.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { n: '3', l: 'Most Reds in a Match', sub: 'MEX vs RSA', color: 'text-red-400' },
            { n: '90+8\'', l: 'Latest Red Card Time', sub: 'Opening match', color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
              <div className={`text-xl font-extrabold ${s.color}`}>{s.n}</div>
              <div className="text-[10px] text-slate-500 font-medium">{s.l}</div>
              <div className="text-[9px] text-slate-600">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-2">Red Card Rules</h2>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Two yellow cards in one match = automatic red card</li>
            <li>• Straight red = immediate sending off + 1 match ban minimum</li>
            <li>• Second yellow = sending off + 1 match ban</li>
            <li>• FIFA can extend bans for serious foul play</li>
            <li>• Yellow cards reset after the quarter-final stage</li>
          </ul>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-2">Related Tools</h2>
          <div className="flex flex-wrap gap-2">
            {[
              ['Discipline Tracker', '/fifa-world-cup-discipline/'],
              ['Fair Play Rankings', '/fifa-world-cup-fair-play/'],
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
