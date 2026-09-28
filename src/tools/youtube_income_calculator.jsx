import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const NICHE_RPM = {
  finance: { rpm: 3.5, label: 'Finance & Investing' },
  tech: { rpm: 2.5, label: 'Technology' },
  education: { rpm: 1.8, label: 'Education' },
  gaming: { rpm: 1.2, label: 'Gaming' },
  vlog: { rpm: 1.0, label: 'Vlogs & Lifestyle' },
  entertainment: { rpm: 0.8, label: 'Entertainment' },
}

const fmtUSD = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export default function youtube_income_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [monthlyViews, setMonthlyViews] = useState('')
  const [niche, setNiche] = useState('education')
  const [customRpm, setCustomRpm] = useState('')
  const [usdInr, setUsdInr] = useState('88')

  const calculate = useCallback(() => {
    const views = parseFloat(monthlyViews) || 0
    if (views <= 0) return null

    const rpm = customRpm ? parseFloat(customRpm) : NICHE_RPM[niche].rpm
    const rate = parseFloat(usdInr) || 88
    if (!rpm || rpm <= 0) return null

    const monthlyUSD = (views / 1000) * rpm
    const lowUSD = monthlyUSD * 0.7
    const highUSD = monthlyUSD * 1.3
    const monthlyINR = monthlyUSD * rate
    const lowINR = lowUSD * rate
    const highINR = highUSD * rate
    const yearlyUSD = monthlyUSD * 12
    const yearlyINR = monthlyINR * 12

    return { monthlyUSD, lowUSD, highUSD, monthlyINR, lowINR, highINR, yearlyUSD, yearlyINR, rpm, rate }
  }, [monthlyViews, niche, customRpm, usdInr])

  const result = calculate()

  const handleCalculate = () => { calculate(); jumpTo() }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="YouTube Income Calculator"
      desc="Estimate your YouTube channel earnings based on monthly views, niche RPM, and USD-INR rate — see monthly and yearly income projections."
      icon="💰" iconBg="rgba(34,197,94,0.08)"
      category="marketing" slug="youtube-income-calculator"
      faq={[
        { q: "What is RPM on YouTube?", a: "Revenue Per Mille (RPM) is how much you earn per 1,000 video views. It varies by niche — finance channels earn $3-5 RPM while entertainment may earn $0.50-1.50." },
        { q: "How accurate is this YouTube income calculator?", a: "This provides estimates based on typical RPM ranges. Actual earnings vary based on audience location, ad formats, watch time, CPM fluctuations, and YouTube's 45% revenue share." },
        { q: "How do I increase my YouTube income?", a: "Focus on high-RPM niches (finance, tech), target audiences in high-CPM countries (US, UK), increase watch time, and diversify with sponsorships and memberships." },
        { q: "Is this YouTube Income Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter your average monthly video views.",
        "Select your channel niche (or enter a custom RPM value).",
        "Set the current USD to INR exchange rate (default ₹88).",
        "Click Calculate to see your estimated monthly and yearly earnings in both USD and INR.",
        "Note: Actual earnings depend on audience location, ad formats, and YouTube's revenue share.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "YouTube Income Calculator", "applicationCategory": "BusinessApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Monthly Views</label>
            <input type="number" value={monthlyViews} onChange={(e) => setMonthlyViews(e.target.value)}
              placeholder="e.g. 500000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Channel Niche</label>
            <select value={niche} onChange={(e) => { setNiche(e.target.value); setCustomRpm('') }}
              className={selectClass}>
              {Object.entries(NICHE_RPM).map(([k, v]) => (
                <option key={k} value={k}>{v.label} (~${v.rpm} RPM)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Custom RPM Override ($ per 1K views)</label>
            <input type="number" value={customRpm} onChange={(e) => setCustomRpm(e.target.value)}
              placeholder={`Default: $${NICHE_RPM[niche].rpm}`} min="0" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">USD → INR Rate</label>
            <input type="number" value={usdInr} onChange={(e) => setUsdInr(e.target.value)}
              placeholder="e.g. 88" min="0" step="0.5" className={inputClass} />
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-bold text-sm hover:bg-green-500 transition-all duration-200 active:scale-[0.98]">
          Calculate Income
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Estimate</h3>
            </div>
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-white mb-1">{fmtUSD(result.monthlyUSD)}</div>
              <div className="text-2xl font-bold text-green-400/70">{fmtINR(result.monthlyINR)}</div>
              <div className="text-xs text-slate-500 mt-1">Estimated Monthly Income</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Monthly Range (USD)', value: `${fmtUSD(result.lowUSD)} – ${fmtUSD(result.highUSD)}`, color: 'text-white' },
                { label: 'Monthly Range (INR)', value: `${fmtINR(result.lowINR)} – ${fmtINR(result.highINR)}`, color: 'text-white' },
                { label: 'Yearly Projection (USD)', value: fmtUSD(result.yearlyUSD), color: 'text-green-400' },
                { label: 'Yearly Projection (INR)', value: fmtINR(result.yearlyINR), color: 'text-green-400' },
                { label: 'RPM Used', value: `$${result.rpm.toFixed(1)} per 1K views`, color: 'text-cyan-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                📌 <span className="font-bold text-slate-400">Note:</span> Most mid-size channels need ~100K subscribers and consistent uploads to sustain full-time income. Earnings grow non-linearly — ad revenue, sponsorships, and memberships compound over time.
              </p>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💰</div>
            <p className="text-sm text-slate-600 font-medium">Enter views and niche, then click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
