import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'

export default function net_worth_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [cash, setCash] = useState('5000')
  const [savings, setSavings] = useState('15000')
  const [investments, setInvestments] = useState('50000')
  const [retirement, setRetirement] = useState('100000')
  const [homeValue, setHomeValue] = useState('350000')
  const [vehicles, setVehicles] = useState('25000')
  const [otherAssets, setOtherAssets] = useState('10000')
  const [mortgage, setMortgage] = useState('250000')
  const [carLoans, setCarLoans] = useState('15000')
  const [studentLoans, setStudentLoans] = useState('30000')
  const [creditCards, setCreditCards] = useState('5000')
  const [otherDebt, setOtherDebt] = useState('0')

  const result = useMemo(() => {
    const totalAssets = (parseFloat(cash)||0) + (parseFloat(savings)||0) + (parseFloat(investments)||0) + (parseFloat(retirement)||0) + (parseFloat(homeValue)||0) + (parseFloat(vehicles)||0) + (parseFloat(otherAssets)||0)
    const totalLiabilities = (parseFloat(mortgage)||0) + (parseFloat(carLoans)||0) + (parseFloat(studentLoans)||0) + (parseFloat(creditCards)||0) + (parseFloat(otherDebt)||0)
    const netWorth = totalAssets - totalLiabilities
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets * 100) : 0
    return { totalAssets, totalLiabilities, netWorth, debtRatio }
  }, [cash, savings, investments, retirement, homeValue, vehicles, otherAssets, mortgage, carLoans, studentLoans, creditCards, otherDebt])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"
  const sectionLabel = "text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2"

  return (
    <ToolLayout
      title="Net Worth Calculator"
      desc="Calculate your net worth by adding assets and subtracting liabilities. Track your financial progress."
      icon="💰" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="net-worth-calculator"
      faq={[
        { q: 'What is net worth?', a: 'Net worth is total assets (what you own) minus total liabilities (what you owe). It is a snapshot of financial health.' },
        { q: 'Should I include my home?', a: 'Yes, include your home value as an asset and remaining mortgage as a liability.' },
      ]}
      howItWorks={[
        'Enter all your assets: cash, savings, investments, retirement, home, vehicles.',
        'Enter all your liabilities: mortgage, car loans, student loans, credit cards.',
        'View net worth, total assets, total liabilities, and debt-to-asset ratio.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Net Worth Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/net-worth-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className={sectionLabel}>💰 Assets (What You Own)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Cash & Checking ($)</label>
              <input type="number" value={cash} onChange={e => setCash(e.target.value)} step="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Savings ($)</label>
              <input type="number" value={savings} onChange={e => setSavings(e.target.value)} step="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Investments ($)</label>
              <input type="number" value={investments} onChange={e => setInvestments(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Retirement Accounts ($)</label>
              <input type="number" value={retirement} onChange={e => setRetirement(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Home Value ($)</label>
              <input type="number" value={homeValue} onChange={e => setHomeValue(e.target.value)} step="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Vehicles ($)</label>
              <input type="number" value={vehicles} onChange={e => setVehicles(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Other Assets ($)</label>
              <input type="number" value={otherAssets} onChange={e => setOtherAssets(e.target.value)} step="1000" className={inputClass} />
            </div>
          </div>

          <div className={sectionLabel}>📉 Liabilities (What You Owe)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Mortgage ($)</label>
              <input type="number" value={mortgage} onChange={e => setMortgage(e.target.value)} step="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Car Loans ($)</label>
              <input type="number" value={carLoans} onChange={e => setCarLoans(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Student Loans ($)</label>
              <input type="number" value={studentLoans} onChange={e => setStudentLoans(e.target.value)} step="1000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Credit Cards ($)</label>
              <input type="number" value={creditCards} onChange={e => setCreditCards(e.target.value)} step="100" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Other Debt ($)</label>
              <input type="number" value={otherDebt} onChange={e => setOtherDebt(e.target.value)} step="1000" className={inputClass} />
            </div>
          </div>

          <button onClick={() => { if (result) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate Net Worth
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Your Net Worth</h3>
            </div>
            <div className="text-center mb-4">
              <div className={`text-3xl font-extrabold ${result.netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmt(result.netWorth)}</div>
              <p className="text-sm text-slate-400 mt-1">Total assets minus total liabilities</p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Total Assets', value: fmt(result.totalAssets), color: 'text-white' },
                { label: 'Total Liabilities', value: fmt(result.totalLiabilities), color: 'text-rose-400' },
                { label: 'Debt-to-Asset Ratio', value: result.debtRatio.toFixed(1) + '%', color: 'text-amber-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`text-sm font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter assets and liabilities to calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
