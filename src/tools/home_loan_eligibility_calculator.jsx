import { useMemo, useState } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

function Slider({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-400">{label}</label>
        <span className="text-xs font-bold text-white">{prefix}{Number(value).toLocaleString('en-IN')}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none rounded-full bg-white/10 accent-[#22d3ee]" />
      {hint && <div className="text-[10px] text-slate-600 mt-1">{hint}</div>}
    </div>
  )
}

export default function home_loan_eligibility_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthlyIncome, setMonthlyIncome] = useState(100000)
  const [existingEmi, setExistingEmi] = useState(0)
  const [tenure, setTenure] = useState(20)
  const [rate, setRate] = useState(8.5)
  const [foir, setFoir] = useState(50)

  const result = useMemo(() => {
    const income = monthlyIncome
    const emiCapacity = Math.max(0, income * (foir / 100) - existingEmi)
    const r = rate / 100 / 12
    const n = tenure * 12
    const annuity = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r
    const maxLoan = emiCapacity * annuity
    const maxEmi = emiCapacity
    // LTV guidance: most banks finance up to 80-90% of property value
    const propertyValue = maxLoan / 0.8
    const downPayment = propertyValue - maxLoan
    return {
      emiCapacity,
      maxLoan,
      maxEmi,
      propertyValue,
      downPayment,
      totalInterest: maxLoan > 0 ? maxEmi * n - maxLoan : 0,
      totalPayments: maxLoan > 0 ? maxEmi * n : 0,
    }
  }, [monthlyIncome, existingEmi, tenure, rate, foir])

  return (
    <ToolLayout
      title="Home Loan Eligibility Calculator India"
      desc="Find out how much home loan you qualify for based on your monthly income, existing EMIs, tenure and interest rate. Uses the standard 40-50% FOIR rule with live eligibility, EMI and property value estimates."
      icon="🏠" iconBg="rgba(251,146,60,0.08)"
      category="finance" slug="home-loan-eligibility-calculator"
      faq={[
        { q: 'How do banks calculate home loan eligibility?', a: 'Banks use the FOIR (Fixed Obligation to Income Ratio) method: they typically allow EMIs up to 50% of your net monthly income, minus your existing EMIs. Your eligible loan is the EMI capacity converted into a loan amount using the rate and tenure.' },
        { q: 'What is the FOIR rule?', a: 'FOIR is the percentage of monthly income you can commit to EMIs. Most banks use 40–50%. This calculator defaults to 50% and lets you adjust it to match your bank.' },
        { q: 'What factors improve home loan eligibility?', a: 'Higher income, fewer existing EMIs, a co-applicant (spouse or parent income added), longer tenure, higher down payment, and a good CIBIL score (750+) all increase your eligible amount. Lower interest rate also raises eligibility.' },
        { q: 'How much down payment do I need?', a: 'Banks finance 75–90% of the property value. For a ₹50 lakh property you\'d typically need ₹5–12.5 lakh as down payment (10–25%) depending on LTV norms and your profile.' },
        { q: 'Does CIBIL score affect eligibility?', a: 'Yes — a score above 750 usually gets the best rates and higher eligibility; below 650 many banks reject or shrink the loan. Improve your score before applying.' },
      ]}
      howItWorks={[
        'Enter your net monthly income (post-tax take-home, including bonuses divided monthly).',
        'Add any existing EMI (car, personal, credit card loan) — banks deduct these from your EMI capacity.',
        'Pick tenure (up to 30 years) and expected interest rate (home loan rates are typically 8.5–9.5%).',
        'Adjust the FOIR slider to match your bank\'s rule (40–55%).',
        'The calculator shows your max eligible loan, EMI, indicative property value and down payment.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Home Loan Eligibility Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/home-loan-eligibility-calculator/",
        "description": "Calculate your home loan eligibility from monthly income, existing EMIs, tenure and interest rate using the FOIR rule.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.05] space-y-5" ref={resultRef}>
          <Slider label="Net Monthly Income" value={monthlyIncome} onChange={(v) => { setMonthlyIncome(v); jumpTo() }} min={20000} max={5000000} step={5000} prefix="₹" hint="Take-home salary after tax, monthly" />
          <Slider label="Existing Monthly EMIs" value={existingEmi} onChange={(v) => { setExistingEmi(v); jumpTo() }} min={0} max={500000} step={1000} prefix="₹" hint="Car loan, personal loan, etc." />
          <Slider label="Loan Tenure" value={tenure} onChange={(v) => { setTenure(v); jumpTo() }} min={1} max={30} suffix=" years" />
          <Slider label="Interest Rate" value={rate} onChange={(v) => { setRate(v); jumpTo() }} min={7} max={15} step={0.05} suffix="%" />
          <Slider label="FOIR (EMI-to-income ratio)" value={foir} onChange={(v) => { setFoir(v); jumpTo() }} min={30} max={60} step={1} suffix="%" hint="Most banks use 40–50%. Higher = more aggressive" />
        </div>

        <div className="space-y-4" style={{ animation: 'slideUp 0.35s ease-out' }}>
          {/* Main result */}
          <div className="p-6 rounded-2xl border-2 border-brand/20 bg-brand/[0.04] text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">You are eligible for a home loan of</div>
            <div className="text-3xl font-extrabold gradient-text">{fmt(result.maxLoan)}</div>
            <div className="text-xs text-slate-400 mt-2">≈ EMI of <b className="text-white">{fmt(result.maxEmi)}</b>/month for {tenure} years at {rate}% p.a.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Indicative Property Value</div>
              <div className="text-lg font-extrabold text-white">{fmt(result.propertyValue)}</div>
              <div className="text-[11px] text-slate-500">at 80% LTV</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Down Payment Needed</div>
              <div className="text-lg font-extrabold text-white">{fmt(result.downPayment)}</div>
              <div className="text-[11px] text-slate-500">20% of property value</div>
            </div>
            <div className="p-4 rounded-2xl border border-white/8 bg-white/[0.05]">
              <div className="text-xs text-slate-500 mb-1">Total Interest over {tenure}y</div>
              <div className="text-lg font-extrabold text-amber-400">{fmt(result.totalInterest)}</div>
              <div className="text-[11px] text-slate-500">total payout {fmt(result.totalPayments)}</div>
            </div>
          </div>

          {/* Tenure comparison */}
          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📊 How tenure changes your loan</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 text-left">
                    <th className="py-2 pr-3 font-semibold">Tenure</th>
                    <th className="py-2 pr-3 font-semibold text-right">Max Loan</th>
                    <th className="py-2 font-semibold text-right">Monthly EMI</th>
                  </tr>
                </thead>
                <tbody>
                  {[10, 15, 20, 25, 30].map(t => {
                    const r = rate / 100 / 12
                    const n = t * 12
                    const annuity = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r
                    const loan = result.emiCapacity * annuity
                    return (
                      <tr key={t} className={`border-t border-white/5 ${t === tenure ? 'bg-brand/[0.06]' : ''}`}>
                        <td className="py-2 pr-3 text-slate-300">{t} years</td>
                        <td className="py-2 pr-3 text-white font-medium text-right">{fmt(loan)}</td>
                        <td className="py-2 text-slate-300 text-right">{fmt(result.emiCapacity)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="p-5 rounded-2xl border border-white/8 bg-white/[0.04]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">💡 Raise your eligibility</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Add a <b className="text-slate-200">co-applicant</b> (spouse/parent) — income gets combined when computing FOIR.</li>
              <li>• <b className="text-slate-200">Clear existing loans</b> or prepay to free up EMI capacity.</li>
              <li>• Keep your <b className="text-slate-200">CIBIL score above 750</b> for better rates and higher sanctions.</li>
              <li>• A longer tenure raises eligibility, but you pay far more interest — balance both.</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}