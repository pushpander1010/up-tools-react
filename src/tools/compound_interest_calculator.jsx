import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtUSD = n => '$' + Math.round(n).toLocaleString('en-US')
const fmtUSD2 = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function compound_interest_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [principal, setPrincipal] = useState('100000')
  const [rate, setRate] = useState('10')
  const [freq, setFreq] = useState('12')
  const [years, setYears] = useState('10')
  const [monthly, setMonthly] = useState('0')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const P = parseFloat(principal) || 0
    const R = parseFloat(rate) || 0
    const n = parseInt(freq) || 12
    const t = parseInt(years) || 1
    const M = parseFloat(monthly) || 0
    const r = R / 100 / n
    const monthlyFreq = 12 / n

    let balance = P
    const yearlyData = []
    for (let y = 1; y <= t; y++) {
      const startBal = balance
      let yearContrib = 0
      for (let p = 0; p < n; p++) {
        const contribThisPeriod = M * monthlyFreq
        balance += contribThisPeriod
        yearContrib += contribThisPeriod
        balance *= (1 + r)
      }
      yearlyData.push({ year: y, start: startBal, contributions: yearContrib, interest: balance - startBal - yearContrib, end: balance })
    }

    const totalInvested = P + M * 12 * t
    const totalInterest = balance - totalInvested
    const interestPct = balance > 0 ? ((totalInterest / balance) * 100).toFixed(1) : '0'
    setResult({ finalBalance: balance, totalInterest, totalInvested, years: t, interestPct, yearlyData })
    setTimeout(() => jumpTo(), 50)
  }, [principal, rate, freq, years, monthly, jumpTo])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Compound Interest Calculator"
      desc="Calculate compound interest with monthly contributions. See year-by-year growth breakdown."
      icon="📈" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="compound-interest-calculator"
      faq={[
        { q: "What is compound interest?", a: "Compound interest is interest calculated on the initial principal and accumulated interest from previous periods." },
        { q: "How does compounding frequency affect returns?", a: "More frequent compounding (monthly vs yearly) results in slightly higher returns because interest is added to the balance more often." },
      ]}
      howItWorks={[
        "Enter your initial investment (principal).",
        "Set the annual interest rate and compounding frequency.",
        "Optionally add monthly contributions.",
        "View year-by-year growth breakdown.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Compound Interest Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/compound-interest-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal Amount', value: principal, set: setPrincipal, ph: 'e.g., 100000' },
              { label: 'Annual Interest Rate (%)', value: rate, set: setRate, ph: 'e.g., 10' },
              { label: 'Compounding Frequency', value: freq, set: setFreq, ph: '12', type: 'select',
                options: [{ v: '1', l: 'Yearly' }, { v: '4', l: 'Quarterly' }, { v: '12', l: 'Monthly' }, { v: '365', l: 'Daily' }] },
              { label: 'Time Period (Years)', value: years, set: setYears, ph: '10' },
              { label: 'Monthly Contribution', value: monthly, set: setMonthly, ph: '0 (optional)' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
                {f.type === 'select' ? (
                  <select value={f.value} onChange={e => f.set(e.target.value)} className={inputClass}>
                    {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                ) : (
                  <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                    placeholder={f.ph} className={inputClass} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => { calculate(); jumpTo() }}
            className="w-full mt-4 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all active:scale-[0.98]">
            ⚡ Calculate
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Final Balance', value: fmtUSD2(result.finalBalance), color: 'text-emerald-400', highlight: true },
                { label: 'Total Interest', value: fmtUSD2(result.totalInterest), color: 'text-amber-400' },
                { label: 'Total Invested', value: fmtUSD2(result.totalInvested), color: 'text-cyan-400' },
                { label: 'Interest %', value: result.interestPct + '% of final', color: 'text-purple-400' },
              ].map(item => (
                <div key={item.label} className={`text-center p-4 rounded-xl ${item.highlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-black/20'}`}>
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Year table */}
            <h4 className="text-sm font-bold text-slate-300 mt-4 mb-2">Year-by-Year Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/[0.08]">
                    <th className="py-2 px-2">Year</th>
                    <th className="py-2 px-2">Start</th>
                    <th className="py-2 px-2">Contrib</th>
                    <th className="py-2 px-2">Interest</th>
                    <th className="py-2 px-2">End</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyData.map(d => (
                    <tr key={d.year} className="border-b border-white/[0.04]">
                      <td className="py-2 px-2 text-slate-400">{d.year}</td>
                      <td className="py-2 px-2 text-slate-300">{fmtUSD2(d.start)}</td>
                      <td className="py-2 px-2 text-slate-300">{fmtUSD2(d.contributions)}</td>
                      <td className="py-2 px-2 text-emerald-400">+{fmtUSD2(d.interest)}</td>
                      <td className="py-2 px-2 font-bold text-white">{fmtUSD2(d.end)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Enter values and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
