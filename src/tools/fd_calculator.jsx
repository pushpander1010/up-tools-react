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

const COMP_OPTIONS = [
  { label: 'Yearly', freq: 1 },
  { label: 'Half-Yearly', freq: 2 },
  { label: 'Quarterly', freq: 4 },
  { label: 'Monthly', freq: 12 },
]

function computeFD(principal, annualRate, tenureYears, compFreq, mode, seniorCitizen, hasPan) {
  if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) return null
  const r = annualRate / 100
  let maturityAmount, totalInterest, effectiveAPY, periodicPayout

  if (mode === 'cumulative') {
    const n = compFreq
    const t = tenureYears
    maturityAmount = principal * Math.pow(1 + r / n, n * t)
    totalInterest = maturityAmount - principal
    effectiveAPY = Math.pow(1 + r / n, n) - 1
  } else {
    const n = compFreq
    const periodsTotal = n * tenureYears
    periodicPayout = (principal * r) / n
    totalInterest = periodicPayout * periodsTotal
    maturityAmount = principal + totalInterest
    effectiveAPY = r
  }

  // TDS calculation
  const threshold = seniorCitizen ? 50000 : 40000
  const tdsRate = hasPan ? 0.10 : 0.20
  let tds = 0
  if (totalInterest > threshold) {
    tds = totalInterest * tdsRate
  }
  const netInterest = totalInterest - tds
  const netMaturity = principal + netInterest

  // Maturity date
  const now = new Date()
  const maturityDate = new Date(now)
  maturityDate.setFullYear(maturityDate.getFullYear() + Math.floor(tenureYears))
  const extraMonths = Math.round((tenureYears % 1) * 12)
  maturityDate.setMonth(maturityDate.getMonth() + extraMonths)

  return {
    maturityAmount,
    totalInterest,
    effectiveAPY,
    periodicPayout: mode === 'non-cumulative' ? periodicPayout : null,
    tds,
    netInterest,
    netMaturity,
    maturityDate: maturityDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    principal,
    annualRate,
    tenureYears,
    compFreq,
    mode,
    seniorCitizen,
    hasPan,
  }
}

const FAQs = [
  { q: 'What is a Fixed Deposit (FD)?', a: 'A Fixed Deposit is a financial instrument where you deposit a lump sum for a fixed tenure at a guaranteed interest rate. Banks and NBFCs offer FDs as a safe, low-risk investment option with assured returns.' },
  { q: 'How is FD interest calculated?', a: 'Cumulative FDs use compound interest: A = P × (1 + r/n)^(n×t), where n is the compounding frequency. Non-cumulative FDs pay simple interest periodically (monthly/quarterly/half-yearly/yearly) on the principal.' },
  { q: 'What are the TDS rules on FD interest?', a: 'Banks deduct TDS if annual interest income exceeds ₹40,000 (₹50,000 for senior citizens). TDS is 10% if PAN is provided, 20% otherwise. You can claim TDS credit while filing your Income Tax Return.' },
  { q: 'What is the difference between cumulative and non-cumulative FD?', a: 'Cumulative FD compounds interest and pays everything at maturity — higher returns. Non-cumulative FD pays interest periodically (monthly/quarterly) — better for those needing regular income.' },
]

const HOW_IT_WORKS = [
  'Enter your principal amount and annual interest rate.',
  'Choose your tenure in years, months, or days.',
  'Select compounding frequency: Yearly, Half-Yearly, Quarterly, or Monthly.',
  'Pick Cumulative (interest reinvested) or Non-cumulative (periodic payout) mode.',
  'Toggle senior citizen status if applicable and PAN availability.',
  'View your maturity amount, interest earned, effective APY, and TDS in real-time.',
]

export default function fd_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [principal, setPrincipal] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [tenureYears, setTenureYears] = useState('')
  const [compFreq, setCompFreq] = useState(4)
  const [mode, setMode] = useState('cumulative')
  const [seniorCitizen, setSeniorCitizen] = useState(false)
  const [hasPan, setHasPan] = useState(true)
  const [copied, setCopied] = useState(false)

  const p = parseFloat(principal) || 0
  const rate = parseFloat(annualRate) || 0
  const tenure = parseFloat(tenureYears) || 0

  const result = useMemo(() => computeFD(p, rate, tenure, compFreq, mode, seniorCitizen, hasPan), [p, rate, tenure, compFreq, mode, seniorCitizen, hasPan])

  const handleCopy = useCallback(() => {
    if (!result) return
    const lines = [
      `Principal: ₹${result.principal.toLocaleString('en-IN')}`,
      `Rate: ${result.annualRate}% p.a. | Compounding: ${COMP_OPTIONS.find(c => c.freq === compFreq)?.label}`,
      `Tenure: ${result.tenureYears} years | Mode: ${result.mode === 'cumulative' ? 'Cumulative' : 'Non-Cumulative'}`,
      ``,
      `Maturity Amount: ₹${Math.round(result.maturityAmount).toLocaleString('en-IN')}`,
      `Total Interest: ₹${Math.round(result.totalInterest).toLocaleString('en-IN')}`,
      `Effective APY: ${(result.effectiveAPY * 100).toFixed(2)}%`,
      result.periodicPayout ? `Periodic Payout: ₹${Math.round(result.periodicPayout).toLocaleString('en-IN')}` : '',
      `TDS: ₹${Math.round(result.tds).toLocaleString('en-IN')}`,
      `Net Interest (after TDS): ₹${Math.round(result.netInterest).toLocaleString('en-IN')}`,
      `Net Maturity (after TDS): ₹${Math.round(result.netMaturity).toLocaleString('en-IN')}`,
      `Maturity Date: ${result.maturityDate}`,
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result, compFreq])

  // Visual timeline data
  const timelineYears = useMemo(() => {
    if (!result || tenure <= 0) return []
    const years = Math.ceil(tenure)
    const arr = []
    for (let i = 0; i <= years; i++) {
      const t = i
      let val
      if (mode === 'cumulative') {
        val = p * Math.pow(1 + rate / 100 / compFreq, compFreq * t)
      } else {
        val = p + (p * (rate / 100) / compFreq) * (compFreq * t)
      }
      arr.push({ year: i, value: Math.round(val) })
    }
    return arr
  }, [result, tenure, p, rate, compFreq, mode])

  const maxVal = timelineYears.length > 0 ? timelineYears[timelineYears.length - 1].value : p

  return (
    <ToolLayout
      title="FD Calculator India"
      desc="Calculate Fixed Deposit maturity amount with compound interest, effective APY, TDS deduction, and visual maturity timeline for Indian banks."
      icon="🏦" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="fd-calculator"
      faq={FAQs}
      howItWorks={HOW_IT_WORKS}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "FD Calculator India", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/fd-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ─── Principal Input ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Principal Amount</label>
          <div className="relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-bold text-indigo-500/30 group-focus-within:text-indigo-400 transition-colors">₹</span>
            <input
              type="number" value={principal} onChange={e => setPrincipal(e.target.value)}
              placeholder="1,00,000"
              className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl pl-14 pr-5 py-5 text-4xl font-extrabold text-white outline-none
                focus:border-indigo-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(99,102,241,0.08)]
                transition-all duration-300 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* ─── Rate & Tenure Row ─── */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Interest Rate (p.a.)</label>
            <div className="relative group">
              <input
                type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)}
                placeholder="7.5" step="0.1"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-bold text-white outline-none
                  focus:border-indigo-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(99,102,241,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tenure (years)</label>
            <div className="relative group">
              <input
                type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value)}
                placeholder="5" step="0.5"
                className="w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-bold text-white outline-none
                  focus:border-indigo-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_30px_rgba(99,102,241,0.06)]
                  transition-all duration-300 placeholder:text-slate-500"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">yr</span>
            </div>
          </div>
        </div>

        {/* ─── Compounding Frequency ─── */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Compounding Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMP_OPTIONS.map(opt => (
              <button key={opt.freq} onClick={() => setCompFreq(opt.freq)}
                className={`relative py-3 rounded-xl text-sm font-bold transition-all duration-200 overflow-hidden
                  ${compFreq === opt.freq
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/[0.06] text-slate-400 border border-white/8 hover:bg-white/[0.08] hover:text-white hover:border-white/12'
                  }`}>
                {compFreq === opt.freq && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />}
                <span className="relative">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Mode & Options ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Mode Toggle */}
          <div className="p-4 rounded-2xl border-2 border-white/8 bg-white/[0.05]">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Interest Mode</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['cumulative', 'Cumulative', 'Compounded'],
                ['non-cumulative', 'Non-Cumulative', 'Periodic payout'],
              ].map(([val, label, sub]) => (
                <button key={val} onClick={() => setMode(val)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 border
                    ${mode === val
                      ? 'bg-indigo-500/10 border-indigo-500/25 shadow-lg shadow-indigo-500/10'
                      : 'bg-white/[0.05] border-white/8 hover:border-white/12'
                    }`}>
                  <div className={`text-xs font-bold ${mode === val ? 'text-indigo-400' : 'text-slate-300'}`}>{label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Senior Citizen */}
          <button onClick={() => setSeniorCitizen(!seniorCitizen)}
            className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${seniorCitizen
                ? 'bg-amber-500/8 border-amber-500/25 shadow-lg shadow-amber-500/10'
                : 'bg-white/[0.05] border-white/8 hover:border-white/12'
              }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200
                ${seniorCitizen ? 'bg-amber-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {seniorCitizen && '✓'}
              </div>
              <div>
                <div className="text-sm font-bold text-white">Senior Citizen</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {seniorCitizen ? 'TDS threshold ₹50,000/yr' : 'TDS threshold ₹40,000/yr'}
                </div>
              </div>
            </div>
          </button>

          {/* PAN Toggle */}
          <button onClick={() => setHasPan(!hasPan)}
            className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${hasPan
                ? 'bg-emerald-500/8 border-emerald-500/25 shadow-lg shadow-emerald-500/10'
                : 'bg-white/[0.05] border-white/8 hover:border-white/12'
              }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200
                ${hasPan ? 'bg-emerald-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {hasPan && '✓'}
              </div>
              <div>
                <div className="text-sm font-bold text-white">PAN Provided</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {hasPan ? 'TDS rate 10%' : 'TDS rate 20%'}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* ─── Result ─── */}
        {result && (
          <div className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Maturity Details</h3>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/15 hover:bg-white/10 transition-all duration-200 active:scale-95">
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> Copy</>
                )}
              </button>
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/15">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Maturity Amount</div>
                <div className="text-xl font-extrabold text-indigo-400 mt-1"><AnimatedNumber value={result.maturityAmount} /></div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Interest</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1"><AnimatedNumber value={result.totalInterest} /></div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/8">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Effective APY</div>
                <div className="text-xl font-extrabold text-amber-400 mt-1">{(result.effectiveAPY * 100).toFixed(2)}%</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-1 mb-5">
              {[
                { label: 'Principal', value: INR(result.principal), muted: false },
                { label: 'Interest Rate', value: `${result.annualRate}% p.a.`, muted: true },
                { label: 'Compounding', value: COMP_OPTIONS.find(c => c.freq === result.compFreq)?.label, muted: true },
                { label: 'Mode', value: result.mode === 'cumulative' ? 'Cumulative' : 'Non-Cumulative', muted: true },
                ...(result.periodicPayout ? [{ label: 'Periodic Payout', value: INR(result.periodicPayout), muted: false }] : []),
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 ${row.muted ? 'text-xs' : ''} ${i < 4 ? 'border-b border-white/5' : ''}`}>
                  <span className={`${row.muted ? 'text-slate-600' : 'text-sm text-slate-400'}`}>{row.label}</span>
                  <span className="text-sm font-bold text-white">{row.value}</span>
                </div>
              ))}
            </div>

            {/* TDS & Net */}
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300">TDS Deducted</span>
                <span className="text-lg font-bold text-rose-400"><AnimatedNumber value={result.tds} /></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-300">Net Interest (after TDS)</span>
                <span className="text-lg font-bold text-emerald-400"><AnimatedNumber value={result.netInterest} /></span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-indigo-500/20">
                <span className="text-sm font-bold text-white">Net Maturity Amount</span>
                <span className="text-3xl font-extrabold text-indigo-400 tracking-tight">
                  <AnimatedNumber value={result.netMaturity} />
                </span>
              </div>
              <div className="text-center text-xs text-slate-500 mt-1">Maturity Date: {result.maturityDate}</div>
            </div>
          </div>
        )}

        {/* ─── Visual Timeline ─── */}
        {result && timelineYears.length > 1 && (
          <div className="rounded-3xl border-2 border-white/8 bg-white/[0.03] p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Growth Timeline</h3>
            <div className="flex items-end gap-1.5 h-40">
              {timelineYears.map((point, i) => {
                const h = maxVal > 0 ? (point.value / maxVal) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${Math.max(h, 4)}%`,
                        background: i === 0
                          ? 'rgba(255,255,255,0.15)'
                          : `linear-gradient(to top, rgba(99,102,241,0.6), rgba(139,92,246,0.3))`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                    <span className="text-[9px] text-slate-600 mt-1">{point.year}y</span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <span>Start: ₹{timelineYears[0].value.toLocaleString('en-IN')}</span>
              <span>Maturity: ₹{timelineYears[timelineYears.length - 1].value.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter principal, rate, and tenure to calculate your FD maturity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
