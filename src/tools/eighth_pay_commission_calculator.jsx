import { useState, useCallback } from "react"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const fmtINR = (n) => isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–"

const HRA_SLABS = [
  { id: "X", label: "X cities (30%)", pct: 30 },
  { id: "Y", label: "Y cities (20%)", pct: 20 },
  { id: "Z", label: "Z cities (10%)", pct: 10 },
]

export default function eighth_pay_commission_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [basic, setBasic] = useState("40000")
  const [level, setLevel] = useState("6")
  const [fitment, setFitment] = useState("1.92")
  const [daPct, setDaPct] = useState("55")
  const [hra, setHra] = useState("Y")

  const calculate = useCallback(() => {
    const B = parseFloat(basic) || 0
    const F = parseFloat(fitment) || 0
    const D = parseFloat(daPct) || 0
    if (B <= 0 || F <= 0) return null
    const slab = HRA_SLABS.find((s) => s.id === hra) || HRA_SLABS[1]

    const revisedBasic = Math.round(B * F)
    const currentDA = Math.round(B * D / 100)
    const currentGross = B + currentDA + Math.round(B * slab.pct / 100)
    const revisedHRA = Math.round(revisedBasic * slab.pct / 100)
    const revisedGross = revisedBasic + revisedHRA
    const hike = revisedGross - currentGross
    const hikePct = currentGross > 0 ? (hike / currentGross) * 100 : 0

    return { B, F, D, slab, revisedBasic, currentDA, currentGross, revisedHRA, revisedGross, hike, hikePct }
  }, [basic, fitment, daPct, hra, level])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="Eighth Pay Commission Calculator"
      desc="8th Pay Commission Calculator - estimate revised basic, HRA and gross salary with fitment factor, online free. Instant results, no sign-up, works on mobile."
      icon="🇮🇳" iconBg="rgba(249,115,22,0.08)"
      category="finance" slug="eighth-pay-commission-calculator"
      faq={[
        { q: "What is the 8th Pay Commission?", a: "The 8th Central Pay Commission was announced in January 2025 to revise salaries of central government employees and pensioners. Implementation is expected in 2026-27 with fitment factor deciding the hike." },
        { q: "What fitment factor will the 8th Pay Commission use?", a: "Reports suggest around 1.92, but nothing is final. This calculator lets you compare 1.92, 2.0, 2.15 and 2.57 so you can see every scenario instantly." },
        { q: "How do I use this 8th Pay Commission Calculator online free?", a: "Enter your current basic pay, pay level, fitment factor, DA percent and HRA city slab above. Revised salary updates live with no login, on mobile and desktop." },
        { q: "How is revised basic pay calculated?", a: "Revised basic equals current basic multiplied by the fitment factor, rounded to the nearest rupee. DA resets to zero on implementation and HRA applies on the new basic." },
        { q: "Is this 8th Pay Commission Calculator accurate?", a: "Yes for estimates using official style formulas and 2026 expectations. Final figures depend on the notified fitment factor, so verify big decisions with official orders." },
        { q: "Is this 8th Pay Commission Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Enter your current basic pay and pay level.",
        "Pick a fitment factor, DA percent and HRA city slab.",
        "Click Calculate to see revised basic, HRA, gross salary and monthly hike.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Eighth Pay Commission Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/eighth-pay-commission-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Current Basic Pay (₹)</label>
            <input type="number" value={basic} onChange={(e) => setBasic(e.target.value)}
              placeholder="Enter basic pay" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Pay Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
                {Array.from({ length: 18 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>Level {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Fitment Factor</label>
              <select value={fitment} onChange={(e) => setFitment(e.target.value)} className={inputClass}>
                <option value="1.92">1.92 (expected)</option>
                <option value="2.0">2.00</option>
                <option value="2.15">2.15</option>
                <option value="2.57">2.57 (7th CPC style)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Current DA %</label>
              <input type="number" value={daPct} onChange={(e) => setDaPct(e.target.value)}
                placeholder="55" min="0" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">HRA City Slab</label>
              <select value={hra} onChange={(e) => setHra(e.target.value)} className={inputClass}>
                {HRA_SLABS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-orange-500/15 bg-gradient-to-br from-orange-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Revised Basic Pay", value: fmtINR(result.revisedBasic), color: "text-orange-400" },
                { label: "Revised HRA (" + result.slab.id + ")", value: fmtINR(result.revisedHRA), color: "text-white" },
                { label: "Revised Gross", value: fmtINR(result.revisedGross), color: "text-green-400" },
                { label: "Current Gross", value: fmtINR(result.currentGross), color: "text-white" },
                { label: "Monthly Hike", value: "+" + fmtINR(result.hike) + " (" + result.hikePct.toFixed(1) + "%)", color: "text-green-400" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 font-medium">Level {level} · fitment {result.F} · DA resets to zero on implementation. Estimates only.</p>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🇮🇳</div>
            <p className="text-sm text-slate-600 font-medium">Enter basic pay to estimate revised 8th CPC salary</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
