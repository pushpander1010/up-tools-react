import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const fmtINR = (n) => isFinite(n) ? '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '–'

const KARAT_OPTIONS = [
  { value: 24, label: '24 Karat (99.9% Pure)', purity: 0.999 },
  { value: 22, label: '22 Karat (91.6% Pure)', purity: 0.916 },
  { value: 18, label: '18 Karat (75.0% Pure)', purity: 0.750 },
]

export default function gold_jewellery_price_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [weight, setWeight] = useState('')
  const [karat, setKarat] = useState(22)
  const [ratePerGram, setRatePerGram] = useState('10000')
  const [makingPercent, setMakingPercent] = useState('12')
  const [wastagePercent, setWastagePercent] = useState('3')

  const calculate = useCallback(() => {
    const w = parseFloat(weight) || 0
    const rate = parseFloat(ratePerGram) || 10000
    const making = parseFloat(makingPercent) || 0
    const wastage = parseFloat(wastagePercent) || 0
    const gstRate = 0.03

    if (w <= 0) return null

    const purity = KARAT_OPTIONS.find(k => k.value === karat)?.purity || 0.916
    const effectiveWeight = w * purity
    const goldValue = effectiveWeight * rate
    const makingCharges = goldValue * (making / 100)
    const wastageCharges = goldValue * (wastage / 100)
    const subtotal = goldValue + makingCharges + wastageCharges
    const gst = subtotal * gstRate
    const finalPrice = subtotal + gst
    const pricePerGram = finalPrice / w

    return { effectiveWeight, goldValue, makingCharges, wastageCharges, subtotal, gst, finalPrice, pricePerGram }
  }, [weight, karat, ratePerGram, makingPercent, wastagePercent])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-yellow-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"
  const selectClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-yellow-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Gold Jewellery Price Calculator — Gold, Making Charges & GST"
      desc="Calculate the exact price of gold jewellery including gold value, making charges, wastage, and 3% GST. Works for 24/22/18 karat gold."
      icon="💍" iconBg="rgba(234,179,8,0.08)"
      category="finance" slug="gold-jewellery-price-calculator"
      faq={[
        { q: "How is gold jewellery price calculated?", a: "Gold price = effective weight × rate per gram. Effective weight = actual weight × purity (e.g., 22K = 91.6%). Add making charges (% of gold value), wastage (% of gold value), then 3% GST on the subtotal." },
        { q: "What is the difference between 22K and 24K gold?", a: "24K gold is 99.9% pure and too soft for jewellery. 22K gold is 91.6% pure (mixed with alloys) and is the standard for Indian jewellery. 18K is 75% pure, used for diamond settings." },
        { q: "What are making charges in gold jewellery?", a: "Making charges cover the labour and craftsmanship of converting raw gold into jewellery. They range from 8% to 25% of the gold value depending on design complexity." },
        { q: "What is the GST on gold jewellery in India?", a: "Gold jewellery attracts 3% GST on the total value (gold + making + wastage). This was introduced under the GST regime in 2017." },
        { q: "How do I use this Gold Jewellery Price Calculator online free?", a: "Enter the gold weight, select karat purity, set today's gold rate, making charges %, and wastage %. Click Calculate to see the full price breakdown. Free with no sign-up." },
      ]}
      howItWorks={[
        "Enter the weight of gold jewellery in grams.",
        "Select the karat purity: 24K, 22K, or 18K.",
        "Set today's gold rate per gram (default ₹10,000), making charges %, and wastage %.",
        "Click Calculate to see gold value, making charges, wastage, GST, and final price.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Gold Jewellery Price Calculator", "applicationCategory": "FinanceApplication",
        "operatingSystem": "WebBrowser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Gold Weight (grams)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 25" min="0" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Purity (Karat)</label>
            <select value={karat} onChange={(e) => setKarat(Number(e.target.value))} className={selectClass}>
              {KARAT_OPTIONS.map(k => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Gold Rate per Gram (₹)</label>
            <input type="number" value={ratePerGram} onChange={(e) => setRatePerGram(e.target.value)}
              placeholder="10000" min="0" step="1" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Making Charges (%)</label>
              <input type="number" value={makingPercent} onChange={(e) => setMakingPercent(e.target.value)}
                placeholder="12" min="0" max="100" step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Wastage (%)</label>
              <input type="number" value={wastagePercent} onChange={(e) => setWastagePercent(e.target.value)}
                placeholder="3" min="0" max="100" step="0.5" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-yellow-500/15 bg-gradient-to-br from-yellow-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="text-center mb-5">
              <div className="text-5xl font-extrabold text-yellow-400">{fmtINR(result.finalPrice)}</div>
              <div className="text-sm text-slate-400 mt-1">Final Price (incl. GST)</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Effective Gold Weight', value: result.effectiveWeight.toFixed(2) + ' g', color: 'text-slate-300' },
                { label: 'Gold Value', value: fmtINR(result.goldValue), color: 'text-white' },
                { label: 'Making Charges', value: fmtINR(result.makingCharges), color: 'text-white' },
                { label: 'Wastage', value: fmtINR(result.wastageCharges), color: 'text-white' },
                { label: 'Subtotal', value: fmtINR(result.subtotal), color: 'text-white' },
                { label: 'GST (3%)', value: fmtINR(result.gst), color: 'text-white' },
                { label: 'Price per Gram', value: fmtINR(result.pricePerGram), color: 'text-green-400' },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center py-2 ${i === 6 ? 'pt-3 border-t-2 border-yellow-500/20' : 'border-b border-white/5'}`}>
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💍</div>
            <p className="text-sm text-slate-600 font-medium">Enter gold details and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
