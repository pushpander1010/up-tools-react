import { useState, useCallback, useEffect, useRef } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '$' + Math.round(n).toLocaleString('en-US') : '-'
const pct = n => isFinite(n) ? n.toFixed(1) + '%' : '-'

function GaugeSVG({ value }) {
  const angle = Math.min(180, (value / 100) * 180)
  const radius = 100
  const cx = 130, cy = 130

  const describeArc = (startAngle, endAngle) => {
    const start = (180 - endAngle) * Math.PI / 180
    const end = (180 - startAngle) * Math.PI / 180
    const x1 = cx + radius * Math.cos(start)
    const y1 = cy - radius * Math.sin(start)
    const x2 = cx + radius * Math.cos(end)
    const y2 = cy - radius * Math.sin(end)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`
  }

  const needleAngle = 180 - angle

  return (
    <svg width="260" height="145" viewBox="0 0 260 145">
      <defs>
        <linearGradient id="g-green" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#34d399"/>
        </linearGradient>
        <linearGradient id="g-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
        <linearGradient id="g-red" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f87171"/>
        </linearGradient>
      </defs>
      <path d={describeArc(0, 80)} stroke="url(#g-green)" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".25"/>
      <path d={describeArc(80, 100)} stroke="url(#g-yellow)" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".25"/>
      <path d={describeArc(100, 180)} stroke="url(#g-red)" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".25"/>
      <path d={describeArc(0, angle)} stroke="#22d3ee" strokeWidth="14" fill="none" strokeLinecap="round"
        style={{ transition: 'all 0.55s cubic-bezier(.4,0,.2,1)' }}/>
      <g style={{ transformOrigin: '130px 130px', transform: `rotate(${needleAngle}deg)`, transition: 'transform 0.55s cubic-bezier(.4,0,.2,1)' }}>
        <line x1="130" y1="130" x2="130" y2="52" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".9"/>
      </g>
      <circle cx="130" cy="130" r="7" fill="#1e2d4a" stroke="#22d3ee" strokeWidth="2.5"/>
      <text x="18" y="138" fill="#64748b" fontSize="10" textAnchor="middle">0%</text>
      <text x="130" y="26" fill="#64748b" fontSize="10" textAnchor="middle">50%</text>
      <text x="242" y="138" fill="#64748b" fontSize="10" textAnchor="middle">100%</text>
    </svg>
  )
}

export default function ltv_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [propValue, setPropValue] = useState('')
  const [mode, setMode] = useState('down')
  const [dynVal, setDynVal] = useState('')
  const [secondMortgage, setSecondMortgage] = useState('')
  const [secondLien, setSecondLien] = useState('')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const pv = parseFloat(propValue)
    const dyn = parseFloat(dynVal)
    if (isNaN(pv) || pv <= 0) { setResult({ error: 'Please enter a valid property value.' }); return }
    if (isNaN(dyn) || dyn < 0) { setResult({ error: 'Please enter a valid amount.' }); return }

    let loan, down
    if (mode === 'down') {
      down = dyn
      loan = pv - down
    } else {
      loan = dyn
      down = pv - loan
    }
    if (loan < 0) loan = 0
    if (down < 0) down = 0

    const ltv = (loan / pv) * 100
    const downPct = (down / pv) * 100
    const equity = pv - loan
    const equityPct = (equity / pv) * 100

    const sm = parseFloat(secondMortgage) || 0
    const sl = parseFloat(secondLien) || 0
    const totalLiens = loan + sm + sl
    const cltv = (totalLiens / pv) * 100
    const hasCLTV = sm > 0 || sl > 0

    const pmiRequired = ltv > 80
    const pmiLow = loan * 0.005
    const pmiHigh = loan * 0.015

    setResult({
      ltv, downPct, equity, equityPct, loan, down, propValue: pv,
      cltv, hasCLTV, totalLiens,
      pmiRequired, pmiLow, pmiHigh,
    })
    jumpTo()
  }, [propValue, mode, dynVal, secondMortgage, secondLien, jumpTo])

  const ltvStatus = result ? (result.ltv < 80 ? { text: '✅ Excellent', color: 'text-emerald-400' } : result.ltv <= 90 ? { text: '⚠️ Fair', color: 'text-amber-400' } : { text: '🔴 High Risk', color: 'text-red-400' }) : null

  return (
    <ToolLayout
      title="LTV Calculator"
      desc="Calculate Loan-to-Value ratio, equity, and PMI requirement."
      icon="🏠" iconBg="rgba(245,158,11,0.08)"
      category="finance" slug="ltv-calculator"
      faq={[
        { q: "What is LTV?", a: "Loan-to-Value ratio is the percentage of a property's value that is financed by a loan. Lower LTV means more equity." },
        { q: "When is PMI required?", a: "PMI (Private Mortgage Insurance) is typically required when LTV exceeds 80%." },
      ]}
      howItWorks={[
        "Enter the property value and down payment or loan amount.",
        "Optionally add existing mortgage balances for CLTV calculation.",
        "Click Calculate to see your LTV ratio, equity, and PMI status.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "LTV Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/ltv-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Property Value ($)</label>
            <input type="number" value={propValue} onChange={e => setPropValue(e.target.value)}
              placeholder="350,000" min={1}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Enter By</label>
            <div className="flex gap-2">
              <button onClick={() => setMode('down')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${mode === 'down' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
                Down Payment
              </button>
              <button onClick={() => setMode('loan')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${mode === 'loan' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-white/[0.06] border-white/[0.08] text-slate-500'}`}>
                Loan Amount
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">{mode === 'down' ? 'Down Payment ($)' : 'Loan Amount ($)'}</label>
            <input type="number" value={dynVal} onChange={e => setDynVal(e.target.value)}
              placeholder={mode === 'down' ? '70,000' : '280,000'} min={0}
              className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
          </div>

          {/* Optional CLTV */}
          <div className="border-t border-white/[0.08] pt-3 space-y-2">
            <div className="text-xs font-bold text-slate-500">Optional — Combined LTV (CLTV)</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Existing Mortgage</label>
                <input type="number" value={secondMortgage} onChange={e => setSecondMortgage(e.target.value)}
                  placeholder="0" min={0}
                  className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Second Lien</label>
                <input type="number" value={secondLien} onChange={e => setSecondLien(e.target.value)}
                  placeholder="0" min={0}
                  className="w-full bg-black/20 border-2 border-white/[0.08] rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-slate-600" />
              </div>
            </div>
          </div>

          <button onClick={calculate}
            className="glow-btn w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            🏠 Calculate LTV
          </button>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div ref={resultRef} className="space-y-4">
            {/* Gauge */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-6 text-center">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Loan-to-Value Ratio</div>
              <GaugeSVG value={result.ltv} />
              <div className="text-3xl font-extrabold text-white mt-2">{pct(result.ltv)}</div>
              <div className={`text-sm font-bold mt-1 ${ltvStatus.color}`}>{ltvStatus.text}</div>
            </div>

            {/* PMI Banner */}
            <div className={`rounded-2xl p-4 border ${result.pmiRequired ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{result.pmiRequired ? '⚠️' : '✅'}</span>
                <span className={`text-sm font-bold ${result.pmiRequired ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {result.pmiRequired ? 'PMI Required' : 'No PMI Required 🎉'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {result.pmiRequired
                  ? `Your LTV exceeds 80%. Estimated PMI cost: ${fmt(result.pmiLow)}–${fmt(result.pmiHigh)} per year.`
                  : 'Your LTV is below 80%. No Private Mortgage Insurance required.'}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs text-slate-500">Loan Amount</div>
                <div className="text-lg font-bold text-white">{fmt(result.loan)}</div>
                <div className="text-xs text-slate-500">{pct(result.ltv)} of property</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs text-slate-500">Down Payment</div>
                <div className="text-lg font-bold text-white">{fmt(result.down)}</div>
                <div className="text-xs text-slate-500">{pct(result.downPct)} of property</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs text-slate-500">Equity</div>
                <div className="text-lg font-bold text-emerald-400">{fmt(result.equity)}</div>
                <div className="text-xs text-slate-500">{pct(result.equityPct)} equity stake</div>
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs text-slate-500">PMI Status</div>
                <div className={`text-lg font-bold ${result.pmiRequired ? 'text-red-400' : 'text-emerald-400'}`}>
                  {result.pmiRequired ? 'Required' : 'Not needed'}
                </div>
                <div className="text-xs text-slate-500">{result.pmiRequired ? `${fmt(result.pmiLow)}–${fmt(result.pmiHigh)}/yr` : 'LTV < 80%'}</div>
              </div>
            </div>

            {/* CLTV Card */}
            {result.hasCLTV && (
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-400 mb-2">📊 Combined LTV (CLTV)</div>
                <div className="text-2xl font-bold text-amber-400">{pct(result.cltv)}</div>
                <div className="text-xs text-slate-500">{fmt(result.totalLiens)} total liens</div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 text-center">
            {result.error}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
