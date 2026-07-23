import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'

export default function home_equity_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [homeValue, setHomeValue] = useState('400000')
  const [mortgageBalance, setMortgageBalance] = useState('250000')
  const [otherLiens, setOtherLiens] = useState('0')

  const hv = parseFloat(homeValue) || 0
  const mb = parseFloat(mortgageBalance) || 0
  const ol = parseFloat(otherLiens) || 0

  const result = useMemo(() => {
    if (hv <= 0) return null
    const totalDebt = mb + ol
    const equity = hv - totalDebt
    const equityPercent = hv > 0 ? (equity / hv) * 100 : 0
    const maxLTV = hv * 0.80
    const availableBorrow = Math.max(0, maxLTV - totalDebt)
    return { equity, equityPercent, totalDebt, availableBorrow }
  }, [hv, mb, ol])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Home Equity Calculator"
      desc="Calculate how much equity you have in your home and track equity growth over time."
      icon="🏠" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="home-equity-calculator"
      faq={[
        { q: 'What is home equity?', a: 'Home equity is your home value minus outstanding mortgage and other liens. It represents the portion you truly own.' },
        { q: 'How do I build home equity?', a: 'By making mortgage payments, home appreciation, extra principal payments, and home improvements.' },
        { q: 'What is a good amount of home equity?', a: '20% equity is the minimum to avoid PMI. 50%+ provides financial flexibility.' },
      ]}
      howItWorks={[
        'Enter your current home value.',
        'Enter outstanding mortgage and any other liens.',
        'View your equity amount, percentage, and available borrowing capacity.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Home Equity Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/home-equity-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Current Home Value ($)</label>
            <input type="number" value={homeValue} onChange={e => setHomeValue(e.target.value)}
              min="0" step="5000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Outstanding Mortgage Balance ($)</label>
            <input type="number" value={mortgageBalance} onChange={e => setMortgageBalance(e.target.value)}
              min="0" step="1000" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Other Liens/Loans Against Property ($)</label>
            <input type="number" value={otherLiens} onChange={e => setOtherLiens(e.target.value)}
              min="0" step="1000" className={inputClass} />
            <p className="text-xs text-slate-500 mt-1">HELOC, second mortgage, etc.</p>
          </div>
          <button onClick={() => { if (hv > 0) jumpTo() }}
            className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
            Calculate Home Equity
          </button>
        </div>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Your Home Equity</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-extrabold text-white">{fmt(result.equity)}</div>
              <p className="text-sm text-slate-400 mt-1">Total equity in your home</p>
            </div>
            {/* Equity bar */}
            <div className="w-full h-3 rounded-full bg-black/30 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, result.equityPercent))}%` }} />
            </div>
            <div className="text-center mb-4">
              <span className="text-lg font-bold text-emerald-400">{result.equityPercent.toFixed(1)}%</span>
              <span className="text-sm text-slate-500 ml-1">equity</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Home Value', value: fmt(hv), color: 'text-white' },
                { label: 'Total Debt', value: fmt(result.totalDebt), color: 'text-rose-400' },
                { label: 'Equity Percentage', value: result.equityPercent.toFixed(1) + '%', color: 'text-emerald-400' },
                { label: 'Available to Borrow (80% LTV)', value: fmt(result.availableBorrow), color: 'text-amber-400' },
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
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter home details to calculate equity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
