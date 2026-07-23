import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0)

function calcMonthly(balance, annualRate, years) {
  const mr = annualRate / 100 / 12
  const n = years * 12
  if (mr <= 0) return balance / n
  return balance * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
}

function calcRefinance(balance, curRate, curYears, newRate, newTerm, closingCosts) {
  const b = Math.max(0, Number(balance || 0))
  const cr = Math.max(0, Number(curRate || 0))
  const cy = Math.max(1, Number(curYears || 25))
  const nr = Math.max(0, Number(newRate || 0))
  const nt = Math.max(1, Number(newTerm || 30))
  const cc = Math.max(0, Number(closingCosts || 0))
  if (!b) return null

  const curPmt = calcMonthly(b, cr, cy)
  const newPmt = calcMonthly(b, nr, nt)
  const monthlySavings = curPmt - newPmt
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(cc / monthlySavings) : 999
  const curTotalInterest = (curPmt * cy * 12) - b
  const newTotalInterest = (newPmt * nt * 12) - b
  const interestSaved = curTotalInterest - newTotalInterest - cc

  let recommendation = ''
  if (monthlySavings <= 0) {
    recommendation = 'Refinancing is not recommended. Your monthly payment would increase.'
  } else if (breakEvenMonths <= 24) {
    recommendation = `Refinancing looks good! You'll break even in ${breakEvenMonths} months.`
  } else if (breakEvenMonths <= 60) {
    recommendation = `Refinancing could work if you plan to stay long-term. Break-even in ${Math.floor(breakEvenMonths / 12)} years.`
  } else {
    recommendation = `Break-even is very long (${Math.floor(breakEvenMonths / 12)} years). Refinancing may not be worth it.`
  }

  return { curPmt, newPmt, monthlySavings, breakEvenMonths, interestSaved, recommendation }
}

export default function refinance_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [balance, setBalance] = useState('300000')
  const [curRate, setCurRate] = useState('6.5')
  const [curYears, setCurYears] = useState('25')
  const [newRate, setNewRate] = useState('5.5')
  const [newTerm, setNewTerm] = useState('30')
  const [closingCosts, setClosingCosts] = useState('5000')

  const result = useMemo(() => calcRefinance(balance, curRate, curYears, newRate, newTerm, closingCosts),
    [balance, curRate, curYears, newRate, newTerm, closingCosts])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]'
  const sectionHeader = 'text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 pb-1'

  return (
    <ToolLayout
      title="Refinance Calculator"
      desc="Calculate if refinancing your mortgage saves you money. See monthly savings and break-even point."
      icon="🔄" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="refinance-calculator"
      faq={[
        { q: 'When should I refinance my mortgage?', a: 'Refinance when you can lower your rate by at least 0.5-1%, plan to stay past the break-even point, or want to switch from ARM to fixed-rate.' },
        { q: 'What is the break-even point?', a: 'The break-even point is when your monthly savings equal your refinancing costs. For example, $3,000 costs / $150 savings = 20 months.' },
        { q: 'How much does refinancing cost?', a: 'Refinancing typically costs 2-5% of the loan amount, including appraisal, origination fees, title insurance, and closing costs.' },
      ]}
      howItWorks={[
        'Enter your current mortgage details (balance, rate, years remaining).',
        'Enter the new mortgage terms and closing costs.',
        'Click Calculate to see monthly savings, break-even point, and recommendation.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Refinance Calculator', applicationCategory: 'FinanceApplication',
        url: 'https://www.uptools.in/refinance-calculator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={sectionHeader}>Current Mortgage</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Loan Balance ($)</label>
            <input type="number" value={balance} onChange={e => setBalance(e.target.value)}
              placeholder="300000" min="0" step="1000"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Interest Rate (%)</label>
            <input type="number" value={curRate} onChange={e => setCurRate(e.target.value)}
              placeholder="6.5" min="0" max="20" step="0.1"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Years Remaining</label>
            <input type="number" value={curYears} onChange={e => setCurYears(e.target.value)}
              placeholder="25" min="1" max="30"
              className={inputClass} />
          </div>
        </div>

        <div className={sectionHeader}>New Mortgage</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">New Rate (%)</label>
            <input type="number" value={newRate} onChange={e => setNewRate(e.target.value)}
              placeholder="5.5" min="0" max="20" step="0.1"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">New Term (years)</label>
            <input type="number" value={newTerm} onChange={e => setNewTerm(e.target.value)}
              placeholder="30" min="10" max="30" step="5"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Closing Costs ($)</label>
            <input type="number" value={closingCosts} onChange={e => setClosingCosts(e.target.value)}
              placeholder="5000" min="0" step="500"
              className={inputClass} />
            <p className="text-xs text-slate-500 mt-1">Typically 2-5% of loan amount</p>
          </div>
        </div>

        <button onClick={() => jumpTo()}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Refinance Savings
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Refinance Analysis</h3>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {result.monthlySavings > 0 ? `${fmt(result.monthlySavings)} saved/mo` : `${fmt(Math.abs(result.monthlySavings))} more/mo`}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Payment</span>
                <span className="font-bold text-white">{fmt(result.curPmt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">New Payment</span>
                <span className="font-bold text-white">{fmt(result.newPmt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Break-Even Point</span>
                <span className="font-bold text-white">
                  {result.breakEvenMonths < 999
                    ? `${result.breakEvenMonths} mo (${Math.floor(result.breakEvenMonths / 12)}y ${result.breakEvenMonths % 12}m)`
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Interest Saved</span>
                <span className={`font-bold ${result.interestSaved >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.interestSaved >= 0 ? fmt(result.interestSaved) : `-${fmt(Math.abs(result.interestSaved))}`}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300">
              💡 {result.recommendation}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🔄</div>
            <p className="text-sm text-slate-600 font-medium">Enter mortgage details to compare</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
