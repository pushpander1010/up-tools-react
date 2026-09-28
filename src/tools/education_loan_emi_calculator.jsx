import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '–'
const fmtINR0 = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'

export default function education_loan_emi_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [loanAmount, setLoanAmount] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [studyMonths, setStudyMonths] = useState('')
  const [moratoriumMonths, setMoratoriumMonths] = useState('')
  const [interestType, setInterestType] = useState('simple')
  const [tenureYears, setTenureYears] = useState('')

  const calculate = useCallback(() => {
    const P = parseFloat(loanAmount) || 0
    const rAnnual = parseFloat(annualRate) || 0
    const study = parseInt(studyMonths) || 0
    const mora = parseInt(moratoriumMonths) || 0
    const tenure = parseInt(tenureYears) || 0

    if (P <= 0 || rAnnual <= 0 || tenure <= 0) return null

    const graceMonths = study + mora
    const monthlyRate = rAnnual / 12 / 100

    let capitalizedPrincipal = P
    if (interestType === 'simple') {
      const graceInterest = P * monthlyRate * graceMonths
      capitalizedPrincipal = P + graceInterest
    } else {
      // compound
      capitalizedPrincipal = P * Math.pow(1 + monthlyRate, graceMonths)
    }

    const n = tenure * 12
    if (monthlyRate === 0) {
      const emi = capitalizedPrincipal / n
      return {
        capitalizedPrincipal,
        emi,
        totalInterest: 0,
        totalPayable: capitalizedPrincipal,
      }
    }

    const emi = capitalizedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)
    const totalPayable = emi * n
    const totalInterest = totalPayable - P

    return { capitalizedPrincipal, emi, totalInterest, totalPayable }
  }, [loanAmount, annualRate, studyMonths, moratoriumMonths, interestType, tenureYears])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Education Loan EMI Calculator"
      desc="Calculate education loan EMI with study and moratorium period interest — simple vs compound accrual, capitalized principal, and total payable."
      icon="🏦" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="education-loan-emi-calculator"
      faq={[
        { q: "What is a moratorium period in education loans?", a: "The moratorium period is the grace period after completing your course (typically 6–12 months) before EMI repayment begins. During this period, interest accrues and is added to the principal (capitalized)." },
        { q: "What is simple vs compound interest during the study period?", a: "Simple interest is calculated only on the original principal: Interest = P × r × t. Compound interest is calculated on principal plus accumulated interest: Interest = P × (1 + r)^t − P. Most Indian education loans use simple interest during the study period." },
        { q: "What does 'capitalized principal' mean?", a: "Capitalized principal is the original loan amount plus all interest accrued during the study and moratorium periods. Your EMI is calculated on this higher amount, not the original loan." },
        { q: "Is this calculator free to use?", a: "Yes, this Education Loan EMI Calculator is completely free with no sign-up required. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter the education loan amount and annual interest rate.",
        "Specify the study period and moratorium period in months.",
        "Select simple or compound interest accrual during the grace period.",
        "Choose your repayment tenure in years.",
        "Click Calculate to see capitalized principal, monthly EMI, total interest, and total payable.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Education Loan EMI Calculator", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Loan Amount (₹)</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 2000000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Annual Interest Rate (%)</label>
            <input type="number" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="e.g. 9.5" min="0" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Study Period (months)</label>
            <input type="number" value={studyMonths} onChange={(e) => setStudyMonths(e.target.value)}
              placeholder="e.g. 24" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Moratorium Period (months)</label>
            <input type="number" value={moratoriumMonths} onChange={(e) => setMoratoriumMonths(e.target.value)}
              placeholder="e.g. 6" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Interest During Grace Period</label>
            <select value={interestType} onChange={(e) => setInterestType(e.target.value)} className={selectClass}>
              <option value="simple">Simple Interest (most common)</option>
              <option value="compound">Compound Interest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Repayment Tenure (years)</label>
            <input type="number" value={tenureYears} onChange={(e) => setTenureYears(e.target.value)}
              placeholder="e.g. 10" min="1" max="30" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-center mb-5">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly EMI</div>
              <div className="text-4xl font-black text-white">{fmtINR0(result.emi)}</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Original Loan Amount', value: fmtINR(parseFloat(loanAmount)), color: 'text-white' },
                { label: 'Capitalized Principal', value: fmtINR(result.capitalizedPrincipal), color: 'text-amber-400' },
                { label: 'Total Interest Payable', value: fmtINR(result.totalInterest), color: 'text-rose-400' },
                { label: 'Total Amount Payable', value: fmtINR(result.totalPayable), color: 'text-emerald-400' },
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
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter loan details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
