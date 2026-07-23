import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function overtime_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [rate, setRate] = useState('20')
  const [regular, setRegular] = useState('40')
  const [overtime, setOvertime] = useState('8')
  const [multiplier, setMultiplier] = useState('1.5')
  const [result, setResult] = useState(null)

  const fmt = n => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)

  const calculate = useCallback(() => {
    const r = Number(rate) || 0
    const reg = Number(regular) || 0
    const ot = Number(overtime) || 0
    const m = Number(multiplier) || 1.5
    const regularPay = r * reg
    const overtimePay = r * m * ot
    const total = regularPay + overtimePay
    const avg = total / Math.max(reg + ot, 1)
    setResult({ regularPay, overtimePay, total, avg, fmt })
  }, [rate, regular, overtime, multiplier])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Overtime Calculator"
      desc="Calculate regular pay, overtime pay and total weekly earnings from hourly wages and worked hours."
      icon="💰" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="overtime-calculator"
      faq={[
        { q: "How is overtime pay calculated?", a: "Overtime pay is usually calculated by multiplying the base hourly wage by an overtime multiplier such as 1.5x or 2x for hours worked beyond a regular threshold." },
        { q: "Can I use a custom overtime multiplier?", a: "Yes. This calculator supports custom overtime multipliers because overtime rules vary by employer and country." },
      ]}
      howItWorks={[
        "Enter your hourly rate, regular hours, and overtime hours.",
        "Select or enter an overtime multiplier (1.5x, 2x, etc.).",
        "View regular pay, overtime pay, and total earnings instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Overtime Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/overtime-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Hourly Rate ($)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)}
              min="0" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Regular Hours</label>
            <input type="number" value={regular} onChange={e => setRegular(e.target.value)}
              min="0" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Overtime Hours</label>
            <input type="number" value={overtime} onChange={e => setOvertime(e.target.value)}
              min="0" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">OT Multiplier</label>
            <select value={multiplier} onChange={e => setMultiplier(e.target.value)} className={selectClass}>
              <option value="1.25" className="bg-gray-900">1.25x</option>
              <option value="1.5" className="bg-gray-900">1.5x</option>
              <option value="1.75" className="bg-gray-900">1.75x</option>
              <option value="2" className="bg-gray-900">2x</option>
            </select>
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Earnings Breakdown</h3>
            </div>
            <div className="text-2xl font-extrabold text-white mb-4">${fmt(result.total)}</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-slate-300 text-sm">Regular Pay</span>
                <span className="text-white font-bold">${fmt(result.regularPay)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-slate-300 text-sm">Overtime Pay</span>
                <span className="text-white font-bold">${fmt(result.overtimePay)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-300 text-sm">Effective Hourly Average</span>
                <span className="text-emerald-400 font-bold">${fmt(result.avg)}</span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter values and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
