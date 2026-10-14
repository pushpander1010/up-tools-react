import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const fmtINR = (n) => (isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–");

export default function rd_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const calculate = useCallback(() => {
    const P = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const m = (parseInt(years) || 0) * 12;
    if (P <= 0 || r <= 0 || m <= 0) return null;
    const i = r / 12;
    const maturity = P * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
    const invested = P * m;
    return { invested, maturity, interest: maturity - invested };
  }, [monthly, rate, years]);

  const result = calculate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="RD Calculator"
      desc="RD Calculator — calculate recurring deposit maturity online free for India. Enter monthly deposit, interest rate and tenure for instant maturity value. No login needed."
      icon="🏦" iconBg="rgba(52,211,153,0.08)"
      category="finance" slug="rd-calculator"
      faq={[
        { q: "How do I calculate RD maturity online free?", a: "Enter your monthly deposit, interest rate and tenure above. The RD Calculator shows maturity value, total invested and interest instantly, free with no login." },
        { q: "What is the RD interest rate in 2026?", a: "Most Indian banks offer 6.5% to 7.5% on recurring deposits, with senior citizens getting about 0.5% extra. Post office RD is 6.7%. Always confirm the live rate with your bank." },
        { q: "Is RD interest taxable?", a: "Yes, RD interest is fully taxable at your income slab rate, and banks deduct 10% TDS if yearly interest exceeds ₹40,000 (₹50,000 for senior citizens)." },
        { q: "RD vs FD vs SIP — which is better?", a: "RD suits fixed monthly savers with zero risk. FD suits lump sums. SIP can beat both over long periods but carries market risk. This calculator shows exact RD numbers so you can compare." },
        { q: "Is this RD Calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on mobile or desktop." },
        { q: "What formula does this RD Calculator use?", a: "It uses monthly compounding: maturity equals monthly deposit multiplied by [((1 plus r/12) to the power months minus 1) divided by (r/12)], a standard bank estimate." },
      ]}
      howItWorks={[
        "Enter your monthly RD deposit amount.",
        "Enter the annual interest rate and tenure in years.",
        "Click Calculate to see maturity value, total invested and interest earned.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "RD Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/rd-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Monthly Deposit (₹)</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)}
              placeholder="e.g. 5000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Interest Rate (% per year)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 7" min="0" max="15" step="0.1" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Tenure (years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 5" min="1" max="10" className={inputClass} />
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Total Invested", value: fmtINR(result.invested), color: "text-white" },
                { label: "Interest Earned", value: fmtINR(result.interest), color: "text-white" },
                { label: "Maturity Value", value: fmtINR(result.maturity), color: "text-emerald-400" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={"font-bold " + r.color}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🏦</div>
            <p className="text-sm text-slate-600 font-medium">Enter deposit, rate and tenure to calculate RD maturity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
