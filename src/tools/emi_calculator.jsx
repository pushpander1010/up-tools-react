import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

function calcEMI(P, annualRate, months) {
  if (P <= 0 || annualRate <= 0 || months <= 0) return null
  const r = annualRate / 12 / 100
  const emi = P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
  const total = emi * months
  return { emi, total, interest: total - P, principal: P }
}

export default function emi_calculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenure, setTenure] = useState('')
  const [unit, setUnit] = useState('years')

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const n = unit === 'years' ? (parseFloat(tenure) || 0) * 12 : (parseFloat(tenure) || 0)

  const result = useMemo(() => calcEMI(p, r, n), [p, r, n])

  const schedule = useMemo(() => {
    if (!result || n <= 0) return []
    const monthlyRate = r / 12 / 100
    let balance = p
    const rows = []
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * monthlyRate
      const principalPart = result.emi - interestPart
      balance -= principalPart
      rows.push({ m: i, emi: result.emi, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) })
    }
    return rows
  }, [result, n, p, r])

  const visibleSchedule = schedule.length <= 24 ? schedule : [...schedule.slice(0, 12), null, ...schedule.slice(-12)]
  const principalPct = result ? (p / result.total * 100) : 50
  const interestPct = result ? (result.interest / result.total * 100) : 50

  return (
    <ToolLayout
      title="EMI Calculator"
      desc="Calculate EMI for home loan, car loan, personal loan. See amortization schedule with principal vs interest breakdown."
      icon="📊" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="emi-calculator"
      faq={[
        { q: 'What is EMI?', a: 'Equated Monthly Installment — a fixed payment made each month to repay a loan over a set period.' },
        { q: 'How is EMI calculated?', a: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly interest rate, and n is tenure in months.' },
        { q: 'Should I prepay my loan?', a: 'Prepaying reduces the outstanding principal, which saves you significant interest over the loan tenure.' },
        { q: 'What is a good interest rate?', a: 'Home loans: 8-9%. Car loans: 7-9%. Personal loans: 10-15%. Lower is always better.' },
      ]}
      howItWorks={[
        'Enter the loan principal amount.',
        'Enter the annual interest rate (% per annum).',
        'Select tenure in years or months.',
        'View your monthly EMI, total payment, and full amortization schedule.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "EMI Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/emi-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Principal */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Loan Amount</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-green-500/30">₹</span>
            <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="0"
              className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl pl-12 pr-5 py-4 text-3xl font-extrabold text-white outline-none focus:border-green-500/40 transition-all duration-300 placeholder:text-white/8" />
          </div>
        </div>

        {/* Rate + Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Interest Rate</label>
            <div className="relative">
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} placeholder="0"
                className="w-full bg-white/[0.03] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-green-500/40 transition-all duration-300 placeholder:text-white/8" />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">% p.a.</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tenure</label>
            <div className="flex gap-2">
              <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="0"
                className="flex-1 bg-white/[0.03] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-green-500/40 transition-all duration-300 placeholder:text-white/8" />
              <div className="flex flex-col gap-1.5">
                {['years', 'months'].map(u => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${unit === u ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'bg-white/[0.03] text-slate-500 border border-white/6'}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation: 'slideUp 0.35s ease-out' }}>
            {[
              { label: 'Monthly EMI', value: fmt(result.emi), color: 'text-emerald-400', size: 'text-2xl', bold: true },
              { label: 'Principal', value: fmt(p), color: 'text-white', size: 'text-lg', bold: true },
              { label: 'Total Interest', value: fmt(result.interest), color: 'text-rose-400', size: 'text-lg', bold: true },
              { label: 'Total Payment', value: fmt(result.total), color: 'text-white', size: 'text-lg', bold: true },
            ].map(card => (
              <div key={card.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/6 text-center">
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{card.label}</div>
                <div className={`${card.size} font-extrabold ${card.color} mt-1.5`}>{card.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pie Chart */}
        {result && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/6">
            <div className="text-sm font-semibold text-slate-300 mb-4">Principal vs Interest</div>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="4"
                    strokeDasharray={`${principalPct} ${100 - principalPct}`} strokeDashoffset="0"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f43f5e" strokeWidth="4"
                    strokeDasharray={`${interestPct} ${100 - interestPct}`} strokeDashoffset={`${-principalPct}`}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-sm text-slate-300">Principal</span></div>
                  <span className="text-sm font-bold text-white">{fmt(p)} ({principalPct.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-sm text-slate-300">Interest</span></div>
                  <span className="text-sm font-bold text-white">{fmt(result.interest)} ({interestPct.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amortization Table */}
        {visibleSchedule.length > 0 && (
          <div className="rounded-2xl border border-white/6 overflow-hidden">
            <div className="px-5 py-3 bg-white/[0.02] border-b border-white/6">
              <h3 className="text-sm font-bold text-slate-300">Amortization Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/6">
                    <th className="text-left py-3 px-4 font-semibold">Month</th>
                    <th className="text-right py-3 px-4 font-semibold">EMI</th>
                    <th className="text-right py-3 px-4 font-semibold">Principal</th>
                    <th className="text-right py-3 px-4 font-semibold">Interest</th>
                    <th className="text-right py-3 px-4 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSchedule.map((row, i) => row === null ? (
                    <tr key={i}><td colSpan={5} className="text-center py-2 text-slate-600 font-mono">···</td></tr>
                  ) : (
                    <tr key={i} className="border-b border-white/4 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-medium">{row.m}</td>
                      <td className="text-right py-3 px-4 text-white font-medium">{fmt(row.emi)}</td>
                      <td className="text-right py-3 px-4 text-emerald-400 font-medium">{fmt(row.principal)}</td>
                      <td className="text-right py-3 px-4 text-rose-400 font-medium">{fmt(row.interest)}</td>
                      <td className="text-right py-3 px-4 text-slate-400 font-medium">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
