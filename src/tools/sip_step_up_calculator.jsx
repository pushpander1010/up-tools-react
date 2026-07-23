import { useState, useMemo, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = n => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'

export default function sip_step_up_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthlySIP, setMonthlySIP] = useState('')
  const [stepUp, setStepUp] = useState('10')
  const [retReturn, setRetReturn] = useState('12')
  const [years, setYears] = useState('20')

  const m = parseFloat(monthlySIP) || 0
  const su = parseFloat(stepUp) || 0
  const r = parseFloat(retReturn) || 12
  const y = parseInt(years, 10) || 20

  const result = useMemo(() => {
    if (m <= 0 || y <= 0) return null
    const monthlyRate = r / 100 / 12
    let regularBalance = 0, stepUpBalance = 0, currentSIP = m
    for (let yr = 0; yr < y; yr++) {
      for (let mo = 0; mo < 12; mo++) {
        regularBalance = (regularBalance + m) * (1 + monthlyRate)
        stepUpBalance = (stepUpBalance + currentSIP) * (1 + monthlyRate)
      }
      currentSIP *= (1 + su / 100)
    }
    const totalRegular = m * 12 * y
    return {
      startSIP: m, finalSIP: currentSIP / (1 + su / 100),
      regular: regularBalance, stepUp: stepUpBalance,
      extra: stepUpBalance - regularBalance, totalInvested: totalRegular,
    }
  }, [m, su, r, y])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-500 [color-scheme:dark]"

  return (
    <ToolLayout
      title="SIP Step-Up Calculator"
      desc="Compare regular SIP vs step-up SIP. See how increasing your SIP annually boosts your wealth. Free online calculator."
      icon="🚀" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="sip-step-up-calculator"
      faq={[
        { q: 'What is a Step-Up SIP?', a: 'A Step-Up SIP increases your monthly SIP amount by a fixed percentage each year, aligning with your salary growth. Even a 10% annual step-up can dramatically boost your long-term wealth.' },
        { q: 'How much extra wealth does step-up generate?', a: 'A 10% annual step-up on a ₹5,000 SIP at 12% returns over 20 years generates nearly double the corpus compared to a regular SIP.' },
      ]}
      howItWorks={[
        'Enter your starting monthly SIP amount.',
        'Set the annual step-up percentage (typically 10-15%).',
        'Enter expected return rate and investment period.',
        'Compare regular SIP vs step-up SIP corpus and see extra wealth gained.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SIP Step-Up Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/sip-step-up-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Input */}
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Monthly SIP (₹)</label>
              <input type="number" value={monthlySIP} onChange={e => setMonthlySIP(e.target.value)}
                placeholder="e.g. 5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Annual Step-Up (%)</label>
              <input type="number" value={stepUp} onChange={e => setStepUp(e.target.value)}
                step="1" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Expected Return (%)</label>
              <input type="number" value={retReturn} onChange={e => setRetReturn(e.target.value)}
                step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1">Years</label>
              <input type="number" value={years} onChange={e => setYears(e.target.value)}
                min="1" max="40" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-5 sm:p-6 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Comparison</h3>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Start SIP</span>
                <span className="text-sm font-bold text-white">{fmt(result.startSIP)}/mo</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-slate-400">Final SIP (after {y} years)</span>
                <span className="text-sm font-bold text-white">{fmt(result.finalSIP)}/mo</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Regular SIP</div>
                <div className="text-lg font-extrabold text-white mt-1">{fmt(result.regular)}</div>
                <div className="text-[10px] text-slate-500">Invested: {fmt(result.totalInvested)}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Step-Up SIP</div>
                <div className="text-lg font-extrabold text-emerald-400 mt-1">{fmt(result.stepUp)}</div>
                <div className="text-[10px] text-emerald-400/60">Extra: {fmt(result.extra)}</div>
              </div>
            </div>

            {/* Extra Wealth Highlight */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/15 text-center">
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">Extra Wealth from Step-Up</div>
              <div className="text-2xl font-extrabold text-amber-400">+{fmt(result.extra)}</div>
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🚀</div>
            <p className="text-sm text-slate-600 font-medium">Enter monthly SIP to compare regular vs step-up</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
