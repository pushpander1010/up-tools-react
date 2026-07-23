import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

function calcEMI(principal, tenure, annualRate) {
  const r = annualRate / 12 / 100
  if (r === 0) return principal / tenure
  return principal * r * Math.pow(1 + r, tenure) / (Math.pow(1 + r, tenure) - 1)
}

export default function loan_comparison_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [aAmt, setAAmt] = useState('500000')
  const [aRate, setARate] = useState('8.5')
  const [aTen, setATen] = useState('60')
  const [bAmt, setBAmt] = useState('500000')
  const [bRate, setBRate] = useState('9.5')
  const [bTen, setBTen] = useState('60')

  const result = useMemo(() => {
    const aP = parseFloat(aAmt) || 0, aR = parseFloat(aRate) || 0, aT = parseInt(aTen) || 0
    const bP = parseFloat(bAmt) || 0, bR = parseFloat(bRate) || 0, bT = parseInt(bTen) || 0
    if (aP <= 0 || bP <= 0) return null
    const emiA = calcEMI(aP, aT, aR)
    const emiB = calcEMI(bP, bT, bR)
    const totalA = emiA * aT
    const totalB = emiB * bT
    const cheaper = totalA <= totalB ? 'A' : 'B'
    const savings = Math.abs(totalA - totalB)
    return {
      emiA, emiB, intA: totalA - aP, intB: totalB - bP,
      totalA, totalB, cheaper, savings,
    }
  }, [aAmt, aRate, aTen, bAmt, bRate, bTen])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Loan Comparison Calculator"
      desc="Compare two loans side by side — EMI, total interest and total payable — to pick the cheaper option."
      icon="⚖️" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="loan-comparison-calculator"
      faq={[
        { q: 'What does it compare?', a: 'Monthly EMI, total interest paid and total amount payable for each loan.' },
        { q: 'How is EMI calculated?', a: 'Using the standard amortization formula: P×r×(1+r)^n / ((1+r)^n−1).' },
      ]}
      howItWorks={[
        'Enter loan A details: amount, interest rate, and tenure.',
        'Enter loan B details for comparison.',
        'View EMI, total interest, and which loan saves more.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Loan Comparison Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/loan-comparison-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Loan A</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Amount</label>
                <input type="number" value={aAmt} onChange={e => setAAmt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Rate % (yr)</label>
                <input type="number" value={aRate} onChange={e => setARate(e.target.value)} step="0.1" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tenure (mo)</label>
                <input type="number" value={aTen} onChange={e => setATen(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Loan B</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Amount</label>
                <input type="number" value={bAmt} onChange={e => setBAmt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Rate % (yr)</label>
                <input type="number" value={bRate} onChange={e => setBRate(e.target.value)} step="0.1" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tenure (mo)</label>
                <input type="number" value={bTen} onChange={e => setBTen(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98] mt-5">
            Compare Loans
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Comparison Results</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Loan A — EMI / Interest / Total', value: `${fmt(result.emiA)} / ${fmt(result.intA)} / ${fmt(result.totalA)}` },
                { label: 'Loan B — EMI / Interest / Total', value: `${fmt(result.emiB)} / ${fmt(result.intB)} / ${fmt(result.totalB)}` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className="text-sm font-bold text-white">{r.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-bold text-white">Cheaper Option</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  Loan {result.cheaper} saves {fmt(result.savings)}
                </span>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">⚖️</div>
            <p className="text-sm text-slate-600 font-medium">Enter loan details to compare</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
