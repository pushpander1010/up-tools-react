import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MODELS = [
  { id: '17', label: 'iPhone 17', price: 82900 },
  { id: '17-air', label: 'iPhone 17 Air', price: 89900 },
  { id: '17-pro', label: 'iPhone 17 Pro', price: 134900 },
  { id: '17-pro-max', label: 'iPhone 17 Pro Max', price: 159900 },
]

const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export default function iphone_17_price_emi_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [modelId, setModelId] = useState('17')
  const [price, setPrice] = useState(MODELS[0].price.toString())
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('12')
  const [tenure, setTenure] = useState('12')

  // Sync price when model changes
  const handleModelChange = (id) => {
    setModelId(id)
    const m = MODELS.find(m => m.id === id)
    if (m) setPrice(m.price.toString())
  }

  const calculate = useCallback(() => {
    const total = parseFloat(price) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 0
    const months = parseInt(tenure) || 0
    if (total <= 0 || months <= 0 || down >= total) return null

    const principal = total - down
    const monthlyRate = rate / 12 / 100
    let emi, totalInterest, totalPayable

    if (monthlyRate === 0) {
      emi = principal / months
      totalInterest = 0
      totalPayable = principal
    } else {
      emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
      totalPayable = emi * months
      totalInterest = totalPayable - principal
    }

    return { emi, totalInterest, totalPayable, principal, total, down }
  }, [price, downPayment, interestRate, tenure])

  const result = calculate()

  const handleCalculate = () => { calculate(); jumpTo() }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="iPhone 17 Price & EMI Calculator"
      desc="Calculate monthly EMI for iPhone 17, 17 Air, 17 Pro, and 17 Pro Max with indicative India launch prices — down payment, interest rate, and tenure."
      icon="📱" iconBg="rgba(99,102,241,0.08)"
      category="india" slug="iphone-17-price-emi-calculator"
      faq={[
        { q: "What are the iPhone 17 prices in India?", a: "Prices shown are indicative launch-day estimates: iPhone 17 from ₹82,900, iPhone 17 Air from ₹89,900, iPhone 17 Pro from ₹134,900, and iPhone 17 Pro Max from ₹159,900. Always verify with the Apple Store." },
        { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal (price minus down payment), r is the monthly interest rate, and n is the tenure in months." },
        { q: "What is a good interest rate for phone EMI?", a: "Credit card EMIs typically range from 12-18% per annum. No-cost EMI (0% interest) is often available through bank partnerships on Apple Store and e-commerce platforms." },
        { q: "Is this iPhone 17 Price & EMI Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Select your iPhone 17 model — the indicative India price auto-fills (you can edit it).",
        "Enter a down payment amount (optional) and set the annual interest rate.",
        "Choose the EMI tenure in months (3 to 24).",
        "Click Calculate to see your monthly EMI, total interest, and total payable amount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "iPhone 17 Price EMI Calculator", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
          <p className="text-xs font-medium text-amber-300/80 leading-relaxed">
            ⚠️ <span className="font-bold">Indicative prices only</span> — iPhone 17 launch prices are estimates. Verify with the official Apple Store India before making a purchase decision.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">iPhone 17 Model</label>
            <select value={modelId} onChange={(e) => handleModelChange(e.target.value)} className={selectClass}>
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label} — {fmtINR(m.price)} (indicative)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Price (₹) — Editable</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Down Payment (₹)</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)}
              placeholder="0" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Annual Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
                placeholder="12" min="0" step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Tenure (Months)</label>
              <select value={tenure} onChange={(e) => setTenure(e.target.value)} className={selectClass}>
                {[3, 6, 9, 12, 18, 24].map(m => (
                  <option key={m} value={m}>{m} months</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate EMI
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">EMI Breakdown</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-white mb-1">{fmtINR(result.emi)}</div>
              <div className="text-sm text-slate-400">Monthly EMI</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Phone Price', value: fmtINR(result.total), color: 'text-white' },
                { label: 'Down Payment', value: result.down > 0 ? fmtINR(result.down) : '—', color: 'text-white' },
                { label: 'Loan Amount', value: fmtINR(result.principal), color: 'text-white' },
                { label: 'Total Interest', value: fmtINR(result.totalInterest), color: 'text-amber-400' },
                { label: 'Total Payable', value: fmtINR(result.totalPayable + result.down), color: 'text-indigo-400' },
                { label: 'Tenure', value: `${tenure} months`, color: 'text-white' },
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
            <div className="text-4xl mb-3 opacity-20">📱</div>
            <p className="text-sm text-slate-600 font-medium">Select a model and click Calculate EMI</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
