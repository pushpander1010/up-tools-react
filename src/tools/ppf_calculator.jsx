import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function ppf_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [annual, setAnnual] = useState('')
  const [rate, setRate] = useState('7.1')
  const [tenure, setTenure] = useState('15')
  const [copied, setCopied] = useState(false)

  const a = parseFloat(annual) || 0
  const r = parseFloat(rate) || 7.1
  const t = parseInt(tenure, 10) || 15

  const result = useMemo(() => {
    if (a <= 0 || t < 15) return null
    const rateDecimal = r / 100
    let balance = 0, totalInvested = 0
    const yearData = []
    for (let y = 1; y <= t; y++) {
      balance = (balance + a) * (1 + rateDecimal)
      totalInvested += a
      yearData.push({ year: y, invested: totalInvested, balance })
    }
    return { maturity: balance, invested: totalInvested, interest: balance - totalInvested, yearData }
  }, [a, r, t])

  const handleCSV = useCallback(() => {
    if (!result) return
    const csv = 'Year,Invested,Balance\n' + result.yearData.map(d => `${d.year},${d.invested},${d.balance.toFixed(0)}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'ppf_maturity.csv'; a.click()
    URL.revokeObjectURL(url)
  }, [result])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="PPF Calculator"
      desc="Calculate PPF (Public Provident Fund) maturity amount, interest earned, and year-wise growth. Free online PPF calculator for Indian investors."
      icon="🏛️" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="ppf-calculator"
      faq={[
        { q: 'What is the current PPF interest rate?', a: 'The PPF interest rate for Q1 FY 2024-25 is 7.1% per annum, compounded annually. Rates are set by the government quarterly.' },
        { q: 'What is the minimum and maximum PPF investment?', a: 'Minimum annual investment is ₹500 and maximum is ₹1,50,000 per financial year. You can invest in lump sum or up to 12 installments.' },
        { q: 'What is the PPF lock-in period?', a: 'PPF has a 15-year lock-in period. Partial withdrawal is allowed from the 7th year. Full maturity is at 15 years, extendable in 5-year blocks.' },
      ]}
      howItWorks={[
        'Enter how much you plan to invest annually in PPF (₹500 to ₹1,50,000).',
        'Current PPF rate is 7.1% per annum. You can adjust this.',
        'Default tenure is 15 years (minimum lock-in). You can extend to 20-30 years.',
        'View your PPF maturity amount, total invested, and interest earned.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "PPF Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ppf-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Investment (₹)</label>
              <input type="number" value={annual} onChange={e => setAnnual(e.target.value)}
                placeholder="e.g. 150000" min="500" max="150000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Rate (% p.a.)</label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                step="0.1" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Tenure (Years)</label>
              <input type="number" value={tenure} onChange={e => setTenure(e.target.value)}
                min="15" max="50" className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCSV}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">📥 CSV</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href + `?annualInvest=${annual}&interestRate=${rate}&tenure=${tenure}`); setCopied(true); setTimeout(() => setCopied(false), 1200) }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.06] border-white/[0.08] text-slate-400 hover:text-white'}`}>
              {copied ? '✅ Copied' : '🔗 Share'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">PPF Maturity Summary</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Total Invested</span>
                <span className="text-sm font-bold text-white">{fmt(result.invested)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Interest Earned</span>
                <span className="text-sm font-bold text-emerald-400">{fmt(result.interest)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-white">Maturity Amount</span>
                <span className="text-lg font-extrabold text-emerald-400">{fmt(result.maturity)}</span>
              </div>
            </div>

            {/* Year Table */}
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-slate-500 border-b border-white/[0.06]">
                  <th className="text-left py-2 px-2">Year</th>
                  <th className="text-right py-2 px-2">Invested</th>
                  <th className="text-right py-2 px-2">Balance</th>
                </tr></thead>
                <tbody>
                  {result.yearData.map(d => (
                    <tr key={d.year} className="border-b border-white/[0.04]">
                      <td className="py-1.5 px-2 text-slate-400">{d.year}</td>
                      <td className="py-1.5 px-2 text-right text-slate-400">{fmt(d.invested)}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-white">{fmt(d.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏛️</div>
            <p className="text-sm text-slate-600 font-medium">Enter annual investment to calculate PPF maturity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
