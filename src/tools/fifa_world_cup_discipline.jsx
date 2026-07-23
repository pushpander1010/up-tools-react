import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const TEAMS_DATA = [
  { name: "South Africa", flag: "🇿🇦", matches: 1, yellow: 4, red: 3 },
  { name: "Mexico", flag: "🇲🇽", matches: 1, yellow: 5, red: 1 },
  { name: "Argentina", flag: "🇦🇷", matches: 1, yellow: 3, red: 0 },
  { name: "Morocco", flag: "🇲🇦", matches: 1, yellow: 4, red: 0 },
  { name: "Portugal", flag: "🇵🇹", matches: 1, yellow: 2, red: 0 },
  { name: "Spain", flag: "🇪🇸", matches: 1, yellow: 3, red: 0 },
  { name: "Brazil", flag: "🇧🇷", matches: 1, yellow: 2, red: 0 },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", matches: 1, yellow: 1, red: 0 },
  { name: "France", flag: "🇫🇷", matches: 1, yellow: 2, red: 0 },
  { name: "Germany", flag: "🇩🇪", matches: 1, yellow: 2, red: 1 },
]

const PLAYERS_DATA = [
  { name: "Sphephelo Sithole", team: "South Africa", yellow: 0, red: 1 },
  { name: "Themba Zwane", team: "South Africa", yellow: 0, red: 1 },
  { name: "César Montes", team: "Mexico", yellow: 0, red: 1 },
  { name: "Teboho Mokoena", team: "South Africa", yellow: 1, red: 0 },
  { name: "Lyle Foster", team: "South Africa", yellow: 1, red: 0 },
  { name: "Khuliso Mudau", team: "South Africa", yellow: 1, red: 0 },
  { name: "Edson Álvarez", team: "Mexico", yellow: 1, red: 0 },
  { name: "Raúl Jiménez", team: "Mexico", yellow: 1, red: 0 },
  { name: "Johan Vásquez", team: "Mexico", yellow: 1, red: 0 },
  { name: "Luis Chávez", team: "Mexico", yellow: 1, red: 0 },
  { name: "Hirving Lozano", team: "Mexico", yellow: 1, red: 0 },
  { name: "Rodrigo De Paul", team: "Argentina", yellow: 1, red: 0 },
  { name: "Nicolás Otamendi", team: "Argentina", yellow: 1, red: 0 },
  { name: "Leandro Paredes", team: "Argentina", yellow: 1, red: 0 },
  { name: "Achraf Hakimi", team: "Morocco", yellow: 1, red: 0 },
  { name: "Sofyan Amrabat", team: "Morocco", yellow: 1, red: 0 },
  { name: "Noussair Mazraoui", team: "Morocco", yellow: 1, red: 0 },
  { name: "Romain Saïss", team: "Morocco", yellow: 1, red: 0 },
  { name: "Bruno Fernandes", team: "Portugal", yellow: 1, red: 0 },
  { name: "Rúben Dias", team: "Portugal", yellow: 1, red: 0 },
  { name: "Dani Carvajal", team: "Spain", yellow: 1, red: 0 },
  { name: "Aymeric Laporte", team: "Spain", yellow: 1, red: 0 },
  { name: "Rodri", team: "Spain", yellow: 1, red: 0 },
  { name: "Marquinhos", team: "Brazil", yellow: 1, red: 0 },
  { name: "Casemiro", team: "Brazil", yellow: 1, red: 0 },
  { name: "Declan Rice", team: "England", yellow: 1, red: 0 },
  { name: "Kylian Mbappé", team: "France", yellow: 1, red: 0 },
  { name: "Antoine Griezmann", team: "France", yellow: 1, red: 0 },
  { name: "Toni Kroos", team: "Germany", yellow: 1, red: 0 },
  { name: "Joshua Kimmich", team: "Germany", yellow: 1, red: 0 },
]

const FAQ_DATA = [
  { q: "How are fair play points calculated?", a: "Fair play points: Yellow card = 1 point, Second yellow/red = 2 points, Straight red = 3 points. Lower points = better discipline." },
  { q: "Do two yellow cards equal a red card?", a: "Yes. Two yellow cards in one match result in a red card (second yellow). The player is sent off and suspended for the next match." },
  { q: "How many yellow cards lead to a suspension?", a: "In the World Cup, accumulating 2 yellow cards before the quarter-finals results in a one-match ban. Yellow cards are reset after the quarter-final stage." },
  { q: "What happened in the Mexico vs South Africa opener?", a: "The opening match saw a record 3 red cards — Sphephelo Sithole (SA), Themba Zwane (SA), and César Montes (MEX) — making it the most red cards in a single World Cup match." },
]

export default function fifa_world_cup_discipline() {
  const [tab, setTab] = useState('teams')

  const sortedTeams = useMemo(() =>
    [...TEAMS_DATA].sort((a, b) => (b.yellow + b.red * 3) - (a.yellow + a.red * 3)), [])

  const sortedPlayers = useMemo(() =>
    [...PLAYERS_DATA].sort((a, b) => (b.yellow + b.red) - (a.yellow + a.red)), [])

  const totalYellow = useMemo(() => TEAMS_DATA.reduce((s, t) => s + t.yellow, 0), [])
  const totalRed = useMemo(() => TEAMS_DATA.reduce((s, t) => s + t.red, 0), [])
  const mostDisciplined = useMemo(() =>
    TEAMS_DATA.reduce((a, b) => a.yellow + a.red * 3 < b.yellow + b.red * 3 ? a : b), [])
  const leastDisciplined = useMemo(() =>
    TEAMS_DATA.reduce((a, b) => a.yellow + a.red * 3 > b.yellow + b.red * 3 ? a : b), [])

  return (
    <ToolLayout
      title="FIFA World Cup 2026 Discipline Tracker"
      desc="Track yellow cards, red cards, and fair play points across all World Cup 2026 matches."
      icon="🟨" iconBg="rgba(234,179,8,0.08)"
      category="fifa" slug="fifa-world-cup-discipline"
      faq={FAQ_DATA.map(f => ({ q: f.q, a: f.a }))}
      howItWorks={[
        "We collect official FIFA match reports after each game.",
        "Every yellow and red card is logged per player and team.",
        "Fair Play Points: Yellow=1pt, SecondYellow=2pts, StraightRed=3pts.",
        "Stats reflect the full tournament after all 104 matches concluded.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "FIFA World Cup 2026 Discipline Tracker",
        url: "https://www.uptools.in/fifa-world-cup-discipline/",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { n: totalYellow, l: 'Total Yellow Cards', color: 'text-amber-400' },
            { n: totalRed, l: 'Total Red Cards', color: 'text-red-400' },
            { n: '3', l: 'Most Reds in a Match', sub: 'Mexico vs South Africa', color: 'text-white' },
            { n: mostDisciplined.flag, l: 'Most Disciplined', sub: mostDisciplined.name, color: 'text-white' },
            { n: leastDisciplined.flag, l: 'Least Disciplined', sub: leastDisciplined.name, color: 'text-white' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3 text-center">
              <div className={`text-xl font-extrabold ${s.color}`}>{s.n}</div>
              <div className="text-[10px] text-slate-500 font-medium">{s.l}</div>
              {s.sub && <div className="text-[9px] text-slate-600">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2">
          {['teams', 'players'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              {t === 'teams' ? '📊 Team Discipline' : '👤 Player Cards'}
            </button>
          ))}
        </div>

        {/* Tables */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 overflow-x-auto">
          {tab === 'teams' ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.08]">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Team</th>
                  <th className="text-right py-2 px-2">Matches</th>
                  <th className="text-right py-2 px-2">🟨</th>
                  <th className="text-right py-2 px-2">🟥</th>
                  <th className="text-right py-2 px-2">Total</th>
                  <th className="text-right py-2 px-2">Fair Play</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((t, i) => {
                  const fp = t.yellow + t.red * 3
                  return (
                    <tr key={t.name} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-indigo-400 font-bold">{i + 1}</td>
                      <td className="py-2 px-2 text-white">{t.flag} {t.name}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{t.matches}</td>
                      <td className="py-2 px-2 text-right text-amber-400">{t.yellow}</td>
                      <td className="py-2 px-2 text-right text-red-400">{t.red}</td>
                      <td className="py-2 px-2 text-right text-white font-bold">{t.yellow + t.red}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{fp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.08]">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Player</th>
                  <th className="text-left py-2 px-2">Team</th>
                  <th className="text-right py-2 px-2">🟨</th>
                  <th className="text-right py-2 px-2">🟥</th>
                  <th className="text-right py-2 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((p, i) => (
                  <tr key={p.name} className="border-b border-white/[0.04]">
                    <td className="py-2 px-2 text-indigo-400 font-bold">{i + 1}</td>
                    <td className="py-2 px-2 text-white font-bold">{p.name}</td>
                    <td className="py-2 px-2 text-slate-300">{p.team}</td>
                    <td className="py-2 px-2 text-right text-amber-400">{p.yellow}</td>
                    <td className="py-2 px-2 text-right text-red-400">{p.red}</td>
                    <td className="py-2 px-2 text-right text-white font-bold">{p.yellow + p.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">FAQ</h2>
          {FAQ_DATA.map((f, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer text-sm text-slate-300 font-semibold hover:text-white transition-all list-none flex items-center justify-between">
                {f.q}
                <span className="text-slate-600 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-xs text-slate-500 mt-2 pl-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
