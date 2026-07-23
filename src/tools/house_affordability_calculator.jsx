import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'

export default function house_affordability_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('75000')
  const [monthlyDebts, setMonthlyDebts] = useState('500')
  const [downPayment, setDownPayment] = useState('40000')
  const [interestRate, setInterestRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState('30')
  const [propertyTax, setPropertyTax] = useState('3000')
  const [insurance, setInsurance] = useState('1200')

  const result = useMemo(() => {
    const inc = parseFloat(income) || 0
    const md = parseFloat(monthlyDebts) || 0
    const dp = parseFloat(downPayment) || 0
    const ir = parseFloat(interestRate) || 0
    const lt = parseInt(loanTerm) || 30
    const pt = parseFloat(propertyTax) || 0
    const ins = parseFloat(insurance) || 0
    if (inc <= 0) return null

    const monthlyIncome = inc / 12
    const maxHousingPayment = monthlyIncome * 0.28
    const maxTotalDebt = monthlyIncome * 0.36
    const maxHousingWithDebts = maxTotalDebt - md
    const maxHousing = Math.min(maxHousingPayment, maxHousingWithDebts)

    const monthlyTax = pt / 12
    const monthlyIns = ins / 12
    const maxPI = maxHousing - monthlyTax - monthlyIns

    const monthlyRate = ir / 100 / 12
    const numPayments = lt * 12
    const maxLoan = maxPI * ((Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments)))
    const maxPrice = maxLoan + dp

    const actualLoan = Math.max(0, maxPrice - dp)
    const monthlyPI = actualLoan > 0 ? actualLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : 0
    const totalMonthly = monthlyPI + monthlyTax + monthlyIns
    const dti = ((totalMonthly + md) / monthlyIncome * 100)

    let warning = null
    if (dti > 43) warning = 'Your debt-to-income ratio is above 43%, which may make it difficult to qualify for a mortgage.'
    else if (dti > 36) warning = 'Your debt-to-income ratio is above the recommended 36%. Consider reducing debts for better loan terms.'

    return { maxPrice, downPmt: dp, loanAmt: actualLoan, monthlyPI, monthlyTax, monthlyIns, totalMonthly, dti, warning }
  }, [income, monthlyDebts, downPayment, interestRate, loanTerm, propertyTax, insurance])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="House Affordability Calculator"
      desc="Calculate how much house you can afford based on income, debts, down payment, and interest rates."
      icon="🏡" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="house-affordability-calculator"
      faq={[
        { q: 'How much house can I afford with my salary?', a: 'A general rule is that your home price should be 2.5 to 3 times your annual gross income. This also depends on debts, down payment, and interest rates.' },
        { q: 'What is the 28/36 rule?', a: 'Housing costs should not exceed 28% of gross monthly income, and total debt payments should not exceed 36%.' },
      ]}
      howItWorks={[
        'Enter your annual income, monthly debts, and down payment.',
        'Set the interest rate and loan term.',
        'View maximum home price, monthly payment breakdown, and DTI ratio.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "House Affordability Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/house-affordability-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Gross Income ($)</label>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Monthly Debt Payments ($)</label>
              <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} step="50" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Down Payment ($)</label>
              <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Loan Term (years)</label>
              <input type="number" value={loanTerm} onChange={e => setLoanTerm(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Property Tax ($)</label>
              <input type="number" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} step="100" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Home Insurance ($)</label>
              <input type="number" value={insurance} onChange={e => setInsurance(e.target.value)} step="100" className={inputClass} />
            </div>
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate Affordability
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Affordability Results</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-extrabold text-white">{fmt(result.maxPrice)}</div>
              <p className="text-sm text-slate-400 mt-1">Maximum Home Price</p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Down Payment', value: fmt(result.downPmt), color: 'text-white' },
                { label: 'Loan Amount', value: fmt(result.loanAmt), color: 'text-white' },
                { label: 'Monthly Payment (P&I)', value: fmt(result.monthlyPI), color: 'text-amber-400' },
                { label: 'Monthly Property Tax', value: fmt(result.monthlyTax), color: 'text-slate-300' },
                { label: 'Monthly Insurance', value: fmt(result.monthlyIns), color: 'text-slate-300' },
                { label: 'Total Monthly Payment', value: fmt(result.totalMonthly), color: 'text-emerald-400' },
                { label: 'Debt-to-Income Ratio', value: result.dti.toFixed(1) + '%', color: result.dti > 36 ? 'text-rose-400' : 'text-emerald-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            {result.warning && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-400 font-medium">⚠️ {result.warning}</p>
              </div>
            )}
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏡</div>
            <p className="text-sm text-slate-600 font-medium">Enter income details to calculate affordability</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
