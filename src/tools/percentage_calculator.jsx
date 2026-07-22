import useJumpToResult from '../hooks/useJumpToResult'
import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const MODES = [
  { id: 'of', label: 'X% of Y', desc: 'What is X% of Y?' },
  { id: 'is', label: 'X is what % of Y', desc: 'X is what percentage of Y?' },
  { id: 'change', label: '% Change', desc: 'Percentage change from X to Y' },
  { id: 'increase', label: 'Increase by %', desc: 'Increase X by Y%' },
  { id: 'decrease', label: 'Decrease by %', desc: 'Decrease X by Y%' },
]

export default function percentage_calculator() {

  const { ref: resultRef, trigger, reset } = useJumpToResult()
  const [mode, setMode] = useState('of')
  const [x, setX] = useState('')
  const [y, setY] = useState('')

  const result = useMemo(() => {
    const a = parseFloat(x) || 0
    const b = parseFloat(y) || 0
    if (mode === 'of') return (a / 100) * b
    if (mode === 'is') return b !== 0 ? (a / b) * 100 : 0
    if (mode === 'change') return b !== 0 ? ((b - a) / a) * 100 : 0
    if (mode === 'increase') return a * (1 + b / 100)
    if (mode === 'decrease') return a * (1 - b / 100)
    return 0
  }, [x, y, mode])
  if (result !== null && result !== undefined && result !== 0) trigger()

  const fmt = (n) => {
    if (Number.isInteger(n)) return n.toLocaleString()
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  return (
    <ToolLayout
      title="Percentage Calculator"
      desc="Calculate percentages, percentage change, increase/decrease, and find what percent X is of Y."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="percentage-calculator"
      faq={[
        { q: 'How do I calculate X% of Y?', a: 'Multiply X by Y and divide by 100. Example: 15% of 200 = 15 × 200 / 100 = 30.' },
        { q: 'How do I find percentage increase?', a: '(New - Old) / Old × 100. Example: from 80 to 100 = (100-80)/80 × 100 = 25% increase.' },
      ]}
      howItWorks={[
        'Select the calculation mode.',
        'Enter the values in the input fields.',
        'View the result instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Percentage Calculator", "applicationCategory": "CalculatorApplication",
        "url": "https://www.uptools.in/percentage-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${mode === m.id ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-white/[0.06] border-white/8 text-slate-400 hover:border-white/12'}`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {mode === 'of' ? 'Percentage (%)' : mode === 'is' ? 'Value (X)' : mode === 'change' ? 'From Value' : 'Value'}
            </label>
            <input type="number" value={x} onChange={e => setX(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-white/8" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {mode === 'of' ? 'Of Value' : mode === 'is' ? 'Total (Y)' : mode === 'change' ? 'To Value' : 'Percentage (%)'}
            </label>
            <input type="number" value={y} onChange={e => setY(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-white/8" />
          </div>
        </div>

        {/* Result */}
        {(x || y) && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/8 via-white/[0.02] to-transparent border border-emerald-500/15 text-center" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Result</div>
            <div ref={resultRef} className="text-4xl font-extrabold text-emerald-400">{fmt(result)}</div>
            {mode === 'is' && <div className="text-sm text-slate-400 mt-2">{x} is {fmt(result)}% of {y}</div>}
            {mode === 'change' && <div className="text-sm text-slate-400 mt-2">{result >= 0 ? '↑' : '↓'} {Math.abs(fmt(result))}% {result >= 0 ? 'increase' : 'decrease'}</div>}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
