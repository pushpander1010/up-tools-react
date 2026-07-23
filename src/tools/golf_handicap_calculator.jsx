import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function golf_handicap_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [gross, setGross] = useState('')
  const [par, setPar] = useState('72')
  const [rating, setRating] = useState('72.0')
  const [slope, setSlope] = useState('113')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const g = parseInt(gross) || 0
    const p = parseInt(par) || 72
    const r = parseFloat(rating) || 72.0
    const s = parseInt(slope) || 113
    if (g === 0) return

    const netScore = g - p
    const handicapDifferential = (g - r) * (113 / s)
    const courseHandicap = Math.round(handicapDifferential * (s / 113))

    setResult({ gross: g, netScore, handicapDifferential: handicapDifferential.toFixed(1), courseHandicap })
  }, [gross, par, rating, slope])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Golf Handicap Calculator"
      desc="Calculate your golf handicap index, course handicap, and net score."
      icon="⛳" iconBg="rgba(34,197,94,0.08)"
      category="sports" slug="golf-handicap-calculator"
      faq={[
        { q: "What is a golf handicap?", a: "A golf handicap is a numerical measure of a golfer's potential ability. It allows players of different skill levels to compete fairly." },
        { q: "How is handicap differential calculated?", a: "Handicap Differential = (Gross Score - Course Rating) × (113 / Slope Rating). This adjusts for course difficulty." },
      ]}
      howItWorks={[
        "Enter your gross score, course par, course rating, and slope rating.",
        "Click Calculate to compute your handicap differential and course handicap.",
        "Net score shows your performance relative to par after handicap adjustment.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: "Golf Handicap Calculator", "applicationCategory": "UtilitiesApplication",
        url: "https://www.uptools.in/golf-handicap-calculator/",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-bold text-white">Score Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Gross Score', gross, setGross, '0', false],
              ['Course Par', par, setPar, '72', false],
              ['Course Rating', rating, setRating, '72.0', false],
              ['Slope Rating', slope, setSlope, '113', false],
            ].map(([label, val, setter, ph]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                <input type="number" min="0" step={label === 'Course Rating' ? '0.1' : '1'} value={val}
                  onChange={e => setter(e.target.value)} placeholder={ph} className={inputClass} />
              </div>
            ))}
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-all">
            Calculate
          </button>
        </div>

        {result ? (
          <div ref={resultRef} className="bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent border-2 border-emerald-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Handicap Results</h3>
            </div>
            <div className="space-y-2">
              {[
                ['Gross Score', result.gross],
                ['Net Score', <span>{result.netScore > 0 ? '+' : ''}{result.netScore}</span>],
                ['Handicap Differential', result.handicapDifferential],
                ['Course Handicap', <span className="text-emerald-400 font-extrabold">{result.courseHandicap}</span>],
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
            <div className="text-4xl mb-3 opacity-20">⛳</div>
            <p className="text-sm text-slate-600">Enter your score to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
