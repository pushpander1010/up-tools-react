import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function nps_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthly, setMonthly] = useState('')
  const [retReturn, setRetReturn] = useState('10')
  const [years, setYears] = useState('30')
  const [annuityPct, setAnnuityPct] = useState('40')
  const [annuityRate, setAnnuityRate] = useState('8')

  const m = parseFloat(monthly) || 0
  const r = parseFloat(retReturn) || 10
  const y = parseInt(years, 10) || 30
  const ap = parseFloat(annuityPct) || 40
  const ar = parseFloat(annuityRate) || 8

  const result = useMemo(() => {
    if (m <= 0 || y <= 0) return null
    const rateDecimal = r / 100
    const monthlyRate = rateDecimal / 12
    const totalMonths = y * 12
    let balance = 0
    for (let i = 0; i < totalMonths; i++) {
      balance = (balance + m) * (1 + monthlyRate)
    }
    const totalContrib = m * 12 * y
    const growth = balance - totalContrib
    const lumpSum = balance * (1 - ap / 100)
    const annuityAmount = balance * (ap / 100)
    const annualPension = annuityAmount * (ar / 100)
    const monthlyPension = annualPension / 12
    return { corpus: balance, contributed: totalContrib, growth, lumpSum, annuityAmount, monthlyPension }
  }, [m, r, y, ap, ar])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="NPS Calculator"
      desc="Calculate NPS (National Pension Scheme) retirement corpus, monthly pension, and tax benefits under Section 80CCD."
      icon="🏗️" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="nps-calculator"
      faq={[
        { q: 'What is NPS?', a: 'NPS (National Pension Scheme) is a government-backed retirement savings scheme. Subscribers invest in equity and debt funds. At maturity, 60% can be withdrawn and 40% must be used to buy an annuity for monthly pension.' },
        { q: 'What are the tax benefits of NPS?', a: 'Under Section 80CCD(1B), you can claim additional ₹50,000 tax deduction over and above 80C limit. Employer contribution under 80CCD(2) is also tax-free up to 14% of salary.' },
      ]}
      howItWorks={[
        'Enter how much you contribute monthly to NPS.',
        'Expected return depends on fund allocation. Equity-heavy: 10-12%, Balanced: 8-10%.',
        'Enter how many years until you retire.',
        'View your NPS corpus, annuity amount, and monthly pension.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "NPS Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/nps-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Monthly Contribution (₹)</label>
              <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)}
                placeholder="e.g. 5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Expected Return (% p.a.)</label>
              <input type="number" value={retReturn} onChange={e => setRetReturn(e.target.value)}
                step="0.1" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Years to Retirement</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)}
                min="1" max="50" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annuity (%)</label>
              <input type="number" value={annuityPct} onChange={e => setAnnuityPct(e.target.value)}
                min="40" max="100" step="5" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annuity Rate (%)</label>
              <input type="number" value={annuityRate} onChange={e => setAnnuityRate(e.target.value)}
                step="0.1" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">NPS Retirement Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Total Contribution</span>
                <span className="text-sm font-bold text-white">{fmt(result.contributed)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Growth (Interest)</span>
                <span className="text-sm font-bold text-emerald-400">{fmt(result.growth)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-sm font-bold text-white">Total NPS Corpus</span>
                <span className="text-lg font-extrabold text-emerald-400">{fmt(result.corpus)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Lump Sum ({100 - ap}%)</span>
                <span className="text-sm font-bold text-white">{fmt(result.lumpSum)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Annuity ({ap}%)</span>
                <span className="text-sm font-bold text-white">{fmt(result.annuityAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-white">Monthly Pension</span>
                <span className="text-lg font-extrabold text-amber-400">{fmt(result.monthlyPension)}/mo</span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏗️</div>
            <p className="text-sm text-slate-600 font-medium">Enter monthly contribution to calculate NPS corpus</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
