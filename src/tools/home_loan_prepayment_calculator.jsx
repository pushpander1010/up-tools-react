import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'

export default function home_loan_prepayment_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [loanAmount, setLoanAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [tenureYears, setTenureYears] = useState('')
  const [prepayment, setPrepayment] = useState('0')
  const [extraMonthly, setExtraMonthly] = useState('0')

  const amortize = (principal, monthlyRate, months, oneTime, extra) => {
    if (monthlyRate === 0) {
      const monthly = principal / months
      let totalPaid = 0
      let remaining = principal
      let m = 0
      for (m = 0; m < months && remaining > 0; m++) {
        if (m === 0 && oneTime > 0) {
          remaining -= Math.min(oneTime, remaining)
        }
        const pay = Math.min(monthly + extra, remaining)
        remaining -= pay
        totalPaid += pay
      }
      return { totalInterest: totalPaid - principal, months: m, totalPaid }
    }

    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    let remaining = principal
    let totalPaid = 0
    let m = 0
    for (m = 0; m < months && remaining > 0.01; m++) {
      if (m === 0 && oneTime > 0) {
        remaining -= Math.min(oneTime, remaining)
      }
      const interest = remaining * monthlyRate
      const principalPart = emi - interest
      const pay = Math.min(emi + extra, remaining + interest)
      remaining = Math.max(0, remaining - (pay - interest))
      totalPaid += pay
    }
    return { totalInterest: totalPaid - principal, months: m, totalPaid, emi }
  }

  const calculate = useCallback(() => {
    const P = parseFloat(loanAmount) || 0
    const annual = parseFloat(annualRate) || 0
    const yrs = parseInt(tenureYears) || 0
    const oneTime = parseFloat(prepayment) || 0
    const extra = parseFloat(extraMonthly) || 0
    if (P <= 0 || annual <= 0 || yrs <= 0) return null

    const monthlyRate = annual / 100 / 12
    const totalMonths = yrs * 12

    const base = amortize(P, monthlyRate, totalMonths, 0, 0)
    const prepay = amortize(P, monthlyRate, totalMonths, oneTime, extra)

    const interestSaved = base.totalInterest - prepay.totalInterest
    const monthsReduced = base.months - prepay.months

    const now = new Date()
    const payoffDate = new Date(now)
    payoffDate.setMonth(payoffDate.getMonth() + prepay.months)
    const payoffLabel = payoffDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

    return {
      interestSaved, monthsReduced,
      baseInterest: base.totalInterest,
      prepayInterest: prepay.totalInterest,
      baseMonths: base.months,
      prepayMonths: prepay.months,
      payoffLabel,
      baseEmi: base.emi,
      prepayEmi: prepay.emi,
    }
  }, [loanAmount, annualRate, tenureYears, prepayment, extraMonthly])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  const fmtMo = (n) => {
    const y = Math.floor(n / 12)
    const m = n % 12
    if (y > 0 && m > 0) return `${y} yr ${m} mo`
    if (y > 0) return `${y} yr`
    return `${m} mo`
  }

  return (
    <ToolLayout
      title="Home Loan Prepayment Calculator India"
      desc="See how much interest and time you save by making a one-time prepayment or extra monthly EMI on your home loan — free amortisation calculator."
      icon="🏠" iconBg="rgba(168,85,247,0.08)"
      category="finance" slug="home-loan-prepayment-calculator"
      faq={[
        { q: "How does home loan prepayment work?", a: "When you prepay, the extra amount directly reduces your outstanding principal. This lowers future interest charges and can significantly shorten your loan tenure." },
        { q: "Should I prepay or invest the surplus?", a: "If your home loan interest rate is higher than your post-tax investment returns, prepaying saves more. Otherwise, investing may grow your wealth faster. A financial advisor can help decide." },
        { q: "Is there a prepayment penalty on home loans?", a: "For floating-rate home loans in India, RBI guidelines prohibit prepayment penalties. Fixed-rate loans may charge a fee (typically 1–3%). Check your loan agreement." },
        { q: "What is the difference between prepayment and part-payment?", a: "Prepayment typically refers to a lump-sum one-time payment to reduce principal. Both prepayment and making extra monthly payments reduce your outstanding balance faster." },
      ]}
      howItWorks={[
        "Enter your home loan amount, annual interest rate, and remaining tenure.",
        "Enter any one-time prepayment amount you plan to make.",
        "Enter any extra monthly amount you can pay over your regular EMI.",
        "Click Calculate to compare interest saved and months reduced.",
        "See the new payoff date and total interest for both scenarios.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Home Loan Prepayment Calculator India", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "url": "https://www.uptools.in/home-loan-prepayment-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Loan Amount (₹)</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 5000000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Annual Interest Rate (%)</label>
            <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="e.g. 8.5" min="0" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Remaining Tenure (Years)</label>
            <input type="number" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)}
              placeholder="e.g. 20" min="1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">One-Time Prepayment (₹)</label>
            <input type="number" value={prepayment} onChange={(e) => setPrepayment(e.target.value)}
              placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Extra Monthly Payment (₹)</label>
            <input type="number" value={extraMonthly} onChange={(e) => setExtraMonthly(e.target.value)}
              placeholder="0" min="0" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Savings
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-purple-500/15 bg-gradient-to-br from-purple-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Savings</h3>
            </div>

            {/* Hero metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Interest Saved</p>
                <p className="text-xl font-bold text-emerald-400">{fmtINR(result.interestSaved)}</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-xs text-blue-400 font-bold uppercase mb-1">Months Reduced</p>
                <p className="text-xl font-bold text-blue-400">{fmtMo(result.monthsReduced)}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'New Payoff Date', value: result.payoffLabel, color: 'text-purple-400' },
                { label: 'Tenure Without Prepayment', value: fmtMo(result.baseMonths), color: 'text-white' },
                { label: 'Tenure With Prepayment', value: fmtMo(result.prepayMonths), color: 'text-emerald-400' },
                { label: 'Total Interest Without', value: fmtINR(result.baseInterest), color: 'text-white' },
                { label: 'Total Interest With', value: fmtINR(result.prepayInterest), color: 'text-emerald-400' },
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
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter loan details and click Calculate Savings</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
