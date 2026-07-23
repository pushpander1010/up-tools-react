import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US')

export default function car_loan_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [price, setPrice] = useState('35000')
  const [down, setDown] = useState('7000')
  const [trade, setTrade] = useState('0')
  const [rate, setRate] = useState('5.5')
  const [term, setTerm] = useState('60')
  const [tax, setTax] = useState('7')
  const [fees, setFees] = useState('500')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const p = parseFloat(price) || 35000
    const d = parseFloat(down) || 7000
    const t = parseFloat(trade) || 0
    const r = (parseFloat(rate) || 5.5) / 100 / 12
    const n = parseInt(term) || 60
    const taxR = (parseFloat(tax) || 7) / 100
    const f = parseFloat(fees) || 500
    const taxAmt = p * taxR
    const totalPrice = p + taxAmt + f
    const loanAmt = totalPrice - d - t
    const monthly = loanAmt * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPaid = monthly * n
    const interest = totalPaid - loanAmt
    const totalCost = totalPaid + d + t
    setResult({ monthly, loanAmt, interest, totalCost, taxAmt })
    setTimeout(() => jumpTo(), 50)
  }, [price, down, trade, rate, term, tax, fees, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Car Loan Calculator"
      desc="Calculate monthly car loan payments, total interest, and affordability for your auto purchase."
      icon="🚗" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="car-loan-calculator"
      faq={[
        { q: "What is a good interest rate for a car loan?", a: "As of 2024, good car loan rates range from 4-7% for new cars with excellent credit (720+). Used car rates are typically 1-2% higher." },
        { q: "How much car can I afford?", a: "Financial experts recommend keeping your total car payment under 15-20% of your monthly take-home pay." },
      ]}
      howItWorks={[
        "Enter the car price, down payment, and trade-in value.",
        "Set the interest rate, loan term, sales tax, and fees.",
        "View monthly payment, total interest, and total cost.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Car Loan Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/car-loan-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Car Price ($)', value: price, set: setPrice, ph: '35000' },
              { label: 'Down Payment ($)', value: down, set: setDown, ph: '7000' },
              { label: 'Trade-In Value ($)', value: trade, set: setTrade, ph: '0' },
              { label: 'Interest Rate (%)', value: rate, set: setRate, ph: '5.5' },
              { label: 'Loan Term (months)', value: term, set: setTerm, ph: '60' },
              { label: 'Sales Tax (%)', value: tax, set: setTax, ph: '7' },
              { label: 'Fees & Registration ($)', value: fees, set: setFees, ph: '500' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.ph} className={inputClass} />
              </div>
            ))}
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full mt-4 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            Calculate Payment
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Monthly Payment', value: fmtUSD(result.monthly), color: 'text-indigo-400', highlight: true },
                { label: 'Loan Amount', value: fmtUSD(result.loanAmt), color: 'text-slate-300' },
                { label: 'Total Interest', value: fmtUSD(result.interest), color: 'text-red-400' },
                { label: 'Total Cost', value: fmtUSD(result.totalCost), color: 'text-emerald-400' },
                { label: 'Sales Tax', value: fmtUSD(result.taxAmt), color: 'text-cyan-400' },
              ].map(item => (
                <div key={item.label} className={`text-center p-4 rounded-xl ${item.highlight ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-black/20'}`}>
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🚗</div>
            <p className="text-sm text-slate-600 font-medium">Enter values and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
