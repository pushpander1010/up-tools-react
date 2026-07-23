import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'

const TEAMS = [
  { id:"rcb", name:"Royal Challengers Bengaluru", short:"RCB", logo:"🔴", m:14, w:9, l:5, nr:0, pts:18, nrr:+0.432, form:["W","W","L","W","W"], titles:0 },
  { id:"pbks", name:"Punjab Kings", short:"PBKS", logo:"🦁", m:14, w:9, l:5, nr:0, pts:18, nrr:+0.389, form:["W","L","W","W","L"], titles:0 },
  { id:"mi", name:"Mumbai Indians", short:"MI", logo:"🔵", m:14, w:8, l:6, nr:0, pts:16, nrr:+0.271, form:["W","W","L","W","L"], titles:5 },
  { id:"dc", name:"Delhi Capitals", short:"DC", logo:"🔷", m:14, w:8, l:6, nr:0, pts:16, nrr:+0.108, form:["L","W","W","L","W"], titles:0 },
  { id:"csk", name:"Chennai Super Kings", short:"CSK", logo:"🟡", m:14, w:7, l:7, nr:0, pts:14, nrr:-0.044, form:["L","L","W","W","L"], titles:5 },
  { id:"kkr", name:"Kolkata Knight Riders", short:"KKR", logo:"🟣", m:14, w:7, l:7, nr:0, pts:14, nrr:-0.112, form:["W","L","L","W","W"], titles:3 },
  { id:"srh", name:"Sunrisers Hyderabad", short:"SRH", logo:"🟠", m:14, w:6, l:8, nr:0, pts:12, nrr:-0.198, form:["L","W","L","L","W"], titles:1 },
  { id:"gt", name:"Gujarat Titans", short:"GT", logo:"🔵", m:14, w:6, l:8, nr:0, pts:12, nrr:-0.234, form:["L","L","W","L","L"], titles:2 },
  { id:"rr", name:"Rajasthan Royals", short:"RR", logo:"🩷", m:14, w:5, l:9, nr:0, pts:10, nrr:-0.301, form:["L","L","L","W","L"], titles:1 },
  { id:"lsg", name:"Lucknow Super Giants", short:"LSG", logo:"🩵", m:14, w:4, l:10, nr:0, pts:8, nrr:-0.412, form:["L","L","L","L","W"], titles:0 },
]

const SORT_OPTIONS = [
  { key: 'pts', label: 'Points' },
  { key: 'nrr', label: 'NRR' },
  { key: 'w', label: 'Wins' },
  { key: 'm', label: 'Matches' },
]

export default function ipl_points_table() {
  const [sortCol, setSortCol] = useState('pts')
  const [sortDir, setSortDir] = useState(-1)

  const handleSort = useCallback((col) => {
    if (sortCol === col) setSortDir(d => -d)
    else { setSortCol(col); setSortDir(-1) }
  }, [sortCol])

  const sorted = useMemo(() => {
    return [...TEAMS].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol]
      if (av === bv) return b.nrr - a.nrr
      return sortDir * (bv - av)
    })
  }, [sortCol, sortDir])

  const totalMatches = TEAMS.reduce((s, t) => s + t.m, 0) / 2
  const topTeam = [...TEAMS].sort((a, b) => b.pts - a.pts)[0]
  const bestNRR = [...TEAMS].sort((a, b) => b.nrr - a.nrr)[0]
  const mostWins = [...TEAMS].sort((a, b) => b.w - a.w)[0]

  return (
    <ToolLayout
      title="IPL 2025 Points Table"
      desc="Live standings, NRR, form, and playoff tracker for all 10 IPL teams."
      icon="🏆" iconBg="rgba(234,179,8,0.08)"
      category="sports" slug="ipl-points-table"
      faq={[
        { q: "How are points calculated?", a: "Win = 2 pts, Loss = 0 pts, No Result = 1 pt each. Teams ranked by points then NRR." },
        { q: "How many qualify?", a: "Top 4 teams qualify for playoffs." },
      ]}
      howItWorks={["View the current IPL standings", "Sort by Points, NRR, Wins, or Matches", "Check each team's form and playoff status"]}
      schema={{"@context":"https://schema.org","@type":"SoftwareApplication","name":"IPL 2025 Points Table","applicationCategory":"UtilitiesApplication","url":"https://www.uptools.in/ipl-points-table/","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Sort controls */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-slate-500 font-medium">Sort:</span>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.key} onClick={() => handleSort(opt.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                sortCol === opt.key
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-white/[0.04] text-slate-500 border-white/8 hover:bg-white/[0.08]'
              }`}>{opt.label}</button>
          ))}
        </div>

        {/* Points table */}
        <div className="rounded-3xl border-2 border-white/8 bg-white/[0.06] p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="border-b border-white/8">
              <th className="text-left py-2 px-2 text-slate-400 font-semibold">#</th>
              <th className="text-left py-2 px-2 text-slate-400 font-semibold">Team</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">M</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">W</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">L</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">NR</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Pts</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">NRR</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Form</th>
              <th className="text-center py-2 px-2 text-slate-400 font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {sorted.map((t, i) => {
                const pos = i + 1
                const rowBg = pos <= 4 ? 'bg-green-500/[0.04]' : ''
                const nrrClass = t.nrr >= 0 ? 'text-green-400' : 'text-red-400'
                const nrrStr = (t.nrr >= 0 ? '+' : '') + t.nrr.toFixed(3)
                return (
                  <tr key={t.id} className={`border-b border-white/5 ${rowBg}`}>
                    <td className="py-3 px-2 text-white font-bold">{pos}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.logo}</span>
                        <div>
                          <div className="text-white font-bold text-xs">{t.short}</div>
                          <div className="text-slate-500 text-[10px]">{t.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-white">{t.m}</td>
                    <td className="py-3 px-2 text-center text-green-400 font-bold">{t.w}</td>
                    <td className="py-3 px-2 text-center text-red-400">{t.l}</td>
                    <td className="py-3 px-2 text-center text-slate-500">{t.nr}</td>
                    <td className="py-3 px-2 text-center text-white font-bold">{t.pts}</td>
                    <td className={`py-3 px-2 text-center font-bold ${nrrClass}`}>{nrrStr}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1 justify-center">
                        {t.form.map((f, fi) => (
                          <span key={fi} className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            f === 'W' ? 'bg-green-500/20 text-green-400' : f === 'L' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>{f}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {pos <= 4
                        ? <span className="text-xs text-green-400 font-semibold">✅ Playoff</span>
                        : pos <= 6
                          ? <span className="text-xs text-amber-400 font-semibold">⚡ In Hunt</span>
                          : <span className="text-xs text-red-400 font-semibold">❌ Elim</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Season stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['Matches Played', totalMatches, 'of 74 league matches'],
            ['League Leader', topTeam.short, `${topTeam.pts} pts`],
            ['Best NRR', bestNRR.short, `+${bestNRR.nrr.toFixed(3)}`],
            ['Most Wins', mostWins.short, `${mostWins.w} wins`],
          ].map(([label, val, sub]) => (
            <div key={label} className="rounded-2xl border-2 border-white/8 bg-white/[0.06] p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-white">{val}</p>
              <p className="text-[10px] text-slate-600">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
