import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function salary_hike_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [currentSalary, setCurrentSalary] = useState('')
  const [hikePercent, setHikePercent] = useState('10')

  const current = parseFloat(currentSalary) || 0
  const hike = parseFloat(hikePercent) || 0

  const result = useMemo(() => {
    if (current <= 0) return null
    const increase = current * (hike / 100)
    const newAnnual = current + increase
    return {
      current, hike: hike, increase, newAnnual,
      newMonthly: newAnnual / 12, newWeekly: newAnnual / 52, newDaily: newAnnual / 365,
    }
  }, [current, hike])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Salary Hike Calculator"
      desc="Calculate your new salary after a percentage hike. See annual, monthly, weekly, and daily breakdowns."
      icon="💸" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="salary-hike-calculator"
      faq={[
        { q: 'How is salary hike calculated?', a: 'New Salary = Current Salary × (1 + Hike%). Increase = Current Salary × Hike%.' },
        { q: 'What is a good salary hike?', a: 'In India, 8-15% is average, 15-25% is good, and 25%+ is excellent. Job switches typically command 20-50% hikes.' },
      ]}
      howItWorks={[
        'Enter your current annual CTC (Cost to Company).',
        'Set the hike percentage you expect or received.',
        'View new annual, monthly, weekly, and daily salary breakdowns.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Salary Hike Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/salary-hike-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Current Annual CTC (₹)</label>
            <input type="number" value={currentSalary} onChange={e => setCurrentSalary(e.target.value)}
              placeholder="e.g. 1200000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Hike Percentage (%)</label>
            <input type="number" value={hikePercent} onChange={e => setHikePercent(e.target.value)}
              step="0.5" className={inputClass} />
            <div className="flex gap-1.5 mt-2">
              {[10, 15, 20, 30, 50].map(h => (
                <button key={h} onClick={() => setHikePercent(String(h))}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.1] transition-all font-semibold">
                  {h}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Salary Breakdown</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Current CTC</span>
                <span className="text-sm font-bold text-white">{fmt(result.current)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Hike</span>
                <span className="text-sm font-bold text-amber-400">{result.hike.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Increase</span>
                <span className="text-sm font-bold text-emerald-400">+{fmt(result.increase)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-sm font-bold text-white">New Annual CTC</span>
                <span className="text-lg font-extrabold text-emerald-400">{fmt(result.newAnnual)}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-white">{fmt(result.newMonthly)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Monthly</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-white">{fmt(result.newWeekly)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Weekly</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-white">{fmt(result.newDaily)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Daily</div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💸</div>
            <p className="text-sm text-slate-600 font-medium">Enter current salary to calculate hike</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
