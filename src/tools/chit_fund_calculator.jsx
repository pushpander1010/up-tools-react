import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function chit_fund_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [chitValue, setChitValue] = useState(100000)
  const [months, setMonths] = useState(20)
  const [commission, setCommission] = useState(5)

  const result = useMemo(() => {
    if (!chitValue || months < 1 || commission < 0) return null
    const monthlyDue = chitValue / months
    const commAmount = (commission / 100) * chitValue
    const commPerMonth = commAmount / months

    const rows = []
    let cumulativeDividend = 0
    for (let m = 1; m <= months; m++) {
      const remainingAfterDeduction = chitValue - commAmount
      const dividendPerMember = remainingAfterDeduction / months
      const netDividend = dividendPerMember - monthlyDue
      cumulativeDividend += Math.max(0, netDividend)
      rows.push({
        month: m,
        monthlyDue: Math.round(monthlyDue),
        commissionDeduction: Math.round(commPerMonth),
        dividend: Math.round(netDividend),
        cumulative: Math.round(cumulativeDividend),
      })
    }

    const totalPaid = monthlyDue * months
    const totalDeduction = commAmount
    const effectiveReturn = ((chitValue - totalPaid - totalDeduction) / totalPaid) * 100

    return {
      monthlyDue: Math.round(monthlyDue),
      commissionAmount: Math.round(commAmount),
      effectiveReturn: effectiveReturn.toFixed(2),
      totalPaid: Math.round(totalPaid),
      rows,
    }
  }, [chitValue, months, commission])

  return (
    <ToolLayout
      title="Chit Fund Calculator"
      desc="Chit Fund Calculator – calculate monthly contributions, commission deductions, dividends and effective returns. Free online, no sign-up. Works on any device."
      icon="💰" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="chit-fund-calculator"
      faq={[
        { q: 'What is a Chit Fund?', a: 'A chit fund is a rotating savings and credit scheme where members contribute monthly and bid to receive the collected amount.' },
        { q: 'How is the commission calculated?', a: 'The organizer deducts a fixed commission percentage (typically 5%) from the collected pool each month.' },
        { q: 'What is the effective return?', a: 'Effective return is the annualized return you earn based on the dividends you receive minus the commissions you pay.' },
        { q: 'Is this calculator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
        { q: 'Can I use it for different chit amounts?', a: 'Yes, enter any chit value, tenure in months, and commission percentage to calculate your returns.' },
        { q: 'What are typical commission rates?', a: 'Commission rates typically range from 3% to 7% depending on the chit fund and organizer.' },
      ]}
      howItWorks={[
        'Enter the chit fund value (total pool amount), number of months, and organizer commission percentage.',
        'The tool calculates monthly contribution, commission deduction, and net dividends.',
        'View a month-by-month breakdown showing dividends earned and cumulative returns.',
        'Check the effective return rate to understand the annualized yield on your chit fund investment.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Chit Fund Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/chit-fund-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Chit Value (₹)</label>
          <input type="number" value={chitValue} onChange={e => setChitValue(Number(e.target.value))} min={1000}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Duration (Months)</label>
          <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))} min={1} max={120}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Organizer Commission (%)</label>
          <input type="number" step="0.1" value={commission} onChange={e => setCommission(Number(e.target.value))} min={0} max={20}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-amber-500/40 transition-all duration-200 [color-scheme:dark]" />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-amber-500/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Chit Fund Summary</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
              {[
                ['Monthly Due', `₹${result.monthlyDue.toLocaleString()}`, 'text-amber-400'],
                ['Commission', `₹${result.commissionAmount.toLocaleString()}`, 'text-red-400'],
                ['Effective Return', `${result.effectiveReturn}%`, 'text-emerald-400'],
                ['Total Paid', `₹${result.totalPaid.toLocaleString()}`, 'text-cyan-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-lg sm:text-xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Month-wise table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase">
                    <th className="pb-2 pr-3">Month</th>
                    <th className="pb-2 pr-3 text-right">Due</th>
                    <th className="pb-2 pr-3 text-right">Commission</th>
                    <th className="pb-2 pr-3 text-right">Dividend</th>
                    <th className="pb-2 text-right">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map(r => (
                    <tr key={r.month} className="border-t border-white/[0.05]">
                      <td className="py-2 pr-3 text-white font-medium">{r.month}</td>
                      <td className="py-2 pr-3 text-right text-slate-300">₹{r.monthlyDue.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right text-red-400">₹{r.commissionDeduction.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right text-emerald-300">₹{r.dividend.toLocaleString()}</td>
                      <td className="py-2 text-right text-amber-300 font-semibold">₹{r.cumulative.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter chit fund details to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
