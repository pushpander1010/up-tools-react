import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'
const fmt = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })

export default function investment_return_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [initial, setInitial] = useState(10000)
  const [monthly, setMonthly] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(8)
  const [years, setYears] = useState(20)
  const [frequency, setFrequency] = useState(12)
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const init = parseFloat(initial) || 0
    const m = parseFloat(monthly) || 0
    const rate = (parseFloat(annualReturn) || 0) / 100
    const y = parseInt(years) || 1
    const freq = parseInt(frequency) || 12
    const ratePerPeriod = rate / freq
    const totalPeriods = y * freq
    const contributionPerPeriod = m * (12 / freq)

    let balance = init
    let totalContributions = init
    const yearlyData = []
    for (let period = 1; period <= totalPeriods; period++) {
      balance = balance * (1 + ratePerPeriod) + contributionPerPeriod
      totalContributions += contributionPerPeriod
      if (period % freq === 0) {
        yearlyData.push({
          year: period / freq,
          balance,
          contributions: totalContributions,
          interest: balance - totalContributions,
        })
      }
    }
    const finalValue = balance
    const totalInterest = finalValue - totalContributions
    const roi = totalContributions > 0 ? ((finalValue - totalContributions) / totalContributions) * 100 : 0
    setResult({ finalValue, totalContributions, totalInterest, roi, yearlyData })
  }, [initial, monthly, annualReturn, years, frequency])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Investment Return Calculator"
      desc="Calculate your investment returns with compound interest. See how your money grows over time."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="investment-return-calculator"
      faq={[
        { q: "What is compound interest?", a: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It causes your investment to grow exponentially." },
        { q: "What is a good ROI?", a: "The S&P 500 has historically returned about 10% annually. A good ROI depends on your investment type: stocks (8-12%), bonds (4-6%), real estate (8-10%)." },
      ]}
      howItWorks={[
        "Enter initial investment, monthly contribution, and expected return rate.",
        "Choose compounding frequency and investment period.",
        "Click Calculate to see projected value, ROI, and year-by-year breakdown.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Investment Return Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/investment-return-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Initial Investment ($)', value: initial, set: setInitial, step: 100, min: 0 },
            { label: 'Monthly Contribution ($)', value: monthly, set: setMonthly, step: 50, min: 0 },
            { label: 'Expected Annual Return (%)', value: annualReturn, set: setAnnualReturn, step: 0.1, min: 0, max: 50 },
            { label: 'Investment Period (Years)', value: years, set: setYears, step: 1, min: 1, max: 50 },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-semibold text-slate-300 mb-2">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.set(e.target.value)} min={f.min} max={f.max} step={f.step} className={inputClass} />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Compounding Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className={selectClass}>
              <option value="365">Daily</option>
              <option value="12">Monthly</option>
              <option value="4">Quarterly</option>
              <option value="2">Semi-Annually</option>
              <option value="1">Annually</option>
            </select>
          </div>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Returns
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Investment Growth</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-4xl font-extrabold text-white">{fmt(result.finalValue)}</div>
              <div className="text-sm text-slate-400 mt-1">Final investment value</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Total Contributions', value: fmt(result.totalContributions) },
                { label: 'Total Interest Earned', value: fmt(result.totalInterest) },
                { label: 'ROI', value: result.roi.toFixed(1) + '%' },
              ].map((r, i) => (
                <div key={i} className="rounded-xl p-3 border-2 border-white/8 bg-white/[0.03] text-center">
                  <div className="text-sm font-extrabold text-white">{r.value}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{r.label}</div>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-bold text-white mb-3">Year-by-Year Breakdown</h3>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[#12121a]"><tr className="border-b border-white/8">
                  <th className="text-left py-2 text-slate-400 font-semibold">Year</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Balance</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Contributions</th>
                  <th className="text-right py-2 text-slate-400 font-semibold">Interest</th>
                </tr></thead>
                <tbody>
                  {result.yearlyData.map((d, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-1.5 text-slate-500">{d.year}</td>
                      <td className="py-1.5 text-right text-white font-bold">{fmt(d.balance)}</td>
                      <td className="py-1.5 text-right text-slate-300">{fmt(d.contributions)}</td>
                      <td className="py-1.5 text-right text-emerald-400">{fmt(d.interest)}</td>
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
            <p className="text-sm text-slate-600 font-medium">Enter investment details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
