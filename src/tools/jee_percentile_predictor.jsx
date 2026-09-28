import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function jee_percentile_predictor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [marks, setMarks] = useState('')
  const [totalMarks, setTotalMarks] = useState('300')
  const [difficulty, setDifficulty] = useState('moderate')
  const [candidates, setCandidates] = useState('1400000')

  const calculate = useCallback(() => {
    const m = parseFloat(marks) || 0
    const t = parseFloat(totalMarks) || 300
    const c = parseFloat(candidates) || 1400000
    if (m <= 0 || t <= 0) return null

    const scorePct = Math.min(m / t, 1)
    // Curve tuned: 300/300 → 100, ~150/300 → ~90
    let p = 100 * Math.pow(scorePct, 0.65)

    // Shift adjustment
    if (difficulty === 'easy') p -= 1.5
    else if (difficulty === 'tough') p += 1.5
    p = Math.max(0, Math.min(100, p))

    const rangeLow = Math.max(0, p - 1.2)
    const rangeHigh = Math.min(100, p + 1.2)
    const avgPct = (rangeLow + rangeHigh) / 2

    const rankLow = Math.round(((100 - rangeHigh) / 100) * c)
    const rankHigh = Math.round(((100 - rangeLow) / 100) * c)

    const qualifies = avgPct >= 90

    return { p, rangeLow, rangeHigh, rankLow, rankHigh, qualifies }
  }, [marks, totalMarks, difficulty, candidates])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  const fmtNum = (n) => isFinite(n) ? Number(n).toLocaleString('en-IN') : '–'

  return (
    <ToolLayout
      title="JEE Main Percentile Predictor"
      desc="Predict your JEE Main NTA percentile and All India Rank based on marks scored, shift difficulty, and number of candidates — free online estimator."
      icon="🎓" iconBg="rgba(34,197,94,0.08)"
      category="education" slug="jee-percentile-predictor"
      faq={[
        { q: "How is JEE Main percentile calculated?", a: "NTA percentile is based on a normalization formula that compares your raw marks against all candidates in your shift. It is not a simple percentage — it reflects relative performance." },
        { q: "Does shift difficulty affect my percentile?", a: "Yes. NTA normalises scores across shifts, so an easier shift slightly lowers your percentile while a tougher shift can boost it. This tool applies an approximate adjustment." },
        { q: "What JEE Main percentile is needed for Advanced?", a: "You need to be in the top ~2,50,000 candidates (category-wise) to qualify for JEE Advanced. Historically this requires roughly 85–90+ percentile depending on your category." },
        { q: "Is this JEE Main Percentile Predictor accurate?", a: "This is an estimate based on publicly observed score-to-percentile curves. Actual results depend on the official NTA normalisation process and cannot be predicted exactly." },
      ]}
      howItWorks={[
        "Enter your marks scored and total marks (default 300).",
        "Select your shift difficulty — easy, moderate, or tough.",
        "Enter total number of candidates appearing (default 14 lakh).",
        "Click Predict to see your estimated percentile range and AIR range.",
        "Check the JEE Advanced qualifying verdict and disclaimer.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "JEE Main Percentile Predictor", "applicationCategory": "EducationalApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/jee-percentile-predictor/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Marks Scored</label>
            <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)}
              placeholder="Enter marks scored" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Marks</label>
            <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)}
              placeholder="300" min="1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Shift Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
              <option value="moderate">Moderate (default)</option>
              <option value="easy">Easy</option>
              <option value="tough">Tough</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Number of Candidates</label>
            <input type="number" value={candidates} onChange={(e) => setCandidates(e.target.value)}
              placeholder="1400000" min="1" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          Predict Percentile
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Prediction</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Estimated Percentile', value: `${result.rangeLow.toFixed(1)} – ${result.rangeHigh.toFixed(1)}`, color: 'text-emerald-400' },
                { label: 'Est. All India Rank', value: `${fmtNum(result.rankHigh)} – ${fmtNum(result.rankLow)}`, color: 'text-white' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/5">
                <p className="text-sm font-bold text-white">
                  JEE Advanced Qualifying:{' '}
                  <span className={result.qualifies ? 'text-emerald-400' : 'text-rose-400'}>
                    {result.qualifies ? '✓ Likely Qualifies' : '✗ May Not Qualify'}
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Qualifying requires being in the top ~2.5 lakh candidates (category-dependent). Percentile ≥ 90 is a rough threshold.
                </p>
              </div>
              <p className="text-xs text-slate-600 italic pt-2">
                Disclaimer: Actual NTA percentile depends on normalisation across shifts. This is an approximate estimate only.
              </p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Enter marks and click Predict</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
