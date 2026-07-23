import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

function calcRRSP(income, contrib, rate, room) {
  const c = Math.max(0, Number(contrib || 0))
  const r = Math.max(0, Number(rate || 0)) / 100
  const roomVal = Math.max(0, Number(room || 0))
  const refund = c * r
  return {
    refund,
    used: c,
    remaining: roomVal ? Math.max(0, roomVal - c) : null,
    hasInput: c > 0 && r > 0,
  }
}

export default function rrsp_optimizer() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('')
  const [contrib, setContrib] = useState('')
  const [rate, setRate] = useState('')
  const [room, setRoom] = useState('')

  const result = useMemo(() => calcRRSP(income, contrib, rate, room), [income, contrib, rate, room])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="RRSP Contribution Optimizer"
      desc="Estimate RRSP contribution impact, refund estimate, and remaining room. Quick Canada-focused calculator."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="rrsp-optimizer"
      faq={[
        { q: 'What is RRSP Contribution Optimizer?', a: 'Estimate RRSP contribution impact, refund estimate, and remaining room. Quick Canada-focused calculator.' },
        { q: 'Is it free to use?', a: 'Yes, RRSP Contribution Optimizer is completely free. No sign-up or credit card required.' },
      ]}
      howItWorks={[
        'Enter your annual income, planned contribution, marginal tax rate, and optional RRSP room.',
        'Click Calculate to see your refund estimate.',
        'Review contribution used and remaining room.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'RRSP Contribution Optimizer', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/rrsp-optimizer/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Annual income (CAD)</label>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="e.g., 85000" min="0" step="100"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Planned RRSP contribution</label>
          <input type="number" value={contrib} onChange={e => setContrib(e.target.value)}
            placeholder="e.g., 8000" min="0" step="100"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Marginal tax rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)}
            placeholder="e.g., 29.7" min="0" max="60" step="0.1"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">RRSP contribution room (optional)</label>
          <input type="number" value={room} onChange={e => setRoom(e.target.value)}
            placeholder="e.g., 15000" min="0" step="100"
            className={inputClass} />
        </div>

        {result.hasInput ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Refund Estimate</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.refund)}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Contribution used</span>
                <span className="font-bold text-white">{fmt(result.used)}</span>
              </div>
              {result.remaining !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Room remaining</span>
                  <span className="font-bold text-white">{fmt(result.remaining)}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-4">Estimate based on marginal rate. Actual refund depends on deductions and credits.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter values to see refund estimate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
