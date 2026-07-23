import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => isFinite(n) ? new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) : '–'

const SLABS = [[100, 5.5], [100, 6.5], [200, 7.5], [99999, 8.5]]
const FIXED_CHARGE = 50

export default function electricity_bill_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [units, setUnits] = useState('')

  const calculate = useCallback(() => {
    const u = parseFloat(units) || 0
    if (u <= 0) return null

    let cost = 0
    let rem = u
    for (const [lim, rate] of SLABS) {
      if (rem <= 0) break
      const used = Math.min(rem, lim)
      cost += used * rate
      rem -= used
    }
    const total = cost + FIXED_CHARGE

    return { units: u, cost, fixed: FIXED_CHARGE, total }
  }, [units])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Electricity Bill Calculator"
      desc="Calculate your electricity bill based on slab rates. Free online tool by UpTools."
      icon="⚡" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="electricity-bill-calculator"
      faq={[
        { q: "How are electricity bills calculated?", a: "Electricity bills are calculated using a slab-based system where different rates apply to different usage ranges. Higher consumption typically means higher rates per unit." },
        { q: "What is the fixed charge?", a: "A fixed charge (₹50 in this calculator) is added regardless of usage. It covers infrastructure and maintenance costs." },
      ]}
      howItWorks={[
        "Enter the number of units (kWh) consumed.",
        "Click Calculate to see the energy cost, fixed charge, and total bill.",
        "The slab rates are: 0-100 units at ₹5.5, 100-200 at ₹6.5, 200-400 at ₹7.5, 400+ at ₹8.5.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Electricity Bill Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/electricity-bill-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Units Consumed (kWh)</label>
            <input type="number" value={units} onChange={(e) => setUnits(e.target.value)}
              placeholder="Enter units" min="0" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Bill Summary</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Units', value: result.units + ' kWh', color: 'text-white' },
                { label: 'Energy Cost', value: fmt(result.cost), color: 'text-white' },
                { label: 'Fixed Charge', value: fmt(result.fixed), color: 'text-white' },
                { label: 'Estimated Bill', value: fmt(result.total), color: 'text-amber-400' },
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
            <div className="text-4xl mb-3 opacity-20">⚡</div>
            <p className="text-sm text-slate-600 font-medium">Enter units and click Calculate</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-2">Slab Rates</h3>
          <div className="space-y-1 text-xs text-slate-400">
            <div>0–100 units: ₹5.50/unit</div>
            <div>100–200 units: ₹6.50/unit</div>
            <div>200–400 units: ₹7.50/unit</div>
            <div>400+ units: ₹8.50/unit</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
