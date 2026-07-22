import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

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
    total = amount
    base = r > 0 ? amount / (1 + r) : amount
    gst = total - base
  } else {
    base = amount
    gst = base * r
    total = base + gst
  }

  const rnd = rounding === 'rupee' ? 0 : 2
  const f = (n) => Number(n.toFixed(rnd))

  const cgst = supply === 'intra' ? f(gst) / 2 : 0
  const sgst = supply === 'intra' ? f(gst) / 2 : 0
  const igst = supply === 'inter' ? f(gst) : 0

  return { base: f(base), gst: f(gst), total: f(total), cgst: f(cgst), sgst: f(sgst), igst: f(igst) }
}

export default function gst_calculator() {
  const [amount, setAmount] = useState('')
  const [rateIdx, setRateIdx] = useState(3) // 18% default
  const [customRate, setCustomRate] = useState('')
  const [inclusive, setInclusive] = useState(false)
  const [supply, setSupply] = useState('intra')
  const [rounding, setRounding] = useState('paise')

  const rate = RATES[rateIdx].value === -1 ? (parseFloat(customRate) || 0) : RATES[rateIdx].value
  const amt = parseFloat(amount) || 0

  const result = useMemo(() => {
    if (amt <= 0) return null
    return calcGST(amt, rate, inclusive, supply, rounding)
  }, [amt, rate, inclusive, supply, rounding])

  const rnd = rounding === 'rupee' ? 0 : 2

  return (
    <>
      <Helmet>
        <title>GST Calculator India — Inclusive/Exclusive + CGST/SGST/IGST Split</title>
        <meta name="description" content="Calculate GST instantly for 5%, 12%, 18%, 28% rates. Get base amount, GST breakdown (CGST/SGST/IGST), total with rounding." />
        <link rel="canonical" href="https://www.uptools.in/gst-calculator/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">GST Calculator</span>
      </nav>

      {/* Header */}
      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>🧮</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">GST Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">India — inclusive/exclusive with CGST/SGST/IGST split</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Amount Input */}
          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-2 block">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Rate Selection */}
          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-3 block">GST Rate</label>
            <div className="flex flex-wrap gap-2">
              {RATES.map((r, i) => (
                <button key={i}
                  onClick={() => setRateIdx(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    rateIdx === i
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-white/4 border-white/6 text-slate-400 hover:text-white hover:border-white/12'
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
            {RATES[rateIdx].value === -1 && (
              <input
                type="number"
                value={customRate}
                onChange={e => setCustomRate(e.target.value)}
                placeholder="Enter custom rate %"
                className="mt-3 w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600"
              />
            )}
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Inclusive/Exclusive */}
            <div className="glass p-4">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Amount Type</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inclusive}
                  onChange={e => setInclusive(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
                <span className="text-sm text-white">GST Inclusive</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-2">
                {inclusive ? 'Amount includes GST' : 'Amount + GST = Total'}
              </p>
            </div>

            {/* Supply Type */}
            <div className="glass p-4">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Supply Type</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="supply" checked={supply === 'intra'} onChange={() => setSupply('intra')} className="accent-purple-500" />
                  <span className="text-sm text-white">Intra-state</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="supply" checked={supply === 'inter'} onChange={() => setSupply('inter')} className="accent-purple-500" />
                  <span className="text-sm text-white">Inter-state</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {supply === 'intra' ? 'CGST + SGST' : 'IGST'}
              </p>
            </div>

            {/* Rounding */}
            <div className="glass p-4">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Rounding</label>
              <select
                value={rounding}
                onChange={e => setRounding(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none"
              >
                <option value="paise">Paise (2 decimals)</option>
                <option value="rupee">Nearest ₹1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="glass p-5 h-fit sticky top-20">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4">📊 GST Breakdown</h3>

          {result ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/6">
                <span className="text-sm text-slate-400">Base Amount</span>
                <span className="text-sm font-bold text-white">{INR(result.base, rnd)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/6">
                <span className="text-sm text-slate-400">GST ({rate}%)</span>
                <span className="text-sm font-bold text-emerald-400">{INR(result.gst, rnd)}</span>
              </div>

              {supply === 'intra' ? (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-white/6">
                    <span className="text-sm text-slate-400">CGST ({rate / 2}%)</span>
                    <span className="text-sm text-purple-400">{INR(result.cgst, rnd)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/6">
                    <span className="text-sm text-slate-400">SGST ({rate / 2}%)</span>
                    <span className="text-sm text-purple-400">{INR(result.sgst, rnd)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center py-2 border-b border-white/6">
                  <span className="text-sm text-slate-400">IGST ({rate}%)</span>
                  <span className="text-sm text-purple-400">{INR(result.igst, rnd)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 bg-emerald-500/10 rounded-xl px-3 -mx-1">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-lg font-bold text-emerald-400">{INR(result.total, rnd)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-500">
                <span>Type</span>
                <span>{inclusive ? 'Inclusive' : 'Exclusive'}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Supply</span>
                <span>{supply === 'intra' ? 'Intra-state' : 'Inter-state'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Enter an amount to calculate</p>
          )}
        </div>
      </div>

      {/* FAQ */}
      <section className="glass p-6 mt-6">
        <h2 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'How do I calculate GST from an inclusive amount?', a: 'Tick "GST Inclusive", select the rate, and the calculator back-calculates the base and GST.' },
            { q: "What's the difference between CGST+SGST and IGST?", a: 'Intra-state: GST splits into CGST (Central) + SGST (State). Inter-state: full IGST applies.' },
            { q: 'Can I use a custom GST rate?', a: 'Yes — select "Custom" and enter any rate (e.g., 3% or 7.5%).' },
          ].map((faq, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer text-sm font-semibold text-white py-2 list-none flex items-center gap-2">
                <span className="text-emerald-400 group-open:rotate-90 transition-transform text-xs">▶</span>
                {faq.q}
              </summary>
              <p className="text-xs text-slate-400 pl-5 pb-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "GST Calculator (India)",
        "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gst-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }) }} />
    </>
  )
}
