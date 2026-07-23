import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => isFinite(n) ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n) : '–'

export default function markup_margin_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [cost, setCost] = useState('40')
  const [sale, setSale] = useState('65')
  const [targetMargin, setTargetMargin] = useState('35')

  const calculate = useCallback(() => {
    const c = parseFloat(cost) || 0
    const s = parseFloat(sale) || 0
    const tm = parseFloat(targetMargin) || 0
    if (c < 0 || s <= 0) return null

    const profit = s - c
    const markup = c === 0 ? 0 : (profit / c) * 100
    const margin = s === 0 ? 0 : (profit / s) * 100
    const targetPrice = tm >= 100 ? Infinity : (1 - tm / 100) <= 0 ? Infinity : c / (1 - tm / 100)

    return { profit, markup, margin, tm, targetPrice }
  }, [cost, sale, targetMargin])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Markup vs Margin Calculator"
      desc="Calculate markup, gross margin, profit and selling price for products and services."
      icon="💲" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="markup-margin-calculator"
      faq={[
        { q: "What is the difference between markup and margin?", a: "Markup is profit as a percentage of cost. Margin is profit as a percentage of selling price. They are not the same and cannot be compared directly without conversion." },
        { q: "Who uses a markup and margin calculator?", a: "Retailers, ecommerce sellers, wholesalers, agencies, freelancers and manufacturers use it to set profitable prices and compare pricing strategies." },
      ]}
      howItWorks={[
        "Enter the cost price and selling price.",
        "Set your target margin percentage.",
        "View gross profit, markup, margin, and the price needed for your target margin.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Markup vs Margin Calculator", "applicationCategory": "BusinessApplication",
        "url": "https://www.uptools.in/markup-margin-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Cost Price</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)}
              placeholder="Enter cost price" min="0" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Selling Price</label>
            <input type="number" value={sale} onChange={(e) => setSale(e.target.value)}
              placeholder="Enter selling price" min="0" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Target Margin %</label>
            <input type="number" value={targetMargin} onChange={(e) => setTargetMargin(e.target.value)}
              placeholder="Enter target margin" min="0" max="99.99" step="0.01" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Gross Profit', value: fmt(result.profit), color: 'text-green-400' },
                { label: 'Markup', value: fmt(result.markup) + '%', color: 'text-white' },
                { label: 'Margin', value: fmt(result.margin) + '%', color: 'text-white' },
                { label: `Price for ${fmt(result.tm)}% margin`, value: Number.isFinite(result.targetPrice) ? fmt(result.targetPrice) : 'Not possible', color: 'text-indigo-400' },
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
            <div className="text-4xl mb-3 opacity-20">💲</div>
            <p className="text-sm text-slate-600 font-medium">Enter prices and click Calculate</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-slate-300 mb-2">Markup</h3>
            <p className="text-xs text-slate-400">Profit divided by cost. Example: buy for 40, sell for 60. Profit is 20, markup is 50%.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-5">
            <h3 className="text-sm font-bold text-slate-300 mb-2">Margin</h3>
            <p className="text-xs text-slate-400">Profit divided by selling price. On the same example, 20 profit on 60 sale price gives 33.33% margin.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
