import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'

export default function life_insurance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [annualIncome, setAnnualIncome] = useState('75000')
  const [incomeYears, setIncomeYears] = useState('10')
  const [totalDebt, setTotalDebt] = useState('25000')
  const [mortgage, setMortgage] = useState('250000')
  const [education, setEducation] = useState('100000')
  const [dependents, setDependents] = useState('2')
  const [existingCoverage, setExistingCoverage] = useState('0')
  const [savings, setSavings] = useState('50000')

  const inc = parseFloat(annualIncome) || 0
  const yrs = parseFloat(incomeYears) || 10
  const debt = parseFloat(totalDebt) || 0
  const mort = parseFloat(mortgage) || 0
  const edu = parseFloat(education) || 0
  const deps = parseInt(dependents) || 0
  const existing = parseFloat(existingCoverage) || 0
  const sav = parseFloat(savings) || 0

  const result = useMemo(() => {
    if (inc <= 0) return null
    const incomeReplacement = inc * yrs
    const totalNeeds = incomeReplacement + debt + mort + edu
    const existingAssets = existing + sav
    const coverageNeeded = Math.max(0, totalNeeds - existingAssets)

    let recommendation = ''
    const multiplier = coverageNeeded / inc
    if (multiplier < 5) recommendation = 'Your coverage needs are relatively modest. Consider term life insurance for cost-effective protection.'
    else if (multiplier < 10) recommendation = 'Your coverage needs are moderate. A 20-30 year term policy would provide solid protection.'
    else if (multiplier < 15) recommendation = 'Your coverage needs are substantial. Consider a combination of term and permanent life insurance.'
    else recommendation = 'Your coverage needs are significant. Consult with a financial advisor for the right policy mix.'
    if (deps > 2) recommendation += ` With ${deps} dependents, ensure coverage lasts until the youngest is financially independent.`

    return { coverageNeeded, incomeReplacement, debt, mortgage: mort, education: edu, existingAssets, recommendation }
  }, [inc, yrs, debt, mort, edu, deps, existing, sav])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Life Insurance Calculator"
      desc="Calculate how much life insurance coverage you need based on income, debts, dependents, and future expenses."
      icon="🛡️" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="life-insurance-calculator"
      faq={[
        { q: 'How much life insurance do I need?', a: 'A common rule is 10-12 times annual income. The exact amount depends on debts, dependents, and future expenses.' },
        { q: 'What is the DIME method?', a: 'DIME stands for Debt, Income, Mortgage, and Education. Add all four categories for comprehensive coverage.' },
        { q: 'Should I include my mortgage?', a: 'Yes, including your mortgage ensures your family can stay in their home.' },
      ]}
      howItWorks={[
        'Enter your annual income and how many years of income replacement needed.',
        'Enter debts, mortgage balance, and future education costs.',
        'Deduct existing insurance and savings to find coverage needed.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Life Insurance Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/life-insurance-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Income ($)</label>
              <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Years of Income Replacement</label>
              <input type="number" value={incomeYears} onChange={e => setIncomeYears(e.target.value)} min="1" max="30" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Total Debt ($)</label>
              <input type="number" value={totalDebt} onChange={e => setTotalDebt(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Mortgage Balance ($)</label>
              <input type="number" value={mortgage} onChange={e => setMortgage(e.target.value)} step="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Future Education Costs ($)</label>
              <input type="number" value={education} onChange={e => setEducation(e.target.value)} step="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Number of Dependents</label>
              <input type="number" value={dependents} onChange={e => setDependents(e.target.value)} min="0" max="10" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Existing Life Insurance ($)</label>
              <input type="number" value={existingCoverage} onChange={e => setExistingCoverage(e.target.value)} step="10000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Savings & Investments ($)</label>
              <input type="number" value={savings} onChange={e => setSavings(e.target.value)} step="5000" className={inputClass} />
            </div>
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate Coverage Needed
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Recommended Coverage</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-extrabold text-white">{fmt(result.coverageNeeded)}</div>
              <p className="text-sm text-slate-400 mt-1">Total life insurance coverage recommended</p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Income Replacement', value: fmt(result.incomeReplacement), color: 'text-white' },
                { label: 'Debt Coverage', value: fmt(result.debt), color: 'text-white' },
                { label: 'Mortgage Payoff', value: fmt(result.mortgage), color: 'text-white' },
                { label: 'Education Fund', value: fmt(result.education), color: 'text-white' },
                { label: 'Less: Existing Assets', value: '-' + fmt(result.existingAssets), color: 'text-rose-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 font-medium">💡 {result.recommendation}</p>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🛡️</div>
            <p className="text-sm text-slate-600 font-medium">Enter financial details to calculate coverage</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
