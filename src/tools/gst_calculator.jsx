import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const PRESET_RATES = [0, 5, 12, 18, 28]
const INR = (n) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function computeGST(amount, ratePct, inclusive, supply) {
  if (amount <= 0 || ratePct < 0) return null
  const r = ratePct / 100
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
  const cgst = supply === 'intra' ? gst / 2 : 0
  const sgst = supply === 'intra' ? gst / 2 : 0
  const igst = supply === 'inter' ? gst : 0
  return { base, gst, total, cgst, sgst, igst, ratePct, supply, inclusive }
}

// Animated number counter
function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!value) { setDisplay(0); return }
    const start = display
    const diff = value - start
    const duration = 300
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{prefix}{INR(display)}</span>
}

export default function gst_calculator() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState(18)
  const [customRate, setCustomRate] = useState('')
  const [inclusive, setInclusive] = useState(false)
  const [supply, setSupply] = useState('intra')
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const effectiveRate = rate === -1 ? (parseFloat(customRate) || 0) : rate
  const amt = parseFloat(amount) || 0

  const result = useMemo(() => computeGST(amt, effectiveRate, inclusive, supply), [amt, effectiveRate, inclusive, supply])

  const handleCopy = useCallback(() => {
    if (!result) return
    const lines = [
      `Amount: ₹${amt.toLocaleString('en-IN')}`,
      `Rate: ${effectiveRate}%`,
      `Type: ${inclusive ? 'Inclusive' : 'Exclusive'}`,
      `Supply: ${supply === 'intra' ? 'Intra-state' : 'Inter-state'}`,
      ``,
      `Base Amount: ${INR(result.base)}`,
      `GST (${effectiveRate}%): ${INR(result.gst)}`,
      supply === 'intra' ? `CGST (${effectiveRate / 2}%): ${INR(result.cgst)}` : `IGST (${effectiveRate}%): ${INR(result.igst)}`,
      supply === 'intra' ? `SGST (${effectiveRate / 2}%): ${INR(result.sgst)}` : '',
      ``,
      `Total: ${INR(result.total)}`,
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result, amt, effectiveRate, inclusive, supply])

  return (
    <ToolLayout
      title="GST Calculator India"
      desc="Calculate GST instantly for 5%, 12%, 18%, 28% rates. Get base amount, GST breakdown (CGST/SGST/IGST), total with rounding."
      icon="🧮" iconBg="rgba(16,185,129,0.08)"
      category="tax" slug="gst-calculator"
      faq={[
        { q: 'How do I calculate GST from a GST-inclusive amount?', a: 'Tick "Amount includes GST" — the calculator back-calculates the base amount and GST for you.' },
        { q: "What's the difference between CGST+SGST and IGST?", a: 'Within the same state: GST splits equally into CGST (Central) and SGST (State). Between states: IGST applies as a single charge.' },
        { q: 'Can I use a custom GST rate?', a: 'Yes — select "Custom" and type any rate like 3%, 7.5%, or 0.1%.' },
        { q: 'How accurate are the calculations?', a: 'All calculations use precise floating-point math. Results match what CA/accounting software would produce.' },
      ]}
      howItWorks={[
        'Enter the amount in the input field above.',
        'Tap a GST rate button (0%, 5%, 12%, 18%, 28%) or choose Custom.',
        'Toggle "Amount includes GST" if your amount already has tax built in.',
        'Select supply type: Intra-state (CGST+SGST) or Inter-state (IGST).',
        'Results update instantly — copy them with one tap.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "GST Calculator (India)", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/gst-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Amount Input ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Amount</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-500/30 group-focus-within:text-emerald-400 transition-colors">₹</span>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl pl-14 pr-5 py-5 text-4xl font-extrabold text-white outline-none
                focus:border-emerald-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(16,185,129,0.08)]
                transition-all duration-300 placeholder:text-white/8"
            />
          </div>
        </div>

        {/* ─── Rate Buttons ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Select GST Rate</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[...PRESET_RATES, -1].map(r => (
              <button key={r} onClick={() => setRate(r)}
                className={`relative py-3 rounded-xl text-sm font-bold transition-all duration-200 overflow-hidden
                  ${rate === r
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-white/[0.03] text-slate-400 border border-white/6 hover:bg-white/[0.06] hover:text-white hover:border-white/12'
                  }`}>
                {rate === r && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />}
                <span className="relative">{r === -1 ? 'Custom' : `${r}%`}</span>
              </button>
            ))}
          </div>
          {rate === -1 && (
            <div className="mt-3 relative">
              <input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)}
                placeholder="Enter custom rate" step="0.01"
                className="w-full bg-white/[0.03] border-2 border-white/8 rounded-xl px-5 py-3 text-white font-semibold outline-none
                  focus:border-emerald-500/40 transition-all duration-200 placeholder:text-slate-600" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
            </div>
          )}
        </div>

        {/* ─── Options Row ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Inclusive Toggle */}
          <button onClick={() => setInclusive(!inclusive)}
            className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${inclusive
                ? 'bg-emerald-500/8 border-emerald-500/25 shadow-lg shadow-emerald-500/10'
                : 'bg-white/[0.02] border-white/6 hover:border-white/12'
              }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200
                ${inclusive ? 'bg-emerald-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {inclusive && '✓'}
              </div>
              <div>
                <div className="text-sm font-bold text-white">Amount includes GST</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {inclusive ? 'Back-calculating base from inclusive amount' : 'GST will be added on top'}
                </div>
              </div>
            </div>
          </button>

          {/* Supply Type */}
          <div className="p-4 rounded-2xl border-2 border-white/6 bg-white/[0.02]">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Supply Type</div>
            <div className="grid grid-cols-2 gap-2">
              {[['intra', 'Intra-state', 'CGST + SGST'], ['inter', 'Inter-state', 'IGST']].map(([val, label, sub]) => (
                <button key={val} onClick={() => setSupply(val)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 border
                    ${supply === val
                      ? 'bg-purple-500/10 border-purple-500/25 shadow-lg shadow-purple-500/10'
                      : 'bg-white/[0.02] border-white/6 hover:border-white/12'
                    }`}>
                  <div className={`text-xs font-bold ${supply === val ? 'text-purple-400' : 'text-slate-300'}`}>{label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Result ─── */}
        {result && (
          <div className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Calculation Result</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 mb-5">
              {[
                { label: 'Amount Type', value: inclusive ? 'GST-Inclusive' : 'GST-Exclusive', muted: true },
                { label: 'Supply', value: supply === 'intra' ? 'Intra-state' : 'Inter-state', muted: true },
                { label: 'Base Amount', value: <AnimatedNumber value={result.base} />, accent: false },
                { label: `GST (${effectiveRate}%)`, value: <AnimatedNumber value={result.gst} />, accent: true },
                ...(supply === 'intra' ? [
                  { label: `CGST (${effectiveRate / 2}%)`, value: <AnimatedNumber value={result.cgst} />, color: 'purple' },
                  { label: `SGST (${effectiveRate / 2}%)`, value: <AnimatedNumber value={result.sgst} />, color: 'purple' },
                ] : [
                  { label: `IGST (${effectiveRate}%)`, value: <AnimatedNumber value={result.igst} />, color: 'purple' },
                ]),
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 ${row.muted ? 'text-xs' : ''} ${i < 4 ? 'border-b border-white/5' : ''}`}>
                  <span className={`${row.muted ? 'text-slate-600' : 'text-sm text-slate-400'}`}>{row.label}</span>
                  <span className={`text-sm font-bold ${
                    row.accent ? 'text-emerald-400' : row.color === 'purple' ? 'text-purple-400' : 'text-white'
                  }`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  <AnimatedNumber value={result.total} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🧮</div>
            <p className="text-sm text-slate-600 font-medium">Enter an amount and select a rate to calculate GST</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
