import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

function calcRefund(paid, owed) {
  const p = Math.max(0, Number(paid || 0))
  const o = Math.max(0, Number(owed || 0))
  if (!p && !o) return null
  const diff = p - o
  if (diff >= 0) return { amount: diff, status: 'Estimated refund', color: '#22c55e' }
  return { amount: Math.abs(diff), status: 'Estimated balance owing', color: '#ef4444' }
}

export default function cra_refund_estimator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [paid, setPaid] = useState('')
  const [owed, setOwed] = useState('')

  const result = useMemo(() => calcRefund(paid, owed), [paid, owed])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="CRA Refund Estimator"
      desc="Estimate CRA refund or balance owing using tax paid vs tax owed."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="cra-refund-estimator"
      faq={[
        { q: 'What is this tool?', a: 'Estimate CRA refund or balance owing using tax paid vs tax owed.' },
        { q: 'Is it free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter the total tax you\'ve already paid (T4 deductions, instalments).',
        'Enter your estimated total tax owed.',
        'Click Calculate to see if you\'ll get a refund or owe a balance.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'CRA Refund Estimator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/cra-refund-estimator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Tax paid (T4/instalments)</label>
          <input type="number" value={paid} onChange={e => setPaid(e.target.value)}
            placeholder="e.g., 12000" min="0" step="10"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Estimated tax owed</label>
          <input type="number" value={owed} onChange={e => setOwed(e.target.value)}
            placeholder="e.g., 10500" min="0" step="10"
            className={inputClass} />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 p-6 sm:p-8 overflow-hidden"
            style={{ borderColor: result.color + '30', background: result.color.replace(')', ',0.06)').replace('rgb', 'rgba'), animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: result.color }} />
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: result.color }}>{result.status}</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.amount)}</div>
            <p className="text-xs text-slate-500 mt-4">Estimate only. Final results depend on CRA assessment.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter tax paid and owed to estimate refund</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
