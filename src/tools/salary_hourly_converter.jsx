import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

export default function salary_hourly_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [mode, setMode] = useState("annual");
  const [amount, setAmount] = useState("80000");
  const [hoursWeek, setHoursWeek] = useState("40");
  const [weeksYear, setWeeksYear] = useState("52");
  const [currency, setCurrency] = useState("$");

  const calculate = useCallback(() => {
    const A = parseFloat(amount) || 0;
    const h = parseFloat(hoursWeek) || 0;
    const w = parseFloat(weeksYear) || 0;
    if (A <= 0 || h <= 0 || w <= 0) return null;
    const totalHours = h * w;
    let hourly, annual;
    if (mode === "annual") { annual = A; hourly = A / totalHours; }
    else { hourly = A; annual = A * totalHours; }
    return {
      hourly, annual,
      weekly: annual / w, monthly: annual / 12, daily: annual / (w * 5),
      overtime: hourly * 1.5,
    };
  }, [mode, amount, hoursWeek, weeksYear]);

  const result = calculate();
  const fmt = (n) => (isFinite(n) ? currency + Number(n).toLocaleString("en-US", { maximumFractionDigits: n < 100 ? 2 : 0 }) : "–");
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="Salary to Hourly Calculator"
      desc="Salary to Hourly Calculator — convert annual salary to hourly pay online free for USA and India. Weekly, monthly and overtime breakdown with custom work hours. No login needed."
      icon="⏱️" iconBg="rgba(45,212,191,0.08)"
      category="finance" slug="salary-hourly-converter"
      faq={[
        { q: "How do I convert salary to hourly pay online free?", a: "Enter your annual salary and weekly hours above. The converter divides by total yearly hours and shows hourly, weekly, monthly and overtime rates instantly." },
        { q: "What is 80000 a year in hourly pay?", a: "At 40 hours a week for 52 weeks (2,080 hours), 80000 a year equals about 38.46 per hour. Adjust hours above for your exact schedule." },
        { q: "How do I convert hourly wage to annual salary?", a: "Switch to hourly mode above and enter your wage — it multiplies by your weekly hours and working weeks to give yearly pay." },
        { q: "How is overtime pay calculated?", a: "In the USA, overtime is 1.5 times your regular hourly rate for hours past 40 a week. This tool shows your overtime rate automatically." },
        { q: "Does it work for Indian salaries?", a: "Yes. Switch currency to rupees and enter your CTC or annual pay with your actual weekly hours for the correct hourly rate." },
        { q: "Is this converter free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Pick conversion direction: annual to hourly or hourly to annual.",
        "Enter the amount plus weekly hours and working weeks.",
        "Click Convert to see hourly, weekly, monthly and overtime pay.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Salary to Hourly Calculator", "applicationCategory": "FinanceApplication",
        "url": "https://www.uptools.in/salary-hourly-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Convert</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputClass}>
                <option value="annual">Annual → Hourly</option>
                <option value="hourly">Hourly → Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option value="$">Dollar ($)</option>
                <option value="₹">Rupee (₹)</option>
                <option value="£">Pound (£)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">{mode === "annual" ? "Annual Salary" : "Hourly Wage"} ({currency})</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder={mode === "annual" ? "e.g. 80000" : "e.g. 25"} min="0" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Hours / Week</label>
              <input type="number" value={hoursWeek} onChange={(e) => setHoursWeek(e.target.value)}
                placeholder="40" min="1" max="100" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Weeks / Year</label>
              <input type="number" value={weeksYear} onChange={(e) => setWeeksYear(e.target.value)}
                placeholder="52" min="1" max="52" className={inputClass} />
            </div>
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-400 transition-all duration-200 active:scale-[0.98]">
          Convert
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-teal-500/15 bg-gradient-to-br from-teal-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Hourly Rate", value: fmt(result.hourly) + " / hr", color: "text-teal-400" },
                { label: "Annual Salary", value: fmt(result.annual), color: "text-white" },
                { label: "Monthly Pay", value: fmt(result.monthly), color: "text-white" },
                { label: "Weekly Pay", value: fmt(result.weekly), color: "text-white" },
                { label: "Overtime Rate (1.5×)", value: fmt(result.overtime) + " / hr", color: "text-white" },
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
            <div className="text-4xl mb-3 opacity-20">⏱️</div>
            <p className="text-sm text-slate-600 font-medium">Enter salary and hours to convert pay rates</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
