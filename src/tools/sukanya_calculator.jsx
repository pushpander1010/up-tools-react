import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

export default function sukanya_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [deposit, setDeposit] = useState(1000)
  const [rate, setRate] = useState(8.2)
  const [age, setAge] = useState(1)

  const result = useMemo(() => {
    if (!deposit || !rate || age < 1 || age > 10) return null
    const years = 21 - age
    let balance = 0
    const rows = []
    for (let i = 1; i <= years; i++) {
      balance = (balance + deposit) * (1 + rate / 100)
      rows.push({
        year: i,
        age: age + i,
        deposit,
        balance: Math.round(balance),
      })
    }
    const totalDeposited = deposit * years
    return {
      totalDeposited,
      maturity: Math.round(balance),
      interest: Math.round(balance - totalDeposited),
      years,
      rows,
    }
  }, [deposit, rate, age])

  return (
    <ToolLayout
      title="Sukanya Samriddhi Yojana Calculator"
      desc="Sukanya Samriddhi Yojana Calculator – project maturity amount, total deposits and interest earned. Free online, no sign-up. Works on any device."
      icon="🏦" iconBg="rgba(16,185,129,0.08)"
      category="finance" slug="sukanya-calculator"
      faq={[
        { q: 'What is Sukanya Samriddhi Yojana?', a: 'A government-backed savings scheme for girl children offering tax-free interest and guaranteed returns.' },
        { q: 'What is the current interest rate?', a: 'The government reviews SSY rates quarterly. Check the latest notification for the current rate.' },
        { q: 'What is the maximum deposit limit?', a: 'You can deposit a maximum of ₹1,50,000 per financial year.' },
        { q: 'What is the maturity period?', a: 'The account matures 21 years after opening or when the girl turns 21, whichever is later.' },
        { q: 'Can I open an account for more than one daughter?', a: 'Yes, but only up to two accounts per family (exceptions for twins/triplets).' },
        { q: 'Is this calculator free?', a: 'Yes, completely free with no sign-up. Use it unlimited times online on any device.' },
      ]}
      howItWorks={[
        'Enter your yearly deposit amount, annual interest rate, and the child\'s current age.',
        'The tool calculates total deposits, interest earned, and the final maturity amount.',
        'View a year-by-year breakdown showing how your savings grow over the investment period.',
        'Use the table to plan deposits and track growth toward the maturity target.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Sukanya Samriddhi Yojana Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/sukanya-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual Deposit (₹)</label>
          <input type="number" value={deposit} onChange={e => setDeposit(Number(e.target.value))} min={500} max={150000}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Annual Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} min={1} max={20}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all duration-200 [color-scheme:dark]" />

          <label className="block text-sm font-semibold text-slate-300 mb-2 mt-4">Child's Current Age (1–10)</label>
          <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={1} max={10}
            className="w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-5 py-3 text-white font-semibold outline-none focus:border-emerald-500/40 transition-all duration-200 [color-scheme:dark]" />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Maturity Projection</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
              {[
                ['Total Deposited', `₹${result.totalDeposited.toLocaleString()}`, 'text-emerald-400'],
                ['Interest Earned', `₹${result.interest.toLocaleString()}`, 'text-amber-400'],
                ['Maturity Amount', `₹${result.maturity.toLocaleString()}`, 'text-cyan-400'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-2.5 sm:p-3 rounded-xl bg-black/20 border border-white/[0.05] text-center">
                  <div className={`text-lg sm:text-xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Year-wise table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase">
                    <th className="pb-2 pr-4">Year</th>
                    <th className="pb-2 pr-4">Age</th>
                    <th className="pb-2 pr-4 text-right">Deposit</th>
                    <th className="pb-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map(r => (
                    <tr key={r.year} className="border-t border-white/[0.05]">
                      <td className="py-2 pr-4 text-white font-medium">{r.year}</td>
                      <td className="py-2 pr-4 text-slate-300">{r.age}</td>
                      <td className="py-2 pr-4 text-right text-slate-300">₹{r.deposit.toLocaleString()}</td>
                      <td className="py-2 text-right text-emerald-300 font-semibold">₹{r.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter deposit details to see projection</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
