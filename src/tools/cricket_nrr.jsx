import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cricket_nrr() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [matches, setMatches] = useState([])
  const [ourRuns, setOurRuns] = useState('')
  const [ourOvers, setOurOvers] = useState('')
  const [oppRuns, setOppRuns] = useState('')

  const addMatch = useCallback(() => {
    const runs = parseInt(ourRuns) || 0
    const overs = parseFloat(ourOvers) || 0
    const opp = parseInt(oppRuns) || 0
    if (runs <= 0 || overs <= 0 || opp < 0) return

    const ourRR = runs / overs
    const oppRR = opp / 20
    const nrr = ourRR - oppRR
    setMatches(prev => [...prev, { ourRuns: runs, ourOvers: overs, oppRuns: opp, ourRR, oppRR, nrr }])
    setOurRuns(''); setOurOvers(''); setOppRuns('')
  }, [ourRuns, ourOvers, oppRuns])

  const clearAll = useCallback(() => setMatches([]), [])

  const ballsToOvers = (b) => Math.floor(b / 6) + (b % 6) / 10

  const summary = matches.length > 0 ? {
    count: matches.length,
    totalRuns: matches.reduce((a, m) => a + m.ourRuns, 0),
    totalOvers: matches.reduce((a, m) => a + m.ourOvers, 0),
    totalRunsAgainst: matches.reduce((a, m) => a + m.oppRuns, 0),
    avgOurRR: matches.reduce((a, m) => a + m.ourRR, 0) / matches.length,
    avgOppRR: matches.reduce((a, m) => a + m.oppRR, 0) / matches.length,
    avgNRR: matches.reduce((a, m) => a + m.nrr, 0) / matches.length,
  } : null

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Cricket Net Run Rate (NRR) Calculator"
      desc="Calculate net run rate for tournament standings and league matches. Add multiple matches for cumulative NRR."
      icon="🧮" iconBg="rgba(59,130,246,0.08)"
      category="cricket" slug="cricket-nrr"
      faq={[
        { q: "How is Net Run Rate calculated?", a: "NRR = (Team Run Rate) - (Opposition Run Rate). Run Rate = Runs Scored / Overs Faced. For full tournament, average the NRR across all matches." },
        { q: "Why is NRR important?", a: "NRR is used to break ties in tournament standings. Higher NRR means better position. Critical in IPL, World Cup group stages." },
      ]}
      howItWorks={[
        "Enter your team's runs, overs used, and opposition runs for each match.",
        "Click Add to record the match and calculate per-match NRR.",
        "Add multiple matches to see cumulative Net Run Rate across the tournament.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Cricket NRR Calculator", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/cricket-nrr/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Add Match Section */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">Add Match Result</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Runs</label>
              <input type="number" min="0" value={ourRuns} onChange={e => setOurRuns(e.target.value)}
                placeholder="e.g. 165" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Overs Used</label>
              <input type="number" min="0.1" max="20" step="0.1" value={ourOvers} onChange={e => setOurOvers(e.target.value)}
                placeholder="e.g. 19.4" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Opposition Runs</label>
              <input type="number" min="0" value={oppRuns} onChange={e => setOppRuns(e.target.value)}
                placeholder="e.g. 158" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { addMatch(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">
              Add Match
            </button>
            <button onClick={clearAll}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white transition-all">
              Clear All
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <h2 className="text-sm font-bold text-white mb-3">NRR Calculation</h2>
          {matches.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-8">Add matches above to calculate NRR</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/[0.08]">
                    <th className="text-left py-2 px-2">#</th>
                    <th className="text-left py-2 px-2">Match</th>
                    <th className="text-right py-2 px-2">Our RR</th>
                    <th className="text-right py-2 px-2">Opp RR</th>
                    <th className="text-right py-2 px-2">NRR</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-indigo-400 font-bold">{i + 1}</td>
                      <td className="py-2 px-2 text-slate-300">
                        {m.ourRuns}/{ballsToOvers(m.ourOvers * 6).toFixed(1)} ov vs {m.oppRuns}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-300">{m.ourRR.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{m.oppRR.toFixed(2)}</td>
                      <td className={`py-2 px-2 text-right font-bold ${m.nrr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {m.nrr >= 0 ? '+' : ''}{m.nrr.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <div ref={resultRef} className="bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent border-2 border-indigo-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Tournament Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Matches Played', summary.count],
                ['Total Runs Scored', summary.totalRuns],
                ['Overs Used', summary.totalOvers.toFixed(1)],
                ['Runs Conceded', summary.totalRunsAgainst],
                ['Average Run Rate', summary.avgOurRR.toFixed(2)],
                ['Opposition Avg RR', summary.avgOppRR.toFixed(2)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-black/20 rounded-xl px-3 py-3 flex justify-between items-center">
              <span className="text-sm text-slate-400 font-bold">NET RUN RATE</span>
              <span className={`text-xl font-extrabold ${summary.avgNRR >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {summary.avgNRR >= 0 ? '+' : ''}{summary.avgNRR.toFixed(3)}
              </span>
            </div>
          </div>
        )}

        {!summary && (
          <div ref={resultRef} className="text-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏏</div>
            <p className="text-sm text-slate-600">Add matches above to calculate NRR</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
