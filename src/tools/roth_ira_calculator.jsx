import { useState, useCallback, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const fmtK = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : fmt.format(n)

export default function roth_ira_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [balance, setBalance] = useState(0)
  const [contribution, setContribution] = useState(7000)
  const [returnRate, setReturnRate] = useState(8)
  const [contributionIncrease, setContributionIncrease] = useState(0)
  const [result, setResult] = useState(null)

  const limit = currentAge >= 50 ? 8000 : 7000

  const calculate = useCallback(() => {
    const years = retirementAge - currentAge
    const rate = returnRate / 100
    const increase = contributionIncrease / 100
    const limit2025 = currentAge >= 50 ? 8000 : 7000

    let annual = Math.min(contribution, limit2025)
    let bal = balance
    let totalContrib = balance
    let warning = contribution > limit2025

    for (let y = 0; y < years; y++) {
      bal = bal * (1 + rate) + annual
      totalContrib += annual
      annual = Math.min(annual * (1 + increase), limit2025)
    }

    const earnings = bal - totalContrib
    const taxSavings = earnings * 0.24

    setResult({ finalBalance: bal, totalContrib, earnings, years, taxSavings, warning, limit: limit2025 })
  }, [currentAge, retirementAge, balance, contribution, returnRate, contributionIncrease])

  return (
    <ToolLayout
      title="Roth IRA Calculator"
      desc="Calculate your tax-free retirement savings with a Roth IRA. See how your contributions grow over time."
      icon="🏦" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="roth-ira-calculator"
      faq={[
        { q: 'What is a Roth IRA?', a: 'A Roth IRA is a retirement account where you contribute after-tax dollars, but all withdrawals in retirement are tax-free.' },
        { q: 'What is the 2025 contribution limit?', a: '$7,000 per year ($8,000 if you\'re 50 or older). Income limits apply.' },
        { q: 'Can I withdraw early?', a: 'You can withdraw contributions (not earnings) anytime tax-free. Earnings require age 59½ and 5-year holding period.' },
      ]}
      howItWorks={[
        'Enter your current age, retirement age, and current Roth IRA balance.',
        'Set your annual contribution (2025 limit: $7,000, $8,000 if 50+).',
        'Enter expected annual return rate and optional contribution increase.',
        'Click Calculate to see your tax-free retirement savings projection.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Roth IRA Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/roth-ira-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Current Age</label>
            <input type="number" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} min="18" max="70"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Retirement Age</label>
            <input type="number" value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} min="50" max="75"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Current Roth IRA Balance ($)</label>
          <input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} min="0" step="1000"
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-2 block">Annual Contribution ($)</label>
          <input type="number" value={contribution} onChange={e => setContribution(Number(e.target.value))} min="0" max="8000" step="100"
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
          <p className="text-[10px] text-slate-600 mt-1">2025 limit: $7,000 ($8,000 if 50+)</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Expected Return (%)</label>
            <input type="number" value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} min="0" max="20" step="0.5"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Contribution Increase (%)</label>
            <input type="number" value={contributionIncrease} onChange={e => setContributionIncrease(Number(e.target.value))} min="0" max="10" step="0.5"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-4 py-3.5 text-white font-semibold outline-none focus:border-green-500/40 transition-all [color-scheme:dark]" />
            <p className="text-[10px] text-slate-600 mt-1">Optional: increase with raises</p>
          </div>
        </div>

        {/* Calculate Button */}
        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          🏦 Calculate Roth IRA Growth
        </button>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Tax-Free Retirement Savings</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">{fmt.format(result.finalBalance)}</div>
            <p className="text-sm text-slate-400 mb-6">Roth IRA balance at retirement (100% tax-free)</p>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-lg font-bold text-white">{fmt.format(result.totalContrib)}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Total Contributions</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-lg font-bold text-green-400">{fmt.format(result.earnings)}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Investment Earnings</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/8 text-center">
                <div className="text-lg font-bold text-white">{result.years} yrs</div>
                <div className="text-[10px] text-slate-500 font-semibold">Years to Retirement</div>
              </div>
            </div>

            {/* Tax Advantage */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-300"><strong>💰 Tax Advantage:</strong> All {fmt.format(result.earnings)} in earnings will be tax-free at retirement. In a taxable account you'd pay ~{fmt.format(result.taxSavings)} in taxes (24% bracket).</p>
            </div>

            {result.warning && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-300"><strong>⚠️ Contribution Limit:</strong> Adjusted to 2025 limit of {fmt.format(result.limit)}.</p>
              </div>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
