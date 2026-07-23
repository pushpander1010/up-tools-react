import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function post_office_rd_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthly, setMonthly] = useState('')
  const [rate, setRate] = useState('6.7')
  const [months, setMonths] = useState('60')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const m = Number(monthly || 0)
    const r = Number(rate || 6.7) / 100
    const mo = Number(months || 60)

    if (m < 100 || mo < 6) {
      setResult({ error: 'Please enter valid values (min ₹100 monthly, min 6 months)' })
      return
    }

    const quarterlyRate = r / 4
    const totalDeposited = m * mo
    let maturity = 0
    let monthData = []

    for (let i = 1; i <= mo; i++) {
      const remainingMonths = mo - i + 1
      const quartersRemaining = remainingMonths / 3
      const compounded = m * Math.pow(1 + quarterlyRate, quartersRemaining)
      maturity += compounded
      if (i % 6 === 0 || i === mo) {
        monthData.push({ month: i, deposited: m * i, balance: maturity })
      }
    }

    const interest = maturity - totalDeposited
    setResult({ totalDeposited, interest, maturity, monthData })
  }, [monthly, rate, months])

  const toCSV = useCallback(() => {
    if (!result?.monthData) return
    const m = Number(monthly || 0)
    const rows = ['Month,Deposited,Balance']
    result.monthData.forEach(d => {
      rows.push(`${d.month},${m * d.month},${d.balance.toFixed(0)}`)
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'rd_maturity.csv'
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [result, monthly])

  const copyShare = useCallback(async () => {
    const q = new URLSearchParams()
    if (monthly) q.set('monthlyDeposit', monthly)
    if (rate) q.set('interestRate', rate)
    if (months) q.set('tenure', months)
    const url = window.location.origin + window.location.pathname + '?' + q.toString()
    try { await navigator.clipboard.writeText(url) } catch { /* fallback */ }
  }, [monthly, rate, months])

  return (
    <ToolLayout
      title="Post Office RD Calculator"
      desc="Calculate maturity amount for Recurring Deposits at Post Office."
      icon="🏦" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="post-office-rd-calculator"
      faq={[
        { q: "What is the current RD interest rate?", a: "The default rate is 6.7% per annum compounded quarterly. Check India Post for the latest rates." },
        { q: "How is RD maturity calculated?", a: "Maturity is calculated using quarterly compounding: each installment earns compound interest based on remaining quarters." },
      ]}
      howItWorks={[
        "Enter your monthly deposit amount (min ₹100).",
        "Set the interest rate and tenure in months.",
        "View maturity amount, total interest, and month-wise growth table.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Post Office RD Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/post-office-rd-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Monthly Deposit (₹)</label>
            <input type="number" value={monthly} onChange={e => setMonthly(e.target.value)}
              placeholder="5000" min={100}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Interest Rate (% p.a.)</label>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                step={0.1}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Tenure (months)</label>
              <input type="number" value={months} onChange={e => setMonths(e.target.value)}
                min={6}
                className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
            </div>
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            💰 Calculate
          </button>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div ref={resultRef} className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Total Deposited</div>
                <div className="text-lg font-bold text-white">{fmt(result.totalDeposited)}</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Interest Earned</div>
                <div className="text-lg font-bold text-emerald-400">{fmt(result.interest)}</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Maturity Amount</div>
                <div className="text-lg font-bold text-amber-400">{fmt(result.maturity)}</div>
              </div>
            </div>

            {/* Month-wise Table */}
            {result.monthData?.length > 0 && (
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 mb-3">📊 Growth Schedule</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        <th className="text-left py-2 text-slate-500">Month</th>
                        <th className="text-right py-2 text-slate-500">Deposited</th>
                        <th className="text-right py-2 text-slate-500">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthData.map((d, i) => (
                        <tr key={i} className="border-b border-white/[0.04]">
                          <td className="py-2 text-white">{d.month}</td>
                          <td className="py-2 text-right text-slate-300">{fmt(d.deposited)}</td>
                          <td className="py-2 text-right text-amber-400 font-semibold">{fmt(d.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={toCSV}
                className="flex-1 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                📥 Download CSV
              </button>
              <button onClick={copyShare}
                className="flex-1 py-2 rounded-xl text-sm font-bold bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all">
                🔗 Share Link
              </button>
            </div>
          </div>
        )}

        {result?.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 text-center">
            {result.error}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
