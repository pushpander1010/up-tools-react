import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function cagr_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [start, setStart] = useState('100000')
  const [end, setEnd] = useState('250000')
  const [years, setYears] = useState('5')
  const [decimals, setDecimals] = useState('2')

  const s = parseFloat(start) || 0
  const e = parseFloat(end) || 0
  const y = parseFloat(years) || 0
  const d = parseInt(decimals, 10) || 2

  const result = useMemo(() => {
    if (s <= 0 || e < 0 || y <= 0) return null
    const cagr = Math.pow(e / s, 1 / y) - 1
    const totalGrowth = ((e - s) / s) * 100
    return { cagr: (cagr * 100).toFixed(d), totalGrowth: totalGrowth.toFixed(d), multiplier: (e / s).toFixed(4) }
  }, [s, e, y, d])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="CAGR Calculator"
      desc="Calculate Compound Annual Growth Rate (CAGR) for any investment. See total growth and equivalent multiplier."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="cagr-calculator"
      faq={[
        { q: 'What is CAGR?', a: 'CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a period longer than one year. It smooths out volatility to show a steady rate of return.' },
        { q: 'How is CAGR calculated?', a: 'CAGR = (Ending Value / Starting Value)^(1/Number of Years) - 1' },
      ]}
      howItWorks={[
        'Enter the starting value of your investment.',
        'Enter the ending (current) value.',
        'Set the number of years.',
        'View your CAGR percentage, total growth, and multiplier.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CAGR Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/cagr-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Starting Value</label>
              <input type="number" value={start} onChange={e => setStart(e.target.value)}
                placeholder="e.g. 100000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Ending Value</label>
              <input type="number" value={end} onChange={e => setEnd(e.target.value)}
                placeholder="e.g. 250000" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Years</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)}
                min="1" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Decimals</label>
              <input type="number" value={decimals} onChange={e => setDecimals(e.target.value)}
                min="0" max="4" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Results</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold text-emerald-400">{result.cagr}%</div>
              <div className="text-sm text-slate-400 mt-1">CAGR</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center">
                <div className="text-lg font-extrabold text-white">{result.totalGrowth}%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Growth</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center">
                <div className="text-lg font-extrabold text-white">{result.multiplier}x</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Multiplier</div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Enter values to calculate CAGR</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
