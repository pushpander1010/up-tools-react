import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US')

export default function mortgage_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [homePrice, setHomePrice] = useState('300000')
  const [downPayment, setDownPayment] = useState('60000')
  const [interestRate, setInterestRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState('30')

  const price = parseFloat(homePrice) || 0
  const down = parseFloat(downPayment) || 0
  const rate = parseFloat(interestRate) || 0
  const years = parseInt(loanTerm, 10) || 30

  const result = useMemo(() => {
    const principal = price - down
    if (principal <= 0) return null
    const monthlyRate = rate / 100 / 12
    const numPayments = years * 12
    let monthly = 0
    if (monthlyRate > 0) {
      monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                (Math.pow(1 + monthlyRate, numPayments) - 1)
    } else {
      monthly = principal / numPayments
    }
    const totalPaid = monthly * numPayments
    const totalInterest = totalPaid - principal
    return { loanAmount: principal, monthly, totalPaid, totalInterest }
  }, [price, down, rate, years])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Mortgage Calculator"
      desc="Calculate monthly mortgage payments, total interest, and loan amortization. Free online mortgage calculator."
      icon="🏠" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="mortgage-calculator"
      faq={[
        { q: 'How is monthly mortgage calculated?', a: 'Monthly Payment = P × [r(1+r)^n] / [(1+r)^n – 1], where P = loan principal, r = monthly interest rate, n = total number of payments.' },
        { q: 'What is a good down payment?', a: 'A 20% down payment avoids PMI (Private Mortgage Insurance). However, FHA loans allow as low as 3.5% down.' },
      ]}
      howItWorks={[
        'Enter the home price and down payment amount.',
        'Set the annual interest rate and loan term (years).',
        'View your monthly payment, total interest, and total cost.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Mortgage Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/mortgage-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Home Price</label>
              <input type="number" value={homePrice} onChange={e => setHomePrice(e.target.value)}
                placeholder="e.g. 300000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Down Payment</label>
              <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)}
                placeholder="e.g. 60000" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)}
                step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Loan Term (Years)</label>
              <input type="number" value={loanTerm} onChange={e => setLoanTerm(e.target.value)}
                min="1" max="50" className={inputClass} />
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
              <div className="text-[10px] text-slate-500 uppercase font-bold">Monthly Payment</div>
              <div className="text-3xl font-extrabold text-emerald-400">{fmtUSD(result.monthly)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-white">{fmtUSD(result.loanAmount)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Loan Amount</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-amber-400">{fmtUSD(result.totalInterest)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Interest</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                <div className="text-sm font-extrabold text-white">{fmtUSD(result.totalPaid)}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Paid</div>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter home details to calculate mortgage</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
