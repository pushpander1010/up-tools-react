import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtUSD = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function amortization_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [loanAmt, setLoanAmt] = useState('300000')
  const [intRate, setIntRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState('30')
  const [extraPmt, setExtraPmt] = useState('0')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const P = parseFloat(loanAmt) || 0
    const r = (parseFloat(intRate) || 0) / 100 / 12
    const y = parseInt(loanTerm) || 30
    const extra = parseFloat(extraPmt) || 0
    const n = y * 12

    let M = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalBase = M * n, intBase = totalBase - P

    let bal = P, payments = 0, intPaid = 0, month = 0, rows = []
    while (bal > 0.01 && month < 600) {
      month++
      const intPortion = bal * r
      const principalPortion = Math.min(M - intPortion + extra, bal)
      const pmt = intPortion + principalPortion
      intPaid += intPortion; bal -= principalPortion; if (bal < 0) bal = 0
      rows.push({ n: month, pmt, principal: principalPortion, interest: intPortion, balance: bal })
      payments++
    }

    const totalWithExtra = rows.reduce((a, r) => a + r.pmt, 0)
    const intWithExtra = totalWithExtra - P
    const monthsSaved = n - payments
    const intSaved = intBase - intWithExtra
    const now = new Date()
    const payoff = new Date(now.setMonth(now.getMonth() + payments))
    const payoffStr = payoff.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    setResult({ monthly: M + (r > 0 ? extra : 0), total: totalWithExtra, interest: intWithExtra, payoff: payoffStr, extra, intSaved, monthsSaved, rows })
    setTimeout(() => jumpTo(), 50)
  }, [loanAmt, intRate, loanTerm, extraPmt, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Amortization Calculator"
      desc="Calculate monthly payments, total interest, and view full amortization schedule with extra payment impact."
      icon="🏦" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="amortization-calculator"
      faq={[
        { q: "What is amortization?", a: "Amortization is the process of paying off a loan through regular monthly payments over a set period of time." },
        { q: "How do extra payments help?", a: "Extra payments reduce the principal faster, which means less interest paid overall and a shorter loan term." },
      ]}
      howItWorks={[
        "Enter the loan amount, interest rate, and term.",
        "Optionally add extra monthly payments.",
        "View monthly payment, total interest, and full amortization schedule.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Amortization Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/amortization-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Loan Amount ($)', value: loanAmt, set: setLoanAmt, ph: '300000' },
              { label: 'Annual Interest Rate (%)', value: intRate, set: setIntRate, ph: '6.5' },
              { label: 'Loan Term (Years)', value: loanTerm, set: setLoanTerm, ph: '30' },
              { label: 'Extra Monthly Payment ($)', value: extraPmt, set: setExtraPmt, ph: '0' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.ph} className={inputClass} />
              </div>
            ))}
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full mt-4 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            🏦 Calculate Schedule
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Monthly Payment', value: fmtUSD(result.monthly), color: 'text-indigo-400' },
                { label: 'Total Payment', value: fmtUSD(result.total), color: 'text-slate-300' },
                { label: 'Total Interest', value: fmtUSD(result.interest), color: 'text-red-400' },
                { label: 'Payoff Date', value: result.payoff, color: 'text-cyan-400' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-black/20 rounded-xl">
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {result.extra > 0 && result.intSaved > 0 && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 mb-4">
                💡 With an extra {fmtUSD(result.extra)}/month, you'll save {fmtUSD(result.intSaved)} in interest and pay off your loan {result.monthsSaved} months early!
              </div>
            )}

            <h4 className="text-sm font-bold text-slate-300 mt-4 mb-2">Amortization Schedule</h4>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#1a1a2e]">
                  <tr className="text-left text-slate-500 border-b border-white/[0.08]">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Payment</th>
                    <th className="py-2 px-2">Principal</th>
                    <th className="py-2 px-2">Interest</th>
                    <th className="py-2 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map(r => (
                    <tr key={r.n} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-slate-500">{r.n}</td>
                      <td className="py-2 px-2 text-slate-300">{fmtUSD(r.pmt)}</td>
                      <td className="py-2 px-2 text-slate-300">{fmtUSD(r.principal)}</td>
                      <td className="py-2 px-2 text-red-400">{fmtUSD(r.interest)}</td>
                      <td className="py-2 px-2 font-bold text-white">{fmtUSD(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter values and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
