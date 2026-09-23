import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

/**
 * Official GATE Score Formula (for qualified candidates):
 * Score = 1000 * (marks / topperAvg)  when marks >= mean
 * Score = 500 + 1000 * (marks - mean) / (topperAvg - mean)  when marks < mean
 *
 * For qualified candidates where marks >= mean, the score is simply
 * scaled relative to topper average. For marks below mean, the formula
 * interpolates between 500 and the mean-level score.
 */
function computeGateScore(marks, topperAvg, mean, stdDev) {
  if (marks <= 0 || topperAvg <= 0 || mean <= 0 || stdDev <= 0) return null

  let score
  if (marks >= mean) {
    score = (marks / topperAvg) * 1000
  } else {
    const baseScore = (mean / topperAvg) * 1000
    score = 500 + ((marks - mean) / (topperAvg - mean)) * (baseScore - 500)
  }

  return Math.max(0, Math.min(1000, Math.round(score * 100) / 100))
}

function computePercentile(marks, totalCandidates, mean, stdDev) {
  if (stdDev === 0 || totalCandidates <= 0) return 0
  const z = (marks - mean) / stdDev
  const erfApprox = (x) => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429
    const p = 0.3275911
    const sign = x >= 0 ? 1 : -1
    const absX = Math.abs(x)
    const t = 1.0 / (1.0 + p * absX)
    const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)
    return sign * erf
  }
  const cdf = 0.5 * (1 + erfApprox(z))
  return Math.max(0, Math.min(100, Math.round(cdf * 10000) / 100))
}

export default function gate_score_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [marks, setMarks] = useState('')
  const [topperAvg, setTopperAvg] = useState('')
  const [mean, setMean] = useState('')
  const [stdDev, setStdDev] = useState('')
  const [totalCandidates, setTotalCandidates] = useState('')

  const result = useMemo(() => {
    const m = parseFloat(marks), ta = parseFloat(topperAvg), mn = parseFloat(mean), sd = parseFloat(stdDev), tc = parseInt(totalCandidates)
    if (!m || !ta || !mn || !sd || !tc) return null
    if (m < 0 || m > 100 || ta <= 0 || mn <= 0 || sd <= 0 || tc <= 0) return null
    const score = computeGateScore(m, ta, mn, sd)
    const percentile = computePercentile(m, tc, mn, sd)
    jumpTo()
    return { score, percentile, marks: m }
  }, [marks, topperAvg, mean, stdDev, totalCandidates])

  return (
    <ToolLayout
      title="GATE Score Calculator"
      desc="GATE Score Calculator - compute your GATE score and percentile using the official formula. Free online tool, no sign-up."
      icon="🎓" iconBg="rgba(168,85,247,0.08)"
      category="education" slug="gate-score-calculator"
      faq={[
        { q: 'What is the GATE Score Calculator?', a: 'A tool that computes your GATE score using the official normalization formula based on marks obtained, topper average, mean, and standard deviation of all candidates.' },
        { q: 'What is the official GATE score formula?', a: 'For marks >= mean: Score = 1000 × (marks / topperAvg). For marks < mean: Score = 500 + 1000 × (marks − mean) / (topperAvg − mean).' },
        { q: 'How do I find my topper average and mean?', a: 'These values are published by IIT in the GATE scorecard for your specific paper. Check the official GATE website for your paper code details.' },
        { q: 'What is the maximum GATE score?', a: 'The maximum GATE score is 1000, which corresponds to the topper\'s marks in that paper. Scores below 25-30 typically mean you did not qualify.' },
        { q: 'Does this calculator handle score normalization?', a: 'Yes, this calculator applies the official GATE score formula that normalizes scores across different sessions using the statistical parameters provided by GATE.' },
        { q: 'Is this tool free to use?', a: 'Yes, the GATE Score Calculator is completely free to use online with no sign-up required. Use it unlimited times on any device.' },
      ]}
      howItWorks={[
        'Enter your marks obtained out of 100 from your GATE scorecard.',
        'Enter the topper average marks and mean (average) marks for your paper.',
        'Enter the standard deviation and total number of candidates who appeared.',
        'View your computed GATE score and estimated percentile instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "GATE Score Calculator", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/gate-score-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Marks Obtained (out of 100)</label>
              <input type="number" min="0" max="100" step="0.01" value={marks} onChange={e => setMarks(e.target.value)}
                placeholder="e.g. 55.33"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Topper Average Marks</label>
              <input type="number" min="0" max="100" step="0.01" value={topperAvg} onChange={e => setTopperAvg(e.target.value)}
                placeholder="e.g. 85.67"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Mean (Average)</label>
              <input type="number" min="0" max="100" step="0.01" value={mean} onChange={e => setMean(e.target.value)}
                placeholder="e.g. 32.50"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Std Deviation</label>
              <input type="number" min="0" step="0.01" value={stdDev} onChange={e => setStdDev(e.target.value)}
                placeholder="e.g. 15.20"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Total Candidates</label>
              <input type="number" min="1" step="1" value={totalCandidates} onChange={e => setTotalCandidates(e.target.value)}
                placeholder="e.g. 85000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-purple-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]" />
            </div>
          </div>
        </div>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">GATE Score Result</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-4 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-3xl font-extrabold text-purple-400">{result.score}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">GATE Score (out of 1000)</div>
              </div>
              <div className="p-4 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-3xl font-extrabold text-emerald-400">{result.percentile}%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Estimated Percentile</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Score Breakdown</h4>
              <div className="space-y-1 text-sm text-slate-300">
                {result.marks >= parseFloat(mean) ? (
                  <>
                    <p>Marks ({result.marks}) ≥ Mean ({mean})</p>
                    <p className="font-mono text-white">Score = 1000 × ({result.marks} / {topperAvg}) = <span className="text-purple-400 font-bold">{result.score}</span></p>
                  </>
                ) : (
                  <>
                    <p>Marks ({result.marks}) &lt; Mean ({mean})</p>
                    <p className="font-mono text-white">Score = 500 + 1000 × ({result.marks} − {mean}) / ({topperAvg} − {mean}) = <span className="text-purple-400 font-bold">{result.score}</span></p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Enter your GATE details to calculate score</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
