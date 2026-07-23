import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

export default function stamp_duty_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [price, setPrice] = useState(350000)
  const [firstTime, setFirstTime] = useState(false)
  const [additional, setAdditional] = useState(false)
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const standardBands = [
      { threshold: 250000, rate: 0 },
      { threshold: 925000, rate: 0.05 },
      { threshold: 1500000, rate: 0.10 },
      { threshold: Infinity, rate: 0.12 },
    ]

    const ftbBands = [
      { threshold: 425000, rate: 0 },
      { threshold: 625000, rate: 0.05 },
      { threshold: Infinity, rate: 0 },
    ]

    const surcharge = additional ? 0.03 : 0
    const bands = (firstTime && price <= 625000) ? ftbBands : standardBands

    let stampDuty = 0
    const breakdown = []
    let remaining = price
    let prev = 0

    for (const band of bands) {
      const bandAmount = Math.min(remaining, band.threshold - prev)
      if (bandAmount > 0) {
        const rate = band.rate + surcharge
        const tax = bandAmount * rate
        stampDuty += tax
        if (rate > 0) {
          breakdown.push({
            range: `£${prev.toLocaleString()} – £${Math.min(band.threshold, price).toLocaleString()}`,
            rate: `${(rate * 100).toFixed(0)}%`,
            tax,
          })
        }
        remaining -= bandAmount
        prev = band.threshold
      }
      if (remaining <= 0) break
    }

    setResult({ stampDuty, breakdown, price })
  }, [price, firstTime, additional])

  return (
    <ToolLayout
      title="UK Stamp Duty Calculator"
      desc="Calculate Stamp Duty Land Tax (SDLT) on residential property purchases in England and Northern Ireland."
      icon="🏠" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="stamp-duty-calculator"
      faq={[
        { q: 'What is UK Stamp Duty?', a: 'SDLT is a tax paid when buying property in England and Northern Ireland. Rates are tiered: 0% up to £250K, 5% on £250K-£925K, 10% on £925K-£1.5M, 12% above £1.5M.' },
        { q: 'Do first-time buyers pay stamp duty?', a: 'First-time buyers get relief: no stamp duty on properties up to £425K, and 5% on £425K-£625K. Properties over £625K pay standard rates.' },
        { q: 'When do I pay stamp duty?', a: 'Stamp duty must be paid within 14 days of completion. Your solicitor typically handles this.' },
      ]}
      howItWorks={[
        'Enter the property purchase price in pounds.',
        'Check if you\'re a first-time buyer for applicable relief.',
        'Check if this is an additional property (3% surcharge applies).',
        'Click Calculate to see your stamp duty breakdown.',
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "UK Stamp Duty Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/stamp-duty-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Price Input */}
        <div>
          <label className="text-sm font-semibold text-slate-300 mb-2 block">Property Purchase Price (£)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min="0" step="5000"
            className="w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]" />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <button onClick={() => setFirstTime(!firstTime)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
              firstTime ? 'bg-indigo-500/10 border-indigo-500/25' : 'bg-white/[0.04] border-white/8 hover:border-white/12'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${firstTime ? 'bg-indigo-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {firstTime && '✓'}
              </div>
              <div>
                <span className="text-sm font-bold text-white">First-time buyer</span>
                <span className="text-[11px] text-slate-500 ml-2">Relief: 0% up to £425K</span>
              </div>
            </div>
          </button>

          <button onClick={() => setAdditional(!additional)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
              additional ? 'bg-indigo-500/10 border-indigo-500/25' : 'bg-white/[0.04] border-white/8 hover:border-white/12'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${additional ? 'bg-indigo-500 text-white' : 'bg-white/10 text-transparent'}`}>
                {additional && '✓'}
              </div>
              <div>
                <span className="text-sm font-bold text-white">Additional property</span>
                <span className="text-[11px] text-slate-500 ml-2">+3% surcharge on all bands</span>
              </div>
            </div>
          </button>
        </div>

        {/* Calculate Button */}
        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          🏠 Calculate Stamp Duty
        </button>

        {/* Result */}
        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Stamp Duty Payable</h3>
            </div>
            <div className="text-4xl font-extrabold text-white mb-1">{GBP.format(result.stampDuty)}</div>
            <p className="text-sm text-slate-400 mb-6">Total Stamp Duty Land Tax</p>

            {/* Breakdown */}
            {result.breakdown.length > 0 ? (
              <div className="space-y-2">
                {result.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/8">
                    <div>
                      <span className="text-xs text-slate-400">{item.range}</span>
                      <span className="text-xs text-indigo-400 font-bold ml-2">@ {item.rate}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">{GBP.format(item.tax)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-sm text-green-400 font-semibold">✅ No stamp duty payable at this price</p>
              </div>
            )}

            {/* Effective Rate */}
            {result.stampDuty > 0 && (
              <div className="mt-4 pt-4 border-t border-white/8 flex justify-between text-xs text-slate-500">
                <span>Effective rate</span>
                <span className="font-bold text-white">{((result.stampDuty / result.price) * 100).toFixed(2)}%</span>
              </div>
            )}
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏠</div>
            <p className="text-sm text-slate-600 font-medium">Enter property price and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
