import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import useJumpToResult from "../hooks/useJumpToResult";

const GOALS = {
  sedentary: { label: "Maintain (light activity)", factor: 1.0 },
  active: { label: "Active lifestyle", factor: 1.3 },
  muscle: { label: "Build muscle", factor: 1.8 },
  fatloss: { label: "Fat loss (high protein)", factor: 2.0 },
};

const FOODS_VEG = [
  { f: "Paneer (100 g)", p: "18 g" },
  { f: "Soya chunks (50 g dry)", p: "26 g" },
  { f: "Milk (500 ml)", p: "17 g" },
  { f: "Dal + 2 roti (1 meal)", p: "15 g" },
];

const FOODS_NONVEG = [
  { f: "Chicken breast (100 g)", p: "31 g" },
  { f: "Eggs (3 whole)", p: "18 g" },
  { f: "Fish (100 g)", p: "25 g" },
  { f: "Whey scoop (1)", p: "24 g" },
];

export default function protein_intake_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult();
  const [weight, setWeight] = useState("70");
  const [goal, setGoal] = useState("muscle");
  const [diet, setDiet] = useState("veg");

  const calculate = useCallback(() => {
    const w = parseFloat(weight) || 0;
    if (w <= 0 || w > 300) return null;
    const grams = w * GOALS[goal].factor;
    return { w, grams, perMeal: grams / 4, calories: grams * 4 };
  }, [weight, goal]);

  const result = calculate();
  const foods = diet === "veg" ? FOODS_VEG : FOODS_NONVEG;
  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-400 [color-scheme:dark]";

  return (
    <ToolLayout
      title="Protein Intake Calculator"
      desc="Protein Intake Calculator — calculate daily protein needs online free by body weight and goal. Muscle, fat loss and active targets plus veg and non-veg food chart. No login needed."
      icon="🍗" iconBg="rgba(74,222,128,0.08)"
      category="health" slug="protein-intake-calculator"
      faq={[
        { q: "How much protein do I need per day?", a: "Enter your weight and goal above. The calculator multiplies body weight by a science-based factor — 1.0 g/kg to maintain, 1.8 g/kg for muscle, 2.0 g/kg for fat loss." },
        { q: "How much protein to build muscle in India?", a: "Aim for 1.6 to 2.0 g per kg of body weight daily. A 70 kg person needs roughly 125 g of protein across 4 meals plus training." },
        { q: "Which veg foods are highest in protein?", a: "Soya chunks, paneer, milk, dal, chickpeas and peanuts top the veg list. The food chart above shows exact protein per serving." },
        { q: "Can I eat too much protein?", a: "Healthy kidneys handle up to 2.2 g/kg well. Drink enough water and spread intake across meals instead of one heavy serving." },
        { q: "How much protein per meal?", a: "About 25 to 40 g per meal across 3 to 4 meals absorbs best. The result above splits your target into 4 equal meals." },
        { q: "Is this protein calculator free?", a: "Yes, completely free with no sign-up. Use it unlimited times on any device." },
      ]}
      howItWorks={[
        "Enter your body weight in kg.",
        "Pick your goal: maintain, active, muscle or fat loss.",
        "Click Calculate to see daily grams, per-meal target and food chart.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Protein Intake Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/protein-intake-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Body Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70" min="0" max="300" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className={inputClass}>
                {Object.entries(GOALS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Diet</label>
              <select value={diet} onChange={(e) => setDiet(e.target.value)} className={inputClass}>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-veg</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={jumpTo}
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
            <div className="space-y-3">
              {[
                { label: "Daily Protein Target", value: Math.round(result.grams) + " g", color: "text-green-400" },
                { label: "Per Meal (4 meals)", value: Math.round(result.perMeal) + " g", color: "text-white" },
                { label: "Protein Calories", value: Math.round(result.calories) + " kcal", color: "text-white" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={"font-bold " + r.color}>{r.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top {diet === "veg" ? "veg" : "non-veg"} sources</p>
              <div className="space-y-2">
                {foods.map((x, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{x.f}</span>
                    <span className="font-bold text-green-400">{x.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🍗</div>
            <p className="text-sm text-slate-600 font-medium">Enter your weight to calculate protein needs</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
