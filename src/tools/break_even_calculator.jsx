import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v)

export default function break_even_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [fixedCost, setFixedCost] = useState('5000')
  const [pricePerUnit, setPricePerUnit] = useState('50')
  const [variableCost, setVariableCost] = useState('20')
  const [targetProfit, setTargetProfit] = useState('2000')

  const result = useMemo(() => {
    const fixed = Number(fixedCost) || 0
    const price = Number(pricePerUnit) || 0
    const variable = Number(variableCost) || 0
    const target = Number(targetProfit) || 0
    const contribution = price - variable
    if (price <= 0 || contribution <= 0) return null
    const breakEvenUnits = fixed / contribution
    const breakEvenRevenue = breakEvenUnits * price
    const targetUnits = (fixed + target) / contribution
    return { breakEvenUnits: Math.ceil(breakEvenUnits), breakEvenRevenue, contribution, targetUnits: Math.ceil(targetUnits) }
  }, [fixedCost, pricePerUnit, variableCost, targetProfit])

  const inputClass = "w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-600"

  return (
    <ToolLayout
      title="Break-Even Calculator"
      desc="Find the sales volume and revenue needed to cover costs. Useful for product launches, pricing, and subscription businesses."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="break-even-calculator"
      faq={[
        { q: 'What is a break-even point?', a: 'The break-even point is where total revenue equals total cost, so profit is zero.' },
        { q: 'Who uses this calculator?', a: 'Founders, ecommerce sellers, freelancers, agencies, retailers and product teams use it to price offers and forecast sales targets.' },
      ]}
      howItWorks={[
        'Enter your fixed costs, selling price per unit, and variable cost per unit.',
        'Optionally enter a target profit.',
        'Results auto-calculate as you type.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Break-Even Calculator", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/break-even-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Inputs */}
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Inputs</h3>
            {[
              ['Fixed Costs', fixedCost, setFixedCost],
              ['Selling Price Per Unit', pricePerUnit, setPricePerUnit],
              ['Variable Cost Per Unit', variableCost, setVariableCost],
              ['Target Profit', targetProfit, setTargetProfit],
            ].map(([label, val, set]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
                <input type="number" min="0" step="0.01" value={val} onChange={e => set(e.target.value)} className={inputClass} />
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="p-5 rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <h3 className="text-sm font-bold text-slate-300 mb-4">Results</h3>
            {result ? (
              <div ref={resultRef} className="space-y-3" style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
                {[
                  ['Break-Even Units', fmt(result.breakEvenUnits)],
                  ['Break-Even Revenue', fmt(result.breakEvenRevenue)],
                  ['Contribution Margin', fmt(result.contribution)],
                  ['Units for Target Profit', fmt(result.targetUnits)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-sm font-bold text-white font-mono">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600 text-sm">
                Enter values to see results
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
