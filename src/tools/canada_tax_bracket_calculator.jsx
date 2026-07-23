import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

const BRACKETS = [
  { upTo: 55867, rate: 0.15 },
  { upTo: 111733, rate: 0.205 },
  { upTo: 173205, rate: 0.26 },
  { upTo: 246752, rate: 0.29 },
  { upTo: Infinity, rate: 0.33 }
]

function calcTax(inc) {
  let tax = 0, prev = 0, remaining = inc
  for (const b of BRACKETS) {
    const width = Math.min(remaining, b.upTo - prev)
    if (width > 0) tax += width * b.rate
    remaining -= width
    prev = b.upTo
    if (remaining <= 0) break
  }
  return tax
}

function calcBracket(income) {
  const inc = Math.max(0, Number(income || 0))
  if (!inc) return null
  const tax = calcTax(inc)
  return { tax, effectiveRate: ((tax / inc) * 100).toFixed(2) }
}

export default function canada_tax_bracket_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [income, setIncome] = useState('')

  const result = useMemo(() => calcBracket(income), [income])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="Canada Federal Tax Calculator"
      desc="Estimate federal income tax in Canada using current brackets. Quick, no-signup tool."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="canada-tax-bracket-calculator"
      faq={[
        { q: 'What is this tool?', a: 'Estimates federal income tax in Canada using current brackets.' },
        { q: 'Does it include provincial tax?', a: 'No. This calculates federal tax only. Provincial tax is not included.' },
      ]}
      howItWorks={[
        'Enter your taxable income in CAD.',
        'Click Calculate to see your estimated federal tax.',
        'View your effective tax rate.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Canada Federal Tax Calculator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/canada-tax-bracket-calculator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Taxable income (CAD)</label>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)}
            placeholder="e.g., 72000" min="0" step="100"
            className={inputClass} />
        </div>

        {/* Bracket Reference */}
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-5 py-3 bg-white/[0.05] border-b border-white/8">
            <h3 className="text-sm font-bold text-slate-300">Federal Tax Brackets</h3>
          </div>
          <div className="divide-y divide-white/4">
            {BRACKETS.map((b, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-400">
                  {i === 0 ? `$0 – ${b.upTo.toLocaleString()}` :
                   i === BRACKETS.length - 1 ? `Over ${BRACKETS[i-1].upTo.toLocaleString()}` :
                   `${(BRACKETS[i-1].upTo).toLocaleString()} – ${b.upTo.toLocaleString()}`}
                </span>
                <span className="font-bold text-red-400">{(b.rate * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Federal Tax</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.tax)}</div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Effective rate</span>
                <span className="font-bold text-red-400">{result.effectiveRate}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Uses federal brackets only. Provincial tax not included.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter income to estimate federal tax</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
