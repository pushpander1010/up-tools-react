import { useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const TEAMS = [
  { name: "Mumbai Indians", short: "MI", logo: "🔵", titles: 5, matches: 257, wins: 149, losses: 106, finals: 6, playoffs: 12 },
  { name: "Chennai Super Kings", short: "CSK", logo: "🟡", titles: 5, matches: 240, wins: 143, losses: 95, finals: 10, playoffs: 12 },
  { name: "Kolkata Knight Riders", short: "KKR", logo: "🟣", titles: 3, matches: 257, wins: 133, losses: 122, finals: 4, playoffs: 10 },
  { name: "Rajasthan Royals", short: "RR", logo: "🩷", titles: 1, matches: 213, wins: 108, losses: 103, finals: 2, playoffs: 6 },
  { name: "Sunrisers Hyderabad", short: "SRH", logo: "🟠", titles: 1, matches: 165, wins: 87, losses: 77, finals: 2, playoffs: 6 },
  { name: "Gujarat Titans", short: "GT", logo: "🔵", titles: 1, matches: 42, wins: 26, losses: 16, finals: 2, playoffs: 2 },
  { name: "Royal Challengers Bengaluru", short: "RCB", logo: "🔴", titles: 0, matches: 257, wins: 121, losses: 134, finals: 3, playoffs: 8 },
  { name: "Delhi Capitals", short: "DC", logo: "🔷", titles: 0, matches: 257, wins: 124, losses: 131, finals: 1, playoffs: 6 },
  { name: "Punjab Kings", short: "PBKS", logo: "🦁", titles: 0, matches: 257, wins: 119, losses: 136, finals: 1, playoffs: 4 },
  { name: "Lucknow Super Giants", short: "LSG", logo: "🩵", titles: 0, matches: 42, wins: 20, losses: 22, finals: 0, playoffs: 1 },
]

export default function ipl_team_stats() {
  const sorted = useMemo(() => {
    return [...TEAMS].sort((a, b) => {
      if (b.titles !== a.titles) return b.titles - a.titles
      return (b.wins / b.matches) - (a.wins / a.matches)
    })
  }, [])

  return (
    <ToolLayout
      title="IPL Team Statistics"
      desc="All-time records, wins, titles, and performance stats for all IPL franchises."
      icon="📈" iconBg="rgba(234,179,8,0.08)"
      category="sports" slug="ipl-team-stats"
      faq={[
        { q: "Which team has won the most titles?", a: "Mumbai Indians and Chennai Super Kings are tied with 5 IPL titles each." },
        { q: "Best win percentage?", a: "Chennai Super Kings has the best win percentage at ~59.6%." },
      ]}
      howItWorks={["View all-time team records sorted by titles", "See matches, wins, losses, win %", "Check finals and playoff appearances"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"IPL Team Statistics","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/ipl-team-stats/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead><tr className="border-b border-white/8">
              <th className="text-left py-2 px-2 text-slate-400 font-semibold">Team</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Titles</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Matches</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Wins</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Losses</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Win %</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Finals</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Playoffs</th>
            </tr></thead>
            <tbody>
              {sorted.map((t, i) => {
                const winPct = ((t.wins / t.matches) * 100).toFixed(1)
                return (
                  <tr key={t.short} className="border-b border-white/5">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.logo}</span>
                        <div>
                          <div className="text-white font-bold text-xs">{t.name}</div>
                          <div className="text-slate-500 text-[10px]">{t.short}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-amber-400 font-bold">{t.titles > 0 ? `🏆 ${t.titles}` : '-'}</td>
                    <td className="py-3 px-2 text-center text-white">{t.matches}</td>
                    <td className="py-3 px-2 text-center text-green-400 font-bold">{t.wins}</td>
                    <td className="py-3 px-2 text-center text-red-400">{t.losses}</td>
                    <td className="py-3 px-2 text-center text-white font-bold">{winPct}%</td>
                    <td className="py-3 px-2 text-center text-white">{t.finals}</td>
                    <td className="py-3 px-2 text-center text-white">{t.playoffs}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Related tools */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">More Cricket Tools</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/ipl-points-table/', label: '🏆 IPL Points Table' },
              { href: '/ipl-fantasy-calculator/', label: '⭐ Fantasy Calculator' },
              { href: '/cricket-run-rate/', label: '🏏 Run Rate' },
              { href: '/cricket-nrr/', label: '🧮 NRR Calculator' },
            ].map(link => (
              <a key={link.href} href={link.href}
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/8 text-sm text-slate-400 hover:bg-white/10 transition-all">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
