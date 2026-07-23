import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const COUNTRIES = [
  { name: 'Austria', rate: 20 },
  { name: 'Belgium', rate: 21 },
  { name: 'Bulgaria', rate: 20 },
  { name: 'Croatia', rate: 25 },
  { name: 'Cyprus', rate: 19 },
  { name: 'Czech Republic', rate: 21 },
  { name: 'Denmark', rate: 25 },
  { name: 'Estonia', rate: 22 },
  { name: 'Finland', rate: 24 },
  { name: 'France', rate: 20 },
  { name: 'Germany', rate: 19 },
  { name: 'Greece', rate: 24 },
  { name: 'Hungary', rate: 27 },
  { name: 'Ireland', rate: 23 },
  { name: 'Italy', rate: 22 },
  { name: 'Latvia', rate: 21 },
  { name: 'Lithuania', rate: 21 },
  { name: 'Luxembourg', rate: 17 },
  { name: 'Malta', rate: 18 },
  { name: 'Netherlands', rate: 21 },
  { name: 'Poland', rate: 23 },
  { name: 'Portugal', rate: 23 },
  { name: 'Romania', rate: 19 },
  { name: 'Slovakia', rate: 20 },
  { name: 'Slovenia', rate: 22 },
  { name: 'Spain', rate: 21 },
  { name: 'Sweden', rate: 25 },
]

const fmt = (n) => '€' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function vat_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [country, setCountry] = useState(0)
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('add')

  const rate = COUNTRIES[country].rate
  const amt = parseFloat(amount) || 0

  const calculate = useCallback(() => {
    if (amt <= 0) return null
    let vatAmount, netAmount, grossAmount
    if (mode === 'add') {
      netAmount = amt
      vatAmount = amt * (rate / 100)
      grossAmount = amt + vatAmount
    } else {
      grossAmount = amt
      netAmount = amt / (1 + rate / 100)
      vatAmount = amt - netAmount
    }
    return { vatAmount, netAmount, grossAmount, rate }
  }, [amt, mode, rate])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="VAT Calculator"
      desc="Calculate VAT for all European countries. Add or remove VAT from prices. Includes standard, reduced, and super-reduced rates for EU member states."
      icon="📋" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="vat-calculator"
      faq={[
        { q: "What is VAT?", a: "VAT (Value Added Tax) is a consumption tax applied to goods and services in the European Union and many other countries. It's collected at each stage of production and distribution." },
        { q: "How do I calculate VAT?", a: "To add VAT, multiply the net price by the VAT rate and add to the original. To remove VAT from a gross price, divide by (1 + VAT rate). For example, €100 with 20% VAT = €100 × 1.20 = €120." },
      ]}
      howItWorks={[
        "Select the country from the dropdown to set the correct VAT rate.",
        "Enter the amount you want to calculate.",
        "Choose to add VAT (net → gross) or remove VAT (gross → net).",
        "View the VAT amount, net price, and gross price instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "VAT Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/vat-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Country</label>
            <select value={country} onChange={(e) => setCountry(Number(e.target.value))} className={selectClass}>
              {COUNTRIES.map((c, i) => (
                <option key={i} value={i}>{c.name} ({c.rate}%)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Amount (€)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount" min="0" step="0.01" className={inputClass} />
          </div>
          <div className="flex gap-2">
            {[['add', 'Add VAT'], ['remove', 'Remove VAT']].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  mode === m
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.06] text-slate-500 border border-white/8'
                }`}>{label}</button>
            ))}
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'VAT Rate', value: `${result.rate}%`, color: 'text-white' },
                { label: 'VAT Amount', value: fmt(result.vatAmount), color: 'text-amber-400' },
                { label: 'Net Amount', value: fmt(result.netAmount), color: 'text-white' },
                { label: 'Gross Amount', value: fmt(result.grossAmount), color: 'text-white' },
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
            <div className="text-4xl mb-3 opacity-20">📋</div>
            <p className="text-sm text-slate-600 font-medium">Enter an amount and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
