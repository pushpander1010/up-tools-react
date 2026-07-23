import { useState, useMemo } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmt = v => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(v || 0)

function calcDuty(value, dutyRate, taxRate, fees) {
  const v = Math.max(0, Number(value || 0))
  const dr = Math.max(0, Number(dutyRate || 0)) / 100
  const tr = Math.max(0, Number(taxRate || 0)) / 100
  const f = Math.max(0, Number(fees || 0))
  if (!v) return null
  const dutyVal = v * dr
  const taxVal = (v + dutyVal) * tr
  const totalVal = v + dutyVal + taxVal + f
  return { duty: dutyVal, tax: taxVal, total: totalVal }
}

export default function vehicle_import_duty_estimator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [value, setValue] = useState('')
  const [dutyRate, setDutyRate] = useState('6.1')
  const [taxRate, setTaxRate] = useState('5')
  const [fees, setFees] = useState('')

  const result = useMemo(() => calcDuty(value, dutyRate, taxRate, fees), [value, dutyRate, taxRate, fees])

  const inputClass = 'w-full bg-white/[0.06] border-2 border-white/8 rounded-2xl px-5 py-4 text-2xl font-extrabold text-white outline-none focus:border-red-500/40 transition-all duration-300 placeholder:text-white/8'

  return (
    <ToolLayout
      title="Vehicle Import Duty Estimator"
      desc="Estimate vehicle import duty and taxes for Canada. Quick guide calculator."
      icon="🍁" iconBg="rgba(220,38,38,0.08)"
      category="canada" slug="vehicle-import-duty-estimator"
      faq={[
        { q: 'What is this tool?', a: 'Estimate vehicle import duty and taxes for Canada.' },
        { q: 'Is it free to use?', a: 'Yes. All UpTools calculators are completely free, with no sign-ups required.' },
      ]}
      howItWorks={[
        'Enter the vehicle value in CAD.',
        'Set the duty rate and GST/HST tax rate.',
        'Add any other fees (shipping, inspection, etc.).',
        'Click Calculate to see total import cost.',
      ]}
      schema={{
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name: 'Vehicle Import Duty Estimator', applicationCategory: 'UtilitiesApplication',
        url: 'https://www.uptools.in/vehicle-import-duty-estimator/',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Vehicle value (CAD)</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            placeholder="e.g., 25000" min="0" step="100"
            className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Duty rate (%)</label>
            <input type="number" value={dutyRate} onChange={e => setDutyRate(e.target.value)}
              min="0" step="0.1"
              className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tax rate (GST/HST %)</label>
            <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)}
              min="0" step="0.1"
              className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Other fees (CAD)</label>
          <input type="number" value={fees} onChange={e => setFees(e.target.value)}
            placeholder="e.g., 300" min="0" step="10"
            className={inputClass} />
        </div>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-red-500/15 bg-gradient-to-br from-red-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Import Cost</h3>
            </div>
            <div className="text-3xl font-extrabold text-white">{fmt(result.total)}</div>
            <div className="text-sm text-slate-400 mt-1">Total cost</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duty</span>
                <span className="font-bold text-white">{fmt(result.duty)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax (GST/HST)</span>
                <span className="font-bold text-white">{fmt(result.tax)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Estimate only. Actual rates depend on origin and province.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍁</div>
            <p className="text-sm text-slate-600 font-medium">Enter vehicle value to estimate duty</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
