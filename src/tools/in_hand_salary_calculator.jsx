import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const fmtINR = (n) => (isFinite(n) ? "₹" + Number(Math.round(n)).toLocaleString("en-IN") : "–");

function newRegimeTax(taxable) {
  const slabs = [[400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3]];
  let tax = 0, prev = 0;
  for (const [cap, rt] of slabs) {
    if (taxable > prev) tax += (Math.min(taxable, cap) - prev) * rt;
    prev = cap;
  }
  if (taxable <= 1200000) return 0;
  if (taxable <= 1275000) tax = Math.min(tax, taxable - 1200000);
  return tax * 1.04;
}

function oldRegimeTax(taxable) {
  const slabs = [[250000, 0], [500000, 0.05], [1000000, 0.2], [Infinity, 0.3]];
  let tax = 0, prev = 0;
  for (const [cap, rt] of slabs) {
    if (taxable > prev) tax += (Math.min(taxable, cap) - prev) * rt;
    prev = cap;
  }
  if (taxable <= 500000) return 0;
  return tax * 1.04;
}

export default function in_hand_salary_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [ctc, setCtc] = useState("1200000");
  const [regime, setRegime] = useState("new");
  const [basicPct, setBasicPct] = useState("50");
  const [pt, setPt] = useState("2500");

  const calculate = useCallback(() => {
    const C = parseFloat(ctc) || 0;
    const bPct = (parseFloat(basicPct) || 0) / 100;
    const PT = parseFloat(pt) || 0;
    if (C <= 0) return null;
    const basic = C * bPct;
    const employerPF = Math.min(basic * 0.12, 21600);
    const employeePF = Math.min(basic * 0.12, 21600);
    const gross = C - employerPF;
    const stdDed = regime === "new" ? 75000 : 50000;
    const ded80C = regime === "old" ? Math.min(employeePF + 50000, 150000) : 0;
    const taxable = Math.max(0, gross - employeePF - stdDed - ded80C);
    const tds = regime === "new" ? newRegimeTax(taxable) : oldRegimeTax(taxable);
    const annual = gross - employeePF - PT - tds;
    return { gross, employeePF, employerPF, PT, tds, annual, monthly: annual / 12 };
  }, [ctc, regime, basicPct, pt]);

  const result = calculate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="In-Hand Salary Calculator"
      desc="In-Hand Salary Calculator — calculate take-home salary online free for India. Enter CTC to get monthly in-hand pay after PF, professional tax and income tax. No login needed."
      icon="💼" iconBg="rgba(99,102,241,0.08)"
      category="finance" slug="in-hand-salary-calculator"
      faq={[
        { q: "How do I calculate in-hand salary from CTC online free?", a: "Enter your annual CTC above. The calculator deducts employer PF, employee PF, professional tax and TDS under your chosen tax regime and shows monthly take-home pay instantly." },
        { q: "What is the difference between CTC and in-hand salary?", a: "CTC is total cost to company including employer PF and gratuity. In-hand salary is what lands in your bank after PF, professional tax and TDS are deducted — usually 80 to 90 percent of CTC." },
        { q: "Which regime gives higher in-hand salary in 2026?", a: "For most salaried employees without HRA and 80C deductions, the new regime gives higher take-home pay due to lower slab rates and the 12 lakh rebate. Compare both options above." },
        { q: "How much PF is deducted from salary?", a: "Employee PF is 12 percent of basic salary, capped at ₹1,800 per month when basic exceeds ₹15,000. Your employer matches it separately inside CTC." },
        { q: "Is this in-hand salary calculator accurate?", a: "It uses FY 2025-26 slabs for both regimes with standard deduction, cess and marginal relief. Treat it as a close estimate and confirm TDS with your payroll team." },
        { q: "Is this calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter your annual CTC and basic salary percent.",
        "Pick new or old tax regime and your state professional tax.",
        "Click Calculate to see monthly and annual in-hand salary with full breakup.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "In-Hand Salary Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/in-hand-salary-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Annual CTC (₹)</label>
            <input type="number" value={ctc} onChange={(e) => setCtc(e.target.value)}
              placeholder="e.g. 1200000" min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Tax Regime</label>
              <select value={regime} onChange={(e) => setRegime(e.target.value)} className={inputClass}>
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Basic (% of CTC)</label>
              <input type="number" value={basicPct} onChange={(e) => setBasicPct(e.target.value)}
                placeholder="50" min="10" max="80" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Professional Tax (₹/year)</label>
            <select value={pt} onChange={(e) => setPt(e.target.value)} className={inputClass}>
              <option value="2500">Maharashtra — ₹2,500</option>
              <option value="2400">Karnataka — ₹2,400</option>
              <option value="2000">Other state — ₹2,000</option>
              <option value="0">No professional tax — ₹0</option>
            </select>
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          Calculate
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Monthly In-Hand Salary", value: fmtINR(result.monthly), color: "text-indigo-400" },
                { label: "Annual In-Hand Salary", value: fmtINR(result.annual), color: "text-white" },
                { label: "Employee PF (year)", value: fmtINR(result.employeePF), color: "text-white" },
                { label: "Professional Tax (year)", value: fmtINR(result.PT), color: "text-white" },
                { label: "Income Tax TDS (year)", value: fmtINR(result.tds), color: "text-rose-400" },
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
            <div className="text-4xl mb-3 opacity-20">💼</div>
            <p className="text-sm text-slate-600 font-medium">Enter your CTC to calculate take-home pay</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
