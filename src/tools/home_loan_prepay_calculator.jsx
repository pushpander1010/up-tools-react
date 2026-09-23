import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function home_loan_prepay_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [loan, setLoan] = useState('')
  const [rate, setRate] = useState('')
  const [tenure, setTenure] = useState('')
  const [prepay, setPrepay] = useState('')
  const [prepayStart, setPrepayStart] = useState('12')

  const schedule = useMemo(() => {
    const P = parseFloat(loan)
    const r = parseFloat(rate) / 12 / 100
    const N = parseInt(tenure) * 12
    const extra = parseFloat(prepay) || 0
    const prepayFrom = parseInt(prepayStart) || 12
    if (!P || !r || !N) return null

    // Original EMI
    const emiOrig = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1)
    let balanceOrig = P
    let totalIntOrig = 0
    for (let m = 1; m <= N; m++) {
      const intPart = balanceOrig * r
      const prinPart = emiOrig - intPart
      totalIntOrig += intPart
      balanceOrig -= prinPart
    }
    const totalPaidOrig = emiOrig * N

    // With prepayment
    let balance = P
    let totalIntNew = 0
    let months = 0
    const rows = []
    for (let m = 1; m <= N && balance > 0.01; m++) {
      const intPart = balance * r
      let prinPart = emiOrig - intPart
      let extraPaid = 0
      if (m >= prepayFrom) {
        extraPaid = Math.min(extra, balance - prinPart > 0 ? balance - prinPart : 0)
        prinPart += extraPaid
      }
      balance -= prinPart
      totalIntNew += intPart
      months = m
      rows.push({
        month: m,
        emi: emiOrig + extraPaid,
        principal: prinPart,
        interest: intPart,
        balance: Math.max(balance, 0),
      })
    }

    return {
      emiOrig: Math.round(emiOrig),
      totalPaidOrig: Math.round(totalPaidOrig),
      totalIntOrig: Math.round(totalIntOrig),
      totalIntNew: Math.round(totalIntNew),
      totalPaidNew: Math.round(emiOrig * months + rows.reduce((s, r) => s + (r.emi - emiOrig), 0)),
      interestSaved: Math.round(totalIntOrig - totalIntNew),
      monthsSaved: N - months,
      newTenure: months,
      rows,
    }
  }, [loan, rate, tenure, prepay, prepayStart])

  const fmt = n => n.toLocaleString('en-IN')

  return (
    <ToolLayout
      title="Home Loan Prepayment Calculator"
      desc="Home Loan Prepayment Calculator - calculate interest saved and tenure reduced by making extra prepayments on your home loan. Free online tool."
      icon="🏠" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="home-loan-prepay-calculator"
      faq={[
        { q: 'What is a Home Loan Prepayment Calculator?', a: 'A tool that shows how much interest you save and how many months are cut from your home loan tenure when you make extra prepayments.' },
        { q: 'How to use it?', a: 'Enter your loan amount, interest rate, tenure, monthly prepayment amount, and when prepayment starts. The calculator shows interest saved and a month-by-month schedule.' },
        { q: 'How do I use this Home Loan Prepayment Calculator online free?', a: 'Enter your input above, customize the options, and copy or save the result. Free with no sign-up.' },
        { q: 'How do I save my result?', a: 'Click the copy or download button on your result to save it. Free with no sign-up.' },
        { q: 'Can I use it more than once?', a: 'Yes, unlimited free use. Generate as many results as you need, on any device.' },
        { q: 'Is this Home Loan Prepayment Calculator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter your loan amount, annual interest rate, and original tenure.',
        'Specify the extra monthly prepayment amount and the month you will start.',
        'The calculator computes interest saved and months reduced compared to original EMI schedule.',
        'Review the month-by-month amortisation schedule with prepayments applied.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Home Loan Prepayment Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/home-loan-prepay-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Loan Amount (₹)</label>
              <input type="number" value={loan} onChange={e => { setLoan(e.target.value); jumpTo() }}
                placeholder="5000000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Interest Rate (% p.a.)</label>
              <input type="number" step="0.01" value={rate} onChange={e => { setRate(e.target.value); jumpTo() }}
                placeholder="8.5"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Tenure (Years)</label>
              <input type="number" value={tenure} onChange={e => { setTenure(e.target.value); jumpTo() }}
                placeholder="20"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Extra Prepayment (₹/month)</label>
              <input type="number" value={prepay} onChange={e => { setPrepay(e.target.value); jumpTo() }}
                placeholder="5000"
                className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Prepayment Starts from Month</label>
            <input type="number" min="1" value={prepayStart} onChange={e => { setPrepayStart(e.target.value); jumpTo() }}
              className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-2.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-400" />
          </div>
        </div>

        {/* Results */}
        {schedule ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Prepayment Summary</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
              {[
                ['Monthly EMI', `₹${fmt(schedule.emiOrig)}`, 'text-indigo-400'],
                ['Interest Saved', `₹${fmt(schedule.interestSaved)}`, 'text-emerald-400'],
                ['Months Saved', schedule.monthsSaved, 'text-amber-400'],
                ['Original Total', `₹${fmt(schedule.totalPaidOrig)}`, 'text-slate-300'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-lg sm:text-xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>
            {/* Schedule Table */}
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Amortisation Schedule (with prepayment)</h4>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-black/40">
                  <tr className="text-slate-400">
                    <th className="py-1.5 px-2">Month</th>
                    <th className="py-1.5 px-2">EMI</th>
                    <th className="py-1.5 px-2">Principal</th>
                    <th className="py-1.5 px-2">Interest</th>
                    <th className="py-1.5 px-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.rows.filter((_, i) => i < 12 || i % 12 === 0).map(r => (
                    <tr key={r.month} className="border-t border-white/[0.05]">
                      <td className="py-1.5 px-2 text-slate-300">{r.month}</td>
                      <td className="py-1.5 px-2 text-indigo-300">₹{fmt(Math.round(r.emi))}</td>
                      <td className="py-1.5 px-2 text-emerald-300">₹{fmt(Math.round(r.principal))}</td>
                      <td className="py-1.5 px-2 text-amber-300">₹{fmt(Math.round(r.interest))}</td>
                      <td className="py-1.5 px-2 text-slate-400">₹{fmt(Math.round(r.balance))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter loan details to see savings</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
