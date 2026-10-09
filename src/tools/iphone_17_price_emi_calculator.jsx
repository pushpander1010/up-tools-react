import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const MODELS = [
  { id: '17', label: 'iPhone 17', storage: '256GB', price: 82900 },
  { id: '17-air', label: 'iPhone Air', storage: '256GB', price: 119900 },
  { id: '17-pro', label: 'iPhone 17 Pro', storage: '256GB', price: 134900 },
  { id: '17-pro-max', label: 'iPhone 17 Pro Max', storage: '256GB', price: 149900 },
]

// Official Apple Store India prices (Oct 2026, base 256GB variants).
// Quick-compare table values computed with the same EMI formula below:
// no-cost 12-mo = price / 12; 24-mo plan at 16% p.a. via reducing-balance formula.
const COMPARE_ROWS = [
  { label: 'iPhone 17', price: 82900, emi12: 6908, emi24: 4059 },
  { label: 'iPhone Air', price: 119900, emi12: 9992, emi24: 5871 },
  { label: 'iPhone 17 Pro', price: 134900, emi12: 11242, emi24: 6605 },
  { label: 'iPhone 17 Pro Max', price: 149900, emi12: 12492, emi24: 7340 },
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
      title="iPhone 17 Price India & EMI Calculator"
      desc="iPhone 17 prices in India (Oct 2026): ₹82,900–₹1,49,900. Calculate No-Cost EMI, compare 12 vs 24-month plans with down payment and interest."
      icon="📱" iconBg="rgba(99,102,241,0.08)"
      category="india" slug="iphone-17-price-emi-calculator"
      faq={[
        { q: "What are the official iPhone 17 prices in India?", a: "Apple Store India prices (Oct 2026, base 256GB): iPhone 17 ₹82,900, iPhone Air ₹1,19,900, iPhone 17 Pro ₹1,34,900, and iPhone 17 Pro Max ₹1,49,900. Higher storage variants cost more — the calculator price field is editable so you can enter any variant." },
        { q: "Which storage variant do these prices cover?", a: "The entire iPhone 17 lineup starts at 256GB base storage in India — Apple doubled the base storage this generation. 512GB and 1TB variants cost extra; enter the exact variant price in the calculator for a precise EMI." },
        { q: "What is No-Cost EMI and how do I calculate it?", a: "No-Cost EMI means 0% interest — you pay exactly price divided by months. Set the interest rate to 0 in the calculator: iPhone 17 works out to about ₹6,908/month over 12 months. Banks offer it via partnerships on the Apple Store, Amazon, and Flipkart." },
        { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal (price minus down payment), r is the monthly interest rate, and n is the tenure in months. At 0% interest it simplifies to principal divided by months." },
        { q: "Should I choose 12-month or 24-month EMI?", a: "12-month No-Cost EMI is cheapest overall — zero interest. A 24-month plan at 16% p.a. roughly halves the monthly outflow (e.g. iPhone 17: ₹6,908 vs ₹4,059) but adds about ₹14,500 in total interest. Pick 12 months if the EMI fits your budget." },
        { q: "Does a down payment lower my EMI?", a: "Yes — every rupee paid upfront reduces the loan principal and therefore both the EMI and total interest. Even a 20% down payment on an iPhone 17 Pro Max saves thousands in interest over 24 months. Enter any amount in the down payment field to see the effect." },
        { q: "Can I exchange my old iPhone to lower the price?", a: "Yes. Apple offers ₹4,500–₹81,500 off with trade-in of an iPhone 8 or newer, and Amazon/Flipkart run exchange bonuses during sales. Subtract your exchange value from the price field before calculating EMI." },
        { q: "Is this iPhone 17 Price & EMI Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Select your iPhone 17 model — the official India price auto-fills (you can edit it for higher storage).",
        "Enter a down payment amount (optional) and set the annual interest rate — use 0 for No-Cost EMI.",
        "Choose the EMI tenure in months (3 to 24).",
        "Click Calculate to see your monthly EMI, total interest, and total payable amount.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "iPhone 17 Price India EMI Calculator", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <figure className="rounded-2xl overflow-hidden border border-white/10">
          <img src="/assets/tools/iphone-emi/iphone-17-lineup.jpg" alt="iPhone 17 lineup with EMI price tags in India" width="1200" height="675"
            className="w-full h-auto object-cover" loading="eager" />
          <figcaption className="px-4 py-2 text-xs text-slate-500">iPhone 17 lineup — official India prices with No-Cost EMI from about ₹6,908/month</figcaption>
        </figure>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
          <p className="text-xs font-medium text-emerald-300/80 leading-relaxed">
            ✅ <span className="font-bold">Official Apple Store India prices (Oct 2026, 256GB base)</span> — iPhone 17 ₹82,900 · Air ₹1,19,900 · Pro ₹1,34,900 · Pro Max ₹1,49,900. Prices are editable for higher storage variants.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">iPhone 17 Model</label>
            <select value={modelId} onChange={(e) => handleModelChange(e.target.value)} className={selectClass}>
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label} {m.storage} — {fmtINR(m.price)}</option>
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

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Quick rate:</span>
          {[
            { label: 'No-Cost 0%', value: '0' },
            { label: '12% p.a.', value: '12' },
            { label: '16% p.a.', value: '16' },
          ].map(r => (
            <button key={r.value} type="button" onClick={() => setInterestRate(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${interestRate === r.value ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-indigo-500/40'}`}>
              {r.label}
            </button>
          ))}
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

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/8">
            <h3 className="text-sm font-bold text-white">Quick Compare — Official Prices & Popular Plans</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">No-Cost 12-mo vs 24-mo at 16% p.a., zero down payment</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5 font-bold">Model</th>
                  <th className="px-4 py-2.5 font-bold text-right">Price</th>
                  <th className="px-4 py-2.5 font-bold text-right">12-mo No-Cost</th>
                  <th className="px-4 py-2.5 font-bold text-right">24-mo @16%</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(r => (
                  <tr key={r.label} className="border-t border-white/5">
                    <td className="px-4 py-2.5 font-semibold text-slate-200">{r.label}</td>
                    <td className="px-4 py-2.5 text-right text-slate-300">{fmtINR(r.price)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-emerald-400">{fmtINR(r.emi12)}/mo</td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-200">{fmtINR(r.emi24)}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
