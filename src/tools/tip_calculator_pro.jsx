import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIP_PRESETS = [10, 15, 20, 25]

export default function tip_calculator_pro() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [bill, setBill] = useState('')
  const [tipPct, setTipPct] = useState(15)
  const [split, setSplit] = useState(1)

  const results = useMemo(() => {
    const b = parseFloat(bill) || 0
    const t = tipPct || 0
    const s = Math.max(1, split || 1)
    const tipAmount = b * t / 100
    const total = b + tipAmount
    const perPerson = total / s
    return { tipAmount, total, perPerson }
  }, [bill, tipPct, split])

  const fmt = (n) => '$' + n.toFixed(2)
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Tip Calculator"
      desc="Calculate tips, total bill, and per-person amount. Split restaurant bills, adjust tip percentage, and see the breakdown instantly."
      icon="💰" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="tip-calculator-pro"
      faq={[
        { q: 'What is a good tip percentage?', a: 'In the US, 15-20% is standard for restaurant service. 25%+ for exceptional service. Some countries include tip in the bill.' },
        { q: 'How do I split the bill?', a: 'Enter the total bill amount, set the tip percentage, then enter how many people are splitting. The per-person amount updates instantly.' },
        { q: 'Does this include tax?', a: 'Enter the bill amount after tax. The tip is calculated on whatever amount you enter.' },
      ]}
      howItWorks={[
        'Enter the bill amount.',
        'Select or type the tip percentage.',
        'Set the number of people splitting the bill.',
        'See tip, total, and per-person amount instantly.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Tip Calculator", "applicationCategory": "UtilitiesApplication",
        "url": "https://www.uptools.in/tip-calculator-pro/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Bill Amount ($)</label>
            <input type="number" value={bill} onChange={e => setBill(e.target.value)}
              placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Tip %</label>
            <input type="number" value={tipPct} onChange={e => setTipPct(Number(e.target.value))}
              className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Split Between</label>
            <input type="number" min={1} value={split} onChange={e => setSplit(Math.max(1, parseInt(e.target.value) || 1))}
              className={inputClass} />
          </div>
        </div>

        {/* Tip Presets */}
        <div className="flex gap-2">
          {TIP_PRESETS.map(t => (
            <button key={t} onClick={() => setTipPct(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tipPct === t ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/8 hover:text-white'}`}>
              {t}%
            </button>
          ))}
        </div>

        {/* Results */}
        <div ref={resultRef} className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-extrabold text-green-400">{fmt(results.tipAmount)}</div>
            <div className="text-xs text-slate-500 mt-1">Tip</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-extrabold text-indigo-400">{fmt(results.total)}</div>
            <div className="text-xs text-slate-500 mt-1">Total</div>
          </div>
          <div className="text-center p-4 bg-black/20 rounded-xl">
            <div className="text-2xl font-extrabold text-amber-400">{fmt(results.perPerson)}</div>
            <div className="text-xs text-slate-500 mt-1">Per Person</div>
          </div>
        </div>

        {split > 1 && (
          <div className="text-center text-xs text-slate-500">
            Splitting {fmt(results.total)} between {split} people
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
