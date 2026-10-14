import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const SYSTEMS = {
  cbse: { label: "CBSE (× 9.5)", toPct: (c) => c * 9.5 },
  generic10: { label: "Generic (× 10)", toPct: (c) => c * 10 },
  mumbai: { label: "Mumbai University (7.1 × CGPA + 11)", toPct: (c) => 7.1 * c + 11 },
  vtu: { label: "VTU ((CGPA − 0.75) × 10)", toPct: (c) => (c - 0.75) * 10 },
  anna: { label: "Anna University (× 10)", toPct: (c) => c * 10 },
};

function division(p) {
  if (p >= 75) return "Distinction";
  if (p >= 60) return "First Division";
  if (p >= 50) return "Second Division";
  if (p >= 40) return "Pass";
  return "Fail";
}

export default function cgpa_to_percentage_converter() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [cgpa, setCgpa] = useState("8.5");
  const [system, setSystem] = useState("cbse");

  const calculate = useCallback(() => {
    const c = parseFloat(cgpa) || 0;
    if (c <= 0 || c > 10) return null;
    const pct = SYSTEMS[system].toPct(c);
    return { c, pct: Math.min(100, pct), grade: division(Math.min(100, pct)) };
  }, [cgpa, system]);

  const result = calculate();
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="CGPA to Percentage Converter"
      desc="CGPA to Percentage Converter — convert CGPA to percentage online free for CBSE, Mumbai University, VTU and Anna University. Exact university formulas, no login needed."
      icon="🎓" iconBg="rgba(56,189,248,0.08)"
      category="education" slug="cgpa-to-percentage-converter"
      faq={[
        { q: "How do I convert CGPA to percentage online free?", a: "Enter your CGPA and pick your university above. The converter applies the official formula instantly — free with no login." },
        { q: "What is the CBSE CGPA to percentage formula?", a: "CBSE uses percentage equals CGPA multiplied by 9.5. So 8.5 CGPA means 80.75 percent." },
        { q: "How does Mumbai University convert CGPA?", a: "Mumbai University uses percentage equals 7.1 multiplied by CGPA plus 11 for its credit-based grading system." },
        { q: "What is 9 CGPA in percentage?", a: "On CBSE it is 85.5 percent, on a straight 10-point scale it is 90 percent. Pick your university above for the exact number." },
        { q: "Is CGPA to percentage conversion the same everywhere?", a: "No. Each university notifies its own multiplier, so always use your university formula for resumes and applications." },
        { q: "Is this converter free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter your CGPA on a 10-point scale.",
        "Select your university or board conversion formula.",
        "Click Convert to see percentage and division instantly.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "CGPA to Percentage Converter", "applicationCategory": "EducationalApplication",
        "url": "https://www.uptools.in/cgpa-to-percentage-converter/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">CGPA (out of 10)</label>
            <input type="number" value={cgpa} onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.5" min="0" max="10" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">University / Board</label>
            <select value={system} onChange={(e) => setSystem(e.target.value)} className={inputClass}>
              {Object.entries(SYSTEMS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={jumpTo}
          className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-400 transition-all duration-200 active:scale-[0.98]">
          Convert
        </button>

        {result ? (
          <div ref={resultRef} className="rounded-3xl border-2 border-sky-500/15 bg-gradient-to-br from-sky-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Result</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "CGPA Entered", value: result.c.toFixed(2), color: "text-white" },
                { label: "Percentage", value: result.pct.toFixed(2) + " %", color: "text-sky-400" },
                { label: "Division", value: result.grade, color: "text-white" },
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
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-sm text-slate-600 font-medium">Enter a CGPA between 0 and 10 to convert</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
