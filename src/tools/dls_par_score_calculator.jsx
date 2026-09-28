import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

// Simplified DLS resource percentages (% resources remaining)
// Rows: wickets lost (0-9), Columns: overs remaining brackets [5,10,15,20,25,30,35,40,45,50]
const OVERS_BRACKETS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
const RESOURCE_TABLE = [
  [18.3, 33.9, 45.2, 58.3, 67.5, 75.1, 82.7, 89.3, 95.0, 100.0], // 0 wickets
  [12.7, 27.3, 38.0, 51.7, 61.3, 68.5, 76.0, 82.7, 88.5, 93.4],  // 1 wicket
  [ 7.1, 19.4, 29.0, 43.4, 53.0, 60.0, 67.5, 74.3, 80.0, 85.1],  // 2 wickets
  [ 2.8, 12.2, 20.5, 33.7, 43.0, 49.6, 57.0, 64.0, 70.0, 74.9],  // 3 wickets
  [ 0.5,  6.5, 12.5, 24.2, 33.0, 38.4, 45.5, 52.1, 58.0, 63.0],  // 4 wickets
  [ 0.0,  2.7,  7.0, 15.6, 24.0, 27.5, 34.0, 39.6, 45.0, 50.0],  // 5 wickets
  [ 0.0,  0.4,  2.8,  8.8, 14.5, 17.6, 22.5, 27.0, 32.0, 36.1],  // 6 wickets
  [ 0.0,  0.0,  0.8,  3.5,  7.0,  9.2, 12.5, 15.5, 19.0, 22.5],  // 7 wickets
  [ 0.0,  0.0,  0.0,  0.7,  1.8,  3.0,  4.5,  6.2,  8.0, 10.3],  // 8 wickets
  [ 0.0,  0.0,  0.0,  0.0,  0.1,  0.2,  0.5,  1.0,  1.8,  2.5],  // 9 wickets
]

function getResourceRemaining(wicketsLost, oversLeft) {
  const wi = Math.min(Math.max(wicketsLost, 0), 9)
  const clampedOvers = Math.min(Math.max(oversLeft, 0), 50)
  // Find bracket indices for interpolation
  let lo = 0, hi = OVERS_BRACKETS.length - 1
  for (let i = 0; i < OVERS_BRACKETS.length; i++) {
    if (OVERS_BRACKETS[i] <= clampedOvers) lo = i
    if (OVERS_BRACKETS[i] >= clampedOvers && hi === OVERS_BRACKETS.length - 1) hi = i
  }
  if (lo === hi) return RESOURCE_TABLE[wi][lo]
  const t = (clampedOvers - OVERS_BRACKETS[lo]) / (OVERS_BRACKETS[hi] - OVERS_BRACKETS[lo])
  return RESOURCE_TABLE[wi][lo] + t * (RESOURCE_TABLE[wi][hi] - RESOURCE_TABLE[wi][lo])
}

export default function dls_par_score_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [t1Score, setT1Score] = useState('')
  const [t2Score, setT2Score] = useState('')
  const [wicketsLost, setWicketsLost] = useState('0')
  const [oversRemaining, setOversRemaining] = useState('50')

  const calculate = useCallback(() => {
    const T1 = parseFloat(t1Score) || 0
    const T2 = parseFloat(t2Score) || 0
    const wkts = parseInt(wicketsLost) || 0
    const overs = parseFloat(oversRemaining)
    if (T1 <= 0 || isNaN(overs) || overs < 0 || overs > 50) return null

    const R2 = getResourceRemaining(wkts, overs)
    const parScore = Math.round(T1 * (R2 / 100))
    const runsNeeded = parScore + 1 - T2
    const verdict = T2 > parScore ? 'ahead' : T2 < parScore ? 'behind' : 'on par'

    return { parScore, runsNeeded, verdict, resourceRemaining: R2, wkts, overs }
  }, [t1Score, t2Score, wicketsLost, oversRemaining])

  const result = calculate()

  const handleCalculate = () => { calculate(); jumpTo() }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="DLS Par Score Calculator"
      desc="Simplified Duckworth-Lewis-Stern par score calculator for rain-affected cricket matches — find out if a chasing team is ahead or behind."
      icon="🌧️" iconBg="rgba(99,102,241,0.08)"
      category="cricket" slug="dls-par-score-calculator"
      faq={[
        { q: "What is the DLS method in cricket?", a: "The Duckworth-Lewis-Stern (DLS) method is a mathematical formula used to calculate target scores in rain-interrupted limited-overs cricket matches. It accounts for the resources (wickets and overs) each team has available." },
        { q: "How is the par score calculated?", a: "The simplified par score formula is: Par = Team1 Score × (Resources Remaining ÷ 100). Resources remaining depend on wickets lost and overs left, read from a standardised table." },
        { q: "What does 'ahead' or 'behind' on DLS mean?", a: "If the chasing team's current score exceeds the par score, they are 'ahead' on DLS. If below, they are 'behind'. In a rain中断 match, the team ahead at the cut-off point wins." },
        { q: "Is this DLS Par Score Calculator accurate?", a: "This calculator uses a simplified resource table for illustration. Official DLS targets are calculated by the ICC using more granular data. Always verify with official sources for competitive matches." },
      ]}
      howItWorks={[
        "Enter Team 1's total score (first innings).",
        "Enter Team 2's current score and select wickets lost (0-9).",
        "Choose the overs remaining for Team 2 (0-50).",
        "Click Calculate to see the par score, runs needed to be on track, and the DLS verdict.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "DLS Par Score Calculator", "applicationCategory": "SportsApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
          <p className="text-xs font-medium text-amber-300/80 leading-relaxed">
            ⚠️ <span className="font-bold">Simplified DLS</span> — This uses a simplified resource table for educational purposes. Official ICC DLS targets use more precise calculations. Do not use for competitive match adjudication.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Team 1 Total Score</label>
            <input type="number" value={t1Score} onChange={(e) => setT1Score(e.target.value)}
              placeholder="e.g. 265" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Team 2 Current Score</label>
            <input type="number" value={t2Score} onChange={(e) => setT2Score(e.target.value)}
              placeholder="e.g. 140" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Wickets Lost</label>
              <select value={wicketsLost} onChange={(e) => setWicketsLost(e.target.value)} className={selectClass}>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i}>{i} {i === 1 ? 'wicket' : 'wickets'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Overs Remaining</label>
              <select value={oversRemaining} onChange={(e) => setOversRemaining(e.target.value)} className={selectClass}>
                {Array.from({ length: 51 }, (_, i) => 50 - i).map(o => (
                  <option key={o} value={o}>{o} over{o !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Par Score
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-6xl font-black text-white mb-1">{result.parScore}</div>
              <div className="text-sm font-medium text-slate-400">Par Score (Team 2 should be here)</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Resources Remaining', value: result.resourceRemaining.toFixed(1) + '%', color: 'text-cyan-400' },
                { label: 'Runs Needed to Win', value: result.runsNeeded > 0 ? result.runsNeeded.toString() : '0 (already ahead)', color: result.runsNeeded > 0 ? 'text-white' : 'text-green-400' },
                { label: 'DLS Verdict', value: result.verdict === 'ahead' ? '✅ Ahead on DLS' : result.verdict === 'behind' ? '❌ Behind on DLS' : '⚖️ On Par', color: result.verdict === 'ahead' ? 'text-green-400' : result.verdict === 'behind' ? 'text-rose-400' : 'text-amber-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🌧️</div>
            <p className="text-sm text-slate-600 font-medium">Enter match details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
