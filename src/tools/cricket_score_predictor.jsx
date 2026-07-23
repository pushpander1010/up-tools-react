import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cricket_score_predictor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [format, setFormat] = useState(20)
  const [overs, setOvers] = useState('12')
  const [runs, setRuns] = useState('95')
  const [wkts, setWkts] = useState('3')
  const [target, setTarget] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const ov = parseFloat(overs) || 0
    const r = parseInt(runs) || 0
    const w = parseInt(wkts) || 0
    const tgt = parseInt(target) || 0
    if (ov <= 0 || r < 0) return

    const remOvers = format - ov
    const remBalls = Math.round(remOvers * 6)
    const wicketsRem = 10 - w
    const currentRR = r / ov

    const avgScores = { 20: 160, 50: 280 }
    const avgRR = avgScores[format] / format

    let projScore = currentRR * format
    if (wicketsRem >= 7) projScore *= 1.08
    else if (wicketsRem <= 3) projScore *= 0.92
    projScore = Math.round(projScore)

    const parScore = Math.round(avgRR * (ov + remOvers * 0.9))
    const winChance = Math.min(99, Math.max(1, Math.round(50 + (r - parScore) * 0.4 + (wicketsRem - 3) * 3)))

    const res = {
      currentRR: currentRR.toFixed(2),
      projScore,
      parScore,
      winChance,
      wicketsRem,
      remBalls,
    }

    if (tgt > 0) {
      const need = tgt - r
      const chaseRR = remOvers > 0 ? need / remOvers : 999
      res.target = Math.round(tgt)
      res.need = Math.round(need)
      res.chaseRR = chaseRR.toFixed(2)
      res.chaseColor = chaseRR < currentRR && chaseRR < 10 ? 'text-emerald-400' : chaseRR > 12 ? 'text-red-400' : 'text-amber-400'
    }
    setResult(res)
  }, [overs, runs, wkts, target, format])

  const reset = useCallback(() => {
    setOvers('12'); setRuns('95'); setWkts('3'); setTarget(''); setResult(null)
  }, [])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Cricket Score Predictor"
      desc="Predict match outcome, win probability, and projected score based on current score, overs, and wickets."
      icon="📊" iconBg="rgba(6,182,212,0.08)"
      category="cricket" slug="cricket-score-predictor"
      faq={[
        { q: "How is win probability calculated?", a: "We use a simplified model: comparing current run rate to average scores for the format, factoring in wickets in hand and overs remaining. Real predictions use Duckworth-Lewis (D/L) method." },
        { q: "What is Par Score?", a: "Par score is the total a team would be expected to make at the end of their innings given the current match situation. A score above par = winning position." },
      ]}
      howItWorks={[
        "Select match format (T20 or ODI) and enter current match details.",
        "Click Predict to see projected score, par score, and win probability.",
        "Optionally enter a target to see chase difficulty and required run rate.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Cricket Score Predictor", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/cricket-score-predictor/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Match Format</label>
            <div className="flex gap-2">
              {[{ v: 20, l: 'T20' }, { v: 50, l: 'ODI' }].map(f => (
                <button key={f.v} onClick={() => setFormat(f.v)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${format === f.v ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Overs Completed</label>
              <input type="number" min="0" max="50" step="0.1" value={overs} onChange={e => setOvers(e.target.value)}
                placeholder="e.g. 12.3" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Score</label>
              <input type="number" min="0" value={runs} onChange={e => setRuns(e.target.value)}
                placeholder="e.g. 95" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Wickets Lost</label>
              <input type="number" min="0" max="10" value={wkts} onChange={e => setWkts(e.target.value)}
                placeholder="e.g. 3" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target (optional)</label>
              <input type="number" min="0" value={target} onChange={e => setTarget(e.target.value)}
                placeholder="Leave empty if batting first" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { calculate(); jumpTo() }}
              className="flex-1 py-3 rounded-xl bg-cyan-500 text-white text-sm font-bold hover:bg-cyan-400 transition-all">
              Predict
            </button>
            <button onClick={reset}
              className="px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 text-sm font-semibold hover:text-white transition-all">
              Reset
            </button>
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.01] to-transparent border-2 border-cyan-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Prediction</h3>
            </div>
            <div className="space-y-2">
              {[
                ['Current RR', result.currentRR],
                ['Projected Score', <span className="text-cyan-400 font-bold">{result.projScore}</span>],
                ['Par Score', result.parScore],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}

              {/* Win Probability Bar */}
              <div className="bg-black/20 rounded-xl px-3 py-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Win Probability</span>
                  <span className={`font-bold ${result.winChance > 60 ? 'text-emerald-400' : result.winChance < 40 ? 'text-red-400' : 'text-amber-400'}`}>
                    {result.winChance}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    result.winChance > 60 ? 'bg-emerald-500' : result.winChance < 40 ? 'bg-red-500' : 'bg-amber-500'
                  }`} style={{ width: `${result.winChance}%` }} />
                </div>
              </div>

              {[
                ['Wickets in Hand', result.wicketsRem],
                ['Balls Remaining', result.remBalls],
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
                    ['Needed', result.need],
                    ['Req. Run Rate', <span className={result.chaseColor}>{result.chaseRR}</span>],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2 text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-bold">{val}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600">Enter details and hit Predict</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
