import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const RATES = [
  { label: '0%', value: 0 },
  { label: '5%', value: 5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 },
  { label: 'Custom', value: -1 },
]

const INR = (n, d = 2) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })

function calcGST(amount, rate, inclusive, supply, rounding) {
  const r = rate / 100
  let base, gst, total
  if (inclusive) {
    total = amount; base = r > 0 ? amount / (1 + r) : amount; gst = total - base
  } else {
    base = amount; gst = base * r; total = base + gst
  }
  const rnd = rounding === 'rupee' ? 0 : 2
  const f = (n) => Number(n.toFixed(rnd))
  return { base: f(base), gst: f(gst), total: f(total), cgst: supply === 'intra' ? f(gst) / 2 : 0, sgst: supply === 'intra' ? f(gst) / 2 : 0, igst: supply === 'inter' ? f(gst) : 0 }
}

export default function gst_calculator() {
  const [amount, setAmount] = useState('')
  const [rateIdx, setRateIdx] = useState(3)
  const [customRate, setCustomRate] = useState('')
  const [inclusive, setInclusive] = useState(false)
  const [supply, setSupply] = useState('intra')
  const [rounding, setRounding] = useState('paise')

  const rate = RATES[rateIdx].value === -1 ? (parseFloat(customRate) || 0) : RATES[rateIdx].value
  const amt = parseFloat(amount) || 0
  const result = useMemo(() => amt > 0 ? calcGST(amt, rate, inclusive, supply, rounding) : null, [amt, rate, inclusive, supply, rounding])
  const rnd = rounding === 'rupee' ? 0 : 2

  return (
    <ToolLayout
      title="GST Calculator India"
      desc="Calculate GST instantly for 5%, 12%, 18%, 28% rates. Get base amount, GST breakdown (CGST/SGST/IGST), total with rounding. Supports inclusive/exclusive."
      icon="🧮" iconBg="rgba(16,185,129,0.08)"
      category="tax" slug="gst-calculator"
      faq={[
        { q: 'How do I calculate GST from a GST-inclusive amount?', a: 'Tick "GST Inclusive", select the rate, and the calculator back-calculates the base and GST.' },
        { q: "What's the difference between CGST+SGST and IGST?", a: 'Intra-state: GST splits into CGST (Central) + SGST (State). Inter-state: full IGST applies.' },
        { q: 'Can I use a custom GST rate?', a: 'Yes — select "Custom" and enter any rate (e.g., 3% or 7.5%).' },
        { q: 'How does rounding work?', a: 'Choose "Paise" for 2 decimal places or "Nearest ₹1" to round to whole rupees.' },
      ]}
      howItWorks={[
        'Enter the pre-GST amount in rupees.',
        'Select the GST rate (0%, 5%, 12%, 18%, 28% or custom).',
        'Choose whether the amount includes GST (inclusive) or not (exclusive).',
        'Pick supply type — intra-state (CGST+SGST) or inter-state (IGST).',
        'View the instant breakdown: base, GST, split, and total.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "GST Calculator (India)", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gst-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600" />
        </div>

        {/* Rate */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 block">GST Rate</label>
          <div className="flex flex-wrap gap-2">
            {RATES.map((r, i) => (
              <button key={i} onClick={() => setRateIdx(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${rateIdx === i ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/4 border-white/6 text-slate-400 hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
          {RATES[rateIdx].value === -1 && (
            <input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder="Custom rate %"
              className="mt-3 w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-slate-600" />
          )}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white/3 border border-white/6">
            <label className="text-xs text-slate-400 mb-2 block">Amount Type</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inclusive} onChange={e => setInclusive(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
              <span className="text-sm text-white">GST Inclusive</span>
            </label>
          </div>
          <div className="p-4 rounded-xl bg-white/3 border border-white/6">
            <label className="text-xs text-slate-400 mb-2 block">Supply Type</label>
            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="supply" checked={supply === 'intra'} onChange={() => setSupply('intra')} className="accent-purple-500" /><span className="text-sm text-white">Intra-state</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="supply" checked={supply === 'inter'} onChange={() => setSupply('inter')} className="accent-purple-500" /><span className="text-sm text-white">Inter-state</span></label>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/3 border border-white/6">
            <label className="text-xs text-slate-400 mb-2 block">Rounding</label>
            <select value={rounding} onChange={e => setRounding(e.target.value)} className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none">
              <option value="paise">Paise (2 decimals)</option>
              <option value="rupee">Nearest ₹1</option>
            </select>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">📊 Result</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-sm text-slate-400">Base Amount</span><span className="text-sm font-bold text-white">{INR(result.base, rnd)}</span></div>
              <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-sm text-slate-400">GST ({rate}%)</span><span className="text-sm font-bold text-emerald-400">{INR(result.gst, rnd)}</span></div>
              {supply === 'intra' ? (
                <>
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-sm text-slate-400">CGST ({rate/2}%)</span><span className="text-sm text-purple-400">{INR(result.cgst, rnd)}</span></div>
                  <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-sm text-slate-400">SGST ({rate/2}%)</span><span className="text-sm text-purple-400">{INR(result.sgst, rnd)}</span></div>
                </>
              ) : (
                <div className="flex justify-between py-1.5 border-b border-white/5"><span className="text-sm text-slate-400">IGST ({rate}%)</span><span className="text-sm text-purple-400">{INR(result.igst, rnd)}</span></div>
              )}
              <div className="flex justify-between py-2"><span className="text-sm font-bold text-white">Total</span><span className="text-lg font-bold text-emerald-400">{INR(result.total, rnd)}</span></div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
