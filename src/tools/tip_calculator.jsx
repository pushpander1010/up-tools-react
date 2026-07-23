import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const TIP_PRESETS = [10, 15, 18, 20, 25]

export default function tip_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [bill, setBill] = useState('100')
  const [tipPct, setTipPct] = useState(18)
  const [people, setPeople] = useState('1')

  const results = useMemo(() => {
    const b = parseFloat(bill) || 0
    const t = tipPct / 100
    const p = parseInt(people) || 1
    const tipAmt = b * t
    const total = b + tipAmt
    const perPerson = total / p
    return { tipAmt, total, perPerson }
  }, [bill, tipPct, people])

  const fmt = n => '$' + n.toFixed(2)

  return (
    <ToolLayout
      title="Tip Calculator"
      desc="Calculate tip amount, total bill, and per-person split instantly."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="tip-calculator"
      faq={[
        { q: 'What is a standard tip?', a: 'In the US, 15-20% is standard for good service. 18-20% is common for restaurants.' },
        { q: 'Should I tip on pre-tax or post-tax?', a: 'Most people tip on the pre-tax amount, though it\'s a personal choice.' },
      ]}
      howItWorks={[
        'Enter the bill amount.',
        'Select a tip percentage or type a custom value.',
        'Set the number of people to split the bill.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Tip Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/tip-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Bill Amount */}
        <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Bill Amount ($)</label>
            <input type="number" value={bill} onChange={e => setBill(e.target.value)}
              placeholder="0.00" min="0" step="0.01"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>

          {/* Tip Percentage */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tip Percentage</label>
            <div className="flex gap-2">
              {TIP_PRESETS.map(pct => (
                <button key={pct} onClick={() => setTipPct(pct)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    tipPct === pct
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-white/[0.06] text-slate-500 border border-white/[0.08] hover:text-white'
                  }`}>
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Custom Tip %</label>
            <input type="number" value={tipPct} onChange={e => { setTipPct(Number(e.target.value) || 0) }}
              min="0" max="100" step="0.1"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Number of People</label>
            <input type="number" value={people} onChange={e => setPeople(e.target.value)}
              min="1" step="1"
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>
        </div>

        {/* Results */}
        <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6"
          style={{ animation: 'slideUp 0.35s ease-out' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Results</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-slate-400">Tip Amount</span>
              <span className="text-sm font-bold text-white">{fmt(results.tipAmt)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-slate-400">Total Amount</span>
              <span className="text-sm font-bold text-white">{fmt(results.total)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-400">Per Person</span>
              <span className="text-xl font-extrabold text-amber-400">{fmt(results.perPerson)}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
