import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '–'
const pct = (n) => isFinite(n) ? (n * 100).toFixed(1) + '%' : '–'

const RATES = {
  salary: { label: 'Salary', section: 'Section 192', threshold: 0 },
  rent: { label: 'Rent', section: 'Section 194I', threshold: 240000 },
  interest: { label: 'Interest', section: 'Section 194A', threshold: 40000 },
  commission: { label: 'Commission', section: 'Section 194H', threshold: 15000 },
  contractor: { label: 'Contractor', section: 'Section 194C', threshold: 30000 },
}

function getTDSSalary(annualIncome) {
  const slabs = [[300000,0],[300000,0.05],[300000,0.10],[300000,0.15],[300000,0.20],[Infinity,0.30]]
  let tax = 0, prev = 0
  for (const [limit, rate] of slabs) {
    const taxable = Math.min(annualIncome, limit) - prev
    if (taxable > 0) tax += taxable * rate
    prev = limit
    if (annualIncome <= limit) break
  }
  return tax
}

export default function tds_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [paymentType, setPaymentType] = useState('salary')
  const [amount, setAmount] = useState('')
  const [panStatus, setPanStatus] = useState('available')

  const calculate = useCallback(() => {
    const amt = parseFloat(amount) || 0
    const hasPAN = panStatus === 'available'
    const config = RATES[paymentType]

    if (amt <= 0) return null

    let tdsRate = 0
    let tdsAmount = 0

    if (paymentType === 'salary') {
      tdsAmount = getTDSSalary(amt)
      tdsRate = amt > 0 ? tdsAmount / amt : 0
    } else {
      if (amt > config.threshold) {
        tdsRate = paymentType === 'contractor' ? 0.01 : paymentType === 'commission' ? 0.05 : 0.10
        if (!hasPAN) tdsRate = Math.max(tdsRate, 0.20)
        tdsAmount = amt * tdsRate
      }
    }

    const netAmount = amt - tdsAmount

    return { config, amt, tdsRate, tdsAmount, netAmount }
  }, [paymentType, amount, panStatus])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="TDS Calculator"
      desc="Calculate Tax Deducted at Source (TDS) for salary, rent, interest, commission and contractor payments in India."
      icon="📊" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="tds-calculator"
      faq={[
        { q: "What is TDS?", a: "Tax Deducted at Source (TDS) is a system of collecting income tax at the source of income. The payer deducts tax before making the payment to the payee." },
        { q: "How is TDS on salary calculated?", a: "TDS on salary is calculated based on the applicable income tax slab rates. The employer estimates the annual income and deducts tax accordingly under Section 192." },
      ]}
      howItWorks={[
        "Select the payment type (Salary, Rent, Interest, Commission, or Contractor).",
        "Enter the payment amount and PAN availability status.",
        "Click Calculate to see TDS rate, TDS amount, and net payable amount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "TDS Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/tds-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Payment Type</label>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={selectClass}>
              {Object.entries(RATES).map(([key, val]) => (
                <option key={key} value={key}>{val.label} ({val.section})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">PAN Status</label>
            <select value={panStatus} onChange={(e) => setPanStatus(e.target.value)} className={selectClass}>
              <option value="available">PAN Available</option>
              <option value="unavailable">PAN Not Available (Higher TDS)</option>
            </select>
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
            <div className="space-y-3">
              {[
                { label: 'Payment Type', value: result.config.label, color: 'text-white' },
                { label: 'Amount', value: fmtINR(result.amt), color: 'text-white' },
                { label: 'TDS Rate', value: pct(result.tdsRate), color: 'text-indigo-400' },
                { label: 'TDS Amount', value: fmtINR(result.tdsAmount), color: 'text-rose-400' },
                { label: 'Net Amount', value: fmtINR(result.netAmount), color: 'text-green-400' },
                { label: 'Section', value: result.config.section, color: 'text-slate-300' },
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
            <div className="text-4xl mb-3 opacity-20">📊</div>
            <p className="text-sm text-slate-600 font-medium">Enter payment details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
