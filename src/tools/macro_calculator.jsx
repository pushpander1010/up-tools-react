import { useState, useCallback } from 'react'
import ToolLayout from '../components/ToolLayout'
import useJumpToResult from '../hooks/useJumpToResult'

const GOALS = {
  balanced: { label: 'Balanced (40/40/20)', p: 0.40, c: 0.40, f: 0.20 },
  lowcarb: { label: 'Low Carb (40/30/30)', p: 0.40, c: 0.30, f: 0.30 },
  highprotein: { label: 'High Protein (35/45/20)', p: 0.35, c: 0.45, f: 0.20 },
}

export default function macro_calculator() {
  const { ref: resultRef, jumpTo } = useJumpToResult()
  const [calories, setCalories] = useState('')
  const [goal, setGoal] = useState('balanced')
  const [result, setResult] = useState(null)

  const calculate = useCallback(() => {
    const cal = parseFloat(calories)
    if (isNaN(cal)) return
    const g = GOALS[goal]
    setResult({
      protein: ((cal * g.p) / 4).toFixed(1),
      carbs: ((cal * g.c) / 4).toFixed(1),
      fats: ((cal * g.f) / 9).toFixed(1),
    })
  }, [calories, goal])

  const inputClass = "w-full bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all duration-200 placeholder:text-slate-500 [color-scheme:dark]"
  const selectClass = "bg-white/[0.06] border-2 border-white/8 rounded-xl px-5 py-3.5 text-white font-semibold outline-none focus:border-indigo-500/40 transition-all [color-scheme:dark]"

  return (
    <ToolLayout
      title="Macro Calculator"
      desc="Calculate macronutrient ratios: protein, carbs, and fats for your fitness goals."
      icon="🥗" iconBg="rgba(34,197,94,0.08)"
      category="health" slug="macro-calculator"
      faq={[
        { q: "What are macronutrients?", a: "Macronutrients are protein, carbohydrates, and fats — the three main nutrients your body needs in large amounts for energy and function." },
        { q: "How do I choose a macro ratio?", a: "Balanced works for most people. High protein suits muscle building, low carb for fat loss. Adjust based on your goals and how your body responds." },
      ]}
      howItWorks={[
        "Enter your daily calorie target (use TDEE Calculator to find this).",
        "Choose a goal preset or enter custom ratios.",
        "Click Calculate to see your macro breakdown in grams.",
      ]}
      schema={{
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Macro Calculator", "applicationCategory": "HealthApplication",
        "url": "https://www.uptools.in/macro-calculator/",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Daily Calories</label>
          <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="e.g., 2000" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Goal</label>
          <select value={goal} onChange={e => setGoal(e.target.value)} className={selectClass}>
            {Object.entries(GOALS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        <button onClick={() => { calculate(); jumpTo() }}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all duration-200 active:scale-[0.98]">
          🧮 Calculate
        </button>

        {result && (
          <div ref={resultRef} className="rounded-3xl border-2 border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-white/[0.01] to-transparent p-6 sm:p-8 overflow-hidden"
            style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Macronutrient Breakdown</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Protein (g)', value: result.protein, color: 'text-rose-400' },
                { label: 'Carbs (g)', value: result.carbs, color: 'text-amber-400' },
                { label: 'Fats (g)', value: result.fats, color: 'text-emerald-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{r.label}</span>
                  <span className={`text-xl font-extrabold ${r.color}`}>{r.value}g</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div ref={resultRef} className="text-center py-12 rounded-3xl border-2 border-dashed border-white/8 bg-white/[0.01]">
            <div className="text-4xl mb-3 opacity-20">🥗</div>
            <p className="text-sm text-slate-600 font-medium">Enter calories and click Calculate</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
