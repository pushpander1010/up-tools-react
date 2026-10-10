import { useState, useCallback } from "react"
import ToolLayout from "../components/ToolLayout"
import useJumpToResult from "../hooks/useJumpToResult"

const fmtINR = (n) => isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–"

export default function swp_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [corpus, setCorpus] = useState("1000000")
  const [withdraw, setWithdraw] = useState("10000")
  const [rate, setRate] = useState("12")
  const [years, setYears] = useState("10")

  const calculate = useCallback(() => {
    const P = parseFloat(corpus) || 0
    const W = parseFloat(withdraw) || 0
    const R = parseFloat(rate) || 0
    const Y = parseInt(years) || 0
    if (P <= 0 || W <= 0 || Y <= 0 || Y > 40) return null

    const monthly = Math.pow(1 + R / 100, 1 / 12) - 1
    let bal = P
    let depletedAt = null
    const rows = []
    for (let y = 1; y <= Y; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + monthly) - W
        if (bal <= 0) { bal = 0; depletedAt = "Year " + y + ", month " + (m + 1); break }
      }
      rows.push({ year: y, balance: Math.round(bal) })
      if (bal <= 0) break
    }
    const monthsPaid = depletedAt ? rows.length * 12 : Y * 12
    const totalWithdrawn = depletedAt ? W * (monthsPaid - (12 - (rows.length * 12 - monthsPaid))) : W * Y * 12
    return { P, W, R, Y, totalWithdrawn: depletedAt ? null : W * Y * 12, endBal: Math.round(bal), rows, depletedAt }
  }, [corpus, withdraw, rate, years])

  const result = calculate()

  const handleCalculate = () => {
    calculate()
    jumpTo()
  }

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]"

  return (
    <ToolLayout
      title="SWP Calculator"
      desc="SWP Calculator - plan systematic withdrawal from mutual funds with monthly payout and balance forecast, online free. Instant results, no sign-up, works on mobile."
      icon="💸" iconBg="rgba(34,197,94,0.08)"
      category="finance" slug="swp-calculator"
      faq={[
        { q: "What is SWP in mutual funds?", a: "SWP (Systematic Withdrawal Plan) lets you withdraw a fixed amount every month from your mutual fund corpus while the remaining money keeps growing. It is widely used for regular income after retirement." },
        { q: "How do I use this SWP Calculator online free?", a: "Enter your corpus, monthly withdrawal, expected return and years above to see total withdrawn and balance left. Free with no login, works on mobile and desktop." },
        { q: "Will my money run out with SWP?", a: "It can, if withdrawals exceed growth. This calculator shows a depletion warning with the exact year and month your corpus hits zero so you can adjust." },
        { q: "Is this SWP Calculator accurate?", a: "Yes. The SWP Calculator compounds monthly at your expected return and deducts each withdrawal. Actual fund returns vary, so verify big decisions with a professional." },
        { q: "What is a safe SWP rate?", a: "A common rule is withdrawing 4 to 6 percent of the corpus per year. Higher rates plus lower returns deplete the corpus faster, as the yearly table above shows." },
        { q: "Is this SWP Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times online on any device." },
      ]}
      howItWorks={[
        "Enter your total mutual fund corpus.",
        "Enter monthly withdrawal, expected annual return and duration.",
        "Click Calculate to see total withdrawn, end balance and year-wise table.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "SWP Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/swp-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Total Corpus (₹)</label>
            <input type="number" value={corpus} onChange={(e) => setCorpus(e.target.value)}
              placeholder="Enter invested corpus" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Monthly Withdrawal (₹)</label>
            <input type="number" value={withdraw} onChange={(e) => setWithdraw(e.target.value)}
              placeholder="Enter monthly payout" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Expected Return % (p.a.)</label>
              <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
                placeholder="12" min="0" max="30" step="0.5" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
                placeholder="10" min="1" max="40" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-green-500/15 bg-gradient-to-br from-green-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Result</h3>
            </div>
            {result.depletedAt && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300">
                Corpus runs out at {result.depletedAt}. Lower the withdrawal or raise returns.
              </div>
            )}
            <div className="space-y-3">
              {[
                { label: "Total Withdrawn", value: result.totalWithdrawn == null ? "–" : fmtINR(result.totalWithdrawn), color: "text-white" },
                { label: "End Balance", value: fmtINR(result.endBal), color: "text-green-400" },
                { label: "Monthly Payout", value: fmtINR(result.W), color: "text-white" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <h4 className="mt-6 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Year-wise balance</h4>
            <div className="space-y-1">
              {result.rows.slice(0, 12).map((row) => (
                <div key={row.year} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 text-sm">
                  <span className="text-slate-400 font-medium">Year {row.year}</span>
                  <span className="font-bold text-white">{fmtINR(row.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">💸</div>
            <p className="text-sm text-slate-600 font-medium">Enter corpus and withdrawal to plan your SWP</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
