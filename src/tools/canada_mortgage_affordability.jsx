import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

function mortgageFromPayment(pmt, r, n) {
  if (r <= 0) return pmt * n
  return pmt * (1 - Math.pow(1 + r, -n)) / r
}

function calcAffordability(income, debts, rate, years) {
  const inc = Math.max(0, Number(income || 0))
  const debt = Math.max(0, Number(debts || 0))
  const rateVal = Math.max(0, Number(rate || 0)) / 100
  const yrs = Math.max(5, Number(years || 25))
  if (!inc || !rateVal) return null
  const monthlyIncome = inc / 12
  const gdsLimit = monthlyIncome * 0.32
  const tdsLimit = monthlyIncome * 0.40 - debt
  const maxPmt = Math.max(0, Math.min(gdsLimit, tdsLimit))
  const n = yrs * 12
  const monthlyRate = rateVal / 12
  const loan = mortgageFromPayment(maxPmt, monthlyRate, n)
  return { maxPmt, mortgage: loan, gds: gdsLimit, tds: tdsLimit }
}

export default function canada_mortgage_affordability() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('')
  const [debts, setDebts] = useState('')
  const [rate, setRate] = useState('')
  const [years, setYears] = useState('25')

  const result = useMemo(() => calcAffordability(income, debts, rate, years), [income, debts, rate, years])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="Mortgage Affordability (Canada)"
      desc="Estimate Canadian mortgage affordability using basic GDS/TDS rules, interest rate, and amortization."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="canada-mortgage-affordability"
      faq={[
        { q: 'What is this tool?', a: 'Estimate Canadian mortgage affordability using basic GDS/TDS rules, interest rate, and amortization.' },
        { q: 'Is it free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter your annual household income and monthly debts.',
        'Set the interest rate and amortization period.',
        'Click Calculate to see max monthly payment and approximate mortgage amount.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Mortgage Affordability (Canada)', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/canada-mortgage-affordability/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual household income (CAD)</label>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="e.g., 120000" min="0" step="100"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Monthly debts (CAD)</label>
          <input type="number" value={debts} onChange={e => setDebts(e.target.value)}
            placeholder="e.g., 600" min="0" step="50"
            className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Interest rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)}
              placeholder="e.g., 5.5" min="0" step="0.1"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Amortization (years)</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)}
              min="5" max="30" step="1"
              className={inputClass} />
          </div>
        </div>
        <p className="text-xs text-slate-500">Uses GDS 32% and TDS 40% as a simple guide.</p>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Affordability</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.mortgage)}</div>
            <div className="text-sm text-slate-400 mt-1">Approximate mortgage</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Max monthly payment</span>
                <span className="font-bold text-white">{fmt(result.maxPmt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">GDS limit</span>
                <span className="font-bold text-slate-300">{fmt(result.gds)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">TDS limit</span>
                <span className="font-bold text-slate-300">{fmt(result.tds)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Estimate only; excludes property taxes, heating, condo fees.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter income and rate to estimate affordability</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
