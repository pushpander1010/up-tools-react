import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cricket_run_rate() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [format, setFormat] = useState(20)
  const [overs, setOvers] = useState('10')
  const [runs, setRuns] = useState('85')
  const [wickets, setWickets] = useState('2')
  const [target, setTarget] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const ov = parseFloat(overs) || 0
    const r = parseInt(runs) || 0
    const wk = parseInt(wickets) || 0
    const tgt = parseInt(target) || 0
    if (ov <= 0 || r < 0) return

    const currentRR = ov > 0 ? r / ov : 0
    const ballFactor = ov % 1
    const fullOvers = Math.floor(ov)
    const balls = fullOvers * 6 + (ballFactor * 10)
    const projRuns = currentRR * format

    const res = {
      currentRR: currentRR.toFixed(2),
      balls,
      projRuns: Math.round(projRuns),
    }

    if (tgt > 0) {
      const remOvers = Math.max(0, format - ov)
      const remRuns = tgt - r
      const reqRR = remOvers > 0 ? remRuns / remOvers : (remRuns <= 0 ? 0 : 999)
      res.target = Math.round(tgt)
      res.remRuns = Math.round(remRuns)
      res.reqRR = reqRR.toFixed(2)
      res.remOvers = remOvers.toFixed(1)
      res.achieved = remRuns <= 0
      res.difficulty = remRuns > 0 ? (reqRR > 12 && format === 20 ? 'Very Hard' : reqRR > 10 ? 'Challenging' : 'Comfortable') : null
      res.reqPositive = reqRR <= currentRR
    }
    setResult(res)
  }, [overs, runs, wickets, target, format])

  const reset = useCallback(() => {
    setOvers('10'); setRuns('85'); setWickets('2'); setTarget(''); setResult(null)
  }, [])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Cricket Run Rate Calculator"
      desc="Calculate required run rate, projected total, and target score for T20, ODI & Test cricket matches."
      icon="🏏" iconBg="rgba(34,197,94,0.08)"
      category="cricket" slug="cricket-run-rate"
      faq={[
        { q: "How is run rate calculated in cricket?", a: "Run rate (RR) = Total Runs Scored / Overs Bowled. For example, 160 runs in 20 overs = 8.00 run rate." },
        { q: "What is required run rate?", a: "RRR tells how many runs per over are needed to reach the target. Formula: (Target - Current Runs) / Remaining Overs." },
        { q: "Does this work for Test cricket?", a: "Yes! Select 'Test (90 ov)' for first innings of a Test match. Works for all formats with configurable overs." },
      ]}
      howItWorks={[
        "Select match format (T20, ODI, or Test).",
        "Enter overs completed, runs scored, wickets lost, and target if chasing.",
        "Click Calculate to see current run rate, projected total, and required run rate.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Cricket Run Rate Calculator", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/cricket-run-rate/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Format Selector */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Match Format</label>
            <div className="flex gap-2">
              {[{ v: 20, l: 'T20 (20 ov)' }, { v: 50, l: 'ODI (50 ov)' }, { v: 90, l: 'Test (90 ov)' }].map(f => (
                <button key={f.v} onClick={() => setFormat(f.v)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${format === f.v ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Overs Completed</label>
              <input type="number" min="0" max="90" step="0.1" value={overs} onChange={e => setOvers(e.target.value)}
                placeholder="e.g. 10.3" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Runs Scored</label>
              <input type="number" min="0" value={runs} onChange={e => setRuns(e.target.value)}
                placeholder="e.g. 85" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Wickets Lost</label>
              <input type="number" min="0" max="10" value={wickets} onChange={e => setWickets(e.target.value)}
                placeholder="e.g. 2" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target (optional)</label>
              <input type="number" min="0" value={target} onChange={e => setTarget(e.target.value)}
                placeholder="Leave empty if batting first" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { calculate(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all">
              Calculate
            </button>
            <button onClick={reset}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white transition-all">
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div ref={resultRef} className="bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent border-2 border-indigo-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Results</h3>
            </div>
            <div className="space-y-2">
              {[
                ['Current Run Rate', result.currentRR],
                ['Balls Bowled', result.balls],
                ['Projected Total', <span className="text-emerald-400">{result.projRuns}</span>],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
              {result.target != null && (
                <>
                  {[
                    ['Target', result.target],
                    ['Remaining Runs', result.remRuns],
                    ['Required Run Rate', <span className={result.reqPositive ? 'text-emerald-400' : 'text-red-400'}>{result.reqRR}</span>],
                    ['Remaining Overs', result.remOvers],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2 text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                  ))}
                  {result.achieved && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold text-center">
                      🎉 TARGET ACHIEVED!
                    </div>
                  )}
                  {result.difficulty && (
                    <div className={`rounded-xl px-3 py-2 text-sm font-bold text-center ${
                      result.difficulty === 'Very Hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      result.difficulty === 'Challenging' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      Difficulty: {result.difficulty}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏏</div>
            <p className="text-sm text-slate-600">Enter values and hit Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
