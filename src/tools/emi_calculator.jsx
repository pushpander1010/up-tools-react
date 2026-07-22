import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function calcEMI(p, r, n) {
  if (p <= 0 || r <= 0 || n <= 0) return null
  const rate = r / 12 / 100
  const emi = p * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1)
  const total = emi * n
  const interest = total - p
  return { emi, total, interest, principal: p }
}

function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN') }

export default function emi_calculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenure, setTenure] = useState('')
  const [tenureUnit, setTenureUnit] = useState('years')

  const p = parseFloat(principal) || 0
  const r = parseFloat(rate) || 0
  const n = tenureUnit === 'years' ? (parseFloat(tenure) || 0) * 12 : (parseFloat(tenure) || 0)

  const result = useMemo(() => calcEMI(p, r, n), [p, r, n])

  // Amortization schedule (first 12 + last 12 months)
  const schedule = useMemo(() => {
    if (!result || n <= 0) return []
    const rate = r / 12 / 100
    let balance = p
    const rows = []
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * rate
      const principalPart = result.emi - interestPart
      balance -= principalPart
      rows.push({ month: i, emi: result.emi, principal: principalPart, interest: interestPart, balance: Math.max(0, balance) })
    }
    return rows
  }, [result, n, p, r])

  const displaySchedule = useMemo(() => {
    if (schedule.length <= 24) return schedule
    return [...schedule.slice(0, 12), null, ...schedule.slice(-12)]
  }, [schedule])

  const principalPct = result ? (p / result.total * 100) : 50
  const interestPct = result ? (result.interest / result.total * 100) : 50

  return (
    <>
      <Helmet>
        <title>EMI Calculator — Monthly Loan Repayment Planner</title>
        <meta name="description" content="Calculate EMI for home loan, car loan, personal loan. See amortization schedule." />
        <link rel="canonical" href="https://www.uptools.in/emi-calculator/" />
      </Helmet>

      <nav className="text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-white">EMI Calculator</span>
      </nav>

      <section className="glass p-6 mb-6" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(17,24,39,0.6))', borderColor: 'rgba(34,197,94,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>📊</div>
          <div>
            <h1 className="text-xl font-bold text-white m-0">EMI Calculator</h1>
            <p className="text-sm text-slate-400 mt-1">Plan monthly loan repayments</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass p-5">
            <label className="text-xs font-medium text-slate-400 mb-2 block">Loan Amount (₹)</label>
            <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 2000000"
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Interest Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 8.5"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-600" />
            </div>
            <div className="glass p-5">
              <label className="text-xs font-medium text-slate-400 mb-2 block">Tenure</label>
              <div className="flex gap-2">
                <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="e.g. 20"
                  className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-lg font-semibold outline-none focus:border-green-500/50 transition-colors placeholder:text-slate-600" />
                <div className="flex flex-col gap-1">
                  {['years', 'months'].map(u => (
                    <button key={u} onClick={() => setTenureUnit(u)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        tenureUnit === u ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-white/4 text-slate-500 border border-white/6'
                      }`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="glass p-5 text-center">
                <div className="text-xs text-slate-400 mb-1">Monthly EMI</div>
                <div className="text-3xl font-extrabold gradient-text">{fmt(result.emi)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass p-4 text-center">
                  <div className="text-xs text-slate-400">Total Interest</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">{fmt(result.interest)}</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-xs text-slate-400">Total Payment</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{fmt(result.total)}</div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="glass p-4">
                <div className="text-xs text-slate-400 mb-2 text-center">Principal vs Interest</div>
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                      strokeDasharray={`${principalPct} ${100 - principalPct}`} strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f43f5e" strokeWidth="3"
                      strokeDasharray={`${interestPct} ${100 - interestPct}`} strokeDashoffset={`${-principalPct}`} />
                  </svg>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Principal</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Interest</span>
                </div>
              </div>
            </>
          ) : (
            <div className="glass p-8 text-center">
              <p className="text-sm text-slate-500">Enter loan details to calculate EMI</p>
            </div>
          )}
        </div>
      </div>

      {/* Amortization Schedule */}
      {displaySchedule.length > 0 && (
        <section className="glass p-5 mt-6">
          <h3 className="text-sm font-semibold text-white mb-3">📋 Amortization Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/6">
                  <th className="text-left py-2 px-2">Month</th>
                  <th className="text-right py-2 px-2">EMI</th>
                  <th className="text-right py-2 px-2">Principal</th>
                  <th className="text-right py-2 px-2">Interest</th>
                  <th className="text-right py-2 px-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {displaySchedule.map((row, i) => row === null ? (
                  <tr key={i}><td colSpan={5} className="text-center py-1 text-slate-600">···</td></tr>
                ) : (
                  <tr key={i} className="border-b border-white/4 hover:bg-white/2">
                    <td className="py-2 px-2 text-slate-400">{row.month}</td>
                    <td className="py-2 px-2 text-right text-white">{fmt(row.emi)}</td>
                    <td className="py-2 px-2 text-right text-emerald-400">{fmt(row.principal)}</td>
                    <td className="py-2 px-2 text-right text-rose-400">{fmt(row.interest)}</td>
                    <td className="py-2 px-2 text-right text-slate-400">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}
