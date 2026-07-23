import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-'

export default function roi_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [initial, setInitial] = useState('')
  const [finalVal, setFinalVal] = useState('')

  const ini = parseFloat(initial) || 0
  const fin = parseFloat(finalVal) || 0

  const result = useMemo(() => {
    if (ini <= 0) return null
    const profit = fin - ini
    const roi = (profit / ini) * 100
    const multiplier = fin / ini
    return { profit, roi, multiplier }
  }, [ini, fin])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="ROI Calculator"
      desc="Calculate return on investment (ROI) for your business or investments. Measure profitability."
      icon="📊" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="roi-calculator"
      faq={[
        { q: 'What is ROI?', a: 'ROI = ((Final Value - Initial Investment) / Initial Investment) × 100. It measures investment profitability.' },
        { q: 'What does a positive ROI mean?', a: 'A positive ROI means your investment gained value. Higher ROI indicates better performance.' },
      ]}
      howItWorks={[
        'Enter the initial investment amount.',
        'Enter the final value of the investment.',
        'View ROI percentage, profit, and investment multiplier.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "ROI Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/roi-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Initial Investment ($)</label>
            <input type="number" value={initial} onChange={e => setInitial(e.target.value)}
              placeholder="Enter amount" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Final Value ($)</label>
            <input type="number" value={finalVal} onChange={e => setFinalVal(e.target.value)}
              placeholder="Enter amount" min="0" className={inputClass} />
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate ROI
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">ROI Result</h3>
            </div>
            <div className="text-center mb-4">
              <div className={`text-4xl font-extrabold ${result.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{result.roi.toFixed(2)}%</div>
              <p className="text-sm text-slate-400 mt-1">Return on Investment</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Profit</div>
                <div className={`text-lg font-extrabold ${result.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.profit >= 0 ? '+' : ''}{fmt(result.profit)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Multiplier</div>
                <div className="text-lg font-extrabold text-white">{result.multiplier.toFixed(2)}x</div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter investment details to calculate ROI</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
