import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MODES = [
  { id: 'pct', label: '% of Number', icon: '%' },
  { id: 'what', label: 'What %', icon: '?' },
  { id: 'change', label: '% Change', icon: '↕' },
]

export default function percentage_calculator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [mode, setMode] = useState('pct')
  const [a1, setA1] = useState('')
  const [b1, setB1] = useState('')
  const [a2, setA2] = useState('')
  const [b2, setB2] = useState('')
  const [a3, setA3] = useState('')
  const [b3, setB3] = useState('')

  const results = useMemo(() => {
    const pctOf = (a1 && b1) ? (parseFloat(a1) / 100 * parseFloat(b1)).toFixed(2) : '0'
    const whatPct = (a2 && b2 && parseFloat(b2) !== 0) ? (parseFloat(a2) / parseFloat(b2) * 100).toFixed(2) + '%' : '0%'
    let changeVal = 0
    let changeText = '0%'
    let changeColor = '#6366f1'
    if (a3 && b3 && parseFloat(a3) !== 0) {
      changeVal = ((parseFloat(b3) - parseFloat(a3)) / parseFloat(a3)) * 100
      changeText = (changeVal >= 0 ? '+' : '') + changeVal.toFixed(2) + '%'
      changeColor = changeVal >= 0 ? '#22c55e' : '#ef4444'
    }
    return { pctOf, whatPct, changeText, changeColor }
  }, [a1, b1, a2, b2, a3, b3])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Percentage Calculator"
      desc="Calculate percentages, percentage change, and increase/decrease with 4 modes."
      icon="%" iconBg="rgba(99,102,241,0.08)"
      category="math" slug="percentage-calculator-pro"
      faq={[
        { q: 'What are the 4 modes?', a: 'Calculate what percentage X is of Y, find what percent X is of Y, compute percentage increase/decrease, and calculate a percentage of a number.' },
        { q: 'How do I calculate a tip?', a: 'Use "% of Number" mode: enter the tip percentage and the bill amount.' },
        { q: 'How do I calculate profit margin?', a: 'Use "What %" mode: enter profit as the first number and revenue as the second.' },
      ]}
      howItWorks={[
        'Select a mode: % of Number, What %, or % Change.',
        'Enter the values in the input fields.',
        'Results update instantly as you type.',
        'Switch modes to perform different calculations.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Percentage Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/percentage-calculator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === m.id ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:text-slate-300'}`}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Mode 1: % of Number */}
        {mode === 'pct' && (
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">What %</label>
                <input type="number" value={a1} onChange={e => setA1(e.target.value)}
                  placeholder="e.g. 15" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">of</label>
                <input type="number" value={b1} onChange={e => setB1(e.target.value)}
                  placeholder="e.g. 200" className={inputClass} />
              </div>
            </div>
            <div ref={resultRef} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-400">{results.pctOf}</div>
              <div className="text-xs text-slate-500 mt-1">Result</div>
            </div>
          </div>
        )}

        {/* Mode 2: What % */}
        {mode === 'what' && (
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">is</label>
                <input type="number" value={a2} onChange={e => setA2(e.target.value)}
                  placeholder="e.g. 30" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">of</label>
                <input type="number" value={b2} onChange={e => setB2(e.target.value)}
                  placeholder="e.g. 200" className={inputClass} />
              </div>
            </div>
            <div ref={resultRef} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-400">{results.whatPct}</div>
              <div className="text-xs text-slate-500 mt-1">Result</div>
            </div>
          </div>
        )}

        {/* Mode 3: % Change */}
        {mode === 'change' && (
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">From</label>
                <input type="number" value={a3} onChange={e => setA3(e.target.value)}
                  placeholder="e.g. 50" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">To</label>
                <input type="number" value={b3} onChange={e => setB3(e.target.value)}
                  placeholder="e.g. 75" className={inputClass} />
              </div>
            </div>
            <div ref={resultRef} className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: results.changeColor }}>{results.changeText}</div>
              <div className="text-xs text-slate-500 mt-1">Change</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
