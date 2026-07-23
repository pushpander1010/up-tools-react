import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const INR = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!value) { setDisplay(0); return }
    const start = display
    const diff = value - start
    const duration = 400
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + diff * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return <span>{prefix}{INR(display)}</span>
}

function computeSIP(monthly, annualRate, years) {
  if (monthly <= 0 || annualRate <= 0 || years <= 0) return null
  const r = annualRate / 100 / 12 // monthly rate
  const n = years * 12 // total months

  // SIP future value: FV = P × [((1+r)^n - 1) / r] × (1+r)
  const sipFV = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  const totalInvested = monthly * n
  const sipReturns = sipFV - totalInvested

  // Lump sum: A = P × (1+r)^n (using same monthly rate for comparison)
  const lumpFV = totalInvested * Math.pow(1 + r, n)
  const lumpReturns = lumpFV - totalInvested

  // Year-by-year growth
  const yearly = []
  for (let y = 1; y <= years; y++) {
    const months = y * 12
    const invested = monthly * months
    const fv = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
    yearly.push({ year: y, invested: Math.round(invested), value: Math.round(fv), returns: Math.round(fv - invested) })
  }

  return {
    sipFV: Math.round(sipFV),
    totalInvested: Math.round(totalInvested),
    sipReturns: Math.round(sipReturns),
    lumpFV: Math.round(lumpFV),
    lumpReturns: Math.round(lumpReturns),
    yearly,
    monthly,
    annualRate,
    years,
  }
}

const FAQs = [
  { q: 'What is SIP?', a: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly (monthly) in mutual funds. It leverages rupee-cost averaging — you buy more units when prices are low and fewer when prices are high, reducing overall risk.' },
  { q: 'What is the best SIP amount to start with?', a: 'There is no universal "best" amount. Start with what you can comfortably afford — even ₹500/month works. The key is consistency. As your income grows, increase your SIP amount via a step-up SIP.' },
  { q: 'How is SIP different from Lump Sum investment?', a: 'SIP spreads your investment over time, reducing timing risk through rupee-cost averaging. Lump sum invests everything at once — potentially higher returns if markets are low, but riskier if markets fall after investing.' },
  { q: 'Is there tax on SIP returns?', a: 'Yes. Equity mutual fund gains are taxed as LTCG (>1 year, ₹1L exemption, then 12.5%) or STCG (<1 year, 20%). Debt funds are taxed as per your income tax slab. SIP itself has no separate tax — only the gains are taxed.' },
]

const HOW_IT_WORKS = [
  'Enter your monthly investment amount (₹500 – ₹50,000).',
  'Set your expected annual return rate (1% – 30%).',
  'Choose your investment time period (1 – 30 years).',
  'View your projected wealth: total invested, estimated returns, and wealth gained.',
  'Compare SIP vs Lump Sum side by side.',
  'Explore year-by-year growth in the detailed projection table.',
]

export default function sip_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthly, setMonthly] = useState('5000')
  const [annualRate, setAnnualRate] = useState('12')
  const [years, setYears] = useState('10')
  const [copied, setCopied] = useState(false)

  const m = parseFloat(monthly) || 0
  const r = parseFloat(annualRate) || 0
  const y = parseFloat(years) || 0

  const result = useMemo(() => computeSIP(m, r, y), [m, r, y])

  const handleCopy = useCallback(() => {
    if (!result) return
    const lines = [
      `Monthly Investment: ₹${result.monthly.toLocaleString('en-IN')}`,
      `Expected Return: ${result.annualRate}% p.a.`,
      `Time Period: ${result.years} years`,
      ``,
      `Total Invested: ₹${result.totalInvested.toLocaleString('en-IN')}`,
      `Estimated Returns: ₹${result.sipReturns.toLocaleString('en-IN')}`,
      `Wealth Gained: ₹${result.sipFV.toLocaleString('en-IN')}`,
      ``,
      `SIP Value: ₹${result.sipFV.toLocaleString('en-IN')}`,
      `Lump Sum Value: ₹${result.lumpFV.toLocaleString('en-IN')}`,
    ].join('\n')
    navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  // Stacked bar chart data
  const barMax = result ? result.sipFV : 1
  const investedPct = result ? (result.totalInvested / barMax) * 100 : 50
  const returnsPct = result ? (result.sipReturns / barMax) * 100 : 50
  const lumpPct = result ? (result.totalInvested / result.lumpFV) * 100 : 50

  return (
    <ToolLayout
      title="SIP Calculator"
      desc="Calculate SIP returns with monthly investment, expected rate, and time period. Compare SIP vs Lump Sum with year-by-year wealth projection."
      icon="📈" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="sip-calculator"
      faq={FAQs}
      howItWorks={HOW_IT_WORKS}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SIP Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/sip-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Monthly Investment ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Monthly Investment</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-bold text-emerald-500/30 group-focus-within:text-emerald-400 transition-colors">₹</span>
            <input
              type="range" min="500" max="50000" step="500"
              value={m || 5000} onChange={e => setMonthly(e.target.value)}
              className="absolute left-0 right-0 bottom-0 h-2 appearance-none bg-transparent z-10 opacity-0 cursor-pointer"
              style={{ width: '100%' }}
            />
            <div className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-14 pr-5 py-5 text-2xl sm:text-3xl font-extrabold text-white truncate
              focus:border-emerald-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(34,197,94,0.08)]
              transition-all duration-300">
              {INR(m || 0)}
            </div>
            {/* Slider track visual */}
            <div className="mt-2 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-200"
                style={{ width: `${((m || 0) / 50000) * 100}%` }} />
            </div>
            <input
              type="range" min="500" max="50000" step="500"
              value={m || 5000} onChange={e => setMonthly(e.target.value)}
              className="w-full -mt-3.5 relative z-10 accent-emerald-500 h-2 cursor-pointer"
            />
          </div>
        </div>

        {/* ─── Rate & Tenure ─── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Expected Return Rate</label>
            <div className="relative group">
              <input
                type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)}
                placeholder="12" step="0.5"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-bold text-white outline-none
                  focus:border-emerald-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(34,197,94,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">%</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[8, 12, 15, 18].map(r => (
                <button key={r} onClick={() => setAnnualRate(String(r))}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.1] transition-all font-semibold">
                  {r}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Time Period</label>
            <div className="relative group">
              <input
                type="number" value={years} onChange={e => setYears(e.target.value)}
                placeholder="10" step="1" min="1" max="30"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-bold text-white outline-none
                  focus:border-emerald-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(34,197,94,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">yr</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[5, 10, 15, 20].map(yr => (
                <button key={yr} onClick={() => setYears(String(yr))}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.1] transition-all font-semibold">
                  {yr}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Result ─── */}
        {result && (
          <div className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Projected Returns</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Invested</div>
                <div className="text-sm sm:text-lg font-extrabold text-white mt-1 truncate"><AnimatedNumber value={result.totalInvested} /></div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/8 min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Returns</div>
                <div className="text-sm sm:text-lg font-extrabold text-emerald-400 mt-1 truncate"><AnimatedNumber value={result.sipReturns} /></div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.05] border border-white/8 min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Wealth</div>
                <div className="text-sm sm:text-lg font-extrabold text-amber-400 mt-1 truncate"><AnimatedNumber value={result.sipFV} /></div>
              </div>
            </div>

            {/* Stacked Bar */}
            <div className="mb-6">
              <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
                <div className="bg-indigo-500/70 rounded-l-xl flex items-center justify-center text-[10px] font-bold text-white/80 transition-all duration-500"
                  style={{ width: `${investedPct}%` }}>
                  Invested
                </div>
                <div className="bg-emerald-500/70 rounded-r-xl flex items-center justify-center text-[10px] font-bold text-white/80 transition-all duration-500"
                  style={{ width: `${returnsPct}%` }}>
                  Returns
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500 min-w-0">
                <span className="flex items-center gap-1.5 min-w-0 truncate"><span className="w-2 h-2 rounded-sm bg-indigo-500 shrink-0" /> Invested ₹{result.totalInvested.toLocaleString('en-IN')}</span>
                <span className="flex items-center gap-1.5 min-w-0 truncate"><span className="w-2 h-2 rounded-sm bg-emerald-500 shrink-0" /> Returns ₹{result.sipReturns.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* SIP vs Lump Sum */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">SIP vs Lump Sum</h4>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">SIP</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 truncate"><AnimatedNumber value={result.sipFV} /></div>
                  <div className="text-xs text-slate-500 mt-1 truncate">Returns: ₹{result.sipReturns.toLocaleString('en-IN')}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Lump Sum</div>
                  <div className="text-lg sm:text-2xl font-extrabold text-indigo-400 truncate"><AnimatedNumber value={result.lumpFV} /></div>
                  <div className="text-xs text-slate-500 mt-1 truncate">Returns: ₹{result.lumpReturns.toLocaleString('en-IN')}</div>
                </div>
              </div>
              {/* Comparison bar */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-8">SIP</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${(result.sipFV / Math.max(result.sipFV, result.lumpFV)) * 100}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-8">Lump</span>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${(result.lumpFV / Math.max(result.sipFV, result.lumpFV)) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Year-by-Year Table ─── */}
        {result && result.yearly.length > 0 && (
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-6 overflow-x-auto overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Year-by-Year Growth</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  <th className="text-left pb-3 pr-4">Year</th>
                  <th className="text-right pb-3 pr-4">Invested</th>
                  <th className="text-right pb-3 pr-4">Returns</th>
                  <th className="text-right pb-3">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly.map((row, i) => (
                  <tr key={i} className={`border-t border-white/5 ${i === result.yearly.length - 1 ? 'bg-emerald-500/5' : ''}`}>
                    <td className="py-2.5 pr-4 text-slate-300 font-semibold">Year {row.year}</td>
                    <td className="py-2.5 pr-4 text-right text-slate-400">₹{row.invested.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 pr-4 text-right text-emerald-400 font-semibold">₹{row.returns.toLocaleString('en-IN')}</td>
                    <td className={`py-2.5 text-right font-bold ${i === result.yearly.length - 1 ? 'text-emerald-400 text-base' : 'text-white'}`}>
                      ₹{row.value.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">📈</div>
            <p className="text-sm text-slate-600 font-medium">Enter your monthly SIP amount and expected returns to see wealth projection</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
