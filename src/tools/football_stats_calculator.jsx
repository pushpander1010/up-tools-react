import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function football_stats_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [completed, setCompleted] = useState('')
  const [attempted, setAttempted] = useState('')
  const [yards, setYards] = useState('')
  const [tds, setTds] = useState('')
  const [ints, setInts] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const c = parseInt(completed) || 0
    const a = parseInt(attempted) || 0
    const y = parseInt(yards) || 0
    const t = parseInt(tds) || 0
    const i = parseInt(ints) || 0
    if (a === 0) return

    const completionPct = ((c / a) * 100).toFixed(1)
    const yardsPerAttempt = (y / a).toFixed(2)
    const yardsPerCompletion = c > 0 ? (y / c).toFixed(2) : '0'
    const tdInt = t - i

    // NFL Passer Rating
    const a1 = Math.max(0, Math.min(2.375, (c / a - 0.3) * 12.5))
    const b = Math.max(0, Math.min(2.375, (y / a - 3) * 0.25))
    const c1 = Math.max(0, Math.min(2.375, (t / a) * 20))
    const d = Math.max(0, Math.min(2.375, 2.375 - (i / a) * 25))
    const rating = ((a1 + b + c1 + d) / 6 * 100).toFixed(1)

    setResult({ completionPct, yardsPerAttempt, yardsPerCompletion, tdInt, rating })
  }, [completed, attempted, yards, tds, ints])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Football Stats Calculator"
      desc="Calculate player performance metrics, completion percentage, yards per game, and NFL passer rating."
      icon="🏈" iconBg="rgba(239,68,68,0.08)"
      category="sports" slug="football-stats-calculator"
      faq={[
        { q: "What is NFL Passer Rating?", a: "Passer rating is a measure of the performance of passers, based on completion percentage, yards per attempt, touchdowns per attempt, and interceptions per attempt." },
        { q: "How is completion percentage calculated?", a: "Completion % = (Passes Completed / Passes Attempted) × 100. A higher percentage indicates better accuracy." },
      ]}
      howItWorks={[
        "Enter passes completed, attempted, passing yards, touchdowns, and interceptions.",
        "Click Calculate to compute completion %, yards per attempt, and NFL passer rating.",
        "Results include TD-INT ratio and yards per completion for comprehensive analysis.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Football Stats Calculator", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/football-stats-calculator/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">Player Performance</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Passes Completed', completed, setCompleted, '0'],
              ['Passes Attempted', attempted, setAttempted, '0'],
              ['Passing Yards', yards, setYards, '0'],
              ['Touchdowns', tds, setTds, '0'],
              ['Interceptions', ints, setInts, '0'],
            ].map(([label, val, setter, ph]) => (
              <div key={label} className={label === 'Passing Yards' ? 'col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                <input type="number" min="0" value={val} onChange={e => setter(e.target.value)}
                  placeholder={ph} className={inputClass} />
              </div>
            ))}
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all">
            Calculate
          </button>
        </div>

        {result ? (
          <div ref={resultRef} className="bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent border-2 border-red-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Performance Metrics</h3>
            </div>
            <div className="space-y-2">
              {[
                ['Completion %', `${result.completionPct}%`],
                ['Yards/Attempt', result.yardsPerAttempt],
                ['Yards/Completion', result.yardsPerCompletion],
                ['TD-INT Ratio', result.tdInt],
                ['Passer Rating', <span className="text-red-400 font-extrabold">{result.rating}</span>],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between bg-black/20 rounded-xl px-3 py-2 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏈</div>
            <p className="text-sm text-slate-600">Enter stats to calculate metrics</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
