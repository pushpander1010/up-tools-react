import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cat_percentile_predictor() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [rawScore, setRawScore] = useState('')
  const [difficulty, setDifficulty] = useState('moderate')
  const [candidates, setCandidates] = useState('330000')

  const calculate = useCallback(() => {
    const raw = parseFloat(rawScore) || 0
    const totalCandidates = parseInt(candidates) || 330000

    if (raw <= 0) return null

    // CAT has 3 sections (QA, DILR, VARC), each 100 marks. Max = 300 scaled, but raw scores vary.
    // Approximate scaling: raw score is typically out of ~200-260 depending on paper.
    // We apply a difficulty-based multiplier to normalize to a 300-point scale.
    let difficultyMultiplier = 1.0
    if (difficulty === 'easy') difficultyMultiplier = 0.88
    else if (difficulty === 'moderate') difficultyMultiplier = 1.0
    else difficultyMultiplier = 1.12

    const normalizedScore = Math.min(300, Math.round(raw * difficultyMultiplier))

    // Percentile estimation based on historical CAT score-percentile mapping
    // Approximate curve: 99.9 at ~250+, 99 at ~190, 95 at ~140, 90 at ~110, 80 at ~80
    let percentile
    if (normalizedScore >= 260) percentile = 99.95
    else if (normalizedScore >= 240) percentile = 99.9
    else if (normalizedScore >= 220) percentile = 99.7
    else if (normalizedScore >= 200) percentile = 99.3
    else if (normalizedScore >= 190) percentile = 99.0
    else if (normalizedScore >= 170) percentile = 98.0
    else if (normalizedScore >= 155) percentile = 97.0
    else if (normalizedScore >= 140) percentile = 95.0
    else if (normalizedScore >= 125) percentile = 93.0
    else if (normalizedScore >= 110) percentile = 90.0
    else if (normalizedScore >= 95) percentile = 85.0
    else if (normalizedScore >= 80) percentile = 80.0
    else if (normalizedScore >= 65) percentile = 70.0
    else if (normalizedScore >= 50) percentile = 60.0
    else if (normalizedScore >= 35) percentile = 45.0
    else if (normalizedScore >= 20) percentile = 30.0
    else percentile = 15.0

    // IIM call verdict
    let callVerdict = ''
    if (percentile >= 99.5) callVerdict = 'Strong chance at old IIMs (A, B, C, L, I, K)'
    else if (percentile >= 99.0) callVerdict = 'Good chance at old IIMs — borderline for IIM A/B/C'
    else if (percentile >= 97.0) callVerdict = 'Likely calls from new IIMs (Shillong, Ranchi, Trichy, etc.)'
    else if (percentile >= 95.0) callVerdict = 'Strong chance at new IIMs, possible baby IIM shortlists'
    else if (percentile >= 90.0) callVerdict = 'Baby IIMs (Amritsar, Bodh Gaya, etc.) and top non-IIM B-schools'
    else if (percentile >= 85.0) callVerdict = 'Some baby IIMs and private B-schools may shortlist'
    else callVerdict = 'Top private B-schools recommended — IIM calls unlikely'

    // Rank range
    const rankHigh = Math.max(1, Math.round(totalCandidates * (1 - percentile / 100) * 0.7))
    const rankLow = Math.max(1, Math.round(totalCandidates * (1 - percentile / 100) * 1.3))

    return { normalizedScore, percentile, callVerdict, rankLow: Math.min(rankLow, rankHigh), rankHigh: Math.max(rankLow, rankHigh) }
  }, [rawScore, difficulty, candidates])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="CAT Percentile Predictor"
      desc="Predict your CAT scaled score, percentile range, and IIM call chances based on raw score and slot difficulty."
      icon="🎯" iconBg="rgba(99,102,241,0.08)"
      category="education" slug="cat-percentile-predictor"
      faq={[
        { q: "How is the CAT scaled score calculated?", a: "CAT uses a normalization process across three slots to ensure fairness. Raw scores are converted to scaled scores based on slot difficulty. Easier slots have lower multipliers, tougher slots have higher multipliers." },
        { q: "What percentile do I need for old IIMs?", a: "For IIM Ahmedabad, Bangalore, and Calcutta, you typically need 99+ percentile. For IIM Lucknow, Indore, and Kozhikode, 97–99 percentile can get you a shortlist, depending on your profile." },
        { q: "How accurate is this CAT Percentile Predictor?", a: "This predictor provides an estimate based on historical CAT score-percentile curves and approximate normalization. Actual percentiles depend on the difficulty distribution of your slot and the overall candidate performance. Use as a rough guide." },
        { q: "What is the difference between raw score and scaled score?", a: "Raw score is the number of marks you scored directly from correct answers minus negative marking. Scaled score is the normalized version adjusted for slot difficulty — this is what determines your percentile rank." },
      ]}
      howItWorks={[
        "Enter your estimated raw score out of the total marks.",
        "Select your slot difficulty: easy, moderate, or tough.",
        "Enter total candidates appearing (default: 3,30,000).",
        "Click Predict to see your estimated scaled score, percentile range, and IIM call verdict.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CAT Percentile Predictor", "applicationCategory": "EducationalApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Estimated Raw Score</label>
            <input type="number" value={rawScore} onChange={(e) => setRawScore(e.target.value)}
              placeholder="e.g. 120" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Slot Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="tough">Tough</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Candidates</label>
            <input type="number" value={candidates} onChange={(e) => setCandidates(e.target.value)}
              placeholder="e.g. 330000" min="1" className={inputClass} />
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
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Scaled Score</div>
                <div className="text-3xl font-black text-white">{result.normalizedScore}</div>
                <div className="text-xs text-slate-500 mt-1">out of 300</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.04]">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Percentile</div>
                <div className="text-3xl font-black text-indigo-400">{result.percentile}</div>
                <div className="text-xs text-slate-500 mt-1">approximate</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 font-medium">Estimated Rank Range</span>
                <span className="font-bold text-white">{result.rankLow.toLocaleString('en-IN')} – {result.rankHigh.toLocaleString('en-IN')}</span>
              </div>
              <div className="py-3 px-4 rounded-xl bg-white/[0.04]">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">IIM Call Verdict</div>
                <div className="text-sm font-bold text-emerald-400">{result.callVerdict}</div>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-500 text-center leading-relaxed">
              ⚠️ Disclaimer: Percentile predictions are estimates based on historical curves. Actual normalization depends on slot-wise difficulty adjustment by IIMs. Use as a rough indicator only.
            </p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎯</div>
            <p className="text-sm text-slate-600 font-medium">Enter your CAT details and click Predict</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
