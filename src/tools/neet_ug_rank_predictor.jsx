import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function neet_ug_rank_predictor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [marks, setMarks] = useState('')
  const [difficulty, setDifficulty] = useState('moderate')
  const [candidates, setCandidates] = useState('2400000')

  const calculate = useCallback(() => {
    const score = parseFloat(marks) || 0
    const totalCandidates = parseInt(candidates) || 2400000

    if (score <= 0 || score > 720) return null

    // Difficulty adjustment: normalize marks to moderate difficulty
    let normalizedMarks = score
    if (difficulty === 'easy') normalizedMarks = Math.min(720, Math.round(score * 0.93))
    else if (difficulty === 'tough') normalizedMarks = Math.min(720, Math.round(score * 1.07))

    // Percentile estimation based on historical NEET score-rank data
    // Approximate: 700+ → 99.99+, 650+ → 99.9, 600+ → 99.5, 550+ → 98, 500+ → 95
    let percentile
    if (normalizedMarks >= 710) percentile = 99.999
    else if (normalizedMarks >= 700) percentile = 99.99
    else if (normalizedMarks >= 680) percentile = 99.97
    else if (normalizedMarks >= 660) percentile = 99.95
    else if (normalizedMarks >= 640) percentile = 99.9
    else if (normalizedMarks >= 620) percentile = 99.7
    else if (normalizedMarks >= 600) percentile = 99.5
    else if (normalizedMarks >= 580) percentile = 99.0
    else if (normalizedMarks >= 560) percentile = 98.5
    else if (normalizedMarks >= 540) percentile = 98.0
    else if (normalizedMarks >= 520) percentile = 97.0
    else if (normalizedMarks >= 500) percentile = 95.0
    else if (normalizedMarks >= 480) percentile = 93.0
    else if (normalizedMarks >= 460) percentile = 90.0
    else if (normalizedMarks >= 440) percentile = 87.0
    else if (normalizedMarks >= 420) percentile = 83.0
    else if (normalizedMarks >= 400) percentile = 78.0
    else if (normalizedMarks >= 370) percentile = 70.0
    else if (normalizedMarks >= 340) percentile = 60.0
    else if (normalizedMarks >= 300) percentile = 45.0
    else if (normalizedMarks >= 250) percentile = 30.0
    else percentile = 15.0

    // Rank estimation
    const estimatedRank = Math.max(1, Math.round(totalCandidates * (1 - percentile / 100)))
    const rankLow = Math.max(1, Math.round(estimatedRank * 0.7))
    const rankHigh = Math.round(estimatedRank * 1.3)

    // Govt MBBS verdict
    let mbbsVerdict = ''
    if (estimatedRank <= 1500) mbbsVerdict = 'Very strong — top AIIMS and government colleges'
    else if (estimatedRank <= 25000) mbbsVerdict = 'Likely — government MBBS seat probable in most states'
    else if (estimatedRank <= 40000) mbbsVerdict = 'Borderline — possible in less competitive states or mop-up rounds'
    else if (estimatedRank <= 60000) mbbsVerdict = 'Tough — private MBBS or BDS likely; govt MBBS unlikely'
    else if (estimatedRank <= 100000) mbbsVerdict = 'Difficult for MBBS — consider BDS, BAMS, or BHMS'
    else mbbsVerdict = 'Very tough for govt seats — explore private colleges or alternative medical courses'

    return { normalizedMarks, percentile, estimatedRank, rankLow, rankHigh: Math.max(rankLow, rankHigh), mbbsVerdict }
  }, [marks, difficulty, candidates])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="NEET UG Rank Predictor"
      desc="Predict your NEET UG percentile, rank range, and government MBBS seat chances based on marks and exam difficulty."
      icon="🩺" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="neet-ug-rank-predictor"
      faq={[
        { q: "How is NEET percentile calculated?", a: "NEET percentile is calculated using the formula: Percentile = (Total candidates − Rank) / Total candidates × 100. NTA normalizes scores across shifts to ensure a fair comparison among all candidates." },
        { q: "What rank do I need for a government MBBS seat?", a: "For AIQ (All India Quota) government seats, a rank under ~25,000 (general category) is generally competitive. For state quota seats, cutoffs vary significantly by state — some states have seats available up to 40,000–60,000 rank." },
        { q: "What is the difference between AIQ and state quota?", a: "AIQ (15% of govt seats) is open to all candidates across India with higher competition. State quota (85% of govt seats) is reserved for candidates who studied/domiciled in that state, with relatively lower cutoffs." },
        { q: "How accurate is this NEET UG Rank Predictor?", a: "This predictor estimates rank based on historical score-rank correlations and general trends. Actual results vary with exam difficulty, candidate performance, and normalization. Use as a rough indicator, not a guaranteed prediction." },
      ]}
      howItWorks={[
        "Enter your expected or actual NEET marks out of 720.",
        "Select the exam difficulty level (easy, moderate, or tough).",
        "Enter total candidates (default: 24,00,000).",
        "Click Predict to see your percentile band, rank range, and government MBBS chances.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "NEET UG Rank Predictor", "applicationCategory": "EducationalApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Marks (out of 720)</label>
            <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g. 600" min="0" max="720" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Exam Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="tough">Tough</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Candidates</label>
            <input type="number" value={candidates} onChange={(e) => setCandidates(e.target.value)}
              placeholder="e.g. 2400000" min="1" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Predict
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Prediction</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Percentile</div>
                <div className="text-3xl font-black text-indigo-400">{result.percentile}</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Est. Rank</div>
                <div className="text-3xl font-black text-white">~{result.estimatedRank.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 font-medium">Rank Range</span>
                <span className="font-bold text-white">{result.rankLow.toLocaleString('en-IN')} – {result.rankHigh.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 px-4 rounded-xl bg-white/[0.04]">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Government MBBS Chance</div>
                <div className="text-sm font-bold text-emerald-400">{result.mbbsVerdict}</div>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-500 text-center leading-relaxed">
              ⚠️ Disclaimer: Rank predictions are estimates based on historical trends. AIQ (15%) is more competitive than state quota (85%). Cutoffs vary by category, state, and year. Always verify with NTA official results.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🩺</div>
            <p className="text-sm text-slate-600 font-medium">Enter your NEET details and click Predict</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
