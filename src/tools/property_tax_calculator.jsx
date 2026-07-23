import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0)
const fmtPct = v => v.toFixed(2) + '%'

function calcPropertyTax(homeValue, taxRate, assessmentRatio) {
  const hv = Math.max(0, Number(homeValue || 0))
  const tr = Math.max(0, Number(taxRate || 0)) / 100
  const ar = Math.max(0, Math.min(100, Number(assessmentRatio || 100))) / 100
  if (!hv) return null
  const assessedValue = hv * ar
  const annualTax = assessedValue * tr
  const monthlyTax = annualTax / 12
  const effectiveRate = hv > 0 ? (annualTax / hv) * 100 : 0
  return { annualTax, monthlyTax, assessedValue, effectiveRate }
}

export default function property_tax_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [homeValue, setHomeValue] = useState('400000')
  const [taxRate, setTaxRate] = useState('1.2')
  const [assessmentRatio, setAssessmentRatio] = useState('100')

  const result = useMemo(() => calcPropertyTax(homeValue, taxRate, assessmentRatio), [homeValue, taxRate, assessmentRatio])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]'

  return (
    <ToolLayout
      title="Property Tax Calculator"
      desc="Calculate annual property taxes based on your home value and local tax rate."
      icon="🏡" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="property-tax-calculator"
      faq={[
        { q: 'How is property tax calculated?', a: 'Property tax = Assessed Value × Tax Rate. The assessed value is typically a percentage of market value (50-100%), and the tax rate varies by location (0.3-2.5% in the US).' },
        { q: 'What is the average property tax rate in the US?', a: 'The average US property tax rate is about 1.1% of home value. Rates vary widely: New Jersey (2.5%), Texas (1.8%), Hawaii (0.3%).' },
        { q: 'Are property taxes deductible?', a: 'Yes, in the US you can deduct up to $10,000 in state and local taxes (SALT), including property taxes, on your federal return.' },
      ]}
      howItWorks={[
        'Enter your home value, property tax rate, and assessment ratio.',
        'Click Calculate to see your estimated annual and monthly property tax.',
        'View assessed value and effective tax rate.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Property Tax Calculator', applicationCategory: 'FinanceApplication',
        url: 'https://www.uptools.in/property-tax-calculator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Home Value ($)</label>
          <input type="number" value={homeValue} onChange={e => setHomeValue(e.target.value)}
            placeholder="400000" min="0" step="5000"
            className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Property Tax Rate (%)</label>
          <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)}
            placeholder="1.2" min="0" max="5" step="0.1"
            className={inputClass} />
          <p className="text-xs text-slate-500 mt-1">US avg: 1.1%, UK: 0.4-0.8%, Canada: 0.5-1.5%</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Assessment Ratio (%)</label>
          <input type="number" value={assessmentRatio} onChange={e => setAssessmentRatio(e.target.value)}
            placeholder="100" min="0" max="100" step="5"
            className={inputClass} />
          <p className="text-xs text-slate-500 mt-1">Percentage of market value used for tax (usually 100%)</p>
        </div>

        <button onClick={() => jumpTo()}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate Property Tax
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Annual Property Tax</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.annualTax)}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Monthly Property Tax</span>
                <span className="font-bold text-white">{fmt(result.monthlyTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Assessed Value</span>
                <span className="font-bold text-white">{fmt(result.assessedValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Effective Tax Rate</span>
                <span className="font-bold text-indigo-400">{fmtPct(result.effectiveRate)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏡</div>
            <p className="text-sm text-slate-600 font-medium">Enter home value and tax rate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
