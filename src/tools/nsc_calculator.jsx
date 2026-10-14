import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const fmtINR = (n) => (isFinite(n) ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "–");

export default function nsc_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [deposit, setDeposit] = useState("100000");
  const [rate, setRate] = useState("7.7");

  const calculate = useCallback(() => {
    const P = parseFloat(deposit) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    if (P <= 0 || r <= 0) return null;
    const maturity = P * Math.pow(1 + r, 5);
    return { invested: P, maturity, interest: maturity - P };
  }, [deposit, rate]);

  const result = calculate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="NSC Calculator"
      desc="NSC Calculator — calculate National Savings Certificate maturity online free for India. 5-year compounding at current rates, instant maturity and interest breakup. No login needed."
      icon="📜" iconBg="rgba(251,146,60,0.08)"
      category="finance" slug="nsc-calculator"
      faq={[
        { q: "How do I calculate NSC maturity online free?", a: "Enter your one-time deposit above. The NSC Calculator compounds it for 5 years at the current rate and shows maturity value and interest instantly." },
        { q: "What is the NSC interest rate in 2026?", a: "NSC currently pays 7.7 percent per year compounded annually for a 5-year term. Rates are revised quarterly by the government, so confirm before investing." },
        { q: "Is NSC tax-free?", a: "Deposits up to ₹1.5 lakh qualify for 80C deduction, and yearly interest is reinvested and also eligible. Maturity interest in the final year is taxable at your slab rate." },
        { q: "NSC vs FD vs PPF — which pays more?", a: "NSC at 7.7 percent beats most 5-year bank FDs and matches PPF closely, but PPF interest is fully tax-free while NSC final-year interest is taxable." },
        { q: "What is the minimum NSC deposit?", a: "Minimum is ₹1,000 with no maximum limit. You can open NSC at any post office in India." },
        { q: "Is this NSC calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter your one-time NSC deposit amount.",
        "Confirm the annual interest rate (default 7.7 percent).",
        "Click Calculate to see 5-year maturity value and interest.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "NSC Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/nsc-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">One-Time Deposit (₹)</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)}
              placeholder="e.g. 100000" min="0" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Interest Rate (% per year)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 7.7" min="0" max="15" step="0.1" className={inputClass} />
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-orange-500/15 bg-gradient-to-br from-orange-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Result (5 Years)</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Amount Invested", value: fmtINR(result.invested), color: "text-white" },
                { label: "Interest Earned", value: fmtINR(result.interest), color: "text-white" },
                { label: "Maturity Value", value: fmtINR(result.maturity), color: "text-orange-400" },
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
            <div className="text-4xl mb-3 opacity-20">📜</div>
            <p className="text-sm text-slate-600 font-medium">Enter your deposit to calculate NSC maturity</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
