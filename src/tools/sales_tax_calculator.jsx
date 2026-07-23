import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const STATES = [
  { name: 'No Sales Tax', rate: 0 },
  { name: 'Alabama', rate: 4.0 },
  { name: 'Alaska', rate: 0 },
  { name: 'Arizona', rate: 5.6 },
  { name: 'Arkansas', rate: 6.5 },
  { name: 'California', rate: 7.25 },
  { name: 'Colorado', rate: 2.9 },
  { name: 'Connecticut', rate: 6.35 },
  { name: 'Delaware', rate: 0 },
  { name: 'Florida', rate: 6.0 },
  { name: 'Georgia', rate: 4.0 },
  { name: 'Hawaii', rate: 4.0 },
  { name: 'Idaho', rate: 6.0 },
  { name: 'Illinois', rate: 6.25 },
  { name: 'Indiana', rate: 7.0 },
  { name: 'Iowa', rate: 6.0 },
  { name: 'Kansas', rate: 6.5 },
  { name: 'Kentucky', rate: 6.0 },
  { name: 'Louisiana', rate: 4.45 },
  { name: 'Maine', rate: 5.5 },
  { name: 'Maryland', rate: 6.0 },
  { name: 'Massachusetts', rate: 6.25 },
  { name: 'Michigan', rate: 6.0 },
  { name: 'Minnesota', rate: 6.875 },
  { name: 'Mississippi', rate: 7.0 },
  { name: 'Missouri', rate: 4.225 },
  { name: 'Montana', rate: 0 },
  { name: 'Nebraska', rate: 5.5 },
  { name: 'Nevada', rate: 6.85 },
  { name: 'New Hampshire', rate: 0 },
  { name: 'New Jersey', rate: 6.625 },
  { name: 'New Mexico', rate: 5.125 },
  { name: 'New York', rate: 4.0 },
  { name: 'North Carolina', rate: 4.75 },
  { name: 'North Dakota', rate: 5.0 },
  { name: 'Ohio', rate: 5.75 },
  { name: 'Oklahoma', rate: 4.5 },
  { name: 'Oregon', rate: 0 },
  { name: 'Pennsylvania', rate: 6.0 },
  { name: 'Rhode Island', rate: 7.0 },
  { name: 'South Carolina', rate: 6.0 },
  { name: 'South Dakota', rate: 4.5 },
  { name: 'Tennessee', rate: 7.0 },
  { name: 'Texas', rate: 6.25 },
  { name: 'Utah', rate: 6.1 },
  { name: 'Vermont', rate: 6.0 },
  { name: 'Virginia', rate: 5.3 },
  { name: 'Washington', rate: 6.5 },
  { name: 'West Virginia', rate: 6.0 },
  { name: 'Wisconsin', rate: 5.0 },
  { name: 'Wyoming', rate: 4.0 },
]

function calcSalesTax(amount, rate, mode) {
  const amt = Math.max(0, Number(amount || 0))
  const r = Math.max(0, Number(rate || 0))
  let taxAmount, total
  if (mode === 'add') {
    taxAmount = amt * (r / 100)
    total = amt + taxAmount
  } else {
    const original = amt / (1 + r / 100)
    taxAmount = amt - original
    total = original
  }
  return { taxAmount, total, rate: r }
}

export default function sales_tax_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [amount, setAmount] = useState('100')
  const [stateIdx, setStateIdx] = useState(5) // California
  const [mode, setMode] = useState('add')

  const rate = STATES[stateIdx].rate
  const result = useMemo(() => calcSalesTax(amount, rate, mode), [amount, rate, mode])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]'

  return (
    <ToolLayout
      title="US Sales Tax Calculator"
      desc="Calculate sales tax for all 50 US states with accurate state and local rates."
      icon="🧾" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="sales-tax-calculator"
      faq={[
        { q: 'Which US states have no sales tax?', a: 'Five US states have no state sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, Alaska allows local sales taxes.' },
        { q: 'How do I calculate sales tax?', a: 'Multiply the price by the tax rate (as a decimal). For example, $100 × 0.0725 = $8.25 tax. Add this to the original price for the total.' },
        { q: 'Do local taxes apply on top of state sales tax?', a: 'Yes, many cities and counties add local sales taxes on top of the state rate. This calculator shows state rates only.' },
      ]}
      howItWorks={[
        'Select a US state from the dropdown.',
        'Enter the amount and choose Add or Remove tax mode.',
        'View the tax amount and total instantly.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Sales Tax Calculator', applicationCategory: 'UtilityApplication',
        url: 'https://www.uptools.in/sales-tax-calculator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex gap-2">
          {['add', 'remove'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-white/[0.06] text-slate-500 border border-white/[0.08]'}`}>
              {m === 'add' ? '➕ Add Tax' : '➖ Remove Tax'}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Select State</label>
          <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))}
            className={`${inputClass} [color-scheme:dark]`}>
            {STATES.map((s, i) => (
              <option key={i} value={i} className="bg-gray-900">{s.name} – {s.rate}%</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Amount ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" min="0" step="0.01"
            className={inputClass} />
        </div>

        <button onClick={() => jumpTo()}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {amount && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Sales Tax</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax Rate</span>
                <span className="font-bold text-white">{result.rate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sales Tax</span>
                <span className="font-bold text-white">${result.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Amount</span>
                <span className="text-2xl font-extrabold text-indigo-400">${result.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {!amount && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🧾</div>
            <p className="text-sm text-slate-600 font-medium">Enter an amount to calculate sales tax</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
